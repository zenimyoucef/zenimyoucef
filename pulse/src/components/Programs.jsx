import { useToast } from './Toast'
import { PROGRAMS } from '../data/content'

function ProgCard({ prog, index }) {
  const showToast = useToast()
  return (
    <div className="prog-card" style={{ animationDelay: `${index * 0.1}s` }}>
      <div className="pc-gl"></div>
      <div className="pc-icon">{prog.icon}</div>
      <div className={`pc-badge ${prog.badge.cls}`}>{prog.badge.text}</div>
      <h3>{prog.title}</h3>
      <p>{prog.desc}</p>
      <div className="prog-feat">
        {prog.features.map((f, i) => <span key={i}>{f}</span>)}
      </div>
      <div className="pc-price">{prog.price.toLocaleString('fr-DZ')} DZD</div>
      <button className="btn btn-primary btn-sm" onClick={() => showToast('💪', `${prog.title} coming soon!`)}>
        Enroll Now
      </button>
    </div>
  )
}

export default function Programs() {
  const main = PROGRAMS[0]
  const rest = PROGRAMS.slice(1)
  return (
    <section className="section-bleed section-reveal" id="programs">
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div className="section-badge">🏋️ Programs</div>
        <h2>Choose Your <span className="ac">Path</span></h2>
        <div className="sd">Elite programs designed by world-class trainers to transform your body.</div>
        <div className="prog-grid cd visible">
          <ProgCard prog={main} index={0} />
          <div className="prog-right">
            {rest.map((p, i) => <ProgCard key={i} prog={p} index={i + 1} />)}
          </div>
        </div>
      </div>
    </section>
  )
}
