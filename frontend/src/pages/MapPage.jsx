import { useMemo, useState } from 'react'
import {
  Phone,
  Navigation,
  Crosshair,
  Clock,
  MapPin as MapPinIcon,
} from 'lucide-react'
import PageHeader from '../components/PageHeader'
import DynamicIcon from '../components/DynamicIcon'
import EmergencyButton from '../components/EmergencyButton'
import { hospitals, emergencyNumbers, distanceKm } from '../data/hospitals'
import { useGeolocation } from '../hooks/useGeolocation'

const typeTint = {
  Hospital: 'from-danger-100 to-danger-50 text-danger-600',
  Clinic: 'from-brand-100 to-brand-50 text-brand-600',
  Pharmacy: 'from-teal-100 to-teal-50 text-teal-600',
}
const typeIcon = { Hospital: 'Cross', Clinic: 'Stethoscope', Pharmacy: 'Pill' }

/**
 * Open Google Maps straight into driving navigation to a place, starting from
 * the user's current location. On mobile this launches the Maps app directly;
 * `dir_action=navigate` asks it to begin turn-by-turn driving guidance.
 */
function driveTo(lat, lng) {
  const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving&dir_action=navigate`
  window.open(url, '_blank', 'noopener,noreferrer')
}

export default function MapPage() {
  const { coords, status, error, locate } = useGeolocation()
  const [filter, setFilter] = useState('All')

  const places = useMemo(() => {
    const withDist = hospitals.map((h) => ({
      ...h,
      dist: coords ? distanceKm(coords, h) : null,
    }))
    const filtered =
      filter === 'All' ? withDist : withDist.filter((h) => h.type === filter)
    return filtered.sort((a, b) => (a.dist ?? 99) - (b.dist ?? 99))
  }, [coords, filter])

  const filters = ['All', 'Hospital', 'Clinic', 'Pharmacy']

  return (
    <div className="min-h-full bg-canvas pb-6">
      <PageHeader
        title="Nearby Help"
        subtitle="Kathmandu Valley & Dhulikhel"
        back={false}
      />

      {/* Faux map banner */}
      <div className="relative mx-5 mt-4 h-40 overflow-hidden rounded-3xl bg-brand-100 shadow-card ring-1 ring-line">
        <div
          className="absolute inset-0 opacity-70"
          style={{
            backgroundImage:
              'linear-gradient(#d9d2fb 1px, transparent 1px), linear-gradient(90deg, #d9d2fb 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
          aria-hidden="true"
        />
        <div
          className="absolute left-1/3 top-1/2 h-16 w-24 -translate-y-1/2 rounded-full bg-teal-200/60 blur-md"
          aria-hidden="true"
        />
        {/* pins */}
        {[
          { l: '28%', t: '38%' },
          { l: '58%', t: '55%' },
          { l: '72%', t: '30%' },
          { l: '45%', t: '70%' },
        ].map((p, i) => (
          <span
            key={i}
            className="absolute -translate-x-1/2 -translate-y-full text-danger-500"
            style={{ left: p.l, top: p.t }}
            aria-hidden="true"
          >
            <MapPinIcon size={22} fill="currentColor" className="drop-shadow" />
          </span>
        ))}
        {/* user location */}
        <span
          className="absolute grid h-6 w-6 -translate-x-1/2 -translate-y-1/2 place-items-center"
          style={{ left: '50%', top: '52%' }}
          aria-hidden="true"
        >
          <span className="absolute h-6 w-6 rounded-full bg-brand-500/30" style={{ animation: 'neva-pulse-ring 2s ease-out infinite' }} />
          <span className="h-3.5 w-3.5 rounded-full border-2 border-white bg-brand-600" />
        </span>

        <button
          type="button"
          onClick={locate}
          className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-2 text-xs font-bold text-brand-600 shadow-card backdrop-blur transition-transform active:scale-95"
        >
          <Crosshair size={15} aria-hidden="true" />
          {status === 'loading' ? 'Locating…' : coords ? 'Located' : 'Use my location'}
        </button>
      </div>

      {status === 'error' && (
        <p className="mx-5 mt-2 text-xs text-danger-600">{error}</p>
      )}

      {/* Emergency numbers */}
      <div className="px-5 pt-5">
        <EmergencyButton variant="bar" number="102" />
        <div className="mt-3 grid grid-cols-4 gap-2">
          {emergencyNumbers.map((n) => (
            <a
              key={n.number}
              href={`tel:${n.number}`}
              className="flex flex-col items-center gap-1 rounded-2xl bg-white p-2.5 shadow-card ring-1 ring-line transition-transform active:scale-95"
            >
              <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-50 text-brand-600">
                <DynamicIcon name={n.icon} size={17} aria-hidden="true" />
              </span>
              <span className="text-[11px] font-semibold text-ink">{n.label}</span>
              <span className="text-[11px] font-bold text-brand-600">{n.number}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="no-scrollbar mt-5 flex gap-2 overflow-x-auto px-5">
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
              filter === f
                ? 'bg-brand-500 text-white shadow-card'
                : 'bg-white text-ink-soft ring-1 ring-line'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* List */}
      <ul className="space-y-3 px-5 pt-4">
        {places.map((h) => (
          <li
            key={h.id}
            className="rounded-3xl bg-white p-4 shadow-card ring-1 ring-line"
          >
            <div className="flex items-start gap-3.5">
              <span
                className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${typeTint[h.type]}`}
              >
                <DynamicIcon name={typeIcon[h.type]} size={22} strokeWidth={2.2} />
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold leading-tight text-ink">{h.name}</h3>
                <p className="truncate text-xs text-ink-soft">{h.area}</p>
                <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                  <span className="rounded-full bg-canvas px-2 py-0.5 text-[10px] font-bold text-ink-soft">
                    {h.type}
                  </span>
                  {h.open24 && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-teal-100 px-2 py-0.5 text-[10px] font-bold text-teal-700">
                      <Clock size={10} aria-hidden="true" /> 24/7
                    </span>
                  )}
                  {h.dist != null && (
                    <span className="text-[11px] font-semibold text-brand-600">
                      {h.dist < 1
                        ? `${Math.round(h.dist * 1000)} m`
                        : `${h.dist.toFixed(1)} km`}{' '}
                      away
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <a
                href={`tel:${h.phone}`}
                className="inline-flex min-h-[42px] flex-1 items-center justify-center gap-2 rounded-2xl bg-teal-500 font-bold text-white transition-transform active:scale-95"
              >
                <Phone size={17} aria-hidden="true" /> Call
              </a>
              <button
                type="button"
                onClick={() => driveTo(h.lat, h.lng)}
                className="inline-flex min-h-[42px] flex-1 items-center justify-center gap-2 rounded-2xl bg-brand-50 font-bold text-brand-600 transition-transform active:scale-95"
              >
                <Navigation size={17} aria-hidden="true" /> Drive
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
