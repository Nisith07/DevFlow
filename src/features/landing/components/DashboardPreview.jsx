import { useRef, useEffect, useState } from 'react'
import { motion, useInView, animate } from 'framer-motion'
import { LayoutDashboard, GitBranch, CalendarDays, BarChart3, Focus, Settings, Activity, TrendingUp } from 'lucide-react'

/* ─── Animated counter ─── */
function Counter({ to, suffix = '' }) {
  const [val, setVal] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    const ctrl = animate(0, to, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setVal(Math.round(v)),
    })
    return () => ctrl.stop()
  }, [inView, to])

  return <span ref={ref}>{val}{suffix}</span>
}

/* ─── Animated bar chart ─── */
function BarChart({ bars }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  return (
    <div ref={ref} style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 100, padding: '0 4px' }}>
      {bars.map((h, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, height: '100%', justifyContent: 'flex-end' }}>
          <motion.div
            initial={{ scaleY: 0 }}
            animate={inView ? { scaleY: 1 } : { scaleY: 0 }}
            transition={{ duration: 0.7, delay: 0.3 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
            style={{
              width: '100%',
              height: `${h}%`,
              background: i === 4 ? 'var(--lp-orange)' : i === 5 ? 'rgba(230,126,34,0.35)' : 'rgba(230,126,34,0.15)',
              borderRadius: '4px 4px 0 0',
              transformOrigin: 'bottom',
            }}
          />
          <span style={{ fontSize: 9.5, color: 'rgba(29,29,31,0.35)', fontFamily: 'var(--font-mono)', textAlign: 'center' }}>{days[i]}</span>
        </div>
      ))}
    </div>
  )
}

const SIDEBAR_NAV = [
  { icon: LayoutDashboard, label: 'Dashboard', active: true },
  { icon: GitBranch, label: 'GitHub', active: false },
  { icon: CalendarDays, label: 'Planner', active: false },
  { icon: BarChart3, label: 'Analytics', active: false },
  { icon: Focus, label: 'Focus Mode', active: false },
  { icon: Settings, label: 'Settings', active: false },
]

const STATS = [
  { label: 'Tasks', value: 32, suffix: '', change: '+4 today' },
  { label: 'Commits', value: 56, suffix: '', change: '+12 today' },
  { label: 'Streak', value: 7, suffix: ' days', change: 'Personal best' },
  { label: 'Focus Time', value: 4, suffix: 'h 30m', change: '+2h vs avg' },
]

const ACTIVITY = [
  { label: 'Python Exercises', time: '2m ago', color: '#3b82f6' },
  { label: 'Gemini PR#46', time: '18m ago', color: '#22c55e' },
  { label: 'Closed issue #118', time: '1h ago', color: '#f59e0b' },
  { label: 'Deployed to production', time: '3h ago', color: '#a855f7' },
]

export default function DashboardPreview() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-60px' })

  return (
    <section className="lp-dashboard-section" id="dashboard-preview" ref={sectionRef}>
      <div className="lp-wrap">

        {/* Section head */}
        <motion.div
          className="lp-section-head"
          style={{ textAlign: 'left', maxWidth: 560, marginBottom: 52 }}
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div className="lp-label">
            <BarChart3 size={12} />
            Visualized Everything
          </div>
          <h2 className="lp-h2">
            A workspace that <em>thinks with you.</em>
          </h2>
          <p className="lp-section-sub">
            From code to clarity, DevFlow gives you daily awareness of your entire development workflow.
          </p>
        </motion.div>

        {/* Dashboard mockup */}
        <motion.div
          className="lp-dashboard-mockup"
          initial={{ opacity: 0, y: 60, scale: 0.96 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Top chrome bar */}
          <div className="lp-dashboard-header">
            <div className="lp-dashboard-dots">
              <span style={{ background: '#FF5F56' }} />
              <span style={{ background: '#FFBD2E' }} />
              <span style={{ background: '#27C93F' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 22, height: 22, borderRadius: 5, background: 'linear-gradient(135deg,#E67E22,#F0A050)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 11, fontWeight: 900, color: '#fff' }}>D</span>
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(29,29,31,0.6)' }}>DevFlow</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', background: '#fff', borderRadius: 8, border: '1px solid var(--lp-border)', boxShadow: 'var(--lp-shadow-xs)' }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'linear-gradient(135deg,rgba(230,126,34,0.2),rgba(230,126,34,0.08))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: 'var(--lp-orange)' }}>N</div>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(29,29,31,0.7)' }}>Nisith</span>
              </div>
            </div>
          </div>

          {/* Inner: sidebar + main */}
          <div className="lp-db-inner">

            {/* Sidebar */}
            <div className="lp-db-sidebar">
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(29,29,31,0.3)', padding: '0 12px', marginBottom: 8 }}>Navigation</div>
              {SIDEBAR_NAV.map(({ icon: Icon, label, active }) => (
                <div key={label} className={`lp-db-sidebar-item ${active ? 'active' : ''}`}>
                  <Icon size={16} />
                  <span>{label}</span>
                </div>
              ))}
            </div>

            {/* Main content */}
            <div className="lp-db-main">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: 'var(--lp-charcoal)' }}>Overview</h3>
                <div style={{ display: 'flex', gap: 8 }}>
                  <span style={{ fontSize: 11, padding: '4px 10px', background: 'rgba(230,126,34,0.08)', color: 'var(--lp-orange)', borderRadius: 6, fontWeight: 600, cursor: 'default' }}>This Week</span>
                  <span style={{ fontSize: 11, padding: '4px 10px', background: 'var(--lp-gray)', color: 'rgba(29,29,31,0.5)', borderRadius: 6, fontWeight: 500, cursor: 'default' }}>This Month</span>
                </div>
              </div>

              {/* Stat cards */}
              <div className="lp-db-stats-row">
                {STATS.map((s, i) => (
                  <motion.div
                    key={s.label}
                    className="lp-db-stat-card"
                    initial={{ opacity: 0, y: 16 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                  >
                    <div className="lp-db-stat-label">{s.label}</div>
                    <div className="lp-db-stat-value">
                      <Counter to={s.value} suffix={s.suffix} />
                    </div>
                    <div className="lp-db-stat-change">{s.change}</div>
                  </motion.div>
                ))}
              </div>

              {/* Chart + activity */}
              <div className="lp-db-row">

                {/* Productivity chart */}
                <div style={{ background: '#fff', border: '1px solid var(--lp-border)', borderRadius: 14, padding: '18px 20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--lp-charcoal)' }}>Productivity</div>
                      <div style={{ fontSize: 11, color: 'rgba(29,29,31,0.4)', marginTop: 2 }}>Focus hours per day</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 600, color: '#22c55e' }}>
                      <TrendingUp size={13} />
                      +18% vs last week
                    </div>
                  </div>
                  <BarChart bars={[48, 62, 55, 78, 92, 38, 70]} />
                </div>

                {/* Recent activity */}
                <div style={{ background: '#fff', border: '1px solid var(--lp-border)', borderRadius: 14, padding: '18px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
                    <Activity size={14} color="var(--lp-orange)" />
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--lp-charcoal)' }}>Recent Activity</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {ACTIVITY.map((a, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 12 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: 0.8 + i * 0.1, duration: 0.4 }}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ width: 8, height: 8, borderRadius: '50%', background: a.color, flexShrink: 0, display: 'block' }} />
                          <span style={{ fontSize: 12.5, fontWeight: 500, color: 'rgba(29,29,31,0.75)' }}>{a.label}</span>
                        </div>
                        <span style={{ fontSize: 11, color: 'rgba(29,29,31,0.35)', fontFamily: 'var(--font-mono)', flexShrink: 0 }}>{a.time}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

          </div>
        </motion.div>

        {/* Floating analytics badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
          transition={{ delay: 1.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'absolute',
            bottom: 60,
            right: 40,
            background: 'var(--lp-orange)',
            color: '#fff',
            borderRadius: 16,
            padding: '14px 18px',
            boxShadow: 'var(--lp-shadow-orange)',
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <BarChart3 size={14} />
            <span style={{ fontSize: 12, fontWeight: 700 }}>Flow Score</span>
          </div>
          <span style={{ fontSize: 26, fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1 }}>
            <Counter to={92} suffix="%" />
          </span>
          <span style={{ fontSize: 10, opacity: 0.8 }}>↑ 12% this week</span>
        </motion.div>

      </div>
    </section>
  )
}
