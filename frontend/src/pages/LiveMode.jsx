import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mic, MicOff, Camera, PhoneOff, Volume2, VolumeX } from 'lucide-react'
import GradientSphere from '../components/GradientSphere'
import { nextLiveStep, HAS_BACKEND_WS } from '../services/api'
import { useVoiceInput, useVoiceOutput } from '../hooks/useVoice'
import { useLiveStream } from '../hooks/useLiveStream'
import { useSentenceSpeaker } from '../hooks/useSentenceSpeaker'

// Reply text pre-cached by the speech service → spoken in ~0ms on entry.
const OPENER = 'I am here with you. Stay calm, we will do this together.'
const OPENER_PROMPT = 'Tap the mic and tell me what’s happening.'

export default function LiveMode() {
  const navigate = useNavigate()
  const [turnText, setTurnText] = useState(OPENER)
  const [prompt, setPrompt] = useState(OPENER_PROMPT)
  const [interim, setInterim] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [muted, setMuted] = useState(false)

  const fileRef = useRef(null)
  const mutedRef = useRef(false)
  const historyRef = useRef([])

  const speaker = useSentenceSpeaker()
  const liveStream = useLiveStream()
  const voiceOut = useVoiceOutput() // fallback speech (non-streaming path)

  const stopAll = useCallback(() => {
    speaker.reset()
    voiceOut.stop()
    liveStream.close()
  }, [speaker, voiceOut, liveStream])

  // Non-streaming fallback (no WS / stream error): one request, then speak.
  const fallbackTurn = useCallback(
    async (messages) => {
      try {
        const res = await nextLiveStep({ messages, mode: 'live' })
        const full = [res.reply, res.followUp].filter(Boolean).join(' ')
        setTurnText(res.reply)
        setPrompt(res.followUp || '')
        historyRef.current = [...messages, { role: 'assistant', content: res.reply }]
        if (!mutedRef.current) voiceOut.speak(full)
      } finally {
        setStreaming(false)
      }
    },
    [voiceOut],
  )

  const handleFinal = useCallback(
    (text) => {
      if (!text?.trim()) return
      setInterim('')
      stopAll()
      const messages = [...historyRef.current, { role: 'user', content: text }]
      historyRef.current = messages
      setTurnText('')
      setPrompt('')
      setStreaming(true)

      if (!HAS_BACKEND_WS) {
        fallbackTurn(messages)
        return
      }

      liveStream.start({
        messages,
        language: 'auto',
        onToken: (full) => setTurnText(full),
        onSentence: (s) => {
          if (!mutedRef.current) speaker.enqueue(s)
        },
        onDone: (full) => {
          historyRef.current = [...messages, { role: 'assistant', content: full }]
          setStreaming(false)
        },
        onError: () => fallbackTurn(messages),
      })
    },
    [stopAll, liveStream, speaker, fallbackTurn],
  )

  const voiceIn = useVoiceInput({
    onTranscript: handleFinal,
    onInterim: setInterim,
  })

  // Greet + speak the cached opener on entry.
  useEffect(() => {
    const t = setTimeout(() => {
      if (!mutedRef.current) speaker.enqueue(OPENER)
    }, 400)
    return () => {
      clearTimeout(t)
      stopAll()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const toggleMute = () => {
    const next = !muted
    setMuted(next)
    mutedRef.current = next
    if (next) {
      speaker.reset()
      voiceOut.stop()
    }
  }

  const endSession = () => {
    stopAll()
    navigate('/')
  }

  const isSpeaking = speaker.speaking || voiceOut.speaking
  const phase = voiceIn.active
    ? 'listening'
    : isSpeaking
      ? 'speaking'
      : streaming
        ? 'thinking'
        : 'idle'

  const status =
    voiceIn.busy
      ? 'Transcribing…'
      : phase === 'listening'
        ? 'Listening…'
        : phase === 'thinking'
          ? 'Thinking…'
          : phase === 'speaking'
            ? 'Speaking…'
            : 'Tap the mic to talk'

  return (
    <div className="flex h-full flex-col bg-gradient-to-b from-[#1a0f4d] via-brand-800 to-[#0f0833] text-white">
      {/* Header */}
      <header className="flex items-center justify-between px-5 pt-[max(1.25rem,env(safe-area-inset-top))]">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-sm font-bold backdrop-blur">
          <span
            className="h-2 w-2 rounded-full bg-teal-300"
            style={{ animation: 'neva-bar 1.2s ease-in-out infinite' }}
            aria-hidden="true"
          />
          Live · NEVA
        </span>
        <button
          type="button"
          onClick={toggleMute}
          aria-label={muted ? 'Unmute voice' : 'Mute voice'}
          className="grid h-10 w-10 place-items-center rounded-full bg-white/10 backdrop-blur transition-colors active:bg-white/20"
        >
          {muted ? <VolumeX size={20} aria-hidden="true" /> : <Volume2 size={20} aria-hidden="true" />}
        </button>
      </header>

      {/* Sphere */}
      <div className="flex flex-col items-center pt-10">
        <GradientSphere state={phase} size={210} />
        <p className="mt-7 h-5 text-sm font-medium text-brand-100">{status}</p>
      </div>

      {/* Streaming guidance */}
      <div className="no-scrollbar mt-4 flex-1 overflow-y-auto px-6">
        <div className="mx-auto max-w-sm text-center">
          <p className="text-[19px] font-semibold leading-relaxed text-white">
            {turnText}
            {streaming && !turnText && (
              <span className="opacity-60">…</span>
            )}
          </p>
          {prompt && (
            <p className="mt-4 rounded-2xl bg-white/10 px-4 py-3 text-[15px] font-medium text-brand-100 backdrop-blur">
              {prompt}
            </p>
          )}
          {interim && (
            <p className="mt-4 text-sm italic text-white/70">“{interim}”</p>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-6 px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-4">
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.[0]) handleFinal('I’m sharing a photo of the injury.')
            e.target.value = ''
          }}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          aria-label="Show the camera"
          className="grid h-14 w-14 place-items-center rounded-full bg-white/10 backdrop-blur transition-transform active:scale-90"
        >
          <Camera size={24} aria-hidden="true" />
        </button>

        <button
          type="button"
          onClick={voiceIn.toggle}
          disabled={voiceIn.busy}
          aria-label={voiceIn.active ? 'Stop listening' : 'Start talking'}
          className={`grid h-20 w-20 place-items-center rounded-full shadow-float transition-transform active:scale-95 disabled:opacity-60 ${
            voiceIn.active ? 'bg-danger-500' : 'bg-white text-brand-600'
          }`}
        >
          {voiceIn.active ? (
            <MicOff size={30} className="text-white" aria-hidden="true" />
          ) : (
            <Mic size={30} strokeWidth={2.4} aria-hidden="true" />
          )}
        </button>

        <button
          type="button"
          onClick={endSession}
          aria-label="End live session"
          className="grid h-14 w-14 place-items-center rounded-full bg-danger-500 transition-transform active:scale-90"
        >
          <PhoneOff size={24} aria-hidden="true" />
        </button>
      </div>

      {voiceIn.error && (
        <div className="mx-6 mb-4 rounded-2xl bg-danger-500/20 px-4 py-2.5 text-center text-xs font-medium text-danger-100 ring-1 ring-danger-500/40">
          {voiceIn.error}
        </div>
      )}
    </div>
  )
}
