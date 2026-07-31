"""Conversational chat endpoint."""

from fastapi import APIRouter, HTTPException

from ..schemas import ChatRequest, ChatResponse
from ..services import LLMError, generate_guidance

router = APIRouter(tags=["assistant"])


@router.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest) -> ChatResponse:
    """Normal multi-turn first-aid chat (text, and optionally an image)."""
    req.mode = "chat"
    try:
        return await generate_guidance(req)
    except LLMError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc
