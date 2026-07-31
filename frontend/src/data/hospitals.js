/**
 * Hardcoded emergency facilities for the demo (Kathmandu Valley + Dhulikhel).
 * Coordinates are approximate and used to compute distance from the user.
 * Replace with a live places API when wiring the backend.
 */
export const hospitals = [
  {
    id: 'tuth',
    name: 'Tribhuvan University Teaching Hospital',
    type: 'Hospital',
    area: 'Maharajgunj, Kathmandu',
    phone: '+977-1-4412303',
    lat: 27.7355,
    lng: 85.3305,
    open24: true,
  },
  {
    id: 'bir',
    name: 'Bir Hospital',
    type: 'Hospital',
    area: 'Mahaboudha, Kathmandu',
    phone: '+977-1-4221119',
    lat: 27.7043,
    lng: 85.3145,
    open24: true,
  },
  {
    id: 'patan',
    name: 'Patan Hospital',
    type: 'Hospital',
    area: 'Lagankhel, Lalitpur',
    phone: '+977-1-5522266',
    lat: 27.6675,
    lng: 85.3206,
    open24: true,
  },
  {
    id: 'grande',
    name: 'Grande International Hospital',
    type: 'Hospital',
    area: 'Dhapasi, Kathmandu',
    phone: '+977-1-5159266',
    lat: 27.7449,
    lng: 85.3186,
    open24: true,
  },
  {
    id: 'norvic',
    name: 'Norvic International Hospital',
    type: 'Hospital',
    area: 'Thapathali, Kathmandu',
    phone: '+977-1-5970032',
    lat: 27.6934,
    lng: 85.3169,
    open24: true,
  },
  {
    id: 'dhulikhel',
    name: 'Dhulikhel Hospital',
    type: 'Hospital',
    area: 'Dhulikhel, Kavre',
    phone: '+977-11-490497',
    lat: 27.6206,
    lng: 85.5432,
    open24: true,
  },
  {
    id: 'medicare',
    name: 'Om Hospital & Research Centre',
    type: 'Clinic',
    area: 'Chabahil, Kathmandu',
    phone: '+977-1-4590500',
    lat: 27.7172,
    lng: 85.3465,
    open24: false,
  },
  {
    id: 'pharmacy1',
    name: 'Sulav Pharmacy',
    type: 'Pharmacy',
    area: 'Baneshwor, Kathmandu',
    phone: '+977-1-4780123',
    lat: 27.6893,
    lng: 85.3436,
    open24: false,
  },
]

export const emergencyNumbers = [
  { label: 'Ambulance', number: '102', icon: 'Ambulance' },
  { label: 'Police', number: '100', icon: 'Shield' },
  { label: 'Fire', number: '101', icon: 'Flame' },
  { label: 'Traffic Police', number: '103', icon: 'TrafficCone' },
]

/** Rough great-circle distance in km. */
export function distanceKm(a, b) {
  if (!a || !b) return null
  const R = 6371
  const dLat = ((b.lat - a.lat) * Math.PI) / 180
  const dLng = ((b.lng - a.lng) * Math.PI) / 180
  const lat1 = (a.lat * Math.PI) / 180
  const lat2 = (b.lat * Math.PI) / 180
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2)
  return R * 2 * Math.asin(Math.sqrt(h))
}
