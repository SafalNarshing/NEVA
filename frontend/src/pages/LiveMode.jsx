import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mic, MicOff, Camera, PhoneOff, Volume2, VolumeX } from 'lucide-react'
import GradientSphere from '../components/GradientSphere'
import { nextLiveStep, HAS_BACKEND_WS } from '../services/api'
import { useVoiceInput, useVoiceOutput } from '../hooks/useVoice'
import { useLiveStream } from '../hooks/useLiveStream'
import { useSentenceSpeaker } from '../hooks/useSentenceSpeaker'
import { useLanguage } from '../i18n/language'

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

export default function LiveMode() {
  const navigate = useNavigate()
  const { lang, t } = useLanguage()

  // Scrollable transcript of the whole session: user turns + NEVA's replies.
  const [transcript, setTranscript] = useState(() => [
    {
      id: uid(),
      role: 'assistant',
      content: t('live.opener'),
      followUp: t('live.openerPrompt'),
    },
  ])
  const [interim, setInterim] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [muted, setMuted] = useState(false)

  const fileRef = useRef(null)
  const scrollRef = useRef(null)
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

  const pushTranscript = useCallback((msg) => {
    setTranscript((list) => [...list, msg])
  }, [])

  const updateTranscript = useCallback((id, content, followUp) => {
    setTranscript((list) =>
      list.map((m) =>
        m.id === id
          ? { ...m, content: content ?? m.content, followUp: followUp ?? m.followUp }
          : m,
      ),
    )
  }, [])

  // Keep the newest turn pinned to the bottom as it streams in.
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [transcript, interim, streaming])

  // Non-streaming fallback (no WS / stream error): one request, then speak.
  const fallbackTurn = useCallback(
    async (messages, asstId) => {
      try {
        const res = await nextLiveStep({ messages, mode: 'live', language: lang })
        const full = [res.reply, res.followUp].filter(Boolean).join(' ')
        updateTranscript(asstId, res.reply, res.followUp || '')
        historyRef.current = [...messages, { role: 'assistant', content: res.reply }]
        if (!mutedRef.current) voiceOut.speak(full)
      } finally {
        setStreaming(false)
      }
    },
    [voiceOut, lang, updateTranscript],
  )

  const handleFinal = useCallback(
    (text) => {
      if (!text?.trim()) return
      setInterim('')
      stopAll()
      const messages = [...historyRef.current, { role: 'user', content: text }]
      historyRef.current = messages
      setStreaming(true)

      pushTranscript({ id: uid(), role: 'user', content: text })
      const asstId = uid()
      pushTranscript({ id: asstId, role: 'assistant', content: '' })

      if (!HAS_BACKEND_WS) {
        fallbackTurn(messages, asstId)
        return
      }

      liveStream.start({
        messages,
        language: lang,
        onToken: (full) => updateTranscript(asstId, full),
        onSentence: (s) => {
          if (!mutedRef.current) speaker.enqueue(s)
        },
        onDone: (full) => {
          updateTranscript(asstId, full)
          historyRef.current = [...messages, { role: 'assistant', content: full }]
          setStreaming(false)
        },
        onError: () => fallbackTurn(messages, asstId),
      })
    },
    [stopAll, liveStream, speaker, fallbackTurn, lang, pushTranscript, updateTranscript],
  )

  const voiceIn = useVoiceInput({
    lang: lang === 'ne' ? 'ne-NP' : 'en-US',
    onTranscript: handleFinal,
    onInterim: setInterim,
  })

  // Greet + speak the cached opener on entry.
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!mutedRef.current) speaker.enqueue(t('live.opener'))
    }, 400)
    return () => {
      clearTimeout(timer)
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
      ? t('live.statusTranscribing')
      : phase === 'listening'
        ? t('live.statusListening')
        : phase === 'thinking'
          ? t('live.statusThinking')
          : phase === 'speaking'
            ? t('live.statusSpeaking')
            : t('live.statusIdle')

  const lastAsstId = [...transcript].reverse().find((m) => m.role === 'assistant')?.id

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
          {t('live.header')}
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
      <div className="flex flex-col items-center pt-6">
        <GradientSphere state={phase} size={150} />
        <p className="mt-4 h-5 text-sm font-medium text-brand-100">{status}</p>
      </div>

      {/* Scrollable transcript */}
      <div ref={scrollRef} className="no-scrollbar mt-4 flex-1 space-y-3 overflow-y-auto px-5 pb-2">
        {transcript.map((m) => {
          const isUser = m.role === 'user'
          const isLiveAssistant = !isUser && m.id === lastAsstId && streaming
          return (
            <div
              key={m.id}
              className={`flex animate-fade-up ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div className="max-w-[85%]">
                <p
                  className={`mb-1 px-1 text-[10px] font-bold uppercase tracking-wide ${
                    isUser ? 'text-right text-brand-300' : 'text-white/50'
                  }`}
                >
                  {isUser ? t('live.you') : t('live.assistant')}
                </p>
                <div
                  className={`rounded-3xl px-4 py-2.5 text-[15px] leading-snug shadow-card ${
                    isUser
                      ? 'rounded-br-lg bg-brand-500 text-white'
                      : 'rounded-bl-lg bg-white text-ink'
                  }`}
                >
                  {m.content}
                  {isLiveAssistant && !m.content && (
                    <span className="inline-flex items-center gap-1">
                      {[0, 1, 2].map((i) => (
                        <span
                          key={i}
                          className="h-1.5 w-1.5 rounded-full bg-brand-300"
                          style={{
                            animation: 'neva-bar 1s ease-in-out infinite',
                            animationDelay: `${i * 0.15}s`,
                          }}
                        />
                      ))}
                    </span>
                  )}
                  {!isUser && m.followUp && (
                    <p className="mt-2 border-t border-line/70 pt-2 text-sm font-medium text-brand-600">
                      {m.followUp}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )
        })}

        {/* Live draft of what the mic is hearing right now */}
        {interim && (
          <div className="flex animate-fade-up justify-end">
            <div className="max-w-[85%]">
              <p className="mb-1 px-1 text-right text-[10px] font-bold uppercase tracking-wide text-brand-300">
                {t('live.you')}
              </p>
              <div className="rounded-3xl rounded-br-lg bg-brand-500/85 px-4 py-2.5 text-[15px] leading-snug text-white backdrop-blur">
                {interim}
                <span className="ml-1 inline-block h-3.5 w-0.5 animate-pulse bg-white/90 align-middle" />
              </div>
            </div>
          </div>
        )}
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
            if (e.target.files?.[0]) handleFinal(t('live.photoShare'))
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
