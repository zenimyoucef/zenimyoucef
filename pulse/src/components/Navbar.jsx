import { useState, useEffect } from 'react'

export default function Navbar({ isDark, toggleTheme }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id) => {
    setMobileOpen(false)
    if (window.__transitionOverlay) window.__transitionOverlay()
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 200)
  }

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <a href="#hero" className="nav-logo" onClick={(e) => { e.preventDefault(); scrollTo('hero') }}>PULSE</a>
      <div className={`nav-links ${mobileOpen ? 'open' : ''}`}>
        <a href="#programs" onClick={(e) => { e.preventDefault(); scrollTo('programs') }}>Programs</a>
        <a href="#trainers" onClick={(e) => { e.preventDefault(); scrollTo('trainers') }}>Trainers</a>
        <a href="#pricing" onClick={(e) => { e.preventDefault(); scrollTo('pricing') }}>Pricing</a>
        <a href="#timer" onClick={(e) => { e.preventDefault(); scrollTo('timer') }}>Timer</a>
        <a href="#bmi" onClick={(e) => { e.preventDefault(); scrollTo('bmi') }}>BMI</a>
      </div>
      <div className="nav-actions">
        <a href="#pricing" className="nav-cta" onClick={(e) => { e.preventDefault(); scrollTo('pricing') }}>Join</a>
        <button className="theme-btn" onClick={toggleTheme} aria-label="Toggle theme">
          {isDark ? '🌙' : '☀️'}
        </button>
        <button className="mobile-toggle" onClick={() => setMobileOpen(v => !v)} aria-label="Menu">☰</button>
      </div>
    </nav>
  )
}
