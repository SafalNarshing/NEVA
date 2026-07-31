# NEVA — Backend

FastAPI service for **NEVA (Nepal Emergency Voice Assistant)**. Calm,
step-by-step first-aid guidance in English and Nepali, backed by any
OpenAI-compatible LLM (Llama → Hugging Face → Groq → …).

## Quick start

```bash
cd backend
python -m venv venv
venv\Scripts\activate            # Windows  (source venv/bin/activate on macOS/Linux)
pip install -r requirements.txt

cp .env.example .env             # optional — runs in MOCK mode without it
uvicorn app.main:app --reload
```

Open http://localhost:8000/docs for interactive API docs.

> **Mock mode:** with no `MODEL_API_URL` / `MODEL_API_KEY` set (or `USE_MOCK=true`),
> the API returns built-in first-aid replies so the whole pipeline works with
> zero external setup. Add credentials to switch to a real model.

## Endpoints

| Method | Path             | Purpose                                              |
| ------ | ---------------- | ---------------------------------------------------- |
| GET    | `/health`        | Liveness + which model / mode is active              |
| POST   | `/chat`          | Normal multi-turn first-aid chat                     |
| POST   | `/live`          | Live mode — one calm instruction/question per turn   |
| POST   | `/asr`           | Speech-to-text (multipart audio) — needs speech deps |
| POST   | `/tts`           | Text-to-speech → WAV bytes — needs speech deps       |

All routes are also mounted under `/api` (`/api/chat`, `/api/live`, …) to match
the frontend.

### Request / response

```jsonc
// POST /chat  or  /live
{
  "messages": [{ "role": "user", "content": "my hand is bleeding" }],
  "image": "data:image/jpeg;base64,...",   // optional (needs VISION_ENABLED)
  "language": "auto"                         // "en" | "ne" | "auto"
}

// 200 OK
{ "reply": "Stay calm… press firmly on the wound.", "followUp": "Is it still bleeding?", "mode": "chat" }
```

## Switching model providers

Change env vars only — no code change. `LLM_PROVIDER=openai` covers every
OpenAI-compatible API; `LLM_PROVIDER=ollama` uses Ollama's native API.

| Provider       | `LLM_PROVIDER` | `MODEL_API_URL`                    | `MODEL_NAME` example            |
| -------------- | -------------- | ---------------------------------- | ------------------------------- |
| Groq           | `openai`       | `https://api.groq.com/openai/v1`   | `llama-3.1-8b-instant`          |
| Hugging Face   | `openai`       | `https://router.huggingface.co/v1` | `google/gemma-2-9b-it`          |
| Together       | `openai`       | `https://api.together.xyz/v1`      | `meta-llama/Llama-3-8b-chat-hf` |
| Ollama (Gemma) | `ollama`       | `http://localhost:11434/v1`        | `gemma4:12b`                    |

### Local Gemma via Ollama (the prebuilt pipeline)

```env
LLM_PROVIDER=ollama
MODEL_API_URL=http://localhost:11434/v1
MODEL_API_KEY=ollama
MODEL_NAME=gemma4:12b
DISABLE_THINKING=true      # gemma4 is a reasoning model — suppress hidden thinking
MAX_TOKENS=640
```

> **Why `LLM_PROVIDER=ollama` + `DISABLE_THINKING`?** `gemma4:12b` "thinks"
> before answering. Over the OpenAI-compat shim that reasoning silently eats the
> whole token budget and returns an **empty** reply. The native `/api/chat`
> path honours `think=false` and answers directly. Verified working in both
> English and Nepali.

For a true vision model, set `VISION_ENABLED=true` and send a base64 image data
URL in the `image` field (handled for both providers).

## Real voice — local ASR + TTS

The prebuilt Whisper (Nepali) + Piper voices are wired in as an **optional**
module, off by default so the base image stays light and Railway-deployable.

```bash
pip install -r requirements-speech.txt      # faster-whisper + piper-tts
```

```env
SPEECH_ENABLED=true
ASR_MODEL_NAME=Dragneel/whisper-medium-nepali-openslr-ct2
TTS_MODEL_DIR=/path/to/models/TTS           # folder with the 4 Piper .onnx/.json files
```

- `POST /asr` — multipart `audio` file → `{ "text": "…" }`
- `POST /tts` — `{ "text": "…" }` → `audio/wav` (auto-picks Nepali vs English by script)

When `SPEECH_ENABLED=false` (or deps/models missing) these return **503**, and
the frontend automatically falls back to the browser Web Speech API.

## Structure

```
backend/
  app/
    main.py            # FastAPI app, CORS, router wiring, lifespan
    config.py          # pydantic-settings (env vars)
    schemas.py         # request/response models (matches frontend)
    prompts.py         # calm bilingual system prompts (chat + live)
    services.py        # request -> (reply, followUp); mock/real decision
    llm/
      client.py        # openai-compat + ollama-native client (httpx)
      mock.py          # offline fallback guidance engine
    speech/            # optional local voice pipeline
      asr.py           # faster-whisper (Nepali + English), lazy-loaded
      tts.py           # Piper voices, auto Nepali/English by script
    routers/
      health.py  chat.py  live.py  speech.py
  requirements.txt   requirements-speech.txt   .env.example   Procfile   railway.json
```

## Deploy on Railway

1. New project → deploy the `backend/` directory (Nixpacks auto-detects Python).
2. Set variables: `MODEL_API_URL`, `MODEL_API_KEY`, `MODEL_NAME`, and
   `ALLOWED_ORIGINS` (your frontend URL).
3. Start command (from `Procfile` / `railway.json`):
   `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

Point the frontend at it by setting `VITE_API_URL` to the Railway URL.
