import { useLanguage } from '../i18n/language'

/**
 * Compact EN / ने language switcher used in the top-right of every page.
 * Replaces the old Online/Offline pill.
 */
export default function LangToggle({ onDark = false }) {
  const { lang, setLang, t } = useLanguage()
  const base = onDark
    ? 'bg-white/10 text-white backdrop-blur'
    : 'bg-white text-ink shadow-card ring-1 ring-line'
  const active = onDark
    ? 'bg-white text-ink'
    : 'bg-brand-500 text-white'
  const idle = onDark ? 'text-white/70' : 'text-ink-soft'

  return (
    <div
      role="group"
      aria-label={t('lang.toggleLabel')}
      className={`flex items-center gap-0.5 rounded-full p-1 ${base}`}
    >
      {(['en', 'ne']).map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLang(code)}
          aria-pressed={lang === code}
          title={t(code === 'en' ? 'lang.en' : 'lang.ne')}
          className={`min-h-[28px] rounded-full px-2.5 text-xs font-bold transition-colors ${
            lang === code ? active : idle
          }`}
        >
          {code === 'en' ? 'EN' : 'ने'}
        </button>
      ))}
    </div>
  )
}
