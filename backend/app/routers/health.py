"""Health / readiness endpoint."""

from fastapi import APIRouter

from .. import __version__
from ..config import get_settings
from ..schemas import HealthResponse

router = APIRouter(tags=["system"])


@router.get("/health", response_model=HealthResponse)
async def health() -> HealthResponse:
    settings = get_settings()
    return HealthResponse(
        service=settings.app_name,
        version=__version__,
        model=settings.model_name,
        mock_mode=settings.mock_mode,
    )
