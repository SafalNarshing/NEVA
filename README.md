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
  client (Ollama native or any OpenAI-compatible API), mock fallback. Light and
  Railway-deployable.
- **Speech service** (`../-NEVA-…-Prebuilt-TTS-and-ASR/server.py`) — heavy local
  ASR/TTS, kept in its own process so models stay warm and deps stay isolated.
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

# 2) Speech service  →  http://localhost:8001   (in the prebuilt repo)
cd ../-NEVA-Nepal-Emergency-Voice-Assistant-Prebuilt-TTS-and-ASR
venv\Scripts\activate && pip install fastapi
uvicorn server:app --host 0.0.0.0 --port 8001

# 3) Frontend  →  http://localhost:5173
cd ../NEVA/frontend
npm install && npm run dev
```

`backend/.env` and `frontend/.env` are pre-filled for this machine. See each
sub-project's README for details:

- `backend/README.md` — endpoints, provider switching, deployment
- `frontend/README.md` — screens, wiring
- speech service — `SERVER.md` in the prebuilt repo

## Degraded modes

| Missing               | Behavior                                               |
| --------------------- | ------------------------------------------------------ |
| Speech service        | Voice falls back to browser Web Speech API             |
| Orchestrator / Ollama | Chat/Live fall back to built-in mock first-aid replies |
