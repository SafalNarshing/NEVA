import { useEffect, useMemo, useState } from 'react'
import {
  ConversationContext,
  GREETING,
  STORAGE_KEY,
  loadMessages,
} from './conversation'

/**
 * Holds the Chat conversation so it survives tab navigation (and page reloads,
 * via sessionStorage). Lives above the router so switching screens doesn't
 * unmount the state.
 */
export function ConversationProvider({ children }) {
  const [messages, setMessages] = useState(loadMessages)

  // Persist (image object-URLs won't survive a reload, so drop them on save).
  useEffect(() => {
    try {
      const serialisable = messages.map(({ image, ...rest }) =>
        image && image.startsWith('blob:') ? rest : { ...rest, image },
      )
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(serialisable))
    } catch {
      /* storage full / unavailable — keep in-memory only */
    }
  }, [messages])

  const reset = () => setMessages([GREETING])

  const value = useMemo(() => ({ messages, setMessages, reset }), [messages])
  return (
    <ConversationContext.Provider value={value}>
      {children}
    </ConversationContext.Provider>
  )
}
