import { motion } from 'framer-motion'
import { 
  Layers, CheckSquare, Sparkles, Flame, GitMerge, BarChart3, Users,
  Code2, Check, Play, Clock, ArrowRight, ShieldAlert, Cpu
} from 'lucide-react'

const FEATURE_CARDS = [
  {
    id: 'projects',
    title: 'Project Management',
    desc: 'Unify workspace goals. Organise project layers, add descriptions, and track lifecycle milestones in real-time.',
    icon: Layers,
    color: 'var(--color-lp-accent)',
    visual: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', opacity: 0.85 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--color-lp-muted)' }}>
          <span>Workspace Refactor</span>
          <span>82%</span>
        </div>
        <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
          <div style={{ width: '82%', height: '100%', background: 'linear-gradient(to right, var(--color-lp-accent), var(--color-lp-cyan))' }} />
        </div>
        <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
          <span style={{ fontSize: '9px', background: 'var(--color-lp-accent-soft)', border: '1px solid var(--color-lp-accent-soft-line)', padding: '2px 6px', borderRadius: '4px', color: '#fff' }}>Milestone 3</span>
          <span style={{ fontSize: '9px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--color-lp-line)', padding: '2px 6px', borderRadius: '4px', color: 'var(--color-lp-muted)' }}>Docs</span>
        </div>
      </div>
    )
  },
  {
    id: 'tasks',
    title: 'Task Management',
    desc: 'Manage tasks inside structured Kanban grids. Add low/medium/high/urgent priorities and nested subtasks.',
    icon: CheckSquare,
    color: 'var(--color-lp-cyan)',
    visual: (
      <div style={{ display: 'flex', gap: '8px', width: '100%', height: '70px' }}>
        {['Todo', 'Doing'].map((col, index) => (
          <div key={col} style={{ flex: 1, background: 'rgba(255,255,255,0.02)', borderRadius: '6px', padding: '6px', border: '1px solid var(--color-lp-line)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '9px', fontWeight: 'bold', color: 'var(--color-lp-muted)' }}>{col}</span>
            <div style={{ background: index === 1 ? 'rgba(6, 182, 212, 0.1)' : 'var(--color-lp-surface)', border: index === 1 ? '1px solid var(--color-lp-cyan)' : '1px solid var(--color-lp-line)', padding: '4px', borderRadius: '4px', fontSize: '9px', display: 'flex', flexDirection: 'column' }}>
              <span style={{ color: '#fff', fontWeight: 600 }}>{index === 1 ? 'Deploy API' : 'Refactor auth'}</span>
              <span style={{ color: index === 1 ? 'var(--color-lp-cyan)' : 'var(--color-lp-amber)', fontSize: '8px', marginTop: '2px' }}>{index === 1 ? 'Urgent' : 'Medium'}</span>
            </div>
          </div>
        ))}
      </div>
    )
  },
  {
    id: 'ai-copilot',
    title: 'AI Copilot Integration',
    desc: 'Run conversational code audits. Gemini scans your daily workspace tasks, suggests priorities, and executes database actions.',
    icon: Sparkles,
    color: 'var(--color-lp-amber)',
    visual: (
      <div style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--color-lp-line)', borderRadius: '8px', padding: '8px', fontFamily: 'var(--font-mono)' }}>
        <div style={{ display: 'flex', gap: '4px', marginBottom: '6px' }}>
          <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#ff5f56' }} />
          <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#ffbd2e' }} />
          <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#27c93f' }} />
        </div>
        <span style={{ fontSize: '8.5px', color: 'var(--color-lp-cyan)', display: 'block' }}>$ devflow --suggest-tasks</span>
        <span style={{ fontSize: '8.5px', color: 'var(--color-lp-muted)', display: 'block', marginTop: '2px' }}>▶ Scheduled "PR Review" at 09:30 AM</span>
      </div>
    )
  },
  {
    id: 'productivity',
    title: 'Developer Productivity',
    desc: 'Power focus timers linked directly to tasks. Generate motivational widgets, daily milestones, and commit streaks.',
    icon: Flame,
    color: '#ef4444',
    visual: (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '0 8px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span style={{ fontSize: '18px', fontWeight: '900', color: '#fff', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Flame size={16} style={{ color: '#ef4444', fill: '#ef4444' }} />
            14 Day
          </span>
          <span style={{ fontSize: '9px', color: 'var(--color-lp-muted)' }}>Consecutive Streak</span>
        </div>
        <div style={{ borderLeft: '1px solid var(--color-lp-line)', paddingLeft: '12px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span style={{ fontSize: '18px', fontWeight: '900', color: 'var(--color-lp-cyan)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={14} />
            25m
          </span>
          <span style={{ fontSize: '9px', color: 'var(--color-lp-muted)' }}>Active Focus Timer</span>
        </div>
      </div>
    )
  },
  {
    id: 'github',
    title: 'GitHub Integration',
    desc: 'Contextual status logs. Auto-compile commit logs and weekly activity timelines to map yesterday\'s achievements.',
    icon: GitMerge,
    color: 'var(--color-lp-cyan)',
    visual: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--color-lp-line)', padding: '8px', borderRadius: '6px' }}>
        <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#24292e', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', color: '#fff', fontSize: '10px', fontWeight: 'bold' }}>G</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1 }}>
          <span style={{ fontSize: '10px', color: '#fff', fontWeight: 600 }}>Pull Request #42</span>
          <span style={{ fontSize: '8px', color: 'var(--color-lp-muted)' }}>Refactored registration controller</span>
        </div>
        <span style={{ fontSize: '8px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#10B981', padding: '2px 6px', borderRadius: '4px' }}>Merged</span>
      </div>
    )
  },
  {
    id: 'analytics',
    title: 'Analytics & Insights',
    desc: 'Analyse performance graphs. Auto-compile task durations, weekly completions, and project output matrices.',
    icon: BarChart3,
    color: 'var(--color-lp-accent)',
    visual: (
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', height: '60px', width: '100%', justifyContent: 'center' }}>
        {[40, 60, 35, 75, 90, 50].map((val, idx) => (
          <div key={idx} style={{ flex: 1, height: `${val}%`, background: idx === 4 ? 'var(--color-lp-cyan)' : 'var(--color-lp-accent-soft-line)', borderRadius: '2px 2px 0 0', position: 'relative' }}>
            {idx === 4 && <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', fontSize: '7px', color: '#fff', background: 'var(--color-lp-cyan)', padding: '1px 3px', borderRadius: '2px' }}>Peak</div>}
          </div>
        ))}
      </div>
    )
  },
  {
    id: 'collaboration',
    title: 'Team Collaboration',
    desc: 'Quiet project hours. Synchronize active state timelines, tag colleagues, and coordinate without distraction.',
    icon: Users,
    color: 'var(--color-lp-accent-deep)',
    visual: (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '-8px', position: 'relative', width: '100%', height: '50px' }}>
        {['A', 'B', 'C'].map((initial, idx) => (
          <div 
            key={idx} 
            style={{ 
              width: '28px', 
              height: '28px', 
              borderRadius: '50%', 
              background: idx === 0 ? 'var(--color-lp-accent)' : idx === 1 ? 'var(--color-lp-cyan)' : 'var(--color-lp-amber)', 
              color: '#fff', 
              fontSize: '11px', 
              fontWeight: 'bold', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              border: '2px solid #03050c', 
              marginLeft: idx > 0 ? '-8px' : '0px',
              position: 'relative'
            }}
          >
            <div style={{ position: 'absolute', right: '-1px', bottom: '-1px', width: '7px', height: '7px', borderRadius: '50%', background: '#10B981', border: '1px solid #03050c' }} />
          </div>
        ))}
      </div>
    )
  }
]

export default function Features() {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  }

  return (
    <section className="lp-section" id="features" style={{ position: 'relative' }}>
      <div className="lp-wrap">
        
        {/* Header */}
        <div className="lp-section-head">
          <span className="lp-eyebrow" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Cpu size={12} style={{ color: 'var(--color-lp-cyan)' }} />
            Immersive Capabilities
          </span>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 900, letterSpacing: '-0.02em', color: '#fff' }}>
            Unified inside a single cybernetic flow
          </h2>
          <p style={{ fontSize: '15.5px', color: 'var(--color-lp-muted)', marginTop: '14px', maxWidth: '580px', margin: '14px auto 0' }}>
            No context switching. No browser tab sprawl. Every feature integrates directly to structure your daily output from commits and notes.
          </p>
        </div>

        {/* Features Interactive Grid */}
        <motion.div 
          className="lp-features-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginTop: '56px' }}
        >
          {FEATURE_CARDS.map((card) => {
            const Icon = card.icon
            return (
              <motion.div
                key={card.id}
                variants={cardVariants}
                className="lp-glass-card"
                whileHover={{ y: -8, scale: 1.02 }}
                style={{
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  position: 'relative',
                  cursor: 'default',
                  background: 'rgba(13, 17, 28, 0.45)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  overflow: 'hidden'
                }}
              >
                {/* Glowing subtle card gradient */}
                <div 
                  style={{
                    position: 'absolute',
                    top: '-50px',
                    right: '-50px',
                    width: '120px',
                    height: '120px',
                    background: `radial-gradient(circle, ${card.color}15 0%, transparent 70%)`,
                    pointerEvents: 'none'
                  }} 
                />

                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div 
                    style={{ 
                      width: '36px', 
                      height: '36px', 
                      borderRadius: '8px', 
                      background: 'rgba(255,255,255,0.02)', 
                      border: '1px solid var(--color-lp-line)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      color: card.color
                    }}
                  >
                    <Icon size={18} />
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', margin: 0 }}>
                    {card.title}
                  </h3>
                </div>

                {/* Desc */}
                <p style={{ fontSize: '13px', color: 'var(--color-lp-muted)', lineHeight: '1.5', margin: 0 }}>
                  {card.desc}
                </p>

                {/* Interactive Visual Preview */}
                <div 
                  style={{ 
                    marginTop: 'auto',
                    width: '100%', 
                    background: 'rgba(255,255,255,0.01)', 
                    border: '1px solid var(--color-lp-line)', 
                    borderRadius: '8px', 
                    padding: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '80px'
                  }}
                >
                  {card.visual}
                </div>
              </motion.div>
            )
          })}
        </motion.div>

      </div>
    </section>
  )
}
