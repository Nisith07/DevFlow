import { motion } from 'framer-motion'
import { HelpCircle, Sparkles, BookOpen, Milestone } from 'lucide-react'

export default function About() {
  const panels = [
    {
      id: 'problem',
      title: 'The Problem',
      icon: HelpCircle,
      color: 'var(--color-danger)',
      desc: 'Modern development is fractured across ten different browser tabs. Jira ticket updates, Slack standups, calendar focus blocks, and git commits require constant context-switching, leading to cognitive fatigue.'
    },
    {
      id: 'solution',
      title: 'The Solution',
      icon: Sparkles,
      color: 'var(--color-lp-cyan)',
      desc: 'DevFlow unifies your tasks, calendar planning, code commits, and project status notes in a single workspace. It reads what you do naturally and compiles it into a calm daily overview.'
    },
    {
      id: 'philosophy',
      title: 'Developer-First Philosophy',
      icon: BookOpen,
      color: 'var(--color-lp-accent)',
      desc: 'We believe productivity tools should serve developers, not manager spreadsheets. DevFlow maps to the way developers actually work—focusing on lines of code shipped and tasks completed.'
    },
    {
      id: 'vision',
      title: 'Future Vision',
      icon: Milestone,
      color: 'var(--color-lp-amber)',
      desc: 'We are building toward a completely self-documenting workspace. Predictive AI calendars, automatic commit-to-task mapping, and frictionless standups let you focus on shipping great code.'
    }
  ]

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
  }

  return (
    <section className="lp-section" id="about" style={{ position: 'relative' }}>
      <div className="lp-wrap">
        
        {/* Header */}
        <div className="lp-section-head">
          <span className="lp-eyebrow" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <BookOpen size={12} style={{ color: 'var(--color-lp-cyan)' }} />
            Brand Philosophy
          </span>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>
            Built by developers, for developers
          </h2>
          <p style={{ fontSize: '15.5px', color: 'var(--color-lp-muted)', marginTop: '14px', maxWidth: '580px', margin: '14px auto 0' }}>
            A premium workspace dedicated to keeping your flow state untouched.
          </p>
        </div>

        {/* Structured Brand Story Panels Grid */}
        <motion.div 
          className="about-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px',
            marginTop: '56px'
          }}
        >
          {panels.map((panel) => {
            const Icon = panel.icon
            return (
              <motion.div
                key={panel.id}
                variants={cardVariants}
                className="lp-glass-card"
                whileHover={{ y: -6 }}
                style={{
                  padding: '28px',
                  background: 'rgba(10, 14, 25, 0.55)',
                  border: '1px solid rgba(255, 255, 255, 0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Glowing element shadow */}
                <div 
                  style={{
                    position: 'absolute',
                    top: '-60px',
                    left: '-60px',
                    width: '120px',
                    height: '120px',
                    background: `radial-gradient(circle, ${panel.color}10 0%, transparent 70%)`,
                    pointerEvents: 'none'
                  }} 
                />

                {/* Header info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div 
                    style={{ 
                      width: '40px', 
                      height: '40px', 
                      borderRadius: '10px', 
                      background: 'rgba(255,255,255,0.02)', 
                      border: '1px solid var(--color-lp-line)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      color: panel.color
                    }}
                  >
                    <Icon size={20} />
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#fff', margin: 0 }}>
                    {panel.title}
                  </h3>
                </div>

                {/* Body text */}
                <p style={{ fontSize: '13.5px', color: 'var(--color-lp-muted)', lineHeight: '1.6', margin: 0 }}>
                  {panel.desc}
                </p>
              </motion.div>
            )
          })}
        </motion.div>

      </div>
    </section>
  )
}
