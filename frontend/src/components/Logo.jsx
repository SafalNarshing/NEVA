/** NEVA wordmark with a shield + pulse mark. */
export default function Logo({ size = 'md', onDark = false }) {
  const dim = size === 'sm' ? 26 : 32
  const text = size === 'sm' ? 'text-lg' : 'text-2xl'
  return (
    <span className="inline-flex items-center gap-2">
      <span
        className="grid place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-[0_6px_14px_-4px_rgba(90,52,224,0.6)]"
        style={{ width: dim, height: dim }}
      >
        <svg width={dim * 0.62} height={dim * 0.62} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 2 4 5v6c0 4.5 3.2 8.6 8 10 4.8-1.4 8-5.5 8-10V5l-8-3Z"
            fill="rgba(255,255,255,0.18)"
          />
          <path
            d="M6 12.5h3l1.5-3 2.5 6 1.5-3H18"
            stroke="white"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span
        className={`font-extrabold tracking-tight ${text} ${
          onDark ? 'text-white' : 'text-ink'
        }`}
      >
        NEVA
      </span>
    </span>
  )
}
