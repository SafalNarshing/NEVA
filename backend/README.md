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

**Streaming (Live mode):** `WS /ws/live` streams the grounded Gemma reply token
by token — send one JSON frame `{messages, language}`, receive
`{type:"token"|"done"|"error"}`. The frontend buffers tokens into sentences and
synthesises audio sentence-by-sentence, so words are spoken while the model is
still writing. On startup the API warms bge-m3 + the LLM so the first turn isn't
the slow one. First-token latency is dominated by the model — for sub-second
turns use a smaller `MODEL_NAME` (e.g. a 2–3B Ollama model); the streaming
pipeline is model-agnostic.

> **Voice (ASR/TTS)** is a **separate local service** — see `../speech-service/`
> (runs on `:8001`). This orchestrator is LLM-only so it stays light and
> Railway-deployable. The frontend calls the speech service directly via
> `VITE_SPEECH_URL`. See "Voice architecture" below.

## RAG grounding (WHO / MoHP protocols)

When enabled, every real-model reply is grounded in **42 hand-verified protocol
chunks** (English + Nepali) drawn from **WHO Basic Emergency Care (2016)** and
the **Nepal MoHP Standard Treatment Protocol (2078 BS)**, covering 11 emergencies
(choking, bleeding, CPR, snakebite, chest pain, burns, stroke, altitude sickness,
drowning, shock, seizure). Retrieval uses `BAAI/bge-m3` embeddings in ChromaDB.

The assembled prompt is: **short system rules + retrieved protocol block + user
message** (`app/rag_context.py` → `app/rag/retriever.py`).

Enable it:

```bash
pip install -r requirements-rag.txt        # chromadb + sentence-transformers (+torch)
python -m app.rag.build_db --rebuild        # embeds seeds → app/rag/chroma_db (one-time, downloads bge-m3)
# then set RAG_ENABLED=true in .env
```

- `RAG_ENABLED` off by default (base API needs no embedding stack).
- `RAG_STRICT=true` refuses ("no verified protocol → call 102") when nothing
  matches; `false` (default) just skips grounding for that turn.
- Retrieval is bilingual and auto-detects Nepali vs English from the query.
- Rebuild data lives in `app/rag/` (`seed_protocols.py`, `seed_protocols_ne.py`);
  drop extra JSON chunks in `app/rag/data/chunks/` and re-run `build_db`.

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
FastAPI microservice at `../speech-service/`:

```
frontend
  ├─ VITE_API_URL    → this orchestrator (:8000)  → Ollama gemma4:12b   [/chat /live]
  └─ VITE_SPEECH_URL → speech service   (:8001)   → Whisper + Piper     [/asr /tts]
```

Run the speech service:

```bash
cd ../speech-service
.\venv\Scripts\Activate.ps1
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
    rag_context.py     # bridges chat flow → protocol retrieval (lazy, optional)
    llm/
      client.py        # openai-compat + ollama-native client (httpx)
      mock.py          # offline fallback guidance engine
    rag/               # optional RAG stack (WHO/MoHP protocols)
      models.py        # pydantic contract (chunk metadata, request/result)
      seed_protocols.py / seed_protocols_ne.py   # 42 verified chunks (EN + NE)
      retriever.py     # bge-m3 + ChromaDB → retrieve() + format_for_prompt()
      build_db.py      # embeds seeds → chroma_db  (python -m app.rag.build_db)
    routers/
      health.py  chat.py  live.py
  requirements.txt   requirements-rag.txt   .env.example   Procfile   railway.json
```

Speech service (separate): `../speech-service/` (`server.py` + `pipeline.py`).

## Deploy on Railway

1. New project → deploy the `backend/` directory (Nixpacks auto-detects Python).
2. Set variables: `MODEL_API_URL`, `MODEL_API_KEY`, `MODEL_NAME`, and
   `ALLOWED_ORIGINS` (your frontend URL).
3. Start command (from `Procfile` / `railway.json`):
   `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

Point the frontend at it by setting `VITE_API_URL` to the Railway URL.
