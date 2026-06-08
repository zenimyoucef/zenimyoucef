import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import useCountUp from '../../hooks/useCountUp'

export default function KpiCard({ icon: Icon, label, value, unit, delta, raw }) {
  const Trend = delta == null ? Minus : delta > 0 ? TrendingUp : TrendingDown
  const trendColor = delta == null ? '#6B7280' : delta > 0 ? '#22C55E' : '#EF4444'
  const numVal = typeof raw === 'number' && !isNaN(raw) ? raw : null
  const animated = useCountUp(numVal, 700, numVal !== null)

  return (
    <div className="kpi-card">
      <div className="kpi-header">
        {Icon && <Icon size={18} />}
        <span className="kpi-label">{label}</span>
      </div>
      <div className="kpi-value">
        <span className="kpi-num">
          {numVal !== null ? animated.toFixed(1) : (value ?? '—')}
        </span>
        {unit && <span className="kpi-unit">{unit}</span>}
      </div>
      {delta !== undefined && (
        <div className="kpi-trend" style={{ color: trendColor }}>
          <Trend size={14} />
          <span>{Math.abs(delta).toFixed(1)}</span>
        </div>
      )}
    </div>
  )
}
