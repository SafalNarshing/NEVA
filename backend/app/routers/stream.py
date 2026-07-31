"""
Low-latency Live streaming over WebSocket.

Client sends one JSON frame: { messages: [{role,content}], language }.
Server streams the grounded Gemma reply back as it generates:
    {"type":"token","text": "..."}   (many)
    {"type":"done"}                    (once)
    {"type":"error","detail": "..."}   (on failure)

The frontend buffers tokens into sentences and fires Piper TTS per sentence,
so the first words are spoken while the model is still writing.
"""

import logging

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from ..config import get_settings
from ..llm.client import LLMError, get_llm_client
from ..llm.mock import mock_reply
from ..prompts import system_prompt_for
from ..rag_context import augment_system_prompt
from ..schemas import ChatRequest, Message

router = APIRouter()
logger = logging.getLogger("neva.stream")


@router.websocket("/ws/live")
async def ws_live(ws: WebSocket) -> None:
    await ws.accept()
    try:
        payload = await ws.receive_json()
        messages = [Message(**m) for m in payload.get("messages", [])]
        req = ChatRequest(
            messages=messages, mode="live", language=payload.get("language", "auto")
        )

        settings = get_settings()

        # Mock path — stream the canned reply word-by-word so the UX is identical.
        if settings.mock_mode:
            reply, follow = mock_reply(req.messages, None, "live")
            for word in f"{reply} {follow or ''}".split():
                await ws.send_json({"type": "token", "text": word + " "})
            await ws.send_json({"type": "done"})
            return

        system = system_prompt_for("live", req.language)
        system = augment_system_prompt(system, req)  # + WHO/MoHP protocol block

        client = get_llm_client()
        try:
            async for delta in client.stream(system, req.messages):
                await ws.send_json({"type": "token", "text": delta})
        except LLMError as exc:
            await ws.send_json({"type": "error", "detail": str(exc)})
            return

        await ws.send_json({"type": "done"})

    except WebSocketDisconnect:
        return
    except Exception as exc:  # pragma: no cover - defensive
        logger.warning("ws_live error: %s", exc)
        try:
            await ws.send_json({"type": "error", "detail": str(exc)})
        except Exception:
            pass
    finally:
        try:
            await ws.close()
        except Exception:
            pass
