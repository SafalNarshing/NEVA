import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, ChevronRight, Clock } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import DynamicIcon from '../components/DynamicIcon'
import LangToggle from '../components/LangToggle'
import { getGuides } from '../data/firstAid'
import { useLanguage } from '../i18n/language'

const accentMap = {
  brand: 'from-brand-100 to-brand-50 text-brand-600',
  teal: 'from-teal-100 to-teal-50 text-teal-600',
  danger: 'from-danger-100 to-danger-50 text-danger-600',
}
const severityMap = {
  Critical: 'bg-danger-100 text-danger-600',
  Moderate: 'bg-teal-100 text-teal-700',
}

export default function Instructions() {
  const { lang, t } = useLanguage()
  const [query, setQuery] = useState('')
  const guides = getGuides(lang).filter((g) =>
    (g.title + g.tagline).toLowerCase().includes(query.toLowerCase()),
  )

  return (
    <div className="min-h-full bg-canvas pb-6">
      <PageHeader
        title={t('guides.title')}
        subtitle={t('guides.subtitle')}
        back={false}
        right={<LangToggle />}
      />

      <div className="px-5 pt-4">
        <label className="flex items-center gap-2.5 rounded-2xl bg-white px-4 py-3 shadow-card ring-1 ring-line focus-within:ring-2 focus-within:ring-brand-400">
          <Search size={18} className="text-ink-soft" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('guides.search')}
            className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-soft"
            aria-label={t('guides.search')}
          />
        </label>
      </div>

      <div className="space-y-3 px-5 pt-4">
        {guides.map((g) => (
          <Link
            key={g.id}
            to={`/instructions/${g.id}`}
            className="flex items-center gap-4 rounded-3xl bg-white p-4 shadow-card ring-1 ring-line transition-transform duration-150 active:scale-[0.99]"
          >
            <span
              className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${accentMap[g.accent]}`}
            >
              <DynamicIcon name={g.icon} size={26} strokeWidth={2.2} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h2 className="truncate font-bold text-ink">{g.title}</h2>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${severityMap[g.severity]}`}
                >
                  {t(`severity.${g.severity}`)}
                </span>
              </div>
              <p className="truncate text-xs text-ink-soft">{g.tagline}</p>
              <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-ink-soft">
                <Clock size={12} aria-hidden="true" /> {g.time} ·{' '}
                {g.steps.length} {t('units.steps')}
              </span>
            </div>
            <ChevronRight
              size={20}
              className="shrink-0 text-ink-soft"
              aria-hidden="true"
            />
          </Link>
        ))}

        {guides.length === 0 && (
          <p className="rounded-3xl bg-white p-6 text-center text-sm text-ink-soft shadow-card ring-1 ring-line">
            {t('guides.noMatch', { q: query })}
          </p>
        )}
      </div>
    </div>
  )
}
