"""
NEVA API — application entrypoint.

Run locally:
    uvicorn app.main:app --reload

On Railway the Procfile / start command runs:
    uvicorn app.main:app --host 0.0.0.0 --port $PORT
"""

import asyncio
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from . import __version__
from .config import get_settings
from .routers import chat, health, live, stream

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("neva")

settings = get_settings()


async def _warmup() -> None:
    """Pre-load the slow bits so the FIRST live request isn't the slow one:
    the RAG embedding model (bge-m3) and the Ollama model (kept resident)."""
    # RAG embedder — the big one-time cost (~10-20s to load bge-m3).
    if settings.rag_enabled:
        try:
            from .rag.retriever import retrieve
            from .rag.models import RetrievalRequest

            await asyncio.to_thread(
                retrieve, RetrievalRequest(query="warmup", language="en", top_k=1)
            )
            logger.info("warmup: RAG embedder ready")
        except Exception as exc:  # noqa: BLE001
            logger.warning("warmup: RAG skipped (%s)", exc)

    # Nudge the LLM so the model is resident in memory before the first user turn.
    if not settings.mock_mode:
        try:
            from .llm.client import get_llm_client
            from .schemas import Message

            await get_llm_client().complete(
                "Reply with 'ok'.", [Message(role="user", content="ok")]
            )
            logger.info("warmup: LLM resident")
        except Exception as exc:  # noqa: BLE001
            logger.warning("warmup: LLM nudge failed (%s)", exc)


@asynccontextmanager
async def lifespan(_: FastAPI):
    mode = "MOCK (no model credentials)" if settings.mock_mode else settings.model_name
    logger.info("NEVA API v%s starting — model: %s", __version__, mode)
    # Warm up in the background so startup isn't blocked.
    task = asyncio.create_task(_warmup())
    yield
    task.cancel()


app = FastAPI(
    title=settings.app_name,
    version=__version__,
    description="Calm, step-by-step emergency first-aid guidance for Nepal.",
    lifespan=lifespan,
)

# CORS — allow the React frontend to call the API.
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes are exposed both at root (/chat) and under /api (/api/chat) so the
# frontend works whether or not it prefixes calls with /api.
for r in (health.router, chat.router, live.router):
    app.include_router(r)
    app.include_router(r, prefix="/api")

# WebSocket streaming for Live mode (ws://…/ws/live and /api/ws/live).
app.include_router(stream.router)
app.include_router(stream.router, prefix="/api")


@app.get("/", tags=["system"])
async def root() -> dict:
    return {
        "service": settings.app_name,
        "version": __version__,
        "docs": "/docs",
        "endpoints": ["/health", "/chat", "/live"],
    }
