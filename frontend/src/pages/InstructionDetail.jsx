import { useParams, Link } from 'react-router-dom'
import { AlertTriangle, Radio, Volume2, Square } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import DynamicIcon from '../components/DynamicIcon'
import EmergencyButton from '../components/EmergencyButton'
import { getGuide } from '../data/firstAid'
import { useVoiceOutput } from '../hooks/useVoice'

const accentMap = {
  brand: 'from-brand-500 to-brand-700',
  teal: 'from-teal-500 to-teal-700',
  danger: 'from-danger-500 to-danger-600',
}

export default function InstructionDetail() {
  const { id } = useParams()
  const guide = getGuide(id)
  const { speak, stop, speaking, supported } = useVoiceOutput()

  if (!guide) {
    return (
      <div className="min-h-full bg-canvas">
        <PageHeader title="Not found" />
        <p className="px-5 pt-6 text-sm text-ink-soft">
          That guide doesn’t exist.{' '}
          <Link to="/instructions" className="font-semibold text-brand-600">
            Back to guides
          </Link>
        </p>
      </div>
    )
  }

  const readAloud = () => {
    if (speaking) return stop()
    const script = `${guide.title}. ${guide.overview} ${guide.steps
      .map((s, i) => `Step ${i + 1}. ${s.title}. ${s.detail}`)
      .join(' ')}`
    speak(script)
  }

  return (
    <div className="min-h-full bg-canvas pb-8">
      {/* Hero */}
      <div
        className={`bg-gradient-to-br ${accentMap[guide.accent]} rounded-b-[2rem] pb-6`}
      >
        <PageHeader title={guide.title} subtitle={guide.tagline} onDark />
        <div className="flex items-center gap-4 px-5 pt-1">
          <span className="grid h-16 w-16 shrink-0 place-items-center rounded-3xl bg-white/20 text-white backdrop-blur">
            <DynamicIcon name={guide.icon} size={30} strokeWidth={2.2} />
          </span>
          <p className="text-sm leading-snug text-white/90">{guide.overview}</p>
        </div>
        <div className="flex gap-2 px-5 pt-4">
          {supported && (
            <button
              type="button"
              onClick={readAloud}
              className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-2xl bg-white/20 px-4 font-semibold text-white backdrop-blur transition-colors active:bg-white/30"
            >
              {speaking ? (
                <>
                  <Square size={17} aria-hidden="true" /> Stop
                </>
              ) : (
                <>
                  <Volume2 size={18} aria-hidden="true" /> Read aloud
                </>
              )}
            </button>
          )}
          <Link
            to="/live"
            className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-2xl bg-white px-4 font-bold text-ink transition-transform active:scale-95"
          >
            <Radio size={18} aria-hidden="true" /> Go Live
          </Link>
        </div>
      </div>

      {/* Steps */}
      <ol className="space-y-3 px-5 pt-5">
        {guide.steps.map((s, i) => (
          <li
            key={i}
            className="flex gap-3.5 rounded-3xl bg-white p-4 shadow-card ring-1 ring-line"
          >
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-100 text-sm font-black text-brand-600">
              {i + 1}
            </span>
            <div>
              <h3 className="font-bold text-ink">{s.title}</h3>
              <p className="mt-0.5 text-sm leading-snug text-ink-soft">
                {s.detail}
              </p>
            </div>
          </li>
        ))}
      </ol>

      {/* Warnings */}
      <div className="mx-5 mt-5 rounded-3xl bg-danger-50 p-4 ring-1 ring-danger-100">
        <h3 className="flex items-center gap-2 font-bold text-danger-600">
          <AlertTriangle size={18} aria-hidden="true" /> Important
        </h3>
        <ul className="mt-2 space-y-1.5">
          {guide.warnings.map((w, i) => (
            <li key={i} className="flex gap-2 text-sm text-danger-600/90">
              <span aria-hidden="true">•</span>
              <span>{w}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="px-5 pt-5">
        <EmergencyButton variant="bar" number="102" />
      </div>
    </div>
  )
}
