/**
 * Turns a free-text assistant reply into scannable structure:
 *   - emergency  : an elevated "Call 102 …" call-out (if present)
 *   - intro      : the lead sentence(s) before the steps
 *   - steps      : each numbered instruction as its own item
 *
 * Works on English and Nepali (ASCII digits, Devanagari digits, and "Step"/
 * "चरण" markers). Falls back gracefully — no steps means it renders as a
 * normal bubble.
 */

// Ordered list markers: "1." / "2)" and Devanagari "१." / "२।".
const STEP_PATTERNS = [
  /(?<![\d.])(\d{1,2})[.)]\s+/g,
  /(?<![०-९])([०-९]{1,2})[.।)]\s+/g,
]

function splitOn(text, re) {
  const marks = [...text.matchAll(re)]
  if (marks.length < 2) return null
  const intro = text.slice(0, marks[0].index).trim()
  const steps = []
  for (let i = 0; i < marks.length; i++) {
    const start = marks[i].index + marks[i][0].length
    const end = i + 1 < marks.length ? marks[i + 1].index : text.length
    const chunk = text.slice(start, end).trim()
    if (chunk) steps.push(chunk)
  }
  return { intro, steps }
}

const INTRO_LABEL =
  /(follow these steps|here.?s what to do|do the following|steps|यी चरणहरू पालना गर्नुहोस्|तलका चरणहरू|यसो गर्नुहोस्)\s*[:：]?\s*$/i

export function parseGuidance(raw) {
  const empty = { emergency: null, emergencyNumber: null, intro: '', steps: [] }
  if (!raw) return empty

  let text = raw.replace(/\s+/g, ' ').trim()

  // 1. Emergency call-out (English then Nepali).
  let emergency = null
  const emEn =
    /([^.!?]*\b(?:call|dial)\b[^.!?]*?\b(?:102|100|101|ambulance|emergency)\b[^.!?]*[.!?])/i
  const emNe = /([^।.!?]*१०२[^।.!?]*[।.!?])/
  let m = text.match(emEn) || text.match(emNe)
  if (m) {
    emergency = m[1].trim()
    text = (text.slice(0, m.index) + ' ' + text.slice(m.index + m[0].length))
      .replace(/\s+/g, ' ')
      .trim()
  }
  const numMatch = (emergency || '').match(/\b(102|100|101)\b/) ||
    (emergency || '').match(/१०२/)
  const emergencyNumber = numMatch ? (numMatch[1] || '102') : emergency ? '102' : null

  // 2. Steps.
  let intro = text
  let steps = []
  for (const re of STEP_PATTERNS) {
    const r = splitOn(text, re)
    if (r) {
      intro = r.intro
      steps = r.steps
      break
    }
  }

  intro = intro.replace(INTRO_LABEL, '').trim()

  return { emergency, emergencyNumber, intro, steps }
}
