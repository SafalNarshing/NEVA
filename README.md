# NEVA — Nepal Emergency Voice Assistant

Calm, step-by-step first-aid guidance in **English and Nepali** — by voice, chat,
or offline guides. Built for low-stress use in a real emergency.

**Live demo:** https://neva-pied.vercel.app/
**Demo video (short):** https://www.youtube.com/shorts/EWnz5vF-teM

> The hosted demo runs on free-tier hosting, so it may be slow, sleeping, or
> not fully working (e.g. the speech service isn't deployed there) — the
> video is the reliable way to see the full voice + chat flow.

## Gemma 4 implementation

**Gemma 4 (`gemma-4-31b-it`, served via Google's Gemini API) is the model
behind every real reply** — it turns a panicking user's message into calm,
sequential, bilingual first-aid guidance. Where to look:

| What                                   | File                                                                                          |
| --------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Model call (Google's OpenAI-compatible endpoint) | [`backend/app/llm/client.py`](backend/app/llm/client.py) — `LLMClient._openai_body` / `.complete` / `.stream` |
| Hidden-reasoning stripping              | [`backend/app/llm/client.py`](backend/app/llm/client.py) — `_strip_thinking` / `_ThoughtStreamFilter` |
| System prompts fed to Gemma             | [`backend/app/prompts.py`](backend/app/prompts.py) — calm-tone + safety rules, CHAT vs LIVE pacing, bilingual instruction |
| Prompt assembly (rules + RAG + message) | [`backend/app/services.py`](backend/app/services.py) → [`backend/app/rag_context.py`](backend/app/rag_context.py) |
| RAG grounding fed into the prompt       | [`backend/app/rag/retriever.py`](backend/app/rag/retriever.py) — bge-m3 + ChromaDB retrieval over WHO/MoHP protocols |
| Streaming token-by-token (Live mode)    | [`backend/app/routers/stream.py`](backend/app/routers/stream.py) — `WS /ws/live` |
| Config / how to point at Gemma          | [`backend/app/config.py`](backend/app/config.py), [`backend/.env.example`](backend/.env.example) |

**Why this Gemma 4 model needs special handling:** it's a reasoning model
that emits its thinking inline as `<thought>...</thought>` ahead of the real
answer — and, unlike `gemma4:12b` on Ollama (`think=false`), there is **no
supported request param to turn that off** on Google's API (`thinking_config`
and `reasoning_effort` are both rejected). Left alone, that reasoning text
would land in the chat UI and get read aloud by the Live-mode TTS voice.
`LLMClient` strips `<thought>` blocks after the fact — for both the plain
`/chat` response and the token-by-token stream — so only the real answer ever
reaches the user. It also means `MAX_TOKENS` has to cover the hidden reasoning
*and* the visible reply (1600, not 640) or stripping leaves nothing behind.
See `backend/README.md` § "Gemma 4 via Google's Gemini API" for the exact env
vars and the full story.

Every reply (chat and live) flows through the same path:

```
user message
  → system prompt (backend/app/prompts.py: tone, safety rules, EN/NE mirroring)
  → + retrieved WHO/MoHP protocol chunks, if RAG is enabled (backend/app/rag/)
  → Gemma 4 via Google's Gemini API   (backend/app/llm/client.py)
  → strip inline <thought>...</thought> reasoning
  → reply (+ optional follow-up question, chat mode only)
```

The orchestrator is provider-agnostic by design (Gemma via Google's API, Gemma
via local Ollama, or any OpenAI-compatible endpoint) — the shipped, default,
and demoed configuration is **Gemma 4 via Google's Gemini API**.

## Architecture

Three local services (the frontend talks to two of them directly):

```
frontend (React/Vite)
  ├─ VITE_API_URL    → orchestrator (FastAPI :8000) → Gemma 4 (Google Gemini API)   [/chat /live]
  └─ VITE_SPEECH_URL → speech service (FastAPI :8001) → Whisper + Piper             [/asr /tts]
```

- **Orchestrator** (`backend/`) — chat/live prompt logic, provider-agnostic LLM
  client (Google's Gemini API, Ollama native, or any OpenAI-compatible API),
  mock fallback, and **optional RAG grounding** (WHO/MoHP protocols via bge-m3
  + ChromaDB). The prompt = short system rules + retrieved protocol block +
  user message.
- **Speech service** (`speech-service/`) — heavy local ASR/TTS (Whisper + Piper),
  kept in its own process so models stay warm and deps stay isolated.
- **Frontend** (`frontend/`) — mobile-first UI. Full voice loop
  (mic → ASR → Gemma → TTS → playback) with automatic fallback to the browser
  Web Speech API when the speech service isn't running.

## Run it all (local demo)

```bash
# 0) backend/.env needs a Gemma 4 provider — see "Model provider setup" below.
#    Default here is Google's Gemini API (just needs an API key, no local model).

# 1) Orchestrator  →  http://localhost:8000
cd backend && venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

# 2) Speech service  →  http://localhost:8001
cd speech-service
python -m venv venv && .\venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn server:app --host 0.0.0.0 --port 8001

# 3) Frontend  →  http://localhost:5173
cd ..\frontend
npm install && npm run dev
```

Or launch all of them at once: **`.\run-all.ps1`** (from the repo root).

`backend/.env` and `frontend/.env` are pre-filled for this machine. See each
sub-project's README for details:

- `backend/README.md` — endpoints, provider switching, deployment
- `frontend/README.md` — screens, wiring
- `speech-service/README.md` — ASR/TTS setup and endpoints

## Model provider setup

`backend/.env` picks the Gemma 4 backend — **no code change is required to
switch between these**, `app/llm/client.py` already branches on `LLM_PROVIDER`:

### Option A — Google's Gemini API (current default, no local model)

```env
LLM_PROVIDER=openai
MODEL_API_URL=https://generativelanguage.googleapis.com/v1beta/openai/
MODEL_API_KEY=<your Google AI Studio API key>
MODEL_NAME=gemma-4-31b-it
DISABLE_THINKING=false
MAX_TOKENS=1600
```

Just needs an API key — nothing to install or run locally for the model
itself. This Gemma 4 model always reasons inline (`<thought>...</thought>`)
with no way to disable it via request params, so `app/llm/client.py` strips
those blocks in `_strip_thinking` / `_ThoughtStreamFilter`; that's why
`MAX_TOKENS` is generous here (has to cover hidden reasoning + the real reply).

### Option B — local Gemma via Ollama

```bash
ollama pull gemma4:12b   # once; ensure `ollama serve` is up on :11434
```

```env
LLM_PROVIDER=ollama
MODEL_API_URL=http://localhost:11434/v1
MODEL_API_KEY=ollama
MODEL_NAME=gemma4:12b
DISABLE_THINKING=true
MAX_TOKENS=640
```

Switching to this option is **`.env`-only** — nothing in `client.py` needs
editing. `LLM_PROVIDER=ollama` routes calls through `LLMClient._ollama_body`
instead of `_openai_body`, hitting Ollama's native `/api/chat` so `think=false`
actually suppresses the model's reasoning at the source (Google's API has no
equivalent flag, which is why option A needs the strip step instead). The
`_strip_thinking` / `_ThoughtStreamFilter` step still runs for Ollama too —
it's a no-op there since no `<thought>` tags are ever emitted.

Full provider comparison table (Groq, Hugging Face, Together, …) and Railway
deployment notes: `backend/README.md` § "Switching model providers".

## Degraded modes

| Missing                  | Behavior                                               |
| ------------------------- | ------------------------------------------------------ |
| Speech service            | Voice falls back to browser Web Speech API             |
| Orchestrator / model API  | Chat/Live fall back to built-in mock first-aid replies |
| RAG disabled/not built    | Replies still work, just ungrounded (general guidance) |

RAG setup lives in `backend/README.md` (§ RAG grounding).
