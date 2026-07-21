import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { CheckCircle2, GitBranch, Sparkles, Clock, BarChart3 } from 'lucide-react'

const FEATURES = [
  { icon: GitBranch, text: 'Seamless GitHub sync' },
  { icon: Sparkles, text: 'AI suggestions that actually help' },
  { icon: Clock, text: 'Track progress and milestones' },
  { icon: BarChart3, text: 'Beautiful analytics that make sense' },
]

/* ─── Mini Overview card ─── */
function MiniDashboard() {
  return (
    <div style={{
      background: '#fff',
      border: '1px solid var(--lp-border)',
      borderRadius: 20,
      overflow: 'hidden',
      boxShadow: 'var(--lp-shadow-xl)',
      width: '100%',
      maxWidth: 460,
    }}>
      {/* Header */}
      <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--lp-border)', background: 'rgba(252,250,247,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 5 }}>
          <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#FF5F56', display: 'block' }} />
          <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#FFBD2E', display: 'block' }} />
          <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#27C93F', display: 'block' }} />
        </div>
        <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(29,29,31,0.4)' }}>Workspace — Overview</span>
        <div style={{ width: 56 }} />
      </div>

      <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {[
            { label: 'Tasks', value: '32' },
            { label: 'Commits', value: '56' },
            { label: 'Focus', value: '4h 30m' },
          ].map(s => (
            <div key={s.label} style={{ background: 'var(--lp-gray)', borderRadius: 10, padding: '10px 12px', border: '1px solid var(--lp-border)' }}>
              <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(29,29,31,0.4)', marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--lp-charcoal)', letterSpacing: '-0.03em' }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Activity list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(29,29,31,0.35)' }}>Recent Activity</div>
          {[
            { label: 'Python Exercises', time: '2m ago', dot: '#3b82f6' },
            { label: 'Gemini PR#46 merged', time: '18m ago', dot: '#22c55e' },
            { label: 'Closed issue #118', time: '1h ago', dot: '#f59e0b' },
            { label: 'Deployed to prod', time: '3h ago', dot: '#a855f7' },
          ].map((a, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 10px', background: 'rgba(29,29,31,0.02)', borderRadius: 8, border: '1px solid rgba(29,29,31,0.04)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: a.dot, display: 'block', flexShrink: 0 }} />
                <span style={{ fontSize: 12, fontWeight: 500, color: 'rgba(29,29,31,0.7)' }}>{a.label}</span>
              </div>
              <span style={{ fontSize: 10, color: 'rgba(29,29,31,0.35)', fontFamily: 'var(--font-mono)' }}>{a.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function About() {
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true, margin: '-80px' })

  return (
    <section className="lp-section" id="about" ref={containerRef}>
      <div className="lp-wrap">
        <div className="lp-about-grid">

          {/* Left: copy */}
          <motion.div
            className="lp-about-copy"
            initial={{ opacity: 0, x: -32 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="lp-label">Visualized Everything</div>
            <h2 className="lp-h2">
              A workspace that<br />
              <em>thinks with you.</em>
            </h2>
            <p className="lp-section-sub" style={{ marginBottom: 32 }}>
              From code to clarity, DevFlow gives you daily awareness across your entire development workflow — and suggestions that actually make sense.
            </p>

            <div className="lp-about-features">
              {FEATURES.map(({ icon: Icon, text }, i) => (
                <motion.div
                  key={text}
                  className="lp-about-feature-row"
                  initial={{ opacity: 0, x: -16 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3 + i * 0.12, duration: 0.5 }}
                >
                  <div className="lp-about-feature-icon">
                    <CheckCircle2 size={13} />
                  </div>
                  <span className="lp-about-feature-text">{text}</span>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.8, duration: 0.5 }}
              style={{ marginTop: 36 }}
            >
              <a
                href="#dashboard-preview"
                className="lp-btn lp-btn-primary"
                onClick={e => { e.preventDefault(); document.getElementById('dashboard-preview')?.scrollIntoView({ behavior: 'smooth' }) }}
                style={{ display: 'inline-flex', padding: '12px 24px', fontSize: 14 }}
              >
                Explore Dashboard →
              </a>
            </motion.div>
          </motion.div>

          {/* Right: mini dashboard visual */}
          <motion.div
            className="lp-about-visual"
            initial={{ opacity: 0, x: 32 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <MiniDashboard />
          </motion.div>

        </div>
      </div>
    </section>
  )
}
