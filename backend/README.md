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

All routes are also mounted under `/api` (`/api/chat`, `/api/live`, …) to match
the frontend.

> **Voice (ASR/TTS)** is a **separate local service** — see the prebuilt repo's
> `server.py` (runs on `:8001`). This orchestrator is LLM-only so it stays light
> and Railway-deployable. The frontend calls the speech service directly via
> `VITE_SPEECH_URL`. See "Voice architecture" below.

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

## Voice architecture (ASR + TTS)

Speech is intentionally **not** in this service. Whisper + Piper are heavy,
CPU-bound, and hold warm model state, so they live in a dedicated local
FastAPI microservice inside the prebuilt repo:

```
frontend
  ├─ VITE_API_URL    → this orchestrator (:8000)  → Ollama gemma4:12b   [/chat /live]
  └─ VITE_SPEECH_URL → speech service   (:8001)   → Whisper + Piper     [/asr /tts]
```

Run the speech service (from the prebuilt repo):

```bash
cd <prebuilt-repo>
venv\Scripts\activate
uvicorn server:app --host 0.0.0.0 --port 8001
```

- `POST /asr` — multipart `audio` (webm/wav/…) → `{ "text": "…" }`
- `POST /tts` — `{ "text": "…" }` → `audio/wav` (auto-picks Nepali vs English)

When `VITE_SPEECH_URL` is unset, the frontend falls back to the browser Web
Speech API — so the orchestrator alone is enough for a cloud demo.

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
    routers/
      health.py  chat.py  live.py
  requirements.txt   .env.example   Procfile   railway.json
```

Speech service (separate, in the prebuilt repo): `server.py` + `pipeline.py`.

## Deploy on Railway

1. New project → deploy the `backend/` directory (Nixpacks auto-detects Python).
2. Set variables: `MODEL_API_URL`, `MODEL_API_KEY`, `MODEL_NAME`, and
   `ALLOWED_ORIGINS` (your frontend URL).
3. Start command (from `Procfile` / `railway.json`):
   `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

Point the frontend at it by setting `VITE_API_URL` to the Railway URL.
