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
    lat: 27.735008972261607, 
    lng: 85.33094896805677,
    open24: true,
  },
  {
    id: 'bir',
    name: 'Bir Hospital',
    type: 'Hospital',
    area: 'Mahaboudha, Kathmandu',
    phone: '+977-1-4221119',
    lat: 27.705614567798236, 
    lng: 85.31376836655592,
    open24: true,
  },
  {
    id: 'patan',
    name: 'Patan Hospital',
    type: 'Hospital',
    area: 'Lagankhel, Lalitpur',
    phone: '+977-1-5522266',
    lat: 27.668300562992535, 
    lng: 85.32056629291114,
    open24: true,
  },
  {
    id: 'grande',
    name: 'Grande International Hospital',
    type: 'Hospital',
    area: 'Dhapasi, Kathmandu',
    phone: '+977-1-5159266',
    lat: 27.75287723843563,
    lng: 85.32588931264932,
    open24: true,
  },
  {
    id: 'norvic',
    name: 'Norvic International Hospital',
    type: 'Hospital',
    area: 'Thapathali, Kathmandu',
    phone: '+977-1-5970032',
    lat: 27.689941232790986, 
    lng: 85.31893164927837,
    open24: true,
  },
  {
    id: 'dhulikhel',
    name: 'Dhulikhel Hospital',
    type: 'Hospital',
    area: 'Dhulikhel, Kavre',
    phone: '+977-11-490497',
    lat: 27.61666084176177,
    lng: 85.54738280599015,
    open24: true,
  },
  {
    id: 'medicare',
    name: 'Om Hospital & Research Centre',
    type: 'Clinic',
    area: 'Chabahil, Kathmandu',
    phone: '+977-1-4590500',
    lat: 27.721423587281393, 
    lng: 85.34480168462555,
    open24: false,
  },
  {
    id: 'pharmacy1',
    name: 'Sulav Pharmacy',
    type: 'Pharmacy',
    area: 'Baneshwor, Kathmandu',
    phone: '+977-1-4780123',
    lat: ,27.672483527901804, 
    lng: 85.38772957042447,
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
