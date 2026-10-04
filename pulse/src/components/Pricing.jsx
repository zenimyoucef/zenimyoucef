import { PRICING_PLANS } from '../data/content'
import { useToast } from './Toast'

export default function Pricing() {
  const showToast = useToast()

  return (
    <section className="section-reveal" id="pricing" style={{ maxWidth: '100%', padding: '5rem 2rem' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div className="section-badge">💰 Pricing</div>
        <h2>Choose Your <span className="ac">Plan</span></h2>
        <div className="sd">Flexible memberships. Cancel anytime. No hidden fees.</div>
      </div>
      <div className="price-strip" style={{ paddingLeft: 'calc((100% - 1100px) / 2)' }}>
        {PRICING_PLANS.map((plan, i) => (
          <div className={`pricing-card ${plan.featured ? 'feat' : ''}`} key={i}>
            <div className="pc-name">{plan.name}</div>
            <div className="pc-price">{plan.price.toLocaleString('fr-DZ')} DZD</div>
            <div className="pc-period">/شهر</div>
            <ul className="pc-features">
              {plan.features.map((f, j) => <li key={j}>{f}</li>)}
            </ul>
            <button
              className={`btn ${plan.featured ? 'btn-primary' : 'btn-ghost'} btn-sm`}
              onClick={() => showToast(plan.featured ? '🔥' : '✅', `${plan.name} plan selected!`)}
            >
              Start
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}
