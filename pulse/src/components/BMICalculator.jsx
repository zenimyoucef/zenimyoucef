import { useState } from 'react'
import { useToast } from './Toast'

export default function BMICalculator() {
  const showToast = useToast()
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [result, setResult] = useState(null)

  const calcBMI = () => {
    const h = Number(height) / 100
    const w = Number(weight)
    if (!h || !w) { showToast('⚠️', 'Enter height and weight'); return }
    const b = w / (h * h)
    let cat = '', color = ''
    if (b < 18.5) { cat = 'Underweight'; color = 'var(--green)' }
    else if (b < 25) { cat = 'Normal — Great!'; color = 'var(--green)' }
    else if (b < 30) { cat = 'Overweight — Try HIIT!'; color = 'var(--orange)' }
    else { cat = 'Obese — We can help!'; color = 'var(--pink)' }
    setResult({ bmi: b.toFixed(1), cat, color })
  }

  return (
    <section className="section-reveal" id="bmi" style={{ maxWidth: 500, margin: '0 auto' }}>
      <div className="section-badge">📊 BMI</div>
      <h2 style={{ textAlign: 'center' }}>Body Mass <span className="ac">Index</span></h2>
      <div className="sd" style={{ textAlign: 'center' }}>Check your BMI and get a recommended program.</div>
      <div className="bmi-box">
        <input type="number" placeholder="Height (cm)" value={height} onChange={e => setHeight(e.target.value)} />
        <input type="number" placeholder="Weight (kg)" value={weight} onChange={e => setWeight(e.target.value)} />
        <button onClick={calcBMI}>→</button>
      </div>
      <div className="bmi-res" id="bmiRes">
        {result ? (
          <>
            <div className="bmi-n">{result.bmi}</div>
            <div style={{ color: result.color, fontSize: '.72rem', fontWeight: 600 }}>{result.cat}</div>
          </>
        ) : (
          <><div className="bmi-n">—</div><div style={{ fontSize: '.68rem', color: 'var(--text-muted)' }}>Enter your height & weight</div></>
        )}
      </div>
    </section>
  )
}
