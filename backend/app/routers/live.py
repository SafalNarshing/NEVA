"""Live emergency guidance endpoint — one calm step at a time."""

from fastapi import APIRouter, HTTPException

from ..schemas import ChatRequest, ChatResponse
from ..services import LLMError, generate_guidance

router = APIRouter(tags=["assistant"])


@router.post("/live", response_model=ChatResponse)
async def live(req: ChatRequest) -> ChatResponse:
    """Step-by-step spoken guidance: a single instruction or question per turn."""
    req.mode = "live"
    try:
        return await generate_guidance(req)
    except LLMError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc
