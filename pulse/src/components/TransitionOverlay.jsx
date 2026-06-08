import { useRef } from 'react'

export default function TransitionOverlay() {
  const ref = useRef(null)

  const trigger = () => {
    const el = ref.current
    if (!el) return
    el.classList.remove('active')
    void el.offsetWidth
    el.classList.add('active')
    setTimeout(() => el.classList.remove('active'), 650)
  }

  window.__transitionOverlay = trigger

  return <div className="transition-overlay" ref={ref} aria-hidden="true"></div>
}
