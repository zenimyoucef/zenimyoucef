import { useEffect, useState } from 'react'
import { DAYS, TIMES } from '../data/content'
import { useToast } from './Toast'

const PLAN_KEY = 'pulse_plan'

function getPlan() {
  try { return JSON.parse(localStorage.getItem(PLAN_KEY)) || {} } catch (e) { return {} }
}
function savePlan(p) { localStorage.setItem(PLAN_KEY, JSON.stringify(p)) }

export default function WorkoutPlanBuilder() {
  const showToast = useToast()
  const [plan, setPlan] = useState(getPlan)

  const addToSlot = (key, ex) => {
    const p = { ...plan, [key]: ex }
    savePlan(p)
    setPlan(p)
    showToast('✅', `Planned: ${ex} on ${key}`)
  }

  const removeFromSlot = (key) => {
    const p = { ...plan }
    delete p[key]
    savePlan(p)
    setPlan(p)
  }

  const handleDragStart = (e, ex) => {
    e.dataTransfer.setData('text/plain', ex)
    e.currentTarget.classList.add('dragging')
    setTimeout(() => e.currentTarget.classList.remove('dragging'), 0)
  }

  const handleDrop = (e, key) => {
    e.preventDefault()
    e.currentTarget.classList.remove('drag-over')
    const ex = e.dataTransfer.getData('text/plain')
    if (!ex) return
    addToSlot(key, ex)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.currentTarget.classList.add('drag-over')
  }

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('drag-over')
  }

  return (
    <section className="section-bleed section-reveal" id="plan-builder">
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <div className="section-badge">📋 Planner</div>
        <h2>Weekly <span className="ac">Plan</span></h2>
        <div className="sd">Drag exercise cards into the schedule grid. Your plan is saved automatically.</div>
        <div className="plan-layout">
          <div className="plan-exercises">
            {['Push', 'Pull', 'Legs', 'Cardio', 'Rest'].map((ex, i) => (
              <div
                key={i}
                className="plan-ex-card"
                draggable
                onDragStart={(e) => handleDragStart(e, ex)}
              >
                {ex === 'Push' ? '💪' : ex === 'Pull' ? '🏋️' : ex === 'Legs' ? '🦵' : ex === 'Cardio' ? '🏃' : '😴'} {ex}
              </div>
            ))}
          </div>
          <div>
            <div className="plan-grid">
              <div></div>
              {DAYS.map(d => <div key={d} className="plan-day-header">{d}</div>)}
              {TIMES.map(t => (
                <>
                  <div key={t} className="plan-day-header" style={{ fontSize: '.35rem' }}>{t}</div>
                  {DAYS.map(d => {
                    const key = d + '-' + t
                    const ex = plan[key]
                    return (
                      <div
                        key={key}
                        className={`plan-slot ${ex ? 'filled' : ''}`}
                        data-slot={key}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, key)}
                      >
                        {ex ? (
                          <>
                            <span className="slot-ex">{ex}</span>
                            <span className="slot-remove" onClick={() => removeFromSlot(key)}>✕</span>
                          </>
                        ) : (
                          <span className="slot-label">+</span>
                        )}
                      </div>
                    )
                  })}
                </>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
