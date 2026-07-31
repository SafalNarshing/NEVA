import { createContext, useContext } from 'react'

/** Language context object + non-component helpers for the UI language. */
export const LanguageContext = createContext(null)

export const STORAGE_KEY = 'neva.lang'

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
