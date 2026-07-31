import { useCallback, useRef, useState } from 'react'
import { HAS_SPEECH, transcribeAudio, synthesizeSpeech } from '../services/api'
import { useAudioRecorder } from './useAudioRecorder'
import { useSpeechRecognition, useTextToSpeech } from './useSpeech'

/**
 * Unified voice INPUT. Uses the local speech service (record → /asr) when
 * VITE_SPEECH_URL is set, otherwise the browser SpeechRecognition API.
 *
 * Exposes a single tap-to-start / tap-to-stop `toggle()`:
 *  - active: mic is capturing
 *  - busy:   transcribing a finished recording (server path only)
 * `onTranscript(finalText)` fires once a final transcript is ready.
 */
export function useVoiceInput({ onTranscript, onInterim } = {}) {
  const recorder = useAudioRecorder()
  const [transcribing, setTranscribing] = useState(false)

  const browser = useSpeechRecognition({
    onResult: ({ interim, final }) => {
      if (interim) onInterim?.(interim)
      if (final) onTranscript?.(final.trim())
    },
  })

  const serverToggle = useCallback(async () => {
    if (recorder.recording) {
      setTranscribing(true)
      try {
        const blob = await recorder.stop()
        if (blob) {
          const { text } = await transcribeAudio(blob)
          if (text?.trim()) onTranscript?.(text.trim())
        }
      } catch (err) {
        console.warn('[NEVA] ASR failed:', err.message)
      } finally {
        setTranscribing(false)
      }
    } else {
      try {
        await recorder.start()
      } catch (err) {
        console.warn('[NEVA] mic error:', err.message)
      }
    }
  }, [recorder, onTranscript])

  if (HAS_SPEECH) {
    return {
      active: recorder.recording,
      busy: transcribing,
      toggle: serverToggle,
      supported: recorder.supported,
      mode: 'server',
    }
  }

  return {
    active: browser.listening,
    busy: false,
    toggle: () => (browser.listening ? browser.stop() : browser.start()),
    supported: browser.supported,
    mode: 'browser',
  }
}

/**
 * Unified voice OUTPUT. Plays Piper WAV from the speech service (nicer Nepali
 * voice) when available, otherwise falls back to browser TTS — and also falls
 * back automatically if a synth request fails.
 */
export function useVoiceOutput() {
  const tts = useTextToSpeech()
  const audioRef = useRef(null)
  const [serverSpeaking, setServerSpeaking] = useState(false)

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = ''
      audioRef.current = null
    }
    setServerSpeaking(false)
    tts.stop()
  }, [tts])

  const speak = useCallback(
    async (text) => {
      if (!text) return
      if (!HAS_SPEECH) {
        tts.speak(text)
        return
      }
      stop()
      try {
        const { audioUrl } = await synthesizeSpeech(text)
        const audio = new Audio(audioUrl)
        audioRef.current = audio
        setServerSpeaking(true)
        const cleanup = () => {
          setServerSpeaking(false)
          URL.revokeObjectURL(audioUrl)
          if (audioRef.current === audio) audioRef.current = null
        }
        audio.onended = cleanup
        audio.onerror = cleanup
        await audio.play()
      } catch (err) {
        console.warn('[NEVA] TTS failed, using browser voice:', err.message)
        setServerSpeaking(false)
        tts.speak(text)
      }
    },
    [stop, tts],
  )

  return {
    speak,
    stop,
    speaking: HAS_SPEECH ? serverSpeaking : tts.speaking,
    supported: HAS_SPEECH || tts.supported,
  }
}
