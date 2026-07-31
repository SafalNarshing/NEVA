import { useCallback, useRef, useState } from 'react'

/**
 * Microphone recorder built on MediaRecorder. `start()` opens the mic and
 * begins capturing; `stop()` resolves with the recorded Blob (webm/opus, which
 * the speech service decodes via faster-whisper + av).
 */
export function useAudioRecorder() {
  const [recording, setRecording] = useState(false)
  const [supported] = useState(
    () =>
      typeof window !== 'undefined' &&
      typeof navigator !== 'undefined' &&
      !!navigator.mediaDevices?.getUserMedia &&
      typeof window.MediaRecorder !== 'undefined',
  )

  const recorderRef = useRef(null)
  const chunksRef = useRef([])
  const streamRef = useRef(null)
  const stopResolveRef = useRef(null)

  const start = useCallback(async () => {
    if (!supported) throw new Error('Recording not supported')
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    streamRef.current = stream
    chunksRef.current = []

    const rec = new MediaRecorder(stream)
    rec.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data)
    }
    rec.onstop = () => {
      const blob = new Blob(chunksRef.current, {
        type: rec.mimeType || 'audio/webm',
      })
      streamRef.current?.getTracks().forEach((t) => t.stop())
      streamRef.current = null
      setRecording(false)
      stopResolveRef.current?.(blob)
      stopResolveRef.current = null
    }
    recorderRef.current = rec
    rec.start()
    setRecording(true)
  }, [supported])

  /** Stop and resolve with the recorded Blob. */
  const stop = useCallback(() => {
    return new Promise((resolve) => {
      const rec = recorderRef.current
      if (!rec || rec.state === 'inactive') {
        resolve(null)
        return
      }
      stopResolveRef.current = resolve
      rec.stop()
    })
  }, [])

  /** Abort without producing a transcript (e.g. on unmount / cancel). */
  const cancel = useCallback(() => {
    stopResolveRef.current = null
    const rec = recorderRef.current
    if (rec && rec.state !== 'inactive') rec.stop()
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    setRecording(false)
  }, [])

  return { start, stop, cancel, recording, supported }
}
