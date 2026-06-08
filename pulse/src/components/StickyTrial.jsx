import { useEffect, useState } from 'react'

export default function StickyTrial() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const hero = document.getElementById('hero')
      if (hero) setVisible(window.scrollY > hero.offsetHeight * 0.8)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToPricing = () => {
    if (window.__transitionOverlay) window.__transitionOverlay()
    setTimeout(() => {
      document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 200)
  }

  return (
    <div className={`sticky-trial ${visible ? 'visible' : ''}`}>
      <button className="sticky-trial-btn" onClick={scrollToPricing}>
        🔥 Free Trial
      </button>
    </div>
  )
}
