import { useState, useEffect, useRef } from 'react'

export default function useCountUp(target, duration = 800, enabled = true) {
  const [count, setCount] = useState(0)
  const rafRef = useRef()

  useEffect(() => {
    if (!enabled || target === null || target === undefined || isNaN(target)) {
      setCount(0)
      return
    }

    const start = performance.now()
    const from = 0
    const to = Number(target)

    if (to === 0) {
      setCount(0)
      return
    }

    const animate = (now) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(from + (to - from) * eased)

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate)
      }
    }

    rafRef.current = requestAnimationFrame(animate)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [target, duration, enabled])

  return count
}
