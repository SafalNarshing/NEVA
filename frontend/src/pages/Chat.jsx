import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Send,
  Mic,
  ImagePlus,
  Volume2,
  Square,
  Radio,
  X,
} from 'lucide-react'
import PageHeader from '../components/PageHeader'
import { sendMessage } from '../services/api'
import { useTextToSpeech, useSpeechRecognition } from '../hooks/useSpeech'

const GREETING = {
  id: 'greet',
  role: 'assistant',
  content:
    'Hi, I’m NEVA. Tell me what happened — you can type, tap the mic to talk, or share a photo. We’ll go through it calmly, one step at a time.',
}

function Bubble({ msg, onSpeak, isSpeaking }) {
  const isUser = msg.role === 'user'
  return (
    <div
      className={`flex animate-fade-up ${isUser ? 'justify-end' : 'justify-start'}`}
    >
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
        {!isUser && msg.content && (
          <button
            type="button"
            onClick={() => onSpeak(msg)}
            className="mt-1 ml-1 inline-flex items-center gap-1 text-xs font-semibold text-ink-soft transition-colors active:text-brand-600"
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
        )}
      </div>
    </div>
  )
}

export default function Chat() {
  const [messages, setMessages] = useState([GREETING])
  const [input, setInput] = useState('')
  const [image, setImage] = useState(null)
  const [sending, setSending] = useState(false)
  const [speakingId, setSpeakingId] = useState(null)

  const scrollRef = useRef(null)
  const fileRef = useRef(null)

  const { speak, stop, speaking } = useTextToSpeech()
  const { start, stop: stopMic, listening, supported: micSupported } =
    useSpeechRecognition({
      onResult: ({ interim, final }) => setInput(final || interim),
    })

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [messages, sending])

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

  const handleSend = async () => {
    const text = input.trim()
    if ((!text && !image) || sending) return
    if (listening) stopMic()

    const userMsg = {
      id: `u-${messages.length}`,
      role: 'user',
      content: text,
      image,
    }
    const history = [...messages, userMsg]
    setMessages(history)
    setInput('')
    setImage(null)
    setSending(true)

    try {
      const res = await sendMessage({
        messages: history.map(({ role, content }) => ({ role, content })),
        image: userMsg.image,
        mode: 'chat',
      })
      setMessages((m) => [
        ...m,
        {
          id: `a-${m.length}`,
          role: 'assistant',
          content: res.reply,
          followUp: res.followUp,
        },
      ])
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
      <div
        ref={scrollRef}
        className="no-scrollbar flex-1 space-y-3 overflow-y-auto px-4 py-4"
      >
        {messages.map((m) => (
          <Bubble
            key={m.id}
            msg={m}
            onSpeak={handleSpeak}
            isSpeaking={speakingId === m.id && speaking}
          />
        ))}

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
              placeholder={listening ? 'Listening…' : 'Describe what happened…'}
              className="max-h-28 w-full resize-none bg-transparent px-4 py-3 text-[15px] text-ink outline-none placeholder:text-ink-soft"
              aria-label="Message"
            />
            {micSupported && (
              <button
                type="button"
                onClick={listening ? stopMic : start}
                aria-label={listening ? 'Stop recording' : 'Record voice'}
                className={`m-1 grid h-9 w-9 shrink-0 place-items-center rounded-full transition-colors ${
                  listening
                    ? 'bg-danger-500 text-white'
                    : 'text-ink-soft active:bg-brand-50'
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
