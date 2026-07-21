import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Sparkles, Clock, GitBranch, Focus, CalendarDays, BarChart3 } from 'lucide-react'

const FEATURES = [
  { icon: Sparkles, label: 'AI-Powered Insights', desc: 'Smart suggestions that learn from your coding patterns and habits.' },
  { icon: Clock, label: 'Task & Time Tracking', desc: 'Track exactly where your hours go — automatically from git activity.' },
  { icon: GitBranch, label: 'GitHub Integration', desc: 'Seamless sync with commits, PRs, and code reviews in real time.' },
  { icon: Focus, label: 'Focus Mode', desc: 'One-click deep work sessions that block distractions completely.' },
  { icon: CalendarDays, label: 'Daily Planner', desc: 'Auto-generated daily plans based on deadlines and priorities.' },
  { icon: BarChart3, label: 'Analytics Dashboard', desc: 'Beautiful charts showing your productivity trends over time.' },
]

export default function Features() {
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true, margin: '-80px' })
  const [hovered, setHovered] = useState(null)

  return (
    <section className="lp-features-section" id="features" ref={containerRef} style={{ background: 'var(--lp-gray)' }}>
      <div className="lp-wrap">

        {/* Section head */}
        <motion.div
          style={{ textAlign: 'center', marginBottom: 64 }}
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="lp-label">Packed Features</div>
          <h2 className="lp-h2" style={{ margin: '0 auto 16px' }}>
            Everything you need in{' '}
            <em>one workspace</em>
          </h2>
          <p className="lp-section-sub" style={{ maxWidth: 520, margin: '0 auto' }}>
            All the tools, insights, and automation to help you stay in flow.
          </p>
        </motion.div>

        {/* Feature grid */}
        <div className="lp-features-grid">
          {FEATURES.map((feat, i) => {
            const Icon = feat.icon
            return (
              <motion.div
                key={feat.label}
                className="lp-feat-pill"
                initial={{ opacity: 0, y: 28, scale: 0.95 }}
                animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.08 + i * 0.09, ease: [0.16, 1, 0.3, 1] }}
                onHoverStart={() => setHovered(i)}
                onHoverEnd={() => setHovered(null)}
                style={{ cursor: 'default' }}
              >
                <div className="lp-feat-pill-icon">
                  <Icon size={20} />
                </div>
                <div>
                  <div className="lp-feat-pill-label">{feat.label}</div>
                  <motion.div
                    style={{ fontSize: 12, color: 'rgba(29,29,31,0.5)', lineHeight: 1.45, marginTop: 3, overflow: 'hidden' }}
                    initial={false}
                    animate={{ height: hovered === i ? 'auto' : 0, opacity: hovered === i ? 1 : 0 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                  >
                    {feat.desc}
                  </motion.div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Center visual "platform pill" */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{
            marginTop: 64,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div style={{
            background: '#FFFFFF',
            borderRadius: 28,
            padding: '36px 56px',
            border: '1px solid var(--lp-border)',
            boxShadow: 'var(--lp-shadow-xl)',
            display: 'flex',
            gap: 40,
            alignItems: 'center',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}>
            {[
              { num: '32', label: 'Tasks tracked', suffix: '' },
              { num: '4h 30m', label: 'Focus time today', suffix: '' },
              { num: '23', label: 'Git commits synced', suffix: '' },
              { num: '92', label: 'Flow score', suffix: '%' },
            ].map((stat, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '0 8px' }}>
                <div style={{ fontSize: 36, fontWeight: 800, color: 'var(--lp-charcoal)', letterSpacing: '-0.04em', lineHeight: 1 }}>
                  {stat.num}<span style={{ color: 'var(--lp-orange)' }}>{stat.suffix}</span>
                </div>
                <div style={{ fontSize: 12, color: 'rgba(29,29,31,0.45)', marginTop: 6, fontWeight: 500 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  )
}
