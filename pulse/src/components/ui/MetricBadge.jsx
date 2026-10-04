export default function MetricBadge({ label, value, color, active }) {
  return (
    <div
      className={`metric-badge${active ? ' metric-badge-active' : ''}`}
      style={{
        borderColor: active ? color : (color || '#E8302A'),
        '--badge-color': color || '#E8302A'
      }}
    >
      <span className="mb-label">{label}</span>
      <span className="mb-value" style={{ color: active ? 'var(--white)' : (color || '#E8302A') }}>{value}</span>
      {active && <div className="mb-glow" style={{ background: color || '#E8302A' }} />}
    </div>
  )
}
