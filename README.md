# NEVA — Nepal Emergency Voice Assistant

Calm, step-by-step first-aid guidance in **English and Nepali** — by voice, chat,
or offline guides. Built for low-stress use in a real emergency.

## Architecture

Three local services (the frontend talks to two of them directly):

```
frontend (React/Vite)
  ├─ VITE_API_URL    → orchestrator (FastAPI :8000) → Ollama gemma4:12b   [/chat /live]
  └─ VITE_SPEECH_URL → speech service (FastAPI :8001) → Whisper + Piper   [/asr /tts]
```

- **Orchestrator** (`backend/`) — chat/live prompt logic, provider-agnostic LLM
  client (Ollama native or any OpenAI-compatible API), mock fallback, and
  **optional RAG grounding** (WHO/MoHP protocols via bge-m3 + ChromaDB). The
  prompt = short system rules + retrieved protocol block + user message.
- **Speech service** (`speech-service/`) — heavy local ASR/TTS (Whisper + Piper),
  kept in its own process so models stay warm and deps stay isolated.
- **Frontend** (`frontend/`) — mobile-first UI. Full voice loop
  (mic → ASR → Gemma → TTS → playback) with automatic fallback to the browser
  Web Speech API when the speech service isn't running.

## Run it all (local demo)

```bash
# 0) Ollama with the model (once); ensure `ollama serve` is up on :11434
ollama pull gemma4:12b

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

## Degraded modes

| Missing               | Behavior                                               |
| --------------------- | ------------------------------------------------------ |
| Speech service        | Voice falls back to browser Web Speech API             |
| Orchestrator / Ollama | Chat/Live fall back to built-in mock first-aid replies |
| RAG disabled/not built| Replies still work, just ungrounded (general guidance) |

RAG setup lives in `backend/README.md` (§ RAG grounding).
