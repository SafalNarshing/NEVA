import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { useLanguage } from '../i18n/language'

/** Sticky screen header with an optional back button and right-side slot. */
export default function PageHeader({ title, subtitle, back = true, right, onDark = false }) {
  const navigate = useNavigate()
  const { t } = useLanguage()
  return (
    <header
      className={`sticky top-0 z-10 flex items-center gap-3 px-4 pb-3 pt-[max(1rem,env(safe-area-inset-top))] ${
        onDark ? '' : 'border-b border-line bg-canvas/90 backdrop-blur'
      }`}
    >
      {back && (
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label={t('common.goBack')}
          className={`grid h-10 w-10 shrink-0 place-items-center rounded-full transition-colors ${
            onDark
              ? 'bg-white/15 text-white active:bg-white/25'
              : 'bg-white text-ink shadow-card ring-1 ring-line active:bg-brand-50'
          }`}
        >
          <ChevronLeft size={22} aria-hidden="true" />
        </button>
      )}
      <div className="min-w-0 flex-1">
        <h1
          className={`truncate text-lg font-extrabold leading-tight ${
            onDark ? 'text-white' : 'text-ink'
          }`}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className={`truncate text-xs ${
              onDark ? 'text-white/70' : 'text-ink-soft'
            }`}
          >
            {subtitle}
          </p>
        )}
      </div>
      {right}
    </header>
  )
}
