import { useToast } from './Toast'

function ProgressCard({ icon, title, current, goal, unit, goalLabel }) {
  const showToast = useToast()

  const updateProgress = (e) => {
    const card = e.currentTarget.closest('.prog-track-card')
    const cur = parseFloat(card.querySelector('.pt-current').value)
    const g = parseFloat(card.querySelector('.pt-goal').value)
    if (isNaN(cur) || isNaN(g) || g <= 0) { showToast('⚠️', 'Enter valid current & goal values'); return }
    let pct
    if (g >= cur) {
      pct = Math.min(100, (cur / g) * 100)
    } else {
      pct = Math.min(100, Math.max(0, (1 - cur / g) * 100))
    }
    card.querySelector('.pt-fill').style.width = pct + '%'
    card.querySelector('.pt-pct').textContent = Math.round(pct) + '%'
  }

  return (
    <div className="prog-track-card">
      <div className="pt-icon">{icon}</div>
      <h4>{title}</h4>
      <div className="pt-inputs">
        <input type="number" className="pt-current" placeholder="Current" defaultValue={current} />
        <span>{unit}</span>
        <input type="number" className="pt-goal" placeholder="Goal" defaultValue={goal} />
        <span>{unit}</span>
        <button className="btn btn-ghost btn-sm" onClick={updateProgress}>→</button>
      </div>
      <div className="prog-track-bar"><div className="pt-fill" style={{ width: '0%' }}></div></div>
      <div className="pt-pct">0%</div>
      <div className="pt-goal-label">{goalLabel}</div>
    </div>
  )
}

export default function ProgressTracker() {
  return (
    <section className="section-reveal" id="progress" style={{ maxWidth: '100%', padding: '5rem 2rem' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div className="section-badge">📈 Progress</div>
        <h2 style={{ textAlign: 'center' }}>Track Your <span className="ac">Gains</span></h2>
        <div className="sd" style={{ textAlign: 'center' }}>
          Set current and goal values — watch your progress bars fill up.
        </div>
        <div className="progress-grid">
          <ProgressCard icon="⚖️" title="Body Weight" current={85} goal={75} unit="kg" goalLabel="toward goal" />
          <ProgressCard icon="🔬" title="Body Fat" current={22} goal={12} unit="%" goalLabel="toward goal" />
          <ProgressCard icon="🏋️" title="Bench Press" current={60} goal={100} unit="kg" goalLabel="toward goal" />
        </div>
      </div>
    </section>
  )
}
