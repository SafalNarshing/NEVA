import { hospitals, distanceKm } from './hospitals'

/**
 * Detects when the user is asking NEVA to CONTACT / CALL emergency help
 * (as opposed to asking a medical question). English + Nepali.
 */
export function detectContactIntent(text) {
  if (!text) return false
  const t = text.toLowerCase()

  // A contact verb / noun …
  const contactWord =
    /\b(call|dial|phone|contact|ring|reach|ambulance|emergency|102|100|101)\b/.test(
      t,
    ) ||
    /(फोन|बोलाउ|सम्पर्क|एम्बुलेन्स|एम्बुलेन्स|आकस्मिक|१०२)/.test(text)

  // … aimed at getting help for someone (avoids "should I call?" ambiguity a bit,
  // but we still trigger on a clear imperative like "call an ambulance").
  const helpTarget =
    /\b(ambulance|emergency|help|someone|anyone|them|hospital|doctor|for me|us|102|100|101)\b/.test(
      t,
    ) || /(मद्दत|कसैलाई|अस्पताल|एम्बुलेन्स|१०२)/.test(text)

  return contactWord && helpTarget
}

/** Rough condition sniff from free text, used to prioritise the right facility. */
export function detectCondition(text) {
  if (!text) return null
  const t = text.toLowerCase()
  const map = [
    ['snakebite', /(snake|साँप|सर्प|टोक)/],
    ['cardiac', /(chest pain|heart attack|cardiac|मुटु|छाती)/],
    ['bleeding', /(bleed|blood|रगत|काट)/],
    ['burns', /(burn|scald|पोल|डढ)/],
    ['unconscious', /(unconscious|not breathing|बेहोस|सास)/],
  ]
  for (const [cond, re] of map) if (re.test(t) || re.test(text)) return cond
  return null
}

const EMERGENCY = { id: 'ambulance-102', label: 'Ambulance', number: '102', kind: 'ambulance' }

// Conditions that benefit from a specific tertiary centre (e.g. antivenom).
const CONDITION_PRIORITY = {
  snakebite: ['bir', 'dhulikhel'],
}

/**
 * Builds the ordered list NEVA works through when contacting help:
 *   102 (ambulance) first, then the nearest hospitals as fallbacks.
 * `coords` (optional) sorts hospitals by real distance; `condition` (optional)
 * floats a suitable centre to the top of the hospital list.
 */
export function buildEscalation({ coords = null, condition = null } = {}) {
  const facilities = hospitals.filter((h) => h.type !== 'Pharmacy')

  let ordered = [...facilities]
  if (coords) {
    ordered.sort(
      (a, b) => (distanceKm(coords, a) ?? 99) - (distanceKm(coords, b) ?? 99),
    )
  }

  const priorityIds = CONDITION_PRIORITY[condition] || []
  if (priorityIds.length) {
    ordered.sort((a, b) => {
      const ai = priorityIds.indexOf(a.id)
      const bi = priorityIds.indexOf(b.id)
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi)
    })
  }

  const hospitalSteps = ordered.slice(0, 3).map((h) => ({
    id: h.id,
    label: h.name,
    number: h.phone,
    area: h.area,
    dist: coords ? distanceKm(coords, h) : null,
    kind: 'hospital',
  }))

  return [EMERGENCY, ...hospitalSteps]
}
