import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Send,
  Mic,
  ImagePlus,
  Volume2,
  Square,
  Radio,
  X,
  Phone,
  PhoneCall,
  Check,
  RotateCcw,
  Building2,
} from 'lucide-react'
import PageHeader from '../components/PageHeader'
import { sendMessage } from '../services/api'
import { useVoiceInput, useVoiceOutput } from '../hooks/useVoice'
import { useConversation } from '../context/conversation'
import { useGeolocation } from '../hooks/useGeolocation'
import { parseGuidance } from '../utils/guidance'
import {
  detectContactIntent,
  detectCondition,
  buildEscalation,
} from '../data/emergency'

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

/* ------------------------------------------------------------------ *
 * Text bubble
 * ------------------------------------------------------------------ */
function Bubble({ msg }) {
  const isUser = msg.role === 'user'
  return (
    <div className={`flex animate-fade-up ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[82%] ${isUser ? 'items-end' : 'items-start'}`}>
        {msg.image && (
          <img
            src={msg.image}
            alt="Shared by you"
            className="mb-1 max-h-48 rounded-2xl object-cover ring-1 ring-line"
          />
        )}
        {msg.content && (
          <div
            className={`rounded-3xl px-4 py-2.5 text-[15px] leading-snug shadow-card ${
              isUser
                ? 'rounded-br-lg bg-brand-500 text-white'
                : 'rounded-bl-lg bg-white text-ink ring-1 ring-line'
            }`}
          >
            {msg.content}
            {msg.followUp && (
              <p className="mt-2 border-t border-line/70 pt-2 text-sm font-medium text-brand-600">
                {msg.followUp}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * Play (TTS) control shared by assistant messages
 * ------------------------------------------------------------------ */
function PlayButton({ msg, onSpeak, isSpeaking }) {
  return (
    <button
      type="button"
      onClick={() => onSpeak(msg)}
      className="mt-1.5 ml-1 inline-flex items-center gap-1 text-xs font-semibold text-ink-soft transition-colors active:text-brand-600"
    >
      {isSpeaking ? (
        <>
          <Square size={13} aria-hidden="true" /> Stop
        </>
      ) : (
        <>
          <Volume2 size={13} aria-hidden="true" /> Play
        </>
      )}
    </button>
  )
}

/* ------------------------------------------------------------------ *
 * Assistant message — parses free text into scannable blocks:
 *   red call-out · intro · numbered step cards · follow-up question.
 * Short replies (no steps / no emergency) fall back to a plain bubble.
 * ------------------------------------------------------------------ */
function AssistantMessage({ msg, onSpeak, isSpeaking }) {
  const g = useMemo(() => parseGuidance(msg.content), [msg.content])
  const structured = Boolean(g.emergency || g.steps.length)

  if (!structured) {
    return (
      <div className="flex animate-fade-up justify-start">
        <div className="max-w-[85%]">
          <div className="rounded-3xl rounded-bl-lg bg-white px-4 py-2.5 text-[15px] leading-snug text-ink shadow-card ring-1 ring-line">
            {msg.content}
            {msg.followUp && (
              <p className="mt-2 border-t border-line/70 pt-2 text-sm font-medium text-brand-600">
                {msg.followUp}
              </p>
            )}
          </div>
          <PlayButton msg={msg} onSpeak={onSpeak} isSpeaking={isSpeaking} />
        </div>
      </div>
    )
  }

  return (
    <div className="flex animate-fade-up justify-start">
      <div className="w-full space-y-2">
        {/* Emergency call-out */}
        {g.emergency && (
          <a
            href={`tel:${g.emergencyNumber || '102'}`}
            className="flex items-center gap-3 rounded-2xl bg-danger-500 px-4 py-3 text-white shadow-[0_10px_24px_-10px_rgba(239,68,68,0.7)] transition-transform active:scale-[0.99]"
          >
            <PhoneCall size={22} strokeWidth={2.4} className="shrink-0" aria-hidden="true" />
            <span className="flex-1 text-[15px] font-bold leading-snug">
              {g.emergency}
            </span>
            <span className="shrink-0 rounded-full bg-white/25 px-3 py-1 text-sm font-bold">
              Call
            </span>
          </a>
        )}

        {/* Intro */}
        {g.intro && (
          <div className="rounded-2xl bg-white px-4 py-3 text-[15px] leading-snug text-ink shadow-card ring-1 ring-line">
            {g.intro}
          </div>
        )}

        {/* Step cards */}
        {g.steps.length > 0 && (
          <ol className="space-y-2">
            {g.steps.map((s, i) => (
              <li
                key={i}
                className="flex gap-3 rounded-2xl bg-white px-3.5 py-3 shadow-card ring-1 ring-line"
              >
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-100 text-sm font-black text-brand-600">
                  {i + 1}
                </span>
                <p className="pt-0.5 text-[15px] leading-snug text-ink">{s}</p>
              </li>
            ))}
          </ol>
        )}

        {/* Follow-up question */}
        {msg.followUp && (
          <div className="rounded-2xl bg-brand-50 px-4 py-3 text-[15px] font-semibold leading-snug text-brand-700 ring-1 ring-brand-100">
            {msg.followUp}
          </div>
        )}

        <PlayButton msg={msg} onSpeak={onSpeak} isSpeaking={isSpeaking} />
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * Call card — a "contacting X" action with a real tel: dial button
 * ------------------------------------------------------------------ */
function CallCard({ msg }) {
  const { target } = msg
  const isAmbulance = target.kind === 'ambulance'
  return (
    <div className="flex animate-fade-up justify-start">
      <div className="w-[82%] overflow-hidden rounded-3xl rounded-bl-lg bg-white shadow-card ring-1 ring-line">
        <div
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold text-white ${
            isAmbulance ? 'bg-danger-500' : 'bg-brand-600'
          }`}
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/70" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white" />
          </span>
          Contacting {isAmbulance ? 'Ambulance' : 'Hospital'}…
        </div>
        <div className="flex items-center gap-3 px-4 py-3">
          <span
            className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${
              isAmbulance
                ? 'bg-danger-100 text-danger-600'
                : 'bg-brand-100 text-brand-600'
            }`}
          >
            {isAmbulance ? (
              <PhoneCall size={22} aria-hidden="true" />
            ) : (
              <Building2 size={22} aria-hidden="true" />
            )}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate font-bold text-ink">{target.label}</p>
            <p className="truncate text-xs text-ink-soft">
              {target.number}
              {target.area ? ` · ${target.area}` : ''}
              {target.dist != null
                ? ` · ${target.dist < 1 ? `${Math.round(target.dist * 1000)} m` : `${target.dist.toFixed(1)} km`}`
                : ''}
            </p>
          </div>
          <a
            href={`tel:${target.number}`}
            aria-label={`Call ${target.label} at ${target.number}`}
            className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-full px-4 font-bold text-white transition-transform active:scale-95 ${
              isAmbulance ? 'bg-danger-500' : 'bg-brand-600'
            }`}
          >
            <Phone size={16} aria-hidden="true" /> Call
          </a>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * Yes/No prompt bubble (drives the call-escalation flow)
 * ------------------------------------------------------------------ */
function PromptBubble({ msg, onAnswer }) {
  const resolved = !!msg.resolved
  return (
    <div className="flex animate-fade-up justify-start">
      <div className="max-w-[82%]">
        <div className="rounded-3xl rounded-bl-lg bg-white px-4 py-2.5 text-[15px] leading-snug text-ink shadow-card ring-1 ring-line">
          {msg.content}
        </div>
        <div className="mt-2 flex gap-2">
          {msg.actions.map((a) => {
            const chosen = msg.resolved === a.value
            return (
              <button
                key={a.value}
                type="button"
                disabled={resolved}
                onClick={() => onAnswer(msg, a.value)}
                className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-full px-4 text-sm font-bold transition-transform active:scale-95 disabled:opacity-100 ${
                  a.value === 'yes'
                    ? chosen
                      ? 'bg-teal-500 text-white'
                      : 'bg-teal-100 text-teal-700'
                    : chosen
                      ? 'bg-danger-500 text-white'
                      : 'bg-danger-50 text-danger-600'
                } ${resolved && !chosen ? 'opacity-40' : ''}`}
              >
                {a.value === 'yes' && chosen && <Check size={15} aria-hidden="true" />}
                {a.value === 'no' && chosen && <RotateCcw size={15} aria-hidden="true" />}
                {a.label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

/* ================================================================== */

export default function Chat() {
  const { messages, setMessages } = useConversation()
  const [input, setInput] = useState('')
  const [image, setImage] = useState(null)
  const [sending, setSending] = useState(false)
  const [speakingId, setSpeakingId] = useState(null)

  const scrollRef = useRef(null)
  const fileRef = useRef(null)

  const { coords, locate } = useGeolocation()
  const { speak, stop, speaking } = useVoiceOutput()
  const voiceIn = useVoiceInput({
    onTranscript: (text) => setInput((prev) => (prev ? `${prev} ${text}` : text)),
    onInterim: (text) => setInput(text),
  })

  // Ask for location once so "nearest hospital" is ready if it's ever needed.
  useEffect(() => {
    locate()
  }, [locate])

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [messages, sending])

  const push = (msg) => setMessages((m) => [...m, { id: uid(), ...msg }])

  const handleSpeak = (msg) => {
    if (speakingId === msg.id && speaking) {
      stop()
      setSpeakingId(null)
    } else {
      speak([msg.content, msg.followUp].filter(Boolean).join('. '))
      setSpeakingId(msg.id)
    }
  }

  const pickImage = (e) => {
    const file = e.target.files?.[0]
    if (file) setImage(URL.createObjectURL(file))
    e.target.value = ''
  }

  /* ---- Emergency contact flow ---- */

  const startCallFlow = (fullText) => {
    const condition = detectCondition(fullText)
    const escalation = buildEscalation({ coords, condition })
    push({
      role: 'assistant',
      type: 'text',
      content:
        'Do not worry — I’ll contact help for you right now. Stay with the patient and keep them calm.',
    })
    callStep(escalation, 0)
  }

  const callStep = (escalation, idx) => {
    const target = escalation[idx]
    push({ role: 'assistant', type: 'call', target })
    push({
      role: 'assistant',
      type: 'prompt',
      content:
        idx === 0
          ? `Calling the ambulance on ${target.number}. Were you able to reach them?`
          : `Now trying ${target.label} (${target.number}). Did they respond?`,
      flow: { escalation, idx },
      actions: [
        { label: 'Yes, reached', value: 'yes' },
        { label: 'No answer', value: 'no' },
      ],
    })
  }

  const onPromptAnswer = (msg, value) => {
    // Mark this prompt resolved so its buttons lock to the chosen answer.
    setMessages((list) =>
      list.map((m) => (m.id === msg.id ? { ...m, resolved: value } : m)),
    )

    const { escalation, idx } = msg.flow
    if (value === 'yes') {
      push({
        role: 'assistant',
        type: 'text',
        content:
          'Good — help is on the way. Keep the patient still and stay with them. Tell me right away if anything changes.',
      })
      return
    }

    const next = idx + 1
    if (next < escalation.length) {
      const nh = escalation[next]
      push({
        role: 'assistant',
        type: 'text',
        content: `No problem — let me try the nearest hospital, ${nh.label}.`,
      })
      callStep(escalation, next)
    } else {
      push({
        role: 'assistant',
        type: 'text',
        content:
          'We’ve tried the ambulance and the nearest hospitals. Please keep redialling 102 and, if you can, take the patient to the nearest hospital directly. I’m staying right here with you.',
      })
    }
  }

  /* ---- Send ---- */

  const handleSend = async () => {
    const text = input.trim()
    if ((!text && !image) || sending) return
    if (voiceIn.active) voiceIn.toggle()

    const userMsg = { id: uid(), role: 'user', type: 'text', content: text, image }
    setMessages((m) => [...m, userMsg])
    setInput('')
    setImage(null)

    // Contact intent → deterministic emergency call flow (no LLM round-trip).
    if (detectContactIntent(text)) {
      const convoText = [...messages, userMsg]
        .filter((m) => m.role === 'user')
        .map((m) => m.content)
        .join(' ')
      startCallFlow(convoText)
      return
    }

    setSending(true)
    try {
      const history = [...messages, userMsg]
        .filter((m) => (m.type ?? 'text') === 'text' && m.content)
        .map(({ role, content }) => ({ role, content }))
      const res = await sendMessage({
        messages: history,
        image: userMsg.image,
        mode: 'chat',
      })
      push({
        role: 'assistant',
        type: 'text',
        content: res.reply,
        followUp: res.followUp,
      })
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="flex h-full flex-col bg-canvas">
      <PageHeader
        title="Chat Mode"
        subtitle="Text, voice & photos"
        back={false}
        right={
          <Link
            to="/live"
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full bg-brand-500 px-3.5 text-sm font-bold text-white shadow-card transition-transform active:scale-95"
          >
            <Radio size={16} aria-hidden="true" /> Live
          </Link>
        }
      />

      {/* Messages */}
      <div ref={scrollRef} className="no-scrollbar flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.map((m) => {
          if (m.type === 'call') return <CallCard key={m.id} msg={m} />
          if (m.type === 'prompt')
            return <PromptBubble key={m.id} msg={m} onAnswer={onPromptAnswer} />
          if (m.role === 'assistant')
            return (
              <AssistantMessage
                key={m.id}
                msg={m}
                onSpeak={handleSpeak}
                isSpeaking={speakingId === m.id && speaking}
              />
            )
          return <Bubble key={m.id} msg={m} />
        })}

        {sending && (
          <div className="flex justify-start">
            <div className="flex items-center gap-1.5 rounded-3xl rounded-bl-lg bg-white px-4 py-3 shadow-card ring-1 ring-line">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="h-2 w-2 rounded-full bg-brand-300"
                  style={{
                    animation: 'neva-bar 1s ease-in-out infinite',
                    animationDelay: `${i * 0.15}s`,
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Composer */}
      <div className="shrink-0 border-t border-line bg-white/95 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur">
        {voiceIn.error && (
          <div className="mb-2 rounded-xl bg-danger-50 px-3 py-2 text-xs font-medium text-danger-600 ring-1 ring-danger-100">
            {voiceIn.error}
          </div>
        )}
        {image && (
          <div className="relative mb-2 ml-1 inline-block">
            <img
              src={image}
              alt="Attachment preview"
              className="h-16 w-16 rounded-xl object-cover ring-1 ring-line"
            />
            <button
              type="button"
              onClick={() => setImage(null)}
              aria-label="Remove image"
              className="absolute -right-1.5 -top-1.5 grid h-6 w-6 place-items-center rounded-full bg-ink text-white"
            >
              <X size={13} aria-hidden="true" />
            </button>
          </div>
        )}
        <div className="flex items-end gap-2">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={pickImage}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            aria-label="Add a photo"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-canvas text-ink-soft ring-1 ring-line transition-colors active:bg-brand-50"
          >
            <ImagePlus size={20} aria-hidden="true" />
          </button>

          <div className="flex flex-1 items-end rounded-3xl bg-canvas ring-1 ring-line focus-within:ring-2 focus-within:ring-brand-400">
            <textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
              placeholder={
                voiceIn.busy
                  ? 'Transcribing…'
                  : voiceIn.active
                    ? 'Listening…'
                    : 'Describe what happened…'
              }
              className="max-h-28 w-full resize-none bg-transparent px-4 py-3 text-[15px] text-ink outline-none placeholder:text-ink-soft"
              aria-label="Message"
            />
            {voiceIn.supported && (
              <button
                type="button"
                onClick={voiceIn.toggle}
                disabled={voiceIn.busy}
                aria-label={voiceIn.active ? 'Stop recording' : 'Record voice'}
                className={`m-1 grid h-9 w-9 shrink-0 place-items-center rounded-full transition-colors disabled:opacity-50 ${
                  voiceIn.active ? 'bg-danger-500 text-white' : 'text-ink-soft active:bg-brand-50'
                }`}
              >
                <Mic size={19} aria-hidden="true" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={handleSend}
            disabled={(!input.trim() && !image) || sending}
            aria-label="Send message"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand-500 text-white shadow-card transition-all active:scale-90 disabled:opacity-40"
          >
            <Send size={19} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  )
}
