import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { GitCommit, Sparkles, CheckSquare, Clock } from 'lucide-react'

export default function About() {
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true, margin: '-100px' })
  const [activeStep, setActiveStep] = useState(0)

  // Auto transition daily timeline demo
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 4)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const timelineEvents = [
    {
      time: '09:00 AM',
      icon: GitCommit,
      title: 'GitHub Sync Complete',
      desc: 'Synced feat(auth): 4 commits to local timeline.',
      color: '#E67E22'
    },
    {
      time: '09:05 AM',
      icon: Sparkles,
      title: 'AI Drafted Morning Standup',
      desc: '"Yesterday I added jwt checks... Today I will test OAuth flows."',
      color: '#A855F7'
    },
    {
      time: '10:00 AM',
      icon: CheckSquare,
      title: 'Focus Block Started',
      desc: 'Task: Test local authentication routines.',
      color: '#06B6D4'
    },
    {
      time: '01:00 PM',
      icon: Clock,
      title: 'Focus efficiency updated',
      desc: 'Calculated 3.5 deep hours with zero slack distractions.',
      color: '#10B981'
    }
  ]

  return (
    <section className="lp-section" id="about" ref={containerRef}>
      <div className="lp-wrap">
        <div className="lp-about-grid">

          {/* Left: Copy manifesto */}
          <motion.div
            className="lp-about-copy"
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <div className="lp-label">
              Manifesto
            </div>
            <h2 className="lp-h2">
              Designed around the <em>developer's focus</em>
            </h2>
            <p className="lp-section-sub" style={{ marginBottom: 20 }}>
              Enterprise tracking tools were designed for managers who want status reports, not for developers who write code. Jira causes overhead. Notion is too open-ended. Slack constant notifications distract you.
            </p>
            <p className="lp-section-sub" style={{ marginBottom: 36 }}>
              DevFlow is built on a simple premise: your tool should get out of your way. By reading git commits and automating standup notes, DevFlow handles the reporting so you can stay in flow.
            </p>

            <div className="lp-about-stat-grid">
              {[
                { num: '3×', label: 'Faster Standups' },
                { num: '0', label: 'Context Switches' },
              ].map((stat, idx) => (
                <div className="lp-about-stat" key={idx}>
                  <div className="lp-about-stat-num">{stat.num}</div>
                  <div className="lp-about-stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Dynamic Interactive Workflow Timeline */}
          <motion.div
            className="lp-about-visual"
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <div style={{
              background: '#FFFFFF',
              borderRadius: 24,
              padding: '32px 28px',
              border: '1px solid var(--lp-border)',
              boxShadow: 'var(--lp-shadow-lg)',
              width: '100%',
              maxWidth: '460px',
              margin: '0 auto',
              position: 'relative'
            }}>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, borderBottom: '1px solid rgba(29,29,31,0.05)', paddingBottom: 16 }}>
                <div>
                  <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(29,29,31,0.4)' }}>Live timeline</span>
                  <h4 style={{ fontSize: 15, fontWeight: 700, margin: '4px 0 0 0' }}>Daily Developer Log</h4>
                </div>
                <span style={{ fontSize: 11, background: 'rgba(230,126,34,0.1)', color: 'var(--lp-orange)', padding: '4px 10px', borderRadius: 20, fontWeight: 600 }}>Auto-Syncing</span>
              </div>

              {/* Timeline Items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24, position: 'relative' }}>

                {/* Visual Line */}
                <div style={{ position: 'absolute', top: 12, bottom: 12, left: 16, width: 2, background: 'rgba(29, 29, 31, 0.05)' }} />

                {timelineEvents.map((event, idx) => {
                  const EventIcon = event.icon
                  const isActive = activeStep === idx
                  return (
                    <motion.div
                      key={idx}
                      style={{
                        display: 'flex',
                        gap: 16,
                        position: 'relative',
                        zIndex: 2,
                        opacity: isActive ? 1 : 0.45,
                        scale: isActive ? 1.02 : 1,
                        transition: 'all 0.4s ease'
                      }}
                    >
                      {/* Icon bubble */}
                      <div style={{
                        width: 34,
                        height: 34,
                        borderRadius: '50%',
                        background: '#FFFFFF',
                        border: `2px solid ${isActive ? event.color : 'rgba(29, 29, 31, 0.1)'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isActive ? event.color : 'rgba(29, 29, 31, 0.4)',
                        boxShadow: isActive ? `0 0 12px ${event.color}33` : 'none',
                        transition: 'all 0.4s ease'
                      }}>
                        <EventIcon size={16} />
                      </div>

                      {/* Content block */}
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 2 }}>
                          <h5 style={{ fontSize: 13, fontWeight: 700, margin: 0 }}>{event.title}</h5>
                          <span style={{ fontSize: 10, color: 'rgba(29,29,31,0.4)', fontFamily: 'var(--font-mono)' }}>{event.time}</span>
                        </div>
                        <p style={{ fontSize: 12, color: 'rgba(29, 29, 31, 0.6)', margin: 0, lineHeight: 1.4 }}>{event.desc}</p>
                      </div>
                    </motion.div>
                  )
                })}

              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
