import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mic, MicOff, Camera, PhoneOff, Volume2, VolumeX } from 'lucide-react'
import { nextLiveStep } from '../services/api'
import { useVoiceInput, useVoiceOutput } from '../hooks/useVoice'

const OPENER = {
  reply:
    'I’m here with you. Take a breath. Tell me what’s happening and who needs help.',
  followUp: 'Tap the mic and describe the emergency.',
}

/** Animated pulse rings around the mic orb. */
function Orb({ state }) {
  const color =
    state === 'listening'
      ? 'from-danger-400 to-danger-500'
      : state === 'speaking'
        ? 'from-teal-300 to-teal-500'
        : 'from-brand-300 to-brand-500'
  return (
    <div className="relative grid h-40 w-40 place-items-center">
      {(state === 'listening' || state === 'speaking') &&
        [0, 1, 2].map((i) => (
          <span
            key={i}
            className={`absolute h-40 w-40 rounded-full bg-gradient-to-br ${color} opacity-40`}
            style={{
              animation: 'neva-pulse-ring 2.4s ease-out infinite',
              animationDelay: `${i * 0.6}s`,
            }}
            aria-hidden="true"
          />
        ))}
      <div
        className={`relative grid h-32 w-32 place-items-center rounded-full bg-gradient-to-br ${color} shadow-float`}
      >
        {state === 'speaking' ? (
          <div className="flex items-end gap-1" aria-hidden="true">
            {[0, 1, 2, 3, 4].map((i) => (
              <span
                key={i}
                className="w-1.5 rounded-full bg-white"
                style={{
                  height: 34,
                  transformOrigin: 'bottom',
                  animation: 'neva-bar 0.9s ease-in-out infinite',
                  animationDelay: `${i * 0.12}s`,
                }}
              />
            ))}
          </div>
        ) : (
          <Mic size={46} strokeWidth={2.2} className="text-white" aria-hidden="true" />
        )}
      </div>
    </div>
  )
}

export default function LiveMode() {
  const navigate = useNavigate()
  const [turn, setTurn] = useState(OPENER)
  const [interim, setInterim] = useState('')
  const [thinking, setThinking] = useState(false)
  const [muted, setMuted] = useState(false)

  const fileRef = useRef(null)
  const mutedRef = useRef(false)
  const historyRef = useRef([])

  const voiceOut = useVoiceOutput()

  const say = useCallback(
    (text) => {
      if (!mutedRef.current) voiceOut.speak(text)
    },
    [voiceOut],
  )

  const handleFinal = useCallback(
    async (text) => {
      if (!text?.trim()) return
      setInterim('')
      const nextHistory = [...historyRef.current, { role: 'user', content: text }]
      historyRef.current = nextHistory
      setThinking(true)
      try {
        const res = await nextLiveStep({ messages: nextHistory, mode: 'live' })
        historyRef.current = [
          ...nextHistory,
          { role: 'assistant', content: res.reply },
        ]
        setTurn(res)
        say([res.reply, res.followUp].filter(Boolean).join('. '))
      } finally {
        setThinking(false)
      }
    },
    [say],
  )

  const voiceIn = useVoiceInput({
    onTranscript: handleFinal,
    onInterim: setInterim,
  })

  // Greet on entry.
  useEffect(() => {
    const t = setTimeout(
      () => say([OPENER.reply, OPENER.followUp].join('. ')),
      500,
    )
    return () => {
      clearTimeout(t)
      voiceOut.stop()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const toggleMute = () => {
    const next = !muted
    setMuted(next)
    mutedRef.current = next
    if (next) voiceOut.stop()
  }

  const endSession = () => {
    voiceOut.stop()
    navigate('/')
  }

  const orbState = voiceIn.active
    ? 'listening'
    : voiceOut.speaking
      ? 'speaking'
      : 'idle'

  const status = voiceIn.busy
    ? 'Transcribing…'
    : thinking
      ? 'NEVA is thinking…'
      : voiceIn.active
        ? 'Listening…'
        : voiceOut.speaking
          ? 'Speaking…'
          : 'Tap the mic to talk'

  return (
    <div className="flex h-full flex-col bg-gradient-to-b from-brand-700 via-brand-600 to-brand-800 text-white">
      {/* Header */}
      <header className="flex items-center justify-between px-5 pt-[max(1.25rem,env(safe-area-inset-top))]">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-sm font-bold backdrop-blur">
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
          className="grid h-10 w-10 place-items-center rounded-full bg-white/15 backdrop-blur transition-colors active:bg-white/25"
        >
          {muted ? <VolumeX size={20} aria-hidden="true" /> : <Volume2 size={20} aria-hidden="true" />}
        </button>
      </header>

      {/* Orb */}
      <div className="flex flex-col items-center pt-8">
        <Orb state={orbState} />
        <p className="mt-5 h-5 text-sm font-medium text-brand-100">{status}</p>
      </div>

      {/* Guidance */}
      <div className="no-scrollbar mt-4 flex-1 overflow-y-auto px-6">
        <div className="mx-auto max-w-sm text-center">
          <p className="text-[19px] font-semibold leading-relaxed text-white animate-fade-up">
            {turn.reply}
          </p>
          {turn.followUp && (
            <p className="mt-4 rounded-2xl bg-white/10 px-4 py-3 text-[15px] font-medium text-brand-100 backdrop-blur animate-fade-up">
              {turn.followUp}
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
            if (e.target.files?.[0]) {
              handleFinal('I’m sharing a photo of the injury.')
            }
            e.target.value = ''
          }}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          aria-label="Show the camera"
          className="grid h-14 w-14 place-items-center rounded-full bg-white/15 backdrop-blur transition-transform active:scale-90"
        >
          <Camera size={24} aria-hidden="true" />
        </button>

        <button
          type="button"
          onClick={voiceIn.toggle}
          disabled={!voiceIn.supported || voiceIn.busy}
          aria-label={voiceIn.active ? 'Stop listening' : 'Start talking'}
          className={`grid h-20 w-20 place-items-center rounded-full shadow-float transition-transform active:scale-95 disabled:opacity-50 ${
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

      {!voiceIn.supported && (
        <p className="pb-4 text-center text-xs text-brand-100">
          Voice input isn’t available here — try Chat Mode instead.
        </p>
      )}
    </div>
  )
}
