import { useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { GitPullRequest, Sparkles, LayoutGrid, BarChart3, Clock, Lock } from 'lucide-react'

export default function Features() {
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true, margin: '-100px' })

  return (
    <section className="lp-section" id="features" ref={containerRef}>
      <div className="lp-wrap">

        <div className="lp-section-head">
          <div className="lp-label">
            Capabilities
          </div>
          <h2 className="lp-h2">
            Built for <em>absolute precision</em>
          </h2>
          <p className="lp-section-sub">
            Say goodbye to clunky, heavy developer tracking tools. DevFlow offers a set of lightweight, beautifully tailored capabilities designed to keep you in flow.
          </p>
        </div>

        <div className="lp-features-showcase">

          {/* BENTO CARD 1: GITHUB INTEGRATION (LARGE) */}
          <motion.div
            className="lp-feat-card lp-feat-large"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <div className="lp-feat-body">
              <div className="lp-feat-header">
                <div className="lp-feat-icon-wrapper">
                  <GitPullRequest size={20} />
                </div>
                <h3 className="lp-feat-title">Seamless GitHub Sync</h3>
                <p className="lp-feat-desc">
                  Your code speaks for itself. DevFlow automatically reads your commits, merges, and PR branches to construct your task list without manual input.
                </p>
              </div>
            </div>

            {/* Visual GitHub Timeline element */}
            <div className="lp-feat-visual" style={{ background: '#FAF9F6' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: '440px', background: '#FFFFFF', padding: 20, borderRadius: 16, border: '1px solid rgba(29, 29, 31, 0.06)', boxShadow: 'var(--lp-shadow-sm)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(29, 29, 31, 0.05)', paddingBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#27C93F' }} />
                    <span style={{ fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>Repo: devflow-api</span>
                  </div>
                  <span style={{ fontSize: 10, background: 'rgba(29, 29, 31, 0.05)', padding: '2px 8px', borderRadius: 10 }}>Active branch: main</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                    <div>
                      <span style={{ fontWeight: 600, color: 'var(--lp-orange)' }}>feat(auth):</span> Added JWT validation layer
                    </div>
                    <span style={{ color: 'rgba(29, 29, 31, 0.4)', fontFamily: 'var(--font-mono)' }}>2m ago</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                    <div>
                      <span style={{ fontWeight: 600, color: 'var(--lp-orange)' }}>fix(db):</span> Resolved connection pool timeout issue
                    </div>
                    <span style={{ color: 'rgba(29, 29, 31, 0.4)', fontFamily: 'var(--font-mono)' }}>1h ago</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* BENTO CARD 2: AI STANDUP COPILOT (SMALL) */}
          <motion.div
            className="lp-feat-card lp-feat-small"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
          >
            <div className="lp-feat-body">
              <div className="lp-feat-header">
                <div className="lp-feat-icon-wrapper">
                  <Sparkles size={20} />
                </div>
                <h3 className="lp-feat-title">AI Copilot</h3>
                <p className="lp-feat-desc">
                  Let AI write your daily standup, organize your milestones, and flag blocker issues before they impact deployment schedules.
                </p>
              </div>
            </div>

            {/* Visual AI Suggestion Widget */}
            <div className="lp-feat-visual" style={{ background: '#FAF9F6' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%', background: '#FFFFFF', padding: 20, borderRadius: 16, border: '1px solid rgba(29, 29, 31, 0.06)', boxShadow: 'var(--lp-shadow-sm)' }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--lp-orange)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>AI Assistant suggestion</span>
                <div style={{ padding: '8px 12px', background: 'rgba(230, 126, 34, 0.05)', border: '1px solid rgba(230, 126, 34, 0.15)', borderRadius: 10, fontSize: 12, lineHeight: 1.4 }}>
                  Consider grouping your 3 local auth commits into a single Pull Request.
                </div>
              </div>
            </div>
          </motion.div>

          {/* BENTO CARD 3: TASK BOARDS (SMALL) */}
          <motion.div
            className="lp-feat-card lp-feat-small"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
            style={{ marginTop: 24 }}
          >
            <div className="lp-feat-body">
              <div className="lp-feat-header">
                <div className="lp-feat-icon-wrapper">
                  <LayoutGrid size={20} />
                </div>
                <h3 className="lp-feat-title">Minimalist Task Boards</h3>
                <p className="lp-feat-desc">
                  A pure, Kanban-style layout structured for focus. Zero management fluff, only clear next actions.
                </p>
              </div>
            </div>

            {/* Visual Task board snippet */}
            <div className="lp-feat-visual" style={{ background: '#FAF9F6' }}>
              <div style={{ display: 'flex', gap: 10, width: '100%' }}>
                <div style={{ flex: 1, background: '#FFFFFF', padding: '12px 14px', borderRadius: 12, border: '1px solid rgba(29, 29, 31, 0.06)' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(29,29,31,0.4)', marginBottom: 8 }}>TO DO</div>
                  <div style={{ fontSize: 11, background: 'var(--lp-gray)', padding: '6px 8px', borderRadius: 6, fontWeight: 600 }}>Configure OAuth</div>
                </div>
                <div style={{ flex: 1, background: '#FFFFFF', padding: '12px 14px', borderRadius: 12, border: '1px solid rgba(29, 29, 31, 0.06)' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(29,29,31,0.4)', marginBottom: 8 }}>IN FLOW</div>
                  <div style={{ fontSize: 11, background: 'rgba(230,126,34,0.1)', color: 'var(--lp-orange)', padding: '6px 8px', borderRadius: 6, fontWeight: 600 }}>API testing</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* BENTO CARD 4: ANALYTICS (LARGE) */}
          <motion.div
            className="lp-feat-card lp-feat-large"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
            style={{ marginTop: 24 }}
          >
            <div className="lp-feat-body">
              <div className="lp-feat-header">
                <div className="lp-feat-icon-wrapper">
                  <BarChart3 size={20} />
                </div>
                <h3 className="lp-feat-title">Developer Focus Analytics</h3>
                <p className="lp-feat-desc">
                  Understand your coding patterns. Track how many deep focus hours you score daily without intrusive tracking software.
                </p>
              </div>
            </div>

            {/* Visual focus hours analytics display */}
            <div className="lp-feat-visual" style={{ background: '#FAF9F6' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: '440px', background: '#FFFFFF', padding: 20, borderRadius: 16, border: '1px solid rgba(29, 29, 31, 0.06)', boxShadow: 'var(--lp-shadow-sm)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, fontWeight: 700 }}>Focus efficiency</span>
                  <span style={{ fontSize: 12, color: 'var(--lp-orange)', fontWeight: 600 }}>92% flow state</span>
                </div>
                <div style={{ display: 'flex', gap: 4, height: 40, alignItems: 'flex-end', paddingBottom: 4 }}>
                  {[10, 20, 15, 30, 45, 60, 50, 40, 75, 90, 85, 95].map((val, idx) => (
                    <div
                      key={idx}
                      style={{
                        flex: 1,
                        height: `${val}%`,
                        background: 'rgba(230, 126, 34, 0.2)',
                        borderRadius: '2px 2px 0 0'
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  )
}
