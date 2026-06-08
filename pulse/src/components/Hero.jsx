import { useEffect, useRef } from 'react'

function Counter({ target }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let started = false
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting && !started) {
          started = true
          const duration = 2000
          const start = performance.now()
          const animate = (now) => {
            const t = Math.min(1, (now - start) / duration)
            el.textContent = Math.round(target * (1 - Math.pow(1 - t, 3)))
            if (t < 1) requestAnimationFrame(animate)
          }
          requestAnimationFrame(animate)
        }
      })
    }, { threshold: 0.3 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [target])

  return <span className="hs-v counter" ref={ref}>0</span>
}

export default function Hero() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const c = canvasRef.current
    if (!c) return
    const ctx = c.getContext('2d')
    let w, h, t = 0
    const resize = () => { w = c.width = window.innerWidth; h = c.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)
    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      ctx.beginPath()
      ctx.moveTo(0, h)
      for (let x = 0; x <= w; x += 5) {
        const y = h * 0.6 + Math.sin(x * 0.008 + t) * 20 + Math.sin(x * 0.015 + t * 0.7) * 12 + Math.sin(x * 0.003 + t * 0.3) * 25
        ctx.lineTo(x, y)
      }
      ctx.lineTo(w, h)
      ctx.closePath()
      const grd = ctx.createLinearGradient(0, 0, w, 0)
      grd.addColorStop(0, 'rgba(255,90,0,.08)')
      grd.addColorStop(0.5, 'rgba(255,26,94,.06)')
      grd.addColorStop(1, 'rgba(124,58,237,.08)')
      ctx.fillStyle = grd
      ctx.fill()
      t += 0.008
      requestAnimationFrame(draw)
    }
    const raf = requestAnimationFrame(draw)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])

  return (
    <section className="hero" id="hero">
      <canvas ref={canvasRef}></canvas>
      <div className="hero-bg-img"></div>
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <div className="hero-badge">✦ Premium Fitness • Est. 2024</div>
        <div className="sub">IGNITE YOUR POTENTIAL</div>
        <h1><span className="gr">PULSE</span></h1>
        <p>Transform your body, sharpen your mind, and unlock the athlete within. World-class trainers, cutting-edge programs, a community that pushes you beyond your limits.</p>
        <div className="hero-cta">
          <a href="#pricing" className="btn btn-primary" onClick={(e) => { e.preventDefault(); document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' }) }}>
            🔥 Start Free Trial
          </a>
        </div>
        <div className="hero-pulse-indicator">
          <div className="hpi-dot"></div>
          <span>LIVE • 127 BPM</span>
        </div>
        <div className="hero-stats">
          <div className="hero-stat"><Counter target={5000} /><div className="hs-l">Active Members</div></div>
          <div className="hero-stat"><div className="hs-v">24/7</div><div className="hs-l">Open Hours</div></div>
          <div className="hero-stat"><Counter target={50} /><div className="hs-l">Classes Weekly</div></div>
        </div>
      </div>
    </section>
  )
}
