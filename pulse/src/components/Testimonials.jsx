import { TESTIMONIALS } from '../data/content'

export default function Testimonials() {
  return (
    <section className="section-reveal" style={{ maxWidth: 900, margin: '0 auto' }}>
      <div className="section-badge">💬 Results</div>
      <h2 style={{ textAlign: 'center' }}>Member <span className="ac">Stories</span></h2>
      <div className="sd" style={{ textAlign: 'center' }}>Real transformations from real members.</div>
      <div className="testi-grid">
        {TESTIMONIALS.map((t, i) => (
          <div className="testi-card" key={i}>
            <div className="tc-av">{t.initial}</div>
            <div className="tc-q">"{t.quote}"</div>
            <div className="tc-n">{t.name}</div>
            <div className="tc-r">{t.result}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
