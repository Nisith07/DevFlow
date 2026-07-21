import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Sparkles, CheckCircle2, GitPullRequest, BarChart3, Terminal } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { gsap } from 'gsap'

// Trusted logos list with simple SVGs or icons
const TRUSTED_COMPANIES = [
  { name: 'GitHub', icon: '🐙' },
  { name: 'Vercel', icon: '▲' },
  { name: 'Notion', icon: '📝' },
  { name: 'Linear', icon: '⧉' },
  { name: 'Cursor', icon: '⌖' },
  { name: 'Claude', icon: '🧠' }
]

export default function Hero() {
  const navigate = useNavigate()
  const canvasRef = useRef(null)
  const containerRef = useRef(null)

  // Parallax / Scroll animations
  const { scrollY } = useScroll()
  const yOffset = useTransform(scrollY, [0, 800], [0, -100])
  const rotateX = useTransform(scrollY, [0, 800], [15, 5])
  const rotateY = useTransform(scrollY, [0, 800], [-15, -5])

  // Mouse position tracking for active 3D tilt
  const [coords, setCoords] = useState({ x: 0, y: 0 })
  const handleMouseMove = (e) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    // Calculate normalized coords (-1 to 1)
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1
    setCoords({ x, y })
  }

  const handleMouseLeave = () => {
    setCoords({ x: 0, y: 0 })
  }

  // Springs for smooth mouse interpolation
  const springConfig = { stiffness: 150, damping: 20 }
  const tiltX = useSpring(useTransform(scrollY, [0, 800], [12, 5]), springConfig)
  const tiltY = useSpring(useTransform(scrollY, [0, 800], [-15, -5]), springConfig)

  // Floating particle background via Canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animationFrameId

    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const handleResize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    // Create particles
    const particles = []
    const particleCount = 40

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 1,
        speedX: Math.random() * 0.4 - 0.2,
        speedY: Math.random() * 0.4 - 0.2,
        alpha: Math.random() * 0.5 + 0.1
      })
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height)

      // Draw grid lines very subtly
      ctx.strokeStyle = 'rgba(29, 29, 31, 0.015)'
      ctx.lineWidth = 1
      const gridSize = 64
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)
        ctx.stroke()
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
        ctx.stroke()
      }

      // Draw particles
      particles.forEach((p) => {
        p.x += p.speedX
        p.y += p.speedY

        if (p.x < 0 || p.x > width) p.speedX *= -1
        if (p.y < 0 || p.y > height) p.speedY *= -1

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(230, 126, 34, ${p.alpha})`
        ctx.fill()
      })

      animationFrameId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <section
      ref={containerRef}
      className="lp-hero"
      id="home"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Dynamic Background Canvas */}
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }} />
      <div className="lp-bg-glow-1" />
      <div className="lp-bg-glow-2" />

      <div className="lp-wrap">
        <div className="lp-hero-inner">

          {/* ── Left Side: Copy and Actions ── */}
          <motion.div
            className="lp-hero-copy"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <div className="lp-label">
              <Sparkles size={13} style={{ marginRight: 6 }} />
              Premium Workspace
            </div>

            <h1 className="lp-hero-headline">
              Your day,<br />
              <span className="orange-highlight">structured</span><br />
              before you open<br />
              your editor.
            </h1>

            <p className="lp-hero-sub">
              DevFlow reads your git history, automates your morning standup, and tracks daily workflow metrics to bring serenity back to coding.
            </p>

            <div className="lp-hero-ctas">
              <button
                className="lp-btn lp-btn-primary"
                onClick={() => navigate('/register')}
              >
                Start Free <ArrowRight size={15} />
              </button>
              <a
                href="#how-it-works"
                className="lp-btn lp-btn-secondary"
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                See How It Works
              </a>
            </div>

            {/* Trusted Companies */}
            <div className="lp-trusted">
              <span className="lp-trusted-title">Loved by developers at</span>
              <div className="lp-trusted-logos">
                {TRUSTED_COMPANIES.map((company) => (
                  <span key={company.name} className="lp-trusted-logo">
                    <span style={{ fontSize: 16 }}>{company.icon}</span>
                    {company.name}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ── Right Side: 3D Floating Dashboard ── */}
          <div className="lp-hero-visual">
            <motion.div
              className="lp-floating-scene"
              style={{
                rotateY: useTransform(tiltY, (v) => v + coords.x * 12),
                rotateX: useTransform(tiltX, (v) => v - coords.y * 12),
                y: yOffset
              }}
            >
              {/* MAIN GLASS PANEL */}
              <div className="lp-glass-dashboard">

                {/* Header Chrome bar */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(29, 29, 31, 0.05)', paddingBottom: 14 }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#FF5F56' }} />
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#FFBD2E' }} />
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#27C93F' }} />
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(29, 29, 31, 0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Dashboard v1.0
                  </div>
                </div>

                {/* Title */}
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>good morning, Nisith 👋</h3>
                  <p style={{ fontSize: 12, color: 'rgba(29, 29, 31, 0.5)', margin: '4px 0 0 0' }}>Here's your productivity overview for today</p>
                </div>

                {/* Simulated Task List inside Dashboard */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    { text: 'Review critical security PR #104', done: true },
                    { text: 'Deploy V2 landing page to staging', done: false },
                    { text: 'Sync commits with morning standup metrics', done: false }
                  ].map((task, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        background: 'rgba(255, 255, 255, 0.5)',
                        padding: '10px 14px',
                        borderRadius: 10,
                        border: '1px solid rgba(29, 29, 31, 0.03)'
                      }}
                    >
                      <CheckCircle2 size={16} color={task.done ? '#E67E22' : 'rgba(29, 29, 31, 0.2)'} />
                      <span style={{ fontSize: 13, textDecoration: task.done ? 'line-through' : 'none', color: task.done ? 'rgba(29, 29, 31, 0.4)' : 'rgba(29, 29, 31, 0.8)' }}>
                        {task.text}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Mini Graph inside Dashboard */}
                <div style={{ background: 'rgba(255, 255, 255, 0.4)', padding: 14, borderRadius: 12, border: '1px solid rgba(29, 29, 31, 0.03)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(29, 29, 31, 0.6)' }}>Activity Trend</span>
                    <span style={{ fontSize: 11, color: '#E67E22', fontWeight: 600 }}>+28% this week</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 50, paddingBottom: 4 }}>
                    {[35, 60, 45, 80, 55, 95, 70].map((h, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ duration: 1, delay: i * 0.1 }}
                        style={{
                          flex: 1,
                          background: i === 5 ? 'var(--lp-orange)' : 'rgba(230, 126, 34, 0.15)',
                          borderRadius: '3px 3px 0 0'
                        }}
                      />
                    ))}
                  </div>
                </div>

              </div>

              {/* FLOAT-OUT WIDGET 1: GITHUB COMMITS */}
              <motion.div
                className="lp-floating-widget lp-widget-git"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <GitPullRequest size={15} color="var(--lp-orange)" />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: 11, fontWeight: 700 }}>Git Sync</span>
                    <span style={{ fontSize: 9, color: 'rgba(29, 29, 31, 0.5)' }}>4 commits compiled</span>
                  </div>
                </div>
              </motion.div>

              {/* FLOAT-OUT WIDGET 2: AI STANDUP COPILOT */}
              <motion.div
                className="lp-floating-widget lp-widget-ai"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <div style={{ background: 'rgba(230, 126, 34, 0.1)', padding: 6, borderRadius: 8 }}>
                    <Sparkles size={16} color="var(--lp-orange)" />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <span style={{ fontSize: 11, fontWeight: 700 }}>Standup Copilot</span>
                    <span style={{ fontSize: 10, color: 'rgba(29, 29, 31, 0.6)', lineHeight: 1.3 }}>
                      "I'll write your morning standup draft based on yesterday's 4 commits."
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* FLOAT-OUT WIDGET 3: FOCUS TIMER */}
              <motion.div
                className="lp-floating-widget lp-widget-chart"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <BarChart3 size={15} color="var(--lp-orange)" />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: 11, fontWeight: 700 }}>Daily Focus</span>
                    <span style={{ fontSize: 10, color: 'rgba(29, 29, 31, 0.5)', fontFamily: 'var(--font-mono)' }}>4h 30m / 6h</span>
                  </div>
                </div>
              </motion.div>

            </motion.div>
          </div>

        </div>
      </div>
    </section>
  )
}
