import { useState, useEffect, useRef } from 'react'
import { ArrowRight, Sparkles, Code2, Terminal, CheckCircle2, AlertCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Hero() {
  const navigate = useNavigate()
  const [coords, setCoords] = useState({ x: 0, y: 0 })
  const heroRef = useRef(null)

  // Track mouse coordinates for 3D parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!heroRef.current) return
      const { clientX, clientY } = e
      const width = window.innerWidth
      const height = window.innerHeight

      // Normalize mouse coordinates around the center (-0.5 to 0.5)
      const x = (clientX / width) - 0.5
      const y = (clientY / height) - 0.5
      setCoords({ x, y })
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Calculate 3D rotations based on mouse coordinates
  const rotateX = coords.y * -25 // Tilt up/down
  const rotateY = coords.x * 25  // Turn left/right

  return (
    <section className="lp-hero" id="home" ref={heroRef} style={{ overflow: 'visible' }}>
      <div className="lp-wrap lp-hero-stage">
        
        {/* Left Side: Cinematic Copy */}
        <motion.div 
          className="lp-hero-copy"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <span className="lp-eyebrow" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={12} className="text-glow-cyan" style={{ color: 'var(--color-lp-cyan)' }} />
            Next-Gen Developer Platform
          </span>
          <h1 className="lp-headline" style={{ lineHeight: '1.1' }}>
            Your day, <span className="lp-brand-sub text-glow-violet">structured</span> <br />
            before you edit.
          </h1>
          <p className="lp-sub" style={{ fontSize: '16px', color: 'var(--color-lp-muted)', marginTop: '20px' }}>
            DevFlow connects your commits, notes, and tasks in a calm, unified daily workspace. It auto-stands up your day, flags blocker alerts, and runs contextual AI assistance.
          </p>
          <div className="lp-hero-ctas" style={{ marginTop: '32px', display: 'flex', gap: '16px' }}>
            <button 
              className="lp-btn lp-btn-primary" 
              onClick={() => navigate('/register')}
              style={{ padding: '12px 24px', fontSize: '15px' }}
            >
              Start Workspace Free
              <ArrowRight size={16} />
            </button>
            <a 
              href="#how-it-works" 
              className="lp-btn lp-btn-ghost"
              style={{ padding: '12px 24px', fontSize: '15px' }}
            >
              Explore DevFlow
            </a>
          </div>
        </motion.div>

        {/* Right Side: Interactive 3D Visual Environment */}
        <motion.div 
          className="hero-3d-scene"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
        >
          <div 
            className="hero-3d-grid-wrap"
            style={{
              transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
              willChange: 'transform'
            }}
          >
            {/* Background glowing matrix circle */}
            <div 
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%) translateZ(-80px)',
                width: '320px',
                height: '320px',
                background: 'radial-gradient(circle, rgba(6, 182, 212, 0.12) 0%, transparent 70%)',
                filter: 'blur(20px)',
                pointerEvents: 'none'
              }} 
            />

            {/* Widget 1: Developer Task Checklist (translateZ: 50px) */}
            <div 
              className="lp-glass-card card-3d" 
              style={{
                width: '240px',
                padding: '16px',
                left: '0px',
                top: '40px',
                transform: 'translateZ(50px)',
                background: 'rgba(10, 14, 25, 0.8)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--color-lp-line)', paddingBottom: '10px', marginBottom: '12px' }}>
                <Terminal size={14} style={{ color: 'var(--color-lp-cyan)' }} />
                <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Daily Tasks</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={14} style={{ color: 'var(--color-lp-cyan)' }} />
                  <span style={{ fontSize: '12px', textDecoration: 'line-through', opacity: 0.6 }}>Fix auth middleware</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={14} style={{ color: 'var(--color-lp-cyan)' }} />
                  <span style={{ fontSize: '12px', textDecoration: 'line-through', opacity: 0.6 }}>Optimise db index</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '14px', height: '14px', borderRadius: '50%', border: '1px solid var(--color-lp-line)' }} />
                  <span style={{ fontSize: '12px', fontWeight: 500 }}>Review deployment logs</span>
                </div>
              </div>
            </div>

            {/* Widget 2: AI Copilot suggestions (translateZ: 100px) */}
            <div 
              className="lp-glass-card card-3d" 
              style={{
                width: '260px',
                padding: '16px',
                right: '-20px',
                top: '120px',
                transform: 'translateZ(100px)',
                borderLeft: '2.5px solid var(--color-lp-accent)',
                background: 'rgba(13, 17, 30, 0.85)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Sparkles size={14} style={{ color: 'var(--color-lp-accent)' }} />
                <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#fff' }}>AI Copilot</span>
                <span style={{ marginLeft: 'auto', fontSize: '9px', background: 'rgba(139, 92, 246, 0.2)', padding: '2px 6px', borderRadius: '4px', color: 'var(--color-lp-accent)' }}>Critical</span>
              </div>
              <p style={{ fontSize: '11px', color: 'var(--color-lp-muted)', lineHeight: '1.4', margin: 0 }}>
                Found duplicated routing logic in <code style={{ color: 'var(--color-lp-cyan)', fontFamily: 'var(--font-mono)' }}>authRoutes.js</code>. Suggesting refactoring pattern.
              </p>
              <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                <span style={{ fontSize: '10px', color: 'var(--color-lp-cyan)', cursor: 'pointer', fontWeight: 600 }}>Refactor Code</span>
                <span style={{ fontSize: '10px', color: 'var(--color-lp-muted)', cursor: 'pointer' }}>Dismiss</span>
              </div>
            </div>

            {/* Widget 3: Git Contribution Matrix Heatmap (translateZ: -30px) */}
            <div 
              className="lp-glass-card card-3d" 
              style={{
                width: '280px',
                padding: '14px',
                left: '60px',
                bottom: '30px',
                transform: 'translateZ(-30px)',
                background: 'rgba(8, 10, 20, 0.7)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Code2 size={13} style={{ color: 'var(--color-lp-cyan)' }} />
                  <span style={{ fontSize: '11px', fontWeight: 600 }}>Activity Matrix</span>
                </div>
                <span style={{ fontSize: '10px', color: 'var(--color-lp-muted)' }}>42 commits</span>
              </div>
              
              {/* Contribution Squares Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '4px' }}>
                {Array.from({ length: 48 }).map((_, i) => {
                  let colorClass = 'rgba(255, 255, 255, 0.04)'
                  if (i % 5 === 0) colorClass = 'rgba(6, 182, 212, 0.2)'
                  if (i % 7 === 0) colorClass = 'rgba(139, 92, 246, 0.3)'
                  if (i % 11 === 0) colorClass = 'var(--color-lp-accent)'
                  if (i === 15 || i === 23 || i === 31) colorClass = 'var(--color-lp-cyan)'

                  return (
                    <div 
                      key={i} 
                      style={{ 
                        aspectRatio: '1', 
                        backgroundColor: colorClass, 
                        borderRadius: '2px',
                        boxShadow: (colorClass === 'var(--color-lp-cyan)' || colorClass === 'var(--color-lp-accent)') ? '0 0 6px ' + colorClass : 'none'
                      }} 
                    />
                  )
                })}
              </div>
            </div>

            {/* Float Alert widget in depth (translateZ: 140px) */}
            <div
              className="lp-glass-card card-3d"
              style={{
                padding: '8px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                top: '0px',
                right: '40px',
                transform: 'translateZ(140px)',
                background: 'rgba(239, 68, 68, 0.1)',
                borderColor: 'rgba(239, 68, 68, 0.25)',
                boxShadow: '0 0 15px rgba(239, 68, 68, 0.1)'
              }}
            >
              <AlertCircle size={12} style={{ color: 'var(--color-danger)' }} />
              <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--color-danger)' }}>Mongo Timeout Blocker</span>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  )
}
