import { CHALLENGES } from '../data/content'

export default function Challenges() {
  return (
    <section className="section-bleed section-reveal" id="challenges">
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <div className="section-badge">🏆 Challenges</div>
        <h2>30-Day <span className="ac">Challenges</span></h2>
        <div className="sd">Push your limits. Track progress. Earn badges and rewards.</div>
        <div className="chal-grid cd visible">
          {CHALLENGES.map((c, i) => (
            <div className="chal-card" key={i}>
              <div className="ch-icon">{c.icon}</div>
              <h4>{c.title}</h4>
              <p>{c.desc}</p>
              <div className="ch-bar"><div className="ch-fill" style={{ width: `${c.progress}%` }}></div></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
