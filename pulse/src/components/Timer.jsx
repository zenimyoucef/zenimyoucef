import { useState, useRef, useCallback, useEffect } from 'react'
import { useToast } from './Toast'

const PRESETS = [
  { label: '1:00', sec: 60 },
  { label: '3:00', sec: 180 },
  { label: '5:00', sec: 300 },
  { label: '10:00', sec: 600 },
  { label: '15:00', sec: 900 },
  { label: '20:00', sec: 1200 },
]

const CIRCUMFERENCE = 628.32

export default function Timer() {
  const showToast = useToast()
  const [totalSec, setTotalSec] = useState(300)
  const [remaining, setRemaining] = useState(300)
  const [running, setRunning] = useState(false)
  const [paused, setPaused] = useState(false)
  const [customMin, setCustomMin] = useState(5)
  const [customSec, setCustomSec] = useState(0)
  const intervalRef = useRef(null)
  const pausedRef = useRef(false)

  const formatTime = (s) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m < 10 ? '0' : ''}${m}:${sec < 10 ? '0' : ''}${sec}`
  }

  const playBeep = useCallback(() => {
    try {
      const actx = new (window.AudioContext || window.webkitAudioContext)()
      const osc = actx.createOscillator()
      const gain = actx.createGain()
      osc.connect(gain)
      gain.connect(actx.destination)
      osc.frequency.value = 880
      osc.type = 'sine'
      gain.gain.setValueAtTime(0.5, actx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, actx.currentTime + 0.5)
      osc.start(actx.currentTime)
      osc.stop(actx.currentTime + 0.5)
      setTimeout(() => {
        const actx2 = new (window.AudioContext || window.webkitAudioContext)()
        const osc2 = actx2.createOscillator()
        const gain2 = actx2.createGain()
        osc2.connect(gain2)
        gain2.connect(actx2.destination)
        osc2.frequency.value = 1100
        osc2.type = 'sine'
        gain2.gain.setValueAtTime(0.5, actx2.currentTime)
        gain2.gain.exponentialRampToValueAtTime(0.01, actx2.currentTime + 0.3)
        osc2.start(actx2.currentTime)
        osc2.stop(actx2.currentTime + 0.3)
      }, 250)
    } catch (e) { /* ignore */ }
  }, [])

  // Update the ring SVG whenever remaining changes
  useEffect(() => {
    const ring = document.getElementById('timerRing')
    if (ring) {
      const offset = CIRCUMFERENCE * (1 - remaining / totalSec)
      ring.style.strokeDashoffset = offset
    }
  }, [remaining, totalSec])

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  const tick = useCallback(() => {
    intervalRef.current = setInterval(() => {
      if (pausedRef.current) return
      setRemaining(prev => prev - 1)
    }, 1000)
  }, [])

  // When remaining hits 0, stop
  useEffect(() => {
    if (running && remaining <= 0) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
      setRunning(false)
      setPaused(false)
      pausedRef.current = false
      playBeep()
      showToast('⏰', 'Workout timer finished! Great job!')
    }
  }, [remaining, running, playBeep, showToast])

  const startTimer = useCallback(() => {
    if (paused) {
      setPaused(false)
      pausedRef.current = false
      return
    }
    if (running) return
    if (remaining <= 0) { showToast('⏱️', 'Timer finished! Reset to start again.'); return }
    setRunning(true)
    tick()
  }, [paused, running, remaining, showToast, tick])

  const pauseTimer = useCallback(() => {
    if (!running) return
    setPaused(v => {
      const next = !v
      pausedRef.current = next
      return next
    })
  }, [running])

  const resetTimer = useCallback(() => {
    clearInterval(intervalRef.current)
    intervalRef.current = null
    setRunning(false)
    setPaused(false)
    pausedRef.current = false
    setRemaining(totalSec)
  }, [totalSec])

  const applyCustom = useCallback(() => {
    const total = customMin * 60 + customSec
    if (total < 1) { showToast('⚠️', 'Set at least 1 second'); return }
    if (total > 3600) { showToast('⚠️', 'Max 60 minutes'); return }
    setTimer(total)
  }, [customMin, customSec, showToast])

  const setTimer = useCallback((sec) => {
    if (running) return
    setTotalSec(sec)
    setRemaining(sec)
    setPaused(false)
    setCustomMin(Math.floor(sec / 60))
    setCustomSec(sec % 60)
  }, [running])

  return (
    <section className="section-reveal" id="timer" style={{ maxWidth: 700, margin: '0 auto' }}>
      <div className="section-badge">⏱️ Timer</div>
      <h2 style={{ textAlign: 'center' }}>Workout <span className="ac">Timer</span></h2>
      <div className="sd" style={{ textAlign: 'center' }}>Set your interval and crush your sets.</div>
      <div className="timer-display">
        <div className="timer-ring-wrap">
          <svg width="100%" height="100%" viewBox="0 0 220 220">
            <defs>
              <linearGradient id="timerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--orange)" />
                <stop offset="100%" stopColor="var(--pink)" />
              </linearGradient>
            </defs>
            <circle className="timer-ring-bg" cx="110" cy="110" r="100" />
            <circle className="timer-ring-fg" id="timerRing" cx="110" cy="110" r="100" />
          </svg>
          <div className="timer-time">
            <div className="tt-display">{formatTime(remaining)}</div>
            <div className="tt-label">Minutes</div>
          </div>
        </div>
        <div className="timer-presets">
          {PRESETS.map(p => (
            <button
              key={p.sec}
              className={totalSec === p.sec ? 'active' : ''}
              onClick={() => setTimer(p.sec)}
            >{p.label}</button>
          ))}
        </div>
        <div className="timer-custom">
          <input type="number" value={customMin} min="0" max="99"
            onChange={e => setCustomMin(Number(e.target.value) || 0)} /> <span>min</span>
          <input type="number" value={customSec} min="0" max="59"
            onChange={e => setCustomSec(Number(e.target.value) || 0)} /> <span>sec</span>
          <button className="btn btn-ghost btn-sm" onClick={applyCustom}>Set</button>
        </div>
        <div className="timer-controls">
          <button className="btn btn-primary btn-sm" onClick={startTimer} disabled={running && !paused}>
            {running && !paused ? '▶ Running' : paused ? '▶ Resume' : '▶ Start'}
          </button>
          <button className="btn btn-ghost btn-sm" onClick={pauseTimer} disabled={!running}>
            {paused ? '▶ Resume' : '⏸ Pause'}
          </button>
          <button className="btn btn-ghost btn-sm" onClick={resetTimer}>↻ Reset</button>
        </div>
        <div className="timer-status">
          {!running && !paused ? 'Ready' : paused ? '⏸ Paused' : '▶ Running'}
        </div>
      </div>
    </section>
  )
}
