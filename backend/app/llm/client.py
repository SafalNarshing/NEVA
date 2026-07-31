"""
Reusable LLM client with two backends behind one interface:

- "openai"  — any OpenAI-compatible /chat/completions API (Groq, HF router,
              Together, OpenAI, and also Ollama's compat shim).
- "ollama"  — Ollama's native /api/chat. Preferred for local Gemma because it
              reliably suppresses hidden "thinking" (think=false), which the
              compat shim ignores.

Switching providers is config-only (LLM_PROVIDER + MODEL_API_URL/KEY/NAME).
"""

import base64
import json
import re
from functools import lru_cache
from typing import Optional

import httpx

from ..config import Settings, get_settings
from ..schemas import Message


class LLMError(Exception):
    """Raised when the model provider cannot be reached or returns an error."""


_THOUGHT_BLOCK_RE = re.compile(r"<thought>.*?</thought>", re.DOTALL)


def _strip_thinking(text: str) -> str:
    """Remove inline <thought>...</thought> reasoning.

    Some Gemma deployments (e.g. gemma-4-*-it via Google's Gemini API) always
    emit their reasoning inline in the content, with no request param able to
    suppress it (unlike Ollama's think=false). Left in, it would be spoken
    aloud verbatim in Live mode, so it's stripped here for every provider.
    """
    return _THOUGHT_BLOCK_RE.sub("", text).strip()


class _ThoughtStreamFilter:
    """Stateful filter that strips <thought>...</thought> spans from a token
    stream, even when the tags are split across separate chunks."""

    def __init__(self):
        self._in_thought = False
        self._buf = ""

    def feed(self, chunk: str) -> str:
        self._buf += chunk
        out = []
        while True:
            tag = "</thought>" if self._in_thought else "<thought>"
            idx = self._buf.find(tag)
            if idx == -1:
                if not self._in_thought:
                    # Emit everything except a possible partial tag at the end.
                    keep = min(len(self._buf), len(tag) - 1)
                    split = len(self._buf) - keep
                    out.append(self._buf[:split])
                    self._buf = self._buf[split:]
                # else: mid-thought with no closing tag yet — hold the buffer.
                break
            if not self._in_thought:
                out.append(self._buf[:idx])
            self._buf = self._buf[idx + len(tag):]
            self._in_thought = not self._in_thought
        return "".join(out)


def _image_to_base64(data_url: str) -> Optional[str]:
    """Extract raw base64 from a data URL (or return as-is if already raw)."""
    if not data_url:
        return None
    if data_url.startswith("data:"):
        _, _, b64 = data_url.partition(",")
        return b64 or None
    # Assume it's already base64.
    try:
        base64.b64decode(data_url, validate=True)
        return data_url
    except Exception:
        return None


class LLMClient:
    def __init__(self, settings: Settings):
        self._settings = settings
        self._provider = settings.llm_provider.lower()
        base = settings.model_api_url.rstrip("/")

        if self._provider == "ollama":
            # Accept either the /v1 base or the root; native lives at root.
            root = base[:-3].rstrip("/") if base.endswith("/v1") else base
            self._endpoint = f"{root}/api/chat"
        else:
            self._endpoint = f"{base}/chat/completions"

        self._headers = {
            "Authorization": f"Bearer {settings.model_api_key}",
            "Content-Type": "application/json",
        }

    # ------------------------------------------------------------------ openai

    def _openai_messages(
        self, system_prompt: str, messages: list[Message], image: Optional[str]
    ) -> list[dict]:
        payload: list[dict] = [{"role": "system", "content": system_prompt}]
        history = [m.model_dump() for m in messages]
        if image and self._settings.vision_enabled and history:
            for m in reversed(history):
                if m["role"] == "user":
                    m["content"] = [
                        {"type": "text", "text": m["content"]},
                        {"type": "image_url", "image_url": {"url": image}},
                    ]
                    break
        payload.extend(history)
        return payload

    def _openai_body(self, system_prompt, messages, image) -> dict:
        body = {
            "model": self._settings.model_name,
            "messages": self._openai_messages(system_prompt, messages, image),
            "temperature": self._settings.temperature,
            "max_tokens": self._settings.max_tokens,
            "stream": False,
        }
        if self._settings.disable_thinking:
            body["think"] = False
        return body

    @staticmethod
    def _openai_parse(data: dict) -> str:
        return data["choices"][0]["message"]["content"].strip()

    # ------------------------------------------------------------------ ollama

    def _ollama_body(self, system_prompt, messages, image) -> dict:
        msgs: list[dict] = [{"role": "system", "content": system_prompt}]
        history = [m.model_dump() for m in messages]
        if image and self._settings.vision_enabled and history:
            b64 = _image_to_base64(image)
            if b64:
                for m in reversed(history):
                    if m["role"] == "user":
                        m["images"] = [b64]
                        break
        msgs.extend(history)
        return {
            "model": self._settings.model_name,
            "messages": msgs,
            "stream": False,
            # Native API honours think=false and stops the model reasoning at all.
            "think": not self._settings.disable_thinking,
            "options": {
                "temperature": self._settings.temperature,
                "num_predict": self._settings.max_tokens,
                # Explicit context window — keeps conversation history from being
                # truncated by the large RAG system prompt (and avoids the runner
                # over-allocating toward the model's 256K max).
                "num_ctx": self._settings.num_ctx,
            },
        }

    @staticmethod
    def _ollama_parse(data: dict) -> str:
        return (data.get("message", {}).get("content") or "").strip()

    # ------------------------------------------------------------------ call

    async def complete(
        self,
        system_prompt: str,
        messages: list[Message],
        image: Optional[str] = None,
    ) -> str:
        if self._provider == "ollama":
            body = self._ollama_body(system_prompt, messages, image)
            parse = self._ollama_parse
        else:
            body = self._openai_body(system_prompt, messages, image)
            parse = self._openai_parse

        try:
            async with httpx.AsyncClient(
                timeout=self._settings.request_timeout
            ) as http:
                resp = await http.post(
                    self._endpoint, headers=self._headers, json=body
                )
        except httpx.TimeoutException as exc:
            raise LLMError("The model took too long to respond.") from exc
        except httpx.HTTPError as exc:
            raise LLMError(f"Could not reach the model provider: {exc}") from exc

        if resp.status_code >= 400:
            raise LLMError(
                f"Model provider error {resp.status_code}: {resp.text[:400]}"
            )

        try:
            return _strip_thinking(parse(resp.json()))
        except (KeyError, IndexError, ValueError) as exc:
            raise LLMError("Unexpected response format from model provider.") from exc

    # ------------------------------------------------------------------ stream

    async def stream(
        self,
        system_prompt: str,
        messages: list[Message],
        image: Optional[str] = None,
    ):
        """Yield reply text deltas as the model generates them.

        Powers the low-latency Live pipeline: the caller forwards each delta,
        buffers into sentences, and synthesises audio sentence-by-sentence so the
        user hears the first words while the model is still writing.
        """
        if self._provider == "ollama":
            body = self._ollama_body(system_prompt, messages, image)
            body["stream"] = True
        else:
            body = self._openai_body(system_prompt, messages, image)
            body["stream"] = True

        try:
            async with httpx.AsyncClient(
                timeout=self._settings.request_timeout
            ) as http:
                async with http.stream(
                    "POST", self._endpoint, headers=self._headers, json=body
                ) as resp:
                    if resp.status_code >= 400:
                        detail = (await resp.aread())[:400]
                        raise LLMError(f"Model provider error {resp.status_code}: {detail}")
                    thought_filter = _ThoughtStreamFilter()
                    async for line in resp.aiter_lines():
                        delta = self._parse_stream_line(line)
                        if delta:
                            clean = thought_filter.feed(delta)
                            if clean:
                                yield clean
        except httpx.TimeoutException as exc:
            raise LLMError("The model took too long to respond.") from exc
        except httpx.HTTPError as exc:
            raise LLMError(f"Could not reach the model provider: {exc}") from exc

    def _parse_stream_line(self, line: str) -> Optional[str]:
        line = line.strip()
        if not line:
            return None
        if self._provider == "ollama":
            # Native /api/chat streams one JSON object per line.
            try:
                obj = json.loads(line)
            except ValueError:
                return None
            return (obj.get("message") or {}).get("content") or None
        # OpenAI-compatible SSE: "data: {json}" lines, terminated by "[DONE]".
        if line.startswith("data:"):
            payload = line[5:].strip()
            if payload == "[DONE]":
                return None
            try:
                obj = json.loads(payload)
                return (obj["choices"][0].get("delta") or {}).get("content") or None
            except (ValueError, KeyError, IndexError):
                return None
        return None


@lru_cache
def get_llm_client() -> LLMClient:
    return LLMClient(get_settings())
