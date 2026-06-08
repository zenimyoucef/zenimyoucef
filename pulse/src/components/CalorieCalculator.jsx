import { useState } from 'react'

export default function CalorieCalculator() {
  const [age, setAge] = useState(25)
  const [gender, setGender] = useState('male')
  const [height, setHeight] = useState(175)
  const [weight, setWeight] = useState(80)
  const [activity, setActivity] = useState(1.55)
  const [results, setResults] = useState(null)

  const calcTDEE = () => {
    let bmr
    if (gender === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161
    }
    const tdee = Math.round(bmr * activity)
    const cut = Math.round(tdee * 0.8)
    const bulk = Math.round(tdee * 1.15)
    setResults({ tdee, cut, bulk })
  }

  return (
    <section className="section-reveal" id="calories" style={{ maxWidth: 600, margin: '0 auto' }}>
      <div className="section-badge">🔥 Calories</div>
      <h2 style={{ textAlign: 'center' }}>TDEE <span className="ac">Calculator</span></h2>
      <div className="sd" style={{ textAlign: 'center' }}>
        Find your maintenance, cut, and bulk calorie targets using the Mifflin-St Jeor formula.
      </div>
      <div className="cal-box">
        <div className="cal-row">
          <div className="cal-field">
            <label>Age</label>
            <input type="number" value={age} min="10" max="100" onChange={e => setAge(Number(e.target.value))} />
          </div>
          <div className="cal-field">
            <label>Gender</label>
            <select value={gender} onChange={e => setGender(e.target.value)}>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
        </div>
        <div className="cal-row">
          <div className="cal-field">
            <label>Height (cm)</label>
            <input type="number" value={height} min="100" max="250" onChange={e => setHeight(Number(e.target.value))} />
          </div>
          <div className="cal-field">
            <label>Weight (kg)</label>
            <input type="number" value={weight} min="20" max="300" onChange={e => setWeight(Number(e.target.value))} />
          </div>
        </div>
        <div className="cal-field" style={{ marginBottom: '.8rem' }}>
          <label>Activity Level</label>
          <select value={activity} onChange={e => setActivity(Number(e.target.value))}>
            <option value="1.2">Sedentary (little or no exercise)</option>
            <option value="1.375">Light (1-3 days/week)</option>
            <option value="1.55">Moderate (3-5 days/week)</option>
            <option value="1.725">Very Active (6-7 days/week)</option>
            <option value="1.9">Extreme (2x/day, manual labor)</option>
          </select>
        </div>
        <button className="btn btn-primary btn-sm" onClick={calcTDEE} style={{ width: '100%', justifyContent: 'center' }}>
          Calculate TDEE
        </button>
        {results && (
          <div className="cal-results" style={{ display: 'grid' }}>
            <div className="cal-result-card">
              <div className="cr-label">Maintenance</div>
              <div className="cr-value maintenance">{results.tdee}</div>
              <div className="cr-sub">kcal/day</div>
            </div>
            <div className="cal-result-card">
              <div className="cr-label">Cut (-20%)</div>
              <div className="cr-value cut">{results.cut}</div>
              <div className="cr-sub">kcal/day</div>
            </div>
            <div className="cal-result-card">
              <div className="cr-label">Bulk (+15%)</div>
              <div className="cr-value bulk">{results.bulk}</div>
              <div className="cr-sub">kcal/day</div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
