import { motion } from 'framer-motion'
import { Terminal, Calendar, CheckSquare, Sparkles, LineChart, Ship, Eye } from 'lucide-react'

export default function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Create your workspace',
      desc: 'Deploy your local or cloud environment. Start your workspace with a clean, unified dashboard.',
      icon: Terminal,
    },
    {
      num: '02',
      title: 'Organise your projects',
      desc: 'Define goals, create milestones, and group code repositories within dedicated hubs.',
      icon: Calendar,
    },
    {
      num: '03',
      title: 'Manage your tasks',
      desc: 'Log items, drag them across todo/done, assign priority, and check off checklist subtasks.',
      icon: CheckSquare,
    },
    {
      num: '04',
      title: 'Use AI Copilot',
      desc: 'Prompt the assistant to auto-plan calendars, suggest task revisions, and commit DB entries.',
      icon: Sparkles,
    },
    {
      num: '05',
      title: 'Track progress',
      desc: 'Check motivational widgets, monitor daily focus stats, and view project completion cards.',
      icon: LineChart,
    },
    {
      num: '06',
      title: 'Ship better work',
      desc: 'Eliminate tab sprawl. Maintain high focus, build streaks, and deploy high-quality software.',
      icon: Ship,
    },
  ]

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08
      }
    }
  }

  const nodeVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } }
  }

  return (
    <section className="lp-section" id="how-it-works" style={{ position: 'relative', overflow: 'hidden' }}>
      <div className="lp-wrap">
        
        {/* Header */}
        <div className="lp-section-head">
          <span className="lp-eyebrow" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Eye size={12} style={{ color: 'var(--color-lp-cyan)' }} />
            Workflow Engine
          </span>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>
            Connected step-by-step
          </h2>
          <p style={{ fontSize: '15.5px', color: 'var(--color-lp-muted)', marginTop: '14px', maxWidth: '580px', margin: '14px auto 0' }}>
            A developer-first philosophy that fits into your existing routine. Simple, fast, automated.
          </p>
        </div>

        {/* Pipeline container */}
        <div style={{ position: 'relative', marginTop: '64px' }}>
          
          {/* Animated SVG connecting pipeline (visible only on desktop) */}
          <div className="how-svg-overlay">
            <svg
              style={{ width: '100%', height: '100%', minHeight: '380px' }}
              viewBox="0 0 900 380"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="cyan-violet-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--color-lp-cyan)" />
                  <stop offset="50%" stopColor="var(--color-lp-accent)" />
                  <stop offset="100%" stopColor="var(--color-lp-cyan)" />
                </linearGradient>
              </defs>

              {/* Z-connector background dashed line */}
              <path
                d="M 150,72 L 750,72 C 850,72 850,190 450,190 C 50,190 50,308 150,308 L 750,308"
                className="how-svg-path"
              />
              
              {/* Overlapping glowing pulse line */}
              <path
                d="M 150,72 L 750,72 C 850,72 850,190 450,190 C 50,190 50,308 150,308 L 750,308"
                className="how-svg-path-pulse"
              />
            </svg>
          </div>

          {/* Connected step nodes */}
          <motion.div 
            className="how-pipeline"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            {steps.map((step) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={step.num}
                  variants={nodeVariants}
                  className="how-node-wrap"
                >
                  {/* Glowing step circle number */}
                  <div className="how-node-circle">
                    {step.num}
                  </div>

                  {/* Step copy card */}
                  <div 
                    className="lp-glass-card" 
                    style={{ 
                      padding: '20px', 
                      width: '100%', 
                      background: 'rgba(10, 14, 25, 0.65)', 
                      border: '1px solid rgba(255,255,255,0.04)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '10px'
                    }}
                  >
                    <Icon size={18} style={{ color: 'var(--color-lp-cyan)' }} />
                    <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#fff', margin: 0 }}>
                      {step.title}
                    </h3>
                    <p style={{ fontSize: '12px', color: 'var(--color-lp-muted)', lineHeight: '1.5', margin: 0 }}>
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>

        </div>

      </div>
    </section>
  )
}
