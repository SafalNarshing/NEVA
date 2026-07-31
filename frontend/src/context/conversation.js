import { createContext, useContext } from 'react'

/** Context object + non-component helpers for the Chat conversation. */
export const ConversationContext = createContext(null)

export const STORAGE_KEY = 'neva.chat.v1'

export const GREETING = {
  id: 'greet',
  role: 'assistant',
  type: 'text',
  content:
    'Hi, I’m NEVA. Tell me what happened — you can type, tap the mic to talk, or share a photo. We’ll go through it calmly, one step at a time.',
}

export function loadMessages() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length) return parsed
    }
  } catch {
    /* ignore corrupt storage */
  }
  return [GREETING]
}

export function useConversation() {
  const ctx = useContext(ConversationContext)
  if (!ctx) throw new Error('useConversation must be used within ConversationProvider')
  return ctx
}
