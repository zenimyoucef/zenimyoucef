import { useState } from 'react'
import { useApp } from '../context/AppContext'
import Modal from '../components/ui/Modal'
import Toast from '../components/ui/Toast'
import { calcMuscleMass, calcBMI, fmt } from '../utils/calculations'
import { Trash2, Target } from 'lucide-react'

export default function Settings() {
  const { profile, setProfile, unitPref, setUnitPref, entries } = useApp()
  const [showClear, setShowClear] = useState(false)
  const [toast, setToast] = useState(null)

  const latest = entries.length > 0 ? entries[0] : null
  const currentBMI = latest ? calcBMI(Number(latest.weight), profile.heightCm) : null

  const goalProgress = (() => {
    if (!latest || !profile.goalWeight) return null
    const current = Number(latest.weight)
    const target = Number(profile.goalWeight)
    if (current === target) return 100
    const change = current - target
    const initial = entries[entries.length - 1]?.weight
    if (!initial) return 50
    const totalChange = Number(initial) - target
    if (totalChange === 0) return 50
    return Math.min(100, Math.max(0, (change / totalChange) * 100))
  })()

  const handleClearData = () => {
    localStorage.removeItem('pulse_entries')
    localStorage.removeItem('pulse_profile')
    localStorage.removeItem('pulse_unit')
    window.location.reload()
  }

  return (
    <div className="page fade-in">
      <div className="page-header">
        <h2>Settings</h2>
      </div>

      <div className="card">
        <h3 className="card-title">Profile</h3>
        <div className="form-row">
          <label>Name</label>
          <input
            type="text" value={profile.name}
            onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
            className="input" placeholder="Your name"
          />
        </div>
        <div className="form-row form-row-inline">
          <div className="form-field">
            <label>Age</label>
            <input
              type="number" value={profile.age}
              onChange={e => setProfile(p => ({ ...p, age: e.target.value }))}
              className="input" placeholder="Age"
            />
          </div>
          <div className="form-field">
            <label>Sex</label>
            <select
              value={profile.sex}
              onChange={e => setProfile(p => ({ ...p, sex: e.target.value }))}
              className="input"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
        </div>
        <div className="form-row">
          <label>Height (cm)</label>
          <input
            type="number" value={profile.heightCm}
            onChange={e => setProfile(p => ({ ...p, heightCm: Number(e.target.value) }))}
            className="input" placeholder="175"
          />
        </div>
      </div>

      <div className="card">
        <h3 className="card-title"><Target size={16} /> Goals</h3>
        <div className="form-row form-row-inline">
          <div className="form-field">
            <label>Target Weight (kg)</label>
            <input
              type="number" step="0.1" value={profile.goalWeight}
              onChange={e => setProfile(p => ({ ...p, goalWeight: e.target.value }))}
              className="input" placeholder="e.g. 70"
            />
          </div>
          <div className="form-field">
            <label>Target BF%</label>
            <input
              type="number" step="0.1" value={profile.goalBodyFat}
              onChange={e => setProfile(p => ({ ...p, goalBodyFat: e.target.value }))}
              className="input" placeholder="e.g. 12"
            />
          </div>
        </div>

        {goalProgress !== null && (
          <div className="goal-progress-section">
            <div className="goal-progress-header">
              <span>Goal Progress</span>
              <span>{fmt(goalProgress)}%</span>
            </div>
            <div className="goal-progress-track">
              <div className="goal-progress-fill" style={{ width: `${goalProgress}%` }} />
            </div>
            {latest && profile.goalWeight && (
              <p className="goal-detail">
                {fmt(Number(latest.weight))} kg → {fmt(Number(profile.goalWeight))} kg
                {currentBMI && ` (BMI: ${fmt(currentBMI)})`}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="card">
        <h3 className="card-title">Preferences</h3>
        <div className="form-row">
          <label>Units</label>
          <div className="toggle-group">
            <button
              className={`toggle-btn ${unitPref === 'metric' ? 'toggle-active' : ''}`}
              onClick={() => setUnitPref('metric')}
            >Metric</button>
            <button
              className={`toggle-btn ${unitPref === 'imperial' ? 'toggle-active' : ''}`}
              onClick={() => setUnitPref('imperial')}
            >Imperial</button>
          </div>
        </div>
      </div>

      <div className="card card-danger">
        <h3 className="card-title">Danger Zone</h3>
        <p className="danger-text">This will permanently delete all your entries, profile, and settings.</p>
        <button className="btn btn-danger" onClick={() => setShowClear(true)}>
          <Trash2 size={16} /> Clear All Data
        </button>
      </div>

      <Modal open={showClear} onClose={() => setShowClear(false)} title="Clear All Data?">
        <p>This action cannot be undone. All your progress data will be lost.</p>
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={() => setShowClear(false)}>Cancel</button>
          <button className="btn btn-danger" onClick={handleClearData}>Clear Everything</button>
        </div>
      </Modal>

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  )
}
