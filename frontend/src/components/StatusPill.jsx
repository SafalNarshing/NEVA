import { useOnlineStatus } from '../hooks/useOnlineStatus'

/** Compact Online / Offline indicator used in headers. */
export default function StatusPill() {
  const online = useOnlineStatus()
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
        online
          ? 'bg-teal-100 text-teal-700'
          : 'bg-danger-100 text-danger-600'
      }`}
      role="status"
    >
      <span
        className={`h-2 w-2 rounded-full ${
          online ? 'bg-teal-500' : 'bg-danger-500'
        }`}
      />
      {online ? 'Online' : 'Offline'}
    </span>
  )
}
