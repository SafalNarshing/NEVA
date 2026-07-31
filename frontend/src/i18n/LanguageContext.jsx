import { useCallback, useMemo, useState } from 'react'
import { translations } from './translations'
import { LanguageContext, STORAGE_KEY } from './language'

/** Provides the current UI language + a `t()` translate helper to the app. */
export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'ne' ? 'ne' : 'en'
    } catch {
      return 'en'
    }
  })

  const setLang = useCallback((next) => {
    setLangState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* storage unavailable — keep in-memory only */
    }
  }, [])

  const t = useCallback(
    (key, vars = {}) => {
      const table = translations[lang] || translations.en
      let str = table[key] ?? translations.en[key] ?? key
      for (const [k, v] of Object.entries(vars)) {
        str = str.replaceAll(`{${k}}`, String(v))
      }
      return str
    },
    [lang],
  )

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t])
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}
