import { useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Sparkles, Calendar, Zap } from 'lucide-react'

const STEPS = [
  {
    num: '01',
    icon: Sparkles,
    title: 'Connect your tools',
    desc: 'DevFlow securely hooks up to your GitHub, calendar, and task manager in seconds. No complex config necessary.',
  },
  {
    num: '02',
    icon: Calendar,
    title: 'Draft your standup',
    desc: 'Each morning, DevFlow automatically parses your commits and drafts your standup notes. Edit and share in one click.',
  },
  {
    num: '03',
    icon: Zap,
    title: 'Maximize your flow',
    desc: 'Time-block your day, initiate focus timers, and suppress distractions. Reclaim your focus hours naturally.',
  },
]

export default function HowItWorks() {
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true, margin: '-100px' })

  return (
    <section className="lp-section" id="how-it-works" ref={containerRef}>
      <div className="lp-wrap">

        <div className="lp-section-head lp-center">
          <div className="lp-label">
            Workflow
          </div>
          <h2 className="lp-h2">
            Three steps to a <em>perfectly planned</em> day
          </h2>
          <p className="lp-section-sub">
            DevFlow integrates seamlessly into your daily routine. Designed around how developers actually work — not how project managers report.
          </p>
        </div>

        <div className="lp-hiw-grid">
          {STEPS.map((step, idx) => {
            const IconComponent = step.icon
            return (
              <motion.div
                className="lp-hiw-card"
                key={step.num}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: idx * 0.2, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{
                  y: -8,
                  borderColor: 'rgba(230, 126, 34, 0.3)',
                  boxShadow: '0 20px 40px rgba(230, 126, 34, 0.05)'
                }}
              >
                <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div className="lp-hiw-number">
                    {step.num}
                  </div>
                  <div style={{ background: 'rgba(230, 126, 34, 0.08)', padding: 8, borderRadius: 8, color: 'var(--lp-orange)' }}>
                    <IconComponent size={20} />
                  </div>
                </div>
                <h3 className="lp-hiw-title">{step.title}</h3>
                <p className="lp-hiw-desc">{step.desc}</p>
              </motion.div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
