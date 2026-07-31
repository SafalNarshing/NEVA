import { Phone } from 'lucide-react'
import { useLanguage } from '../i18n/language'

/**
 * One-tap call to the ambulance line. Uses a tel: link so it dials on mobile.
 * `variant="bar"` renders the full-width banner; default is a compact button.
 */
export default function EmergencyButton({ number = '102', variant = 'button', label }) {
  const { t } = useLanguage()
  if (variant === 'bar') {
    return (
      <a
        href={`tel:${number}`}
        className="flex min-h-[52px] items-center justify-center gap-2.5 rounded-2xl bg-danger-500 px-4 font-bold text-white shadow-[0_10px_24px_-8px_rgba(239,68,68,0.7)] transition-transform duration-150 active:scale-[0.98]"
      >
        <Phone size={20} strokeWidth={2.5} aria-hidden="true" />
        {label || t('emergency.callAmbulance', { number })}
      </a>
    )
  }

  return (
    <a
      href={`tel:${number}`}
      aria-label={t('emergency.callNumber', { number })}
      className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-danger-500 px-4 font-bold text-white shadow-[0_8px_18px_-6px_rgba(239,68,68,0.7)] transition-transform duration-150 active:scale-95"
    >
      <Phone size={18} strokeWidth={2.5} aria-hidden="true" />
      {label || number}
    </a>
  )
}
