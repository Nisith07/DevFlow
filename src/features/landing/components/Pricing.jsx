import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

const PLANS = [
  {
    name: "Individual",
    price: "$0",
    period: "forever",
    description: "Perfect for solo developers who want to synchronize local commits and structure standup drafts.",
    features: [
      "1 connected GitHub repository",
      "Automated standup notes",
      "Local developer timeline",
      "Core focus session metrics",
      "Standard community support"
    ],
    buttonText: "Start Free",
    popular: false
  },
  {
    name: "Pro Developer",
    price: "$12",
    period: "per month",
    description: "Designed for engineering professionals who want advanced AI copilot insights and deep flow analysis.",
    features: [
      "Unlimited repositories",
      "Priority Standup Copilot",
      "Personal calendar integrations",
      "Advanced flow analytics report",
      "Exclusive dev tools integrations",
      "Priority technical support"
    ],
    buttonText: "Upgrade to Pro",
    popular: true
  },
  {
    name: "Engineering Team",
    price: "$39",
    period: "per seat / mo",
    description: "For teams who want to align their morning standups automatically without daily alignment calls.",
    features: [
      "Everything in Pro plan",
      "Shared team timeline boards",
      "Automated Slack standup feed",
      "Aggregated efficiency analytics",
      "Enterprise SAML/SSO sign-on",
      "Dedicated account manager"
    ],
    buttonText: "Contact Sales",
    popular: false
  }
]

export default function Pricing() {
  return (
    <section className="lp-section" id="pricing">
      <div className="lp-wrap">
        
        <div className="lp-section-head lp-center">
          <div className="lp-label">Pricing</div>
          <h2 className="lp-h2">Sleek plans for <em>every scope</em></h2>
          <p className="lp-section-sub">
            Free for individuals, scalable for teams. Cancel or modify plans easily at any point.
          </p>
        </div>

        <div className="lp-pricing-grid">
          {PLANS.map((plan, idx) => (
            <motion.div
              key={plan.name}
              className={`lp-pricing-card ${plan.popular ? 'popular' : ''}`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
            >
              {plan.popular && (
                <div className="lp-pricing-badge">
                  Popular Choice
                </div>
              )}
              
              <div>
                <div className="lp-pricing-header">
                  <h3 className="lp-pricing-name">{plan.name}</h3>
                  <div className="lp-pricing-price">
                    {plan.price} <span>/ {plan.period}</span>
                  </div>
                  <p style={{ fontSize: '13.5px', color: 'rgba(29, 29, 31, 0.6)', margin: 0, lineHeight: 1.5 }}>
                    {plan.description}
                  </p>
                </div>

                <div style={{ height: 1, background: 'rgba(29, 29, 31, 0.08)', margin: '24px 0' }} />

                <ul className="lp-pricing-features">
                  {plan.features.map((feature, fIdx) => (
                    <li key={fIdx} className="lp-pricing-feature">
                      <Check size={16} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button className={`lp-btn ${plan.popular ? 'lp-btn-primary' : 'lp-btn-secondary'}`} style={{ width: '100%' }}>
                {plan.buttonText}
              </button>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
