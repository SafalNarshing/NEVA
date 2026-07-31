import { useCallback, useRef } from 'react'
import { WS_LIVE_URL } from '../services/api'

/**
 * Streams a Live guidance turn over WebSocket. As Gemma generates, tokens
 * arrive and are split into sentences on the fly, so callers can synthesise
 * audio sentence-by-sentence (first words spoken while the model still writes).
 *
 * Callbacks: onToken(fullTextSoFar), onSentence(sentence), onDone(fullText),
 * onError(message).
 */
export function useLiveStream() {
  const wsRef = useRef(null)

  const close = useCallback(() => {
    try {
      wsRef.current?.close()
    } catch {
      /* already closed */
    }
    wsRef.current = null
  }, [])

  const start = useCallback(
    ({ messages, language = 'auto', onToken, onSentence, onDone, onError }) => {
      close()
      let full = ''
      let buffer = ''

      const flushSentences = (final = false) => {
        // Split on sentence terminators (English + Nepali danda).
        let idx
        while ((idx = buffer.search(/[.!?।\n]/)) !== -1) {
          const sentence = buffer.slice(0, idx + 1).trim()
          buffer = buffer.slice(idx + 1)
          if (sentence.length > 1) onSentence?.(sentence)
        }
        if (final && buffer.trim().length > 1) {
          onSentence?.(buffer.trim())
          buffer = ''
        }
      }

      let ws
      try {
        ws = new WebSocket(WS_LIVE_URL)
      } catch (err) {
        onError?.(err.message)
        return
      }
      wsRef.current = ws

      ws.onopen = () => ws.send(JSON.stringify({ messages, language }))
      ws.onmessage = (ev) => {
        let msg
        try {
          msg = JSON.parse(ev.data)
        } catch {
          return
        }
        if (msg.type === 'token') {
          full += msg.text
          buffer += msg.text
          onToken?.(full)
          flushSentences(false)
        } else if (msg.type === 'done') {
          flushSentences(true)
          onDone?.(full)
          close()
        } else if (msg.type === 'error') {
          onError?.(msg.detail || 'stream error')
          close()
        }
      }
      ws.onerror = () => onError?.('websocket error')
    },
    [close],
  )

  return { start, close }
}
