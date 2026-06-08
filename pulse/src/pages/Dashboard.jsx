import { useMemo } from 'react'
import { useApp } from '../context/AppContext'
import KpiCard from '../components/ui/KpiCard'
import TrendLine from '../components/charts/TrendLine'
import { calcBMI, calcMuscleMass, fmt } from '../utils/calculations'
import { Scale, Percent, Weight, TestTube, Plus, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const { entries, profile } = useApp()
  const navigate = useNavigate()

  const latest = entries.length > 0 ? entries[0] : null

  const kpis = useMemo(() => {
    if (!latest) {
      return [
        { icon: Scale, label: 'Current Weight', value: '—', unit: 'kg', delta: undefined, raw: null },
        { icon: Percent, label: 'Body Fat %', value: '—', unit: '%', delta: undefined, raw: null },
        { icon: Weight, label: 'Muscle Mass', value: '—', unit: 'kg', delta: undefined, raw: null },
        { icon: TestTube, label: 'BMI', value: '—', unit: '', delta: undefined, raw: null }
      ]
    }

    const prev = entries.length > 1 ? entries[1] : null
    const weight = Number(latest.weight)
    const bf = Number(latest.bodyFat)
    const mm = calcMuscleMass(weight, bf)
    const bmi = calcBMI(weight, profile.heightCm)

    const prevWeight = prev ? Number(prev.weight) : null
    const prevBf = prev ? Number(prev.bodyFat) : null
    const prevMm = prev ? calcMuscleMass(Number(prev.weight), Number(prev.bodyFat)) : null
    const prevBmi = prev ? calcBMI(Number(prev.weight), profile.heightCm) : null

    return [
      { icon: Scale, label: 'Current Weight', value: fmt(weight), raw: weight, unit: 'kg', delta: prevWeight ? weight - prevWeight : undefined },
      { icon: Percent, label: 'Body Fat %', value: fmt(bf), raw: bf, unit: '%', delta: prevBf ? bf - prevBf : undefined },
      { icon: Weight, label: 'Muscle Mass', value: fmt(mm), raw: mm, unit: 'kg', delta: prevMm ? mm - prevMm : undefined },
      { icon: TestTube, label: 'BMI', value: fmt(bmi), raw: bmi, unit: '', delta: prevBmi ? bmi - prevBmi : undefined }
    ]
  }, [entries, profile.heightCm])

  const chartData = useMemo(() => {
    const recent = entries.slice(0, 8).reverse()
    return recent.map(e => ({
      label: new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      bf: Number(e.bodyFat),
      muscle: calcMuscleMass(Number(e.weight), Number(e.bodyFat))
    }))
  }, [entries])

  return (
    <div className="page fade-in">
      <div className="page-header">
        <h2>Dashboard</h2>
        <button className="btn btn-primary" onClick={() => navigate('/log')}>
          <Plus size={16} /> Quick Add
        </button>
      </div>

      <div className="kpi-grid">
        {kpis.map((k, i) => (
          <KpiCard key={i} {...k} />
        ))}
      </div>

      <div className="card chart-card">
        <h3 className="card-title">Weekly Progress</h3>
        <TrendLine
          data={chartData}
          lines={[
            { dataKey: 'bf', name: 'Body Fat %', color: '#E8302A' },
            { dataKey: 'muscle', name: 'Muscle Mass', color: '#22C55E' }
          ]}
        />
      </div>

      {latest && (
        <div className="card last-entry-card" onClick={() => navigate('/progress')}>
          <div className="last-entry-header">
            <h3>Last Entry</h3>
            <ChevronRight size={18} />
          </div>
          <div className="last-entry-meta">
            <span>{new Date(latest.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
            <span className="last-entry-notes">{latest.notes || 'No notes'}</span>
          </div>
        </div>
      )}
    </div>
  )
}
