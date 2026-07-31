import { Link } from 'react-router-dom'
import {
  Radio,
  MessagesSquare,
  BookOpen,
  MapPin,
  ChevronRight,
  Sparkles,
} from 'lucide-react'
import Logo from '../components/Logo'
import LangToggle from '../components/LangToggle'
import EmergencyButton from '../components/EmergencyButton'
import DynamicIcon from '../components/DynamicIcon'
import { getGuides } from '../data/firstAid'
import { useLanguage } from '../i18n/language'

const accentMap = {
  brand: 'from-brand-100 to-brand-50 text-brand-600',
  teal: 'from-teal-100 to-teal-50 text-teal-600',
  danger: 'from-danger-100 to-danger-50 text-danger-600',
}

function SecondaryCard({ to, icon: Icon, title, sub, tint }) {
  return (
    <Link
      to={to}
      className="group flex flex-col gap-3 rounded-3xl bg-white p-4 shadow-card ring-1 ring-line transition-transform duration-150 active:scale-[0.98]"
    >
      <span
        className={`grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br ${tint}`}
      >
        <Icon size={22} strokeWidth={2.2} aria-hidden="true" />
      </span>
      <span>
        <span className="block font-bold leading-tight text-ink">{title}</span>
        <span className="mt-0.5 block text-xs text-ink-soft">{sub}</span>
      </span>
    </Link>
  )
}

export default function Home() {
  const { lang, t } = useLanguage()
  const guides = getGuides(lang)

  return (
    <div className="min-h-full bg-canvas pb-6">
      {/* Header */}
      <header className="flex items-center justify-between px-5 pt-[max(1.25rem,env(safe-area-inset-top))]">
        <Logo />
        <LangToggle />
      </header>

      {/* Greeting */}
      <section className="px-5 pt-5">
        <p className="text-sm font-medium text-ink-soft">{t('home.greeting')}</p>
        <h1 className="mt-0.5 text-[26px] font-extrabold leading-tight tracking-tight text-ink">
          {t('home.heroLine1')}
          <br />
          {t('home.heroLine2')}
        </h1>
      </section>

      {/* Primary: Live Mode */}
      <section className="px-5 pt-5">
        <Link
          to="/live"
          className="relative block overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-600 via-brand-500 to-brand-700 p-5 shadow-float transition-transform duration-150 active:scale-[0.99]"
        >
          <div
            className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full bg-white/10"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -bottom-16 -left-8 h-40 w-40 rounded-full bg-white/10"
            aria-hidden="true"
          />
          <div className="relative flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-1 text-xs font-bold text-white">
              <Sparkles size={13} aria-hidden="true" /> {t('home.aiGuided')}
            </span>
          </div>
          <div className="relative mt-4 flex items-end justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-white">{t('home.liveMode')}</h2>
              <p className="mt-1 max-w-[15rem] text-sm text-brand-100">
                {t('home.liveModeSub')}
              </p>
            </div>
            <span className="relative grid h-14 w-14 shrink-0 place-items-center rounded-full bg-white text-brand-600">
              <span
                className="absolute inset-0 rounded-full bg-white/60"
                style={{ animation: 'neva-pulse-ring 2s ease-out infinite' }}
                aria-hidden="true"
              />
              <Radio size={26} strokeWidth={2.4} aria-hidden="true" />
            </span>
          </div>
        </Link>
      </section>

      {/* Secondary grid */}
      <section className="grid grid-cols-2 gap-3 px-5 pt-3">
        <SecondaryCard
          to="/chat"
          icon={MessagesSquare}
          title={t('home.chatMode')}
          sub={t('home.chatModeSub')}
          tint="from-teal-100 to-teal-50 text-teal-600"
        />
        <SecondaryCard
          to="/instructions"
          icon={BookOpen}
          title={t('home.instructions')}
          sub={t('home.instructionsSub')}
          tint="from-brand-100 to-brand-50 text-brand-600"
        />
        <SecondaryCard
          to="/map"
          icon={MapPin}
          title={t('home.nearby')}
          sub={t('home.nearbySub')}
          tint="from-danger-100 to-danger-50 text-danger-600"
        />
        <div className="flex flex-col justify-between rounded-3xl bg-ink p-4 text-white shadow-card">
          <span className="text-xs font-semibold text-white/60">
            {t('home.emergencyLine')}
          </span>
          <div>
            <p className="text-3xl font-black leading-none">102</p>
            <EmergencyButton
              number="102"
              label={t('home.callNow')}
            />
          </div>
        </div>
      </section>

      {/* Quick guides */}
      <section className="pt-6">
        <div className="flex items-center justify-between px-5">
          <h2 className="text-base font-bold text-ink">{t('home.quickGuides')}</h2>
          <Link
            to="/instructions"
            className="inline-flex items-center gap-0.5 text-sm font-semibold text-brand-600"
          >
            {t('home.seeAll')} <ChevronRight size={16} aria-hidden="true" />
          </Link>
        </div>
        <div className="no-scrollbar mt-3 flex gap-3 overflow-x-auto px-5 pb-1">
          {guides.slice(0, 6).map((g) => (
            <Link
              key={g.id}
              to={`/instructions/${g.id}`}
              className="flex w-24 shrink-0 flex-col items-center gap-2 rounded-3xl bg-white p-3 text-center shadow-card ring-1 ring-line transition-transform duration-150 active:scale-95"
            >
              <span
                className={`grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${accentMap[g.accent]}`}
              >
                <DynamicIcon name={g.icon} size={22} strokeWidth={2.2} />
              </span>
              <span className="text-xs font-semibold leading-tight text-ink">
                {g.title}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
