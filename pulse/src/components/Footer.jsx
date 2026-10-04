import { useToast } from './Toast'

export default function Footer() {
  const showToast = useToast()

  const subNL = (e) => {
    e.preventDefault()
    const input = document.getElementById('nlEmail')
    if (!input.value.trim() || !input.value.includes('@')) {
      showToast('⚠️', 'Invalid email')
      return
    }
    showToast('📰', 'Subscribed!')
    input.value = ''
  }

  return (
    <footer>
      <div className="ft-inner">
        <div>
          <div className="fb-logo">PULSE</div>
          <p style={{ marginTop: '.5rem' }}>
            Premium fitness with world-class trainers. Transform your body, sharpen your mind.
          </p>
          <div className="ft-social">
            <a href="#">📸</a>
            <a href="#">𝕏</a>
            <a href="#">▶</a>
          </div>
        </div>
        <div className="ft-col">
          <h4>Links</h4>
          <a href="#programs" onClick={e => { e.preventDefault(); document.getElementById('programs')?.scrollIntoView({ behavior: 'smooth' }) }}>Programs</a>
          <a href="#trainers" onClick={e => { e.preventDefault(); document.getElementById('trainers')?.scrollIntoView({ behavior: 'smooth' }) }}>Trainers</a>
          <a href="#pricing" onClick={e => { e.preventDefault(); document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' }) }}>Pricing</a>
          <a href="#bmi" onClick={e => { e.preventDefault(); document.getElementById('bmi')?.scrollIntoView({ behavior: 'smooth' }) }}>BMI</a>
        </div>
        <div className="ft-col">
          <h4>Support</h4>
          <a href="#">Contact</a>
          <a href="#">FAQ</a>
          <a href="#">Terms</a>
          <a href="#">Privacy</a>
        </div>
        <div>
          <h4>Get Tips</h4>
          <p style={{ fontSize: '.6rem', color: 'var(--text-muted)', marginBottom: '.5rem' }}>
            Fitness tips straight to your inbox.
          </p>
          <form className="nl-form" onSubmit={subNL}>
            <input type="email" placeholder="Email" id="nlEmail" />
            <button type="submit">→</button>
          </form>
        </div>
      </div>
      <div className="ft-bottom">
        <p>© 2026 PULSE Fitness — Ignite Your Potential. All rights reserved.</p>
      </div>
    </footer>
  )
}
