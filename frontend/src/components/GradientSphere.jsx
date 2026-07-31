/**
 * Living gradient sphere for Live mode — layered blurred colour blobs orbiting
 * inside a glossy sphere, ChatGPT/Gemini style. Reacts to `state`:
 *   idle | listening | thinking | speaking
 */
export default function GradientSphere({ state = 'idle', size = 200 }) {
  return (
    <div className="neva-orb-wrap" style={{ width: size, height: size }}>
      <div className="neva-orb-glow" data-state={state} />
      <div className="neva-orb" data-state={state}>
        <div className="neva-orb-blobs">
          <span className="neva-blob a" />
          <span className="neva-blob b" />
        </div>
        <div className="neva-orb-blobs rev">
          <span className="neva-blob c" />
          <span className="neva-blob d" />
        </div>
        <div className="neva-orb-gloss" />
      </div>
    </div>
  )
}
