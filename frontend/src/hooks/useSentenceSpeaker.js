import { useCallback, useRef, useState } from 'react'
import { HAS_SPEECH, synthesizeSpeech } from '../services/api'

/**
 * Plays a stream of sentences as continuous speech with minimal gaps:
 * each sentence's Piper audio is fetched as soon as it's enqueued (parallel
 * prefetch) but played strictly in order via a single drain loop. Falls back
 * to browser TTS when the speech service isn't configured.
 */
export function useSentenceSpeaker() {
  const [speaking, setSpeaking] = useState(false)
  const queueRef = useRef([]) // [{ text, audioPromise }]
  const stoppedRef = useRef(false)
  const drainingRef = useRef(false)
  const audioRef = useRef(null)

  const playItem = useCallback(
    (item) =>
      new Promise((resolve) => {
        if (stoppedRef.current) return resolve()

        if (!HAS_SPEECH) {
          try {
            const u = new SpeechSynthesisUtterance(item.text)
            u.lang = /[ऀ-ॿ]/.test(item.text) ? 'ne-NP' : 'en-US'
            u.onend = resolve
            u.onerror = resolve
            window.speechSynthesis.speak(u)
          } catch {
            resolve()
          }
          return
        }

        item.audioPromise
          .then((url) => {
            if (stoppedRef.current || !url) return resolve()
            const audio = new Audio(url)
            audioRef.current = audio
            const done = () => {
              URL.revokeObjectURL(url)
              resolve()
            }
            audio.onended = done
            audio.onerror = done
            audio.play().catch(done)
          })
          .catch(resolve)
      }),
    [],
  )

  const drain = useCallback(async () => {
    if (drainingRef.current) return
    drainingRef.current = true
    setSpeaking(true)
    while (queueRef.current.length && !stoppedRef.current) {
      const item = queueRef.current.shift()
      await playItem(item)
    }
    drainingRef.current = false
    setSpeaking(false)
  }, [playItem])

  const enqueue = useCallback(
    (text) => {
      const t = text?.trim()
      if (!t) return
      const audioPromise = HAS_SPEECH
        ? synthesizeSpeech(t)
            .then((r) => r.audioUrl)
            .catch(() => null)
        : Promise.resolve(null)
      queueRef.current.push({ text: t, audioPromise })
      stoppedRef.current = false
      drain()
    },
    [drain],
  )

  const reset = useCallback(() => {
    stoppedRef.current = true
    queueRef.current = []
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    drainingRef.current = false
    setSpeaking(false)
    try {
      window.speechSynthesis?.cancel()
    } catch {
      /* ignore */
    }
  }, [])

  return { enqueue, reset, speaking }
}
