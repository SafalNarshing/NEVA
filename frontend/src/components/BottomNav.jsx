import { NavLink } from 'react-router-dom'
import { Home, BookOpen, MessagesSquare, MapPin } from 'lucide-react'
import { useLanguage } from '../i18n/language'

const items = [
  { to: '/', labelKey: 'nav.home', icon: Home, end: true },
  { to: '/instructions', labelKey: 'nav.guides', icon: BookOpen },
  { to: '/chat', labelKey: 'nav.chat', icon: MessagesSquare },
  { to: '/map', labelKey: 'nav.nearby', icon: MapPin },
]

export default function BottomNav() {
  const { t } = useLanguage()
  return (
    <nav
      aria-label={t('nav.primary')}
      className="relative z-20 shrink-0 border-t border-line bg-white/95 px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur"
    >
      <ul className="flex items-stretch justify-around">
        {items.map(({ to, labelKey, icon: Icon, end }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              end={end}
              className="group flex min-h-[44px] flex-col items-center gap-1 rounded-2xl py-1.5 text-ink-soft transition-colors aria-[current=page]:text-brand-600"
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`flex h-8 w-11 items-center justify-center rounded-full transition-all duration-200 ${
                      isActive ? 'bg-brand-100' : 'group-hover:bg-brand-50'
                    }`}
                  >
                    <Icon
                      size={21}
                      strokeWidth={isActive ? 2.5 : 2}
                      aria-hidden="true"
                    />
                  </span>
                  <span
                    className={`text-[11px] font-semibold tracking-tight ${
                      isActive ? 'text-brand-600' : 'text-ink-soft'
                    }`}
                  >
                    {t(labelKey)}
                  </span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
