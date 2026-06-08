import { useState, useMemo } from 'react'
import useBMI from '../hooks/useBMI'
import useCountUp from '../hooks/useCountUp'
import GaugeBar from '../components/ui/GaugeBar'
import MetricBadge from '../components/ui/MetricBadge'
import { devineIdealWeight, robinsonIdealWeight, millerIdealWeight, fmt } from '../utils/calculations'
import { useApp } from '../context/AppContext'
import { Ruler, Weight, ArrowUp, ArrowDown, Minus, ChevronDown } from 'lucide-react'

const RANGE_META = [
  { label: 'Underweight', value: '< 18.5', color: '#3B82F6', id: 'Underweight' },
  { label: 'Normal', value: '18.5–24.9', color: '#22C55E', id: 'Normal' },
  { label: 'Overweight', value: '25–29.9', color: '#F59E0B', id: 'Overweight' },
  { label: 'Obese', value: '≥ 30', color: '#EF4444', id: 'Obese' }
]

function WeightArrow({ weight, prevWeight }) {
  if (!weight || !prevWeight) return null
  const diff = weight - prevWeight
  if (Math.abs(diff) < 0.05) return <Minus size={14} className="trend-neutral" />
  return diff > 0 ? <ArrowUp size={14} className="trend-up" /> : <ArrowDown size={14} className="trend-down" />
}

export default function BMICalc() {
  const { profile } = useApp()

  const [heightCm, setHeightCm] = useState(profile.heightCm || 175)
  const [heightUnit, setHeightUnit] = useState('cm')
  const [weightKg, setWeightKg] = useState('')
  const [weightUnit, setWeightUnit] = useState('kg')
  const [prevWeight, setPrevWeight] = useState(null)
  const [age, setAge] = useState(profile.age || '')
  const [sex, setSex] = useState(profile.sex || 'male')

  const displayHt = heightUnit === 'ft' ? heightCm / 2.54 : heightCm

  const { bmi, category } = useBMI(
    weightUnit === 'lbs' ? Number(weightKg) / 2.20462 : Number(weightKg),
    heightCm
  )

  const animatedBMI = useCountUp(bmi, 1000, bmi !== null)

  const idealWeights = useMemo(() => {
    if (!heightCm || heightCm <= 0) return null
    const isMale = sex === 'male'
    return {
      devine: devineIdealWeight(heightCm, isMale),
      robinson: robinsonIdealWeight(heightCm, isMale),
      miller: millerIdealWeight(heightCm, isMale)
    }
  }, [heightCm, sex])

  const weightInKg = weightUnit === 'lbs' ? Number(weightKg) / 2.20462 : Number(weightKg)

  const handleWeightChange = (e) => {
    const old = Number(weightKg)
    const oldInKg = weightUnit === 'lbs' ? old / 2.20462 : old
    setPrevWeight(oldInKg || null)
    setWeightKg(e.target.value)
  }

  const healthNote = "BMI is a screening tool, not a diagnostic. Consult a healthcare professional for a complete health assessment."

  return (
    <div className="page fade-in">
      <div className="page-header">
        <h2>BMI Calculator</h2>
      </div>

      <div className="card">
        <div className="bmi-inputs">
          <div className="form-row">
            <label>Height</label>
            <div className="input-group attached">
              <input
                type="number" step="0.1" placeholder="e.g. 175"
                value={displayHt || ''}
                onChange={e => {
                  const val = Number(e.target.value)
                  setHeightCm(heightUnit === 'ft' ? val * 2.54 : val)
                }}
                className="input input-group-field"
              />
              <div className="input-group-divider" />
              <div className="select-wrap">
                <select value={heightUnit} onChange={e => setHeightUnit(e.target.value)} className="input input-select input-group-select">
                  <option value="cm">cm</option>
                  <option value="ft">inches</option>
                </select>
                <ChevronDown size={14} className="select-chevron" />
              </div>
            </div>
          </div>

          <div className="form-row">
            <label>Weight</label>
            <div className="input-group attached">
              <input
                type="number" step="0.1" placeholder="e.g. 75"
                value={weightKg || ''}
                onChange={handleWeightChange}
                className="input input-group-field"
              />
              <div className="input-group-divider" />
              <div className="select-wrap">
                <select value={weightUnit} onChange={e => setWeightUnit(e.target.value)} className="input input-select input-group-select">
                  <option value="kg">kg</option>
                  <option value="lbs">lbs</option>
                </select>
                <ChevronDown size={14} className="select-chevron" />
              </div>
            </div>
          </div>

          <div className="form-row form-row-inline">
            <div className="form-field">
              <label>Age</label>
              <input type="number" value={age} onChange={e => setAge(e.target.value)} className="input" placeholder="25" />
            </div>
            <div className="form-field">
              <label>Sex</label>
              <div className="select-wrap select-full">
                <select value={sex} onChange={e => setSex(e.target.value)} className="input">
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
                <ChevronDown size={14} className="select-chevron" />
              </div>
            </div>
          </div>
        </div>

        {bmi !== null && (
          <div className="bmi-result">
            <div className="bmi-number">
              <span className="bmi-value" style={{ color: category?.color }}>
                {animatedBMI.toFixed(1)}
              </span>
              <span className="bmi-cat" style={{ color: category?.color }}>
                {category?.label}
              </span>
              <WeightArrow weight={weightInKg} prevWeight={prevWeight} />
            </div>

            <GaugeBar value={bmi} color={category?.color} />

            <div className="bmi-ranges">
              {RANGE_META.map(r => (
                <MetricBadge
                  key={r.id}
                  label={r.label}
                  value={r.value}
                  color={r.color}
                  active={category?.label === r.id}
                />
              ))}
            </div>

            {idealWeights && (
              <div className="ideal-weight-section">
                <h4><Ruler size={14} /> Ideal Weight Estimates</h4>
                <div className="ideal-weight-grid">
                  {[
                    { label: 'Devine', key: 'devine', formula: 'Devine (1974)' },
                    { label: 'Robinson', key: 'robinson', formula: 'Robinson (1983)' },
                    { label: 'Miller', key: 'miller', formula: 'Miller (1985)' }
                  ].map((fw, i, arr) => {
                    const val = idealWeights[fw.key]
                    const prev = i > 0 ? idealWeights[arr[i - 1].key] : null
                    const diff = prev ? val - prev : null
                    return (
                      <div key={fw.key} className="ideal-weight-item">
                        <MetricBadge label={fw.label} value={`${fmt(val)} kg`} color="#E8302A" />
                        {diff !== null && (
                          <div className="ideal-weight-diff">
                            <span className="diff-arrow" style={{ color: diff > 0 ? '#22C55E' : '#EF4444' }}>
                              {diff > 0 ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                            </span>
                            <span className="diff-value">{Math.abs(diff).toFixed(1)}</span>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            <p className="health-note">{healthNote}</p>
          </div>
        )}

        {bmi === null && (
          <p className="bmi-prompt"><Weight size={18} /> Enter your height and weight to calculate your BMI</p>
        )}
      </div>
    </div>
  )
}
