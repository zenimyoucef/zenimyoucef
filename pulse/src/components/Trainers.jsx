import { TRAINERS } from '../data/content'
import { useToast } from './Toast'
import { openBooking } from './BookingModal'

export default function Trainers() {
  const showToast = useToast()

  return (
    <section className="section-reveal" id="trainers" style={{ maxWidth: '100%', padding: '5rem 2rem' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div className="section-badge">👨‍🏫 Trainers</div>
        <h2>Meet the <span className="ac">Team</span></h2>
        <div className="sd">
          Click a trainer to view their schedule and book a class. Certified pros dedicated to your transformation.
        </div>
      </div>
      <div className="trainer-strip" style={{ paddingLeft: 'calc((100% - 1100px) / 2)' }}>
        {TRAINERS.map((t, i) => (
          <div className="trainer-card" key={i} onClick={() => openBooking(t.name, t.role)}>
            <div className="tc-img" style={{ backgroundImage: `url(${t.img})` }}>
              <div className="tc-ov">
                <a href="#" onClick={e => e.stopPropagation()}>📸</a>
                <a href="#" onClick={e => e.stopPropagation()}>𝕏</a>
              </div>
            </div>
            <div className="tc-body">
              <div className="tc-r">{t.role}</div>
              <h4>{t.name}</h4>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
