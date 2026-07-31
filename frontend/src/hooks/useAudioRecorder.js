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
    // getUserMedia only exists in a secure context (localhost or HTTPS). The
    // most common failure is opening the app over a LAN IP on plain http.
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      const secure = typeof window !== 'undefined' && window.isSecureContext
      throw new Error(
        secure
          ? 'Microphone is not available in this browser.'
          : 'Microphone needs a secure page — open the app at http://localhost (not an IP) or use HTTPS.',
      )
    }
    if (typeof window.MediaRecorder === 'undefined') {
      throw new Error('Audio recording is not supported in this browser.')
    }

    let stream
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    } catch (err) {
      if (err?.name === 'NotAllowedError' || err?.name === 'SecurityError') {
        throw new Error(
          'Microphone permission was blocked. Allow mic access and try again.',
          { cause: err },
        )
      }
      if (err?.name === 'NotFoundError') {
        throw new Error('No microphone was found on this device.', { cause: err })
      }
      throw new Error(err?.message || 'Could not start the microphone.', { cause: err })
    }
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
  }, [])

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
