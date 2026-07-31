"""
RAG grounding for the orchestrator.

Bridges the chat flow to the protocol retriever (app.rag). Heavy imports
(chromadb, sentence-transformers) happen lazily on first use, so the base API
runs without them when RAG is disabled.

Assembled prompt = short system rules  +  retrieved WHO/MoHP protocol block  +  conversation.
"""

import logging

from .config import get_settings
from .schemas import Message

logger = logging.getLogger("neva.rag")

_UNAVAILABLE = False  # flips True after a failed import so we don't retry every turn


def _detect_language(text: str, declared: str) -> str:
    """Map 'auto' to 'ne' when Devanagari is present, else 'en'."""
    if declared in ("en", "ne"):
        return declared
    return "ne" if any("ऀ" <= ch <= "ॿ" for ch in text) else "en"


def _last_user_text(messages: list[Message]) -> str:
    for m in reversed(messages):
        if m.role == "user":
            return m.content
    return ""


def augment_system_prompt(system: str, req) -> str:
    """Return the system prompt with a VERIFIED PROTOCOLS block appended.

    Falls back to the original prompt (no RAG) on any failure, or when RAG is
    disabled / finds nothing grounded (unless RAG_STRICT is set).
    """
    global _UNAVAILABLE
    settings = get_settings()
    if not settings.rag_enabled or _UNAVAILABLE:
        return system

    query = _last_user_text(req.messages)
    if not query.strip():
        return system

    try:
        # Lazy import — only pulled in when RAG is actually enabled.
        from .rag.retriever import retrieve, format_for_prompt
        from .rag.models import RetrievalRequest
    except Exception as exc:  # deps not installed
        logger.warning("RAG unavailable (import failed): %s", exc)
        _UNAVAILABLE = True
        return system

    try:
        result = retrieve(
            RetrievalRequest(
                query=query,
                language=_detect_language(query, req.language),
                top_k=settings.rag_top_k,
            )
        )
    except Exception as exc:  # store missing / query error
        logger.warning("RAG retrieval failed (is the DB built?): %s", exc)
        return system

    if result.grounded:
        block = format_for_prompt(result, max_chunks=settings.rag_max_chunks)
        return f"{system}\n\n{block}"

    if settings.rag_strict:
        # Hard refusal block — model must not free-form medical advice.
        return f"{system}\n\n{format_for_prompt(result)}"

    return system
