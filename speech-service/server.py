"""
NEVA Speech Service — local FastAPI microservice for ASR + TTS.

Reuses the prebuilt engines in `pipeline.py` (faster-whisper Nepali model +
Piper voices). Runs on the machine that has the models; the NEVA web app calls
it at VITE_SPEECH_URL. Kept separate from the chat orchestrator so the heavy ML
deps and warm model state live in their own process.

Run:
    venv\\Scripts\\activate
    uvicorn server:app --host 0.0.0.0 --port 8001
    # or: python server.py

Endpoints:
    GET  /health           -> { status, asr_model, ready }
    POST /asr  (multipart) -> { text }          form field: "audio"
    POST /tts  (json)      -> audio/wav bytes    body: { "text": "..." }
"""

import io
import os
import tempfile
import wave
from pathlib import Path

import numpy as np
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from pydantic import BaseModel

from pipeline import ASREngine, TTSEngine, _is_nepali

# --- Config (env-overridable) ---------------------------------------------
ALLOWED_ORIGINS = os.getenv("SPEECH_ALLOWED_ORIGINS", "*")
TTS_SAMPLE_RATE = 22050

app = FastAPI(title="NEVA Speech Service", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if ALLOWED_ORIGINS == "*" else
    [o.strip() for o in ALLOWED_ORIGINS.split(",")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Engines are lazy inside pipeline.py — models load on first use and stay warm.
asr = ASREngine()
tts = TTSEngine()

# --- TTS cache -------------------------------------------------------------
# Repeated phrases (reassurances, "call 102 now", follow-up questions) are
# synthesised once and served instantly thereafter. Bounded so it can't grow
# without limit.
_TTS_CACHE: "dict[str, bytes]" = {}
_TTS_CACHE_MAX = 256

# Fixed phrases pre-generated at startup for a ~0ms first spoken word.
PREWARM_PHRASES = [
    "I am here with you. Stay calm, we will do this together.",
    "Call one zero two now for an ambulance.",
    "म तपाईंसँग छु। शान्त रहनुहोस्, हामी सँगै गर्नेछौं।",
    "अहिले नै एम्बुलेन्सका लागि एक शून्य दुई मा फोन गर्नुहोस्।",
]


def _tts_cached(text: str) -> bytes:
    key = text.strip()
    hit = _TTS_CACHE.get(key)
    if hit is not None:
        return hit
    wav = _synthesize_wav_bytes(key)
    if len(_TTS_CACHE) >= _TTS_CACHE_MAX:
        _TTS_CACHE.pop(next(iter(_TTS_CACHE)))  # drop oldest
    _TTS_CACHE[key] = wav
    return wav


@app.on_event("startup")
def _warmup():
    """Load Whisper + both Piper voices and pre-cache fixed phrases so the
    first real request isn't the slow one."""
    import threading

    def run():
        try:
            asr._load_model()  # load Whisper into memory
        except Exception:
            pass
        for p in PREWARM_PHRASES:
            try:
                _tts_cached(p)
            except Exception:
                pass

    threading.Thread(target=run, daemon=True).start()


class TTSRequest(BaseModel):
    text: str


class ASRResponse(BaseModel):
    text: str


@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "NEVA Speech Service",
        "asr_model": asr.model_name,
        "asr_loaded": asr._model is not None,
    }


@app.post("/asr", response_model=ASRResponse)
async def transcribe(audio: UploadFile = File(...), language: str | None = None):
    """Transcribe uploaded audio. faster-whisper (with av) decodes webm/ogg/
    wav/mp3/m4a directly, so browser MediaRecorder blobs work as-is."""
    suffix = Path(audio.filename or "audio.webm").suffix or ".webm"
    tmp_path = None
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            tmp.write(await audio.read())
            tmp_path = tmp.name
        text = asr.transcribe(tmp_path, language=language)
        return ASRResponse(text=text)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Transcription failed: {exc}")
    finally:
        if tmp_path:
            Path(tmp_path).unlink(missing_ok=True)


def _synthesize_wav_bytes(text: str) -> bytes:
    """Run Piper and return in-memory WAV bytes (voice auto-selected by script)."""
    voice = tts._voice_for(text)
    samples = []
    for chunk in voice.synthesize(text):
        samples.append((chunk.audio_float_array * 32767).astype(np.int16))
    audio = np.concatenate(samples) if samples else np.array([], dtype=np.int16)

    buffer = io.BytesIO()
    with wave.open(buffer, "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(TTS_SAMPLE_RATE)
        wf.writeframes(audio.tobytes())
    return buffer.getvalue()


@app.post("/tts")
def synthesize(req: TTSRequest):
    """Synthesize speech and return WAV audio bytes."""
    if not req.text.strip():
        raise HTTPException(status_code=422, detail="text must not be empty.")
    cached = req.text.strip() in _TTS_CACHE
    try:
        wav = _tts_cached(req.text)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Synthesis failed: {exc}")
    lang = "ne" if _is_nepali(req.text) else "en"
    return Response(
        content=wav,
        media_type="audio/wav",
        headers={"X-Voice-Language": lang, "X-Cache": "hit" if cached else "miss"},
    )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", "8001")))
