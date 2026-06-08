import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import useBodyFat from '../hooks/useBodyFat'
import Toast from '../components/ui/Toast'
import { Save, Calculator } from 'lucide-react'

const METHODS = ['Navy Method', '3-Site Skinfold', 'Visual Estimate']

export default function LogEntry() {
  const { addEntry, profile } = useApp()
  const navigate = useNavigate()

  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [weight, setWeight] = useState('')
  const [weightUnit, setWeightUnit] = useState('kg')
  const [bodyFat, setBodyFat] = useState('')
  const [bfMethod, setBfMethod] = useState('Navy Method')
  const [waist, setWaist] = useState('')
  const [neck, setNeck] = useState('')
  const [hip, setHip] = useState('')
  const [notes, setNotes] = useState('')
  const [toast, setToast] = useState(null)

  const calcBF = useBodyFat(
    { waist: Number(waist), neck: Number(neck), hip: Number(hip), height: profile.heightCm },
    profile.sex
  )

  const handleSubmit = useCallback((e) => {
    e.preventDefault()
    const w = weightUnit === 'lbs' ? Number(weight) / 2.20462 : Number(weight)
    const bf = bodyFat || calcBF || ''
    if (!w || w <= 0) {
      setToast({ message: 'Please enter a valid weight', type: 'error' })
      return
    }
    addEntry({
      date,
      weight: Math.round(w * 10) / 10,
      bodyFat: bf ? Math.round(Number(bf) * 10) / 10 : null,
      bfMethod,
      waist: waist ? Number(waist) : null,
      neck: neck ? Number(neck) : null,
      hip: hip ? Number(hip) : null,
      notes
    })
    setToast({ message: 'Entry saved successfully!', type: 'success' })
    setTimeout(() => navigate('/'), 1200)
  }, [date, weight, weightUnit, bodyFat, calcBF, bfMethod, waist, neck, hip, notes, addEntry, navigate])

  return (
    <div className="page fade-in">
      <div className="page-header">
        <h2>Log Entry</h2>
      </div>

      <form className="card log-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <label>Date</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className="input" />
        </div>

        <div className="form-row">
          <label>Weight</label>
          <div className="input-group">
            <input
              type="number" step="0.1" placeholder="e.g. 75" value={weight}
              onChange={e => setWeight(e.target.value)} className="input" required
            />
            <select value={weightUnit} onChange={e => setWeightUnit(e.target.value)} className="input input-select">
              <option value="kg">kg</option>
              <option value="lbs">lbs</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <label>Body Fat %</label>
          <div className="input-group">
            <input
              type="number" step="0.1" placeholder={calcBF ? `Auto: ${calcBF}%` : 'Optional'} value={bodyFat}
              onChange={e => setBodyFat(e.target.value)} className="input"
            />
            <select value={bfMethod} onChange={e => setBfMethod(e.target.value)} className="input input-select">
              {METHODS.map(m => <option key={m}>{m}</option>)}
            </select>
          </div>
        </div>

        <fieldset className="form-fieldset">
          <legend className="form-legend"><Calculator size={14} /> Navy Method Measurements</legend>
          <div className="form-row">
            <label>Waist (cm)</label>
            <input type="number" step="0.1" value={waist} onChange={e => setWaist(e.target.value)} className="input" placeholder="e.g. 82" />
          </div>
          <div className="form-row">
            <label>Neck (cm)</label>
            <input type="number" step="0.1" value={neck} onChange={e => setNeck(e.target.value)} className="input" placeholder="e.g. 38" />
          </div>
          {profile.sex === 'female' && (
            <div className="form-row">
              <label>Hip (cm)</label>
              <input type="number" step="0.1" value={hip} onChange={e => setHip(e.target.value)} className="input" placeholder="e.g. 95" />
            </div>
          )}
          {calcBF && <p className="calc-hint">Navy BF%: <strong>{calcBF}%</strong></p>}
        </fieldset>

        <div className="form-row">
          <label>Notes</label>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} className="input input-textarea" rows={3} placeholder="How was the workout today?" />
        </div>

        <button type="submit" className="btn btn-primary btn-full">
          <Save size={16} /> Save Entry
        </button>
      </form>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
