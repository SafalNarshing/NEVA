import { useCallback, useState } from 'react'

/** Requests the user's coordinates via the browser Geolocation API. */
export function useGeolocation() {
  const [coords, setCoords] = useState(null)
  const [status, setStatus] = useState('idle') // idle | loading | ready | error
  const [error, setError] = useState(null)

  const locate = useCallback(() => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setStatus('error')
      setError('Geolocation is not supported on this device.')
      return
    }
    setStatus('loading')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setStatus('ready')
      },
      (err) => {
        setError(err.message || 'Could not get your location.')
        setStatus('error')
      },
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }, [])

  return { coords, status, error, locate }
}
