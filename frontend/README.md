# NEVA — Frontend

Calm AI emergency first-aid assistant. Mobile-first React app (Vite + Tailwind v4).

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build
npm run lint
```

## Screens

| Route             | Screen        | Notes                                                        |
| ----------------- | ------------- | ------------------------------------------------------------ |
| `/`               | Home          | Navigation hub, online/offline status, quick guides          |
| `/instructions`   | Instructions  | Searchable first-aid guides (offline, static)                |
| `/instructions/:id` | Guide detail | Steps, warnings, "Read aloud" (browser TTS), "Go Live"      |
| `/live`           | Live Mode     | Immersive voice guidance — ASR → assistant → TTS, one step at a time |
| `/chat`           | Chat Mode     | Text + voice + image, per-message TTS, toggle to Live        |
| `/map`            | Nearby Help   | Hospitals/clinics/pharmacies, emergency numbers, geolocation |

## Wiring the backend

All network calls live in `src/services/api.js` and are **stubbed** with mock
responses shaped like the real ones. To connect the backend:

1. Copy `.env.example` → `.env` and set `VITE_API_URL`.
2. In each function, replace the `mock*` / `wait()` body with the `// REAL:`
   line already written beside it (`sendMessage`, `nextLiveStep`,
   `transcribeAudio`, `synthesizeSpeech`, `fetchNearbyPlaces`).

Voice currently uses the browser Web Speech API (`src/hooks/useSpeech.js`) so
Live/Chat speak and listen client-side during the demo. Swap for server
ASR/TTS by wiring `transcribeAudio` / `synthesizeSpeech`.

## Structure

```
src/
  components/   PhoneFrame, BottomNav, PageHeader, StatusPill, Logo, EmergencyButton, DynamicIcon
  pages/        Home, Instructions, InstructionDetail, LiveMode, Chat, MapPage
  hooks/        useSpeech (TTS/ASR), useOnlineStatus, useGeolocation
  services/     api.js (axios client + stubs)
  data/         firstAid.js, hospitals.js
```
