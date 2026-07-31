import axios from 'axios'
import { hospitals } from '../data/hospitals.js'

/**
 * Central API client for NEVA.
 *
 * Everything here is STUBBED for the frontend demo but shaped like the real
 * calls, so wiring the backend later means: (1) set VITE_API_URL, and
 * (2) swap each `mock*` body for the real `client.post(...)` line already
 * written beside it.
 */
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const client = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

/** Small helper so mocked calls feel asynchronous in the UI. */
const wait = (ms) => new Promise((r) => setTimeout(r, ms))

/* ------------------------------------------------------------------ *
 * Chat / Live guidance (Gemma)
 * ------------------------------------------------------------------ */

/**
 * Send a message to the assistant.
 * @param {{ messages: Array<{role:string, content:string}>, image?: string, mode?: 'chat'|'live' }} payload
 * @returns {Promise<{ reply: string, followUp?: string }>}
 */
export async function sendMessage(payload) {
  // REAL: return (await client.post('/api/chat', payload)).data
  await wait(700)
  return mockAssistantReply(payload)
}

/**
 * Stream-style helper used by Live Mode to fetch the next single step.
 * Kept separate so Live can drive a calm, one-step-at-a-time flow.
 */
export async function nextLiveStep(payload) {
  // REAL: return (await client.post('/api/live/step', payload)).data
  await wait(600)
  return mockAssistantReply({ ...payload, mode: 'live' })
}

/* ------------------------------------------------------------------ *
 * Speech (server-side ASR / TTS). The demo uses the browser Web Speech
 * API via hooks/useSpeech, but these endpoints are here for a server swap.
 * ------------------------------------------------------------------ */

export async function transcribeAudio(audioBlob) {
  // REAL:
  // const form = new FormData(); form.append('audio', audioBlob)
  // return (await client.post('/api/asr', form)).data
  void audioBlob
  await wait(500)
  return { text: '' }
}

export async function synthesizeSpeech(text) {
  // REAL: return (await client.post('/api/tts', { text }, { responseType: 'blob' })).data
  await wait(200)
  return { audioUrl: null, text }
}

/* ------------------------------------------------------------------ *
 * Places / hospitals
 * ------------------------------------------------------------------ */

export async function fetchNearbyPlaces(coords) {
  // REAL: return (await client.get('/api/places', { params: coords })).data
  void coords
  await wait(300)
  return hospitals
}

/* ------------------------------------------------------------------ *
 * Mock reply engine — keyword-matched calm first-aid guidance.
 * ------------------------------------------------------------------ */

const KNOWLEDGE = [
  {
    match: ['cut', 'bleed', 'blood', 'wound'],
    reply:
      'Okay, stay calm — I’m here with you. First, press a clean cloth firmly onto the cut and keep pressing without lifting it. Raise the hand above chest level if you can.',
    followUp: 'Is the bleeding soaking through the cloth, or slowing down?',
  },
  {
    match: ['burn', 'scald', 'hot'],
    reply:
      'Let’s cool it right away. Hold the burn under cool running water for 20 minutes. Don’t apply ice, butter, or cream.',
    followUp: 'Are there any blisters, or is the skin broken?',
  },
  {
    match: ['chok', 'breath', 'swallow'],
    reply:
      'Stay calm. If they can’t cough or speak, lean them forward and give 5 firm blows between the shoulder blades with the heel of your hand.',
    followUp: 'Did the object come out, or are they still struggling to breathe?',
  },
  {
    match: ['faint', 'unconscious', 'collapse', 'passed out'],
    reply:
      'Check if they respond to their name and a gentle shoulder shake. Tilt their head back and check for breathing for 10 seconds.',
    followUp: 'Are they breathing normally right now?',
  },
  {
    match: ['snake', 'bite'],
    reply:
      'Keep them as still and calm as possible — movement spreads venom. Keep the bitten limb still and below the heart, and remove any rings or watches.',
    followUp: 'Can you tell me which limb was bitten and when it happened?',
  },
  {
    match: ['chest', 'heart', 'cpr'],
    reply:
      'If they’re unresponsive and not breathing normally, we need CPR. Place the heel of your hand in the centre of the chest and push hard and fast, about twice per second.',
    followUp: 'Is anyone nearby who can call 102 while you start compressions?',
  },
]

function mockAssistantReply(payload) {
  const last =
    [...(payload.messages || [])].reverse().find((m) => m.role === 'user')
      ?.content || ''
  const text = last.toLowerCase()

  const hit = KNOWLEDGE.find((k) => k.match.some((w) => text.includes(w)))
  if (hit) return { reply: hit.reply, followUp: hit.followUp }

  if (payload.image) {
    return {
      reply:
        'Thanks for the photo — I can see the affected area. Keep it clean and still. Let’s take this one step at a time.',
      followUp: 'How is the person feeling right now — any dizziness or severe pain?',
    }
  }

  return {
    reply:
      'I’m here to help. Take a breath — tell me what happened and where the person is hurt, and we’ll go through it one step at a time.',
    followUp: 'Can you describe the injury for me?',
  }
}
