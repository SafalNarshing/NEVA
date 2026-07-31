import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Text-to-speech using the browser SpeechSynthesis API.
 * Works fully client-side so Live/Chat can speak during the demo; swap for a
 * server TTS stream later without changing the calling components.
 */
export function useTextToSpeech() {
  const [speaking, setSpeaking] = useState(false)
  const [supported] = useState(
    () => typeof window !== 'undefined' && 'speechSynthesis' in window,
  )

  const speak = useCallback(
    (text) => {
      if (!supported || !text) return
      window.speechSynthesis.cancel()
      const u = new SpeechSynthesisUtterance(text)
      u.rate = 0.98
      u.pitch = 1
      u.lang = 'en-US'
      u.onstart = () => setSpeaking(true)
      u.onend = () => setSpeaking(false)
      u.onerror = () => setSpeaking(false)
      window.speechSynthesis.speak(u)
    },
    [supported],
  )

  const stop = useCallback(() => {
    if (!supported) return
    window.speechSynthesis.cancel()
    setSpeaking(false)
  }, [supported])

  useEffect(() => () => supported && window.speechSynthesis.cancel(), [supported])

  return { speak, stop, speaking, supported }
}

/**
 * Speech-to-text using the browser SpeechRecognition API.
 * onResult receives interim and final transcripts.
 */
export function useSpeechRecognition({ onResult, onEnd } = {}) {
  const [listening, setListening] = useState(false)
  const recognitionRef = useRef(null)
  const [supported] = useState(
    () =>
      typeof window !== 'undefined' &&
      ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window),
  )

  useEffect(() => {
    if (!supported) return
    const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition
    const rec = new Ctor()
    rec.continuous = false
    rec.interimResults = true
    rec.lang = 'en-US'

    rec.onresult = (e) => {
      let interim = ''
      let final = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript
        if (e.results[i].isFinal) final += t
        else interim += t
      }
      onResult?.({ interim, final })
    }
    rec.onend = () => {
      setListening(false)
      onEnd?.()
    }
    rec.onerror = () => setListening(false)
    recognitionRef.current = rec
    return () => rec.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supported])

  const start = useCallback(() => {
    if (!supported || !recognitionRef.current) return
    try {
      recognitionRef.current.start()
      setListening(true)
    } catch {
      /* already started */
    }
  }, [supported])

  const stop = useCallback(() => {
    recognitionRef.current?.stop()
    setListening(false)
  }, [])

  return { start, stop, listening, supported }
}
