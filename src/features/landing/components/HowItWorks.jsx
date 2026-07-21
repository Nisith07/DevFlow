import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Link2, Brain, ListChecks } from 'lucide-react'

const STEPS = [
  {
    num: '01',
    title: 'Connect',
    desc: 'Link your GitHub and tools. We pull your data securely.',
    icons: [Link2],
  },
  {
    num: '02',
    title: 'Analyze',
    desc: 'AI analyzes your work, commits and pulls what needs attention.',
    icons: [Brain],
  },
  {
    num: '03',
    title: 'Plan Your Day',
    desc: 'Get a prioritized list of tasks so you know exactly what to do next.',
    icons: [ListChecks],
  },
]

/* ─── Individual Step Card matching reference ─── */
function StepCard({ step, idx, isInView }) {
  const Icon = step.icons[0]
  return (
    <motion.div
      className="lp-hiw-card"
      initial={{ opacity: 0, y: 28 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: 0.1 + idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -8, boxShadow: '0 24px 56px rgba(29,29,31,0.1), 0 6px 18px rgba(29,29,31,0.06)', borderColor: 'rgba(230,126,34,0.18)' }}
    >
      {/* Top: icon ring + step number */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <div className="lp-hiw-icon">
          <Icon size={20} />
        </div>
        <span className="lp-hiw-number">{step.num}</span>
      </div>

      {/* Text */}
      <div>
        <h3 className="lp-hiw-title">{step.title}</h3>
        <p className="lp-hiw-desc">{step.desc}</p>
      </div>
    </motion.div>
  )
}

export default function HowItWorks() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="lp-section" id="how-it-works" ref={ref}>
      <div className="lp-wrap">
        <motion.div
          className="lp-section-head lp-center"
          initial={{ opacity: 0, y: 22 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="lp-h2">
            How <em style={{ color: 'var(--lp-orange)', fontStyle: 'normal' }}>DevFlow</em> works
          </h2>
          <p className="lp-section-sub">
            A simple 3-step flow that makes your day productive from the moment you open your laptop.
          </p>
        </motion.div>

        <div className="lp-hiw-grid">
          {STEPS.map((step, idx) => (
            <StepCard key={step.num} step={step} idx={idx} isInView={isInView} />
          ))}
        </div>
      </div>
    </section>
  )
}
