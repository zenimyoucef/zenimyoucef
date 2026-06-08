export default function GaugeBar({ value, min = 10, max = 40, color = '#22C55E', label }) {
  const pct = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100))

  const segments = [
    { range: [10, 18.5], color: '#3B82F6' },
    { range: [18.5, 25], color: '#22C55E' },
    { range: [25, 30], color: '#F59E0B' },
    { range: [30, 40], color: '#EF4444' }
  ]

  return (
    <div className="gauge-bar-wrapper">
      <div className="gauge-bar-track">
        {segments.map((seg, i) => {
          const left = ((seg.range[0] - min) / (max - min)) * 100
          const width = ((seg.range[1] - seg.range[0]) / (max - min)) * 100
          return (
            <div
              key={i}
              className="gauge-segment"
              style={{
                left: `${left}%`,
                width: `${width}%`,
                backgroundColor: seg.color,
                opacity: 0.2
              }}
            />
          )
        })}
        <div
          className="gauge-bar-fill"
          style={{ width: `${pct}%`, backgroundColor: color, '--gauge-color': color }}
        />
        <div className="gauge-dot" style={{ left: `${pct}%`, '--dot-color': color }}>
          <div className="gauge-dot-pulse" style={{ '--pulse-color': color }} />
        </div>
      </div>
      <div className="gauge-labels">
        <span>{min}</span>
        <span className="gauge-current">{label || value?.toFixed(1)}</span>
        <span>{max}</span>
      </div>
    </div>
  )
}
