"""
Speech endpoints — real ASR + TTS backed by the local pipeline.

Both return 503 when SPEECH_ENABLED is false or the models/deps are missing, so
the frontend can gracefully fall back to the browser Web Speech API.
"""

import tempfile
from pathlib import Path

from fastapi import APIRouter, File, HTTPException, UploadFile
from fastapi.responses import Response
from pydantic import BaseModel

from ..config import get_settings
from ..speech.asr import SpeechUnavailable, get_asr
from ..speech.tts import get_tts

router = APIRouter(tags=["speech"])


def _require_speech():
    if not get_settings().speech_enabled:
        raise HTTPException(
            status_code=503,
            detail="Speech is disabled. Set SPEECH_ENABLED=true and install "
            "requirements-speech.txt to enable ASR/TTS.",
        )


class TTSRequest(BaseModel):
    text: str
    # Optional hint; when omitted the engine auto-detects Nepali vs English.
    language: str | None = None


class ASRResponse(BaseModel):
    text: str


@router.post("/asr", response_model=ASRResponse)
async def asr(audio: UploadFile = File(...), language: str | None = None) -> ASRResponse:
    """Transcribe an uploaded audio file (WAV recommended)."""
    _require_speech()

    suffix = Path(audio.filename or "audio.wav").suffix or ".wav"
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            tmp.write(await audio.read())
            tmp_path = tmp.name
    except OSError as exc:
        raise HTTPException(status_code=500, detail=f"Could not buffer audio: {exc}")

    try:
        text = get_asr().transcribe(tmp_path, language=language)
        return ASRResponse(text=text)
    except SpeechUnavailable as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except Exception as exc:  # pragma: no cover - runtime/model errors
        raise HTTPException(status_code=500, detail=f"Transcription failed: {exc}")
    finally:
        Path(tmp_path).unlink(missing_ok=True)


@router.post("/tts")
async def tts(req: TTSRequest) -> Response:
    """Synthesize speech and return WAV audio bytes."""
    _require_speech()
    if not req.text.strip():
        raise HTTPException(status_code=422, detail="text must not be empty.")

    try:
        wav = get_tts().synthesize(req.text)
    except SpeechUnavailable as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except Exception as exc:  # pragma: no cover - runtime/model errors
        raise HTTPException(status_code=500, detail=f"Synthesis failed: {exc}")

    return Response(content=wav, media_type="audio/wav")
