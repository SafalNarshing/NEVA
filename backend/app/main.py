"""
NEVA API — application entrypoint.

Run locally:
    uvicorn app.main:app --reload

On Railway the Procfile / start command runs:
    uvicorn app.main:app --host 0.0.0.0 --port $PORT
"""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from . import __version__
from .config import get_settings
from .routers import chat, health, live, speech

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("neva")

settings = get_settings()


@asynccontextmanager
async def lifespan(_: FastAPI):
    mode = "MOCK (no model credentials)" if settings.mock_mode else settings.model_name
    logger.info("NEVA API v%s starting — model: %s", __version__, mode)
    yield


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
for r in (health.router, chat.router, live.router, speech.router):
    app.include_router(r)
    app.include_router(r, prefix="/api")


@app.get("/", tags=["system"])
async def root() -> dict:
    return {
        "service": settings.app_name,
        "version": __version__,
        "docs": "/docs",
        "endpoints": ["/health", "/chat", "/live"],
    }
