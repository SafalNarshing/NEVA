import {
  Circle,
  Droplet,
  Flame,
  Wind,
  UserRound,
  Activity,
  HeartPulse,
  Bone,
  Zap,
  Cross,
  Stethoscope,
  Pill,
  Ambulance,
  Shield,
  TrafficCone,
} from 'lucide-react'

/**
 * Registry of the icons referenced by name in data files. Kept explicit (rather
 * than `import * as`) so tree-shaking only ships the icons we actually use.
 */
const ICONS = {
  Droplet,
  Flame,
  Wind,
  UserRound,
  Activity,
  HeartPulse,
  Bone,
  Zap,
  Cross,
  Stethoscope,
  Pill,
  Ambulance,
  Shield,
  TrafficCone,
}

/** Renders a lucide icon by string name; falls back to a neutral circle. */
export default function DynamicIcon({ name, ...props }) {
  const Icon = ICONS[name] || Circle
  return <Icon aria-hidden="true" {...props} />
}
