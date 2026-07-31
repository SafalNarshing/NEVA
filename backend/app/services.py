"""
Guidance service — the single place that turns a request into (reply, followUp).

Keeps routers thin and makes the mock/real decision in one spot.
"""

import re

from .config import get_settings
from .llm.client import LLMError, get_llm_client
from .llm.mock import mock_reply
from .prompts import system_prompt_for
from .rag_context import augment_system_prompt
from .schemas import ChatRequest, ChatResponse


def _split_follow_up(text: str) -> tuple[str, str | None]:
    """For chat mode, peel a trailing question into a separate followUp field.

    This lets the frontend highlight the next question. It only splits when the
    reply clearly ends with a single question sentence.
    """
    text = text.strip()
    # Find the last sentence; if it is a question, treat it as the follow-up.
    parts = re.split(r"(?<=[.!?])\s+", text)
    if len(parts) >= 2 and parts[-1].endswith("?"):
        follow = parts[-1].strip()
        body = " ".join(parts[:-1]).strip()
        if body:
            return body, follow
    return text, None


async def generate_guidance(req: ChatRequest) -> ChatResponse:
    settings = get_settings()

    # --- Mock path (no credentials / USE_MOCK) -----------------------------
    if settings.mock_mode:
        reply, follow = mock_reply(req.messages, req.image, req.mode, req.language)
        return ChatResponse(reply=reply, followUp=follow, mode=req.mode)

    # --- Real provider -----------------------------------------------------
    # Prompt = short system rules + retrieved WHO/MoHP protocol block + messages.
    client = get_llm_client()
    system = system_prompt_for(req.mode, req.language)
    system = augment_system_prompt(system, req)
    text = await client.complete(system, req.messages, image=req.image)

    if req.mode == "chat":
        body, follow = _split_follow_up(text)
        return ChatResponse(reply=body, followUp=follow, mode=req.mode)

    # Live mode is already one calm step; keep it whole.
    return ChatResponse(reply=text, followUp=None, mode=req.mode)


# Re-export so routers can catch provider failures without importing llm.client.
__all__ = ["generate_guidance", "LLMError"]
