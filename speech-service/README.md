# NEVA Speech Service

Local FastAPI microservice exposing **ASR (faster-whisper, Nepali-tuned) + TTS
(Piper, Nepali & English)** over HTTP, so the NEVA web app can use real voice.
Kept as a separate process from the chat orchestrator so the heavy ML deps and
warm model state stay isolated.

```
frontend ──VITE_SPEECH_URL──→ speech-service (:8001) → Whisper + Piper  [/asr /tts]
```

## Setup

```powershell
cd Z:\Github\NEVA\speech-service
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

## Run  → http://localhost:8001

```powershell
# from this folder (model paths are relative to it)
uvicorn server:app --host 0.0.0.0 --port 8001
```

The first `/asr` call downloads the Whisper model (~1.5 GB) once from the HF hub,
caches it under `~/.cache/huggingface`, then keeps it warm in RAM.

## Endpoints

| Method | Path      | Body                          | Returns                             |
| ------ | --------- | ----------------------------- | ----------------------------------- |
| GET    | `/health` | —                             | `{ status, asr_model, asr_loaded }` |
| POST   | `/asr`    | multipart `audio` (webm/wav…) | `{ "text": "…" }`                   |
| POST   | `/tts`    | `{ "text": "…" }`             | `audio/wav` (Nepali/English auto)   |

Voice auto-selects the Nepali Piper voice when the text contains Devanagari.

## Files

```
speech-service/
  server.py          # FastAPI wrapper (/health /asr /tts) + CORS
  pipeline.py        # ASREngine, TTSEngine (and an Ollama LLMEngine, unused here)
  models/TTS/        # Piper voices — ne_NP-google-medium, en_US-lessac-medium
  requirements.txt
```

## Latency

- **Model warmup** at startup: Whisper loads and a few fixed phrases are
  pre-synthesised, so the first real request isn't the slow one.
- **TTS cache**: repeated phrases (reassurances, "call 102", follow-ups) are
  synthesised once then served in ~0ms (`X-Cache: hit` header). Fresh English
  sentences synth in ~0.4s — fast enough to stream sentence-by-sentence.
- **Faster ASR**: set `ASR_MODEL_NAME=small` for ~0.5s CPU transcription
  (trades some Nepali accuracy). Default is the Nepali-tuned medium model.

## Config (optional env)

- `PORT` — listen port (default 8001)
- `SPEECH_ALLOWED_ORIGINS` — CORS origins, comma-separated or `*` (default `*`)
- `ASR_MODEL_NAME` — faster-whisper model (default Nepali-tuned medium; use
  `small` / `base` for speed). `ASR_COMPUTE_TYPE` (default `int8`).

> The models (~134 MB) are committed so the service is self-contained. Both files
> are under GitHub's 100 MB limit; use Git LFS if you prefer.
