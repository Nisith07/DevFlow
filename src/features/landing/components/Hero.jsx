import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Sparkles, GitPullRequest, BarChart3, Code2, MousePointer, Zap, CheckCircle2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { motion, useSpring, useMotionValue, useTransform } from 'framer-motion'

/* ─── Trusted companies ─── */
const TRUSTED = [
  {
    name: 'GitHub',
    Icon: () => (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.79-.26.79-.58v-2.23c-3.34.73-4.03-1.42-4.03-1.42-.55-1.39-1.33-1.76-1.33-1.76-1.09-.74.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.49.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23.96-.27 1.98-.4 3-.4s2.04.13 3 .4c2.28-1.55 3.29-1.23 3.29-1.23.66 1.65.24 2.87.12 3.18.77.84 1.24 1.9 1.24 3.22 0 4.61-2.8 5.62-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.19.69.8.57C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
  },
  {
    name: 'Vercel',
    Icon: () => (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 22.525H0l12-21.05 12 21.05z" />
      </svg>
    ),
  },
  {
    name: 'Notion',
    Icon: () => (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466l1.823 1.447zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.887.747-.933z" />
      </svg>
    ),
  },
  {
    name: 'Linear',
    Icon: () => (
      <svg width="15" height="15" viewBox="0 0 100 100" fill="currentColor">
        <path d="M1.22541 61.5228c-.2225-.9485.90748-1.5459 1.59638-.857L39.3342 97.1782c.6889.6889.0915 1.8189-.857 1.5964C20.0515 94.4522 5.54779 79.9485 1.22541 61.5228zM.00189135 46.8891c-.01764375 1.2233.1385575 2.4414.42355575 3.6367L49.7545 99.5791c1.1953.2849 2.4134.4411 3.6367.4236L.00189135 46.8891zM4.57081 33.2327c-.7775.4627-1.0557 1.4598-.6313 2.2458L64.5124 95.4603c.786.4244 1.7831.1462 2.2458-.6313L4.57081 33.2327zm9.24971-12.1782c-.5728.3437-.7472 1.0798-.3878 1.6365l56.5493 56.5494c.5567.3593 1.2927.1849 1.6365-.3878L13.8205 21.0545zM26.8723 11.7875c-.4211.2521-.5501.7967-.29 1.2178L84.2921 70.7151c.4211.2601.9658.1311 1.2178-.29L26.8723 11.7875zM43.2852 5.44062c-.3327.1991-.4338.629-.23.9617L93.4728 56.3495c.3327.2038.7626.1027.9617-.23L43.2852 5.44062zm19.0843-3.69027c-.2448.1464-.3165.464-.1577.7088L96.6047 37.4408c.2448.1464.5624.0747.7088-.1577l-35.9439-35.574zM76.8148.903808c-.1664.09948-.2175.31497-.118.47936l24.9344 24.6744c.1644.0995.3799.0484.4794-.118L76.8148.903808z" />
      </svg>
    ),
  },
  { name: 'Cursor', Icon: () => <MousePointer size={14} /> },
  { name: 'Claude', Icon: () => <Zap size={14} /> },
]

/* ─── Word slide-up animation ─── */
function AnimWord({ word, delay, style = {} }) {
  return (
    <span style={{ display: 'inline-block', overflow: 'hidden', lineHeight: 1.06, verticalAlign: 'top' }}>
      <motion.span
        style={{ display: 'inline-block', ...style }}
        initial={{ y: '110%' }}
        animate={{ y: '0%' }}
        transition={{ duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {word}
      </motion.span>
    </span>
  )
}

/* ─── Structured letter-by-letter ─── */
function StructuredWord({ delay }) {
  return (
    <span style={{ color: 'var(--lp-orange)', display: 'inline-block' }}>
      {'structured'.split('').map((char, i) => (
        <motion.span
          key={i}
          style={{ display: 'inline-block' }}
          initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.32, delay: delay + i * 0.052, ease: [0.16, 1, 0.3, 1] }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  )
}

/* ─── Floating App Icon (matches reference 3D icon style) ─── */
function AppIcon({ children, style, yRange, delay, duration = 4 }) {
  return (
    <motion.div
      animate={{ y: yRange }}
      transition={{ duration, repeat: Infinity, ease: 'easeInOut', delay }}
      style={{
        position: 'absolute',
        width: 58,
        height: 58,
        borderRadius: 17,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 30,
        ...style,
      }}
    >
      {children}
    </motion.div>
  )
}

/* ─── GitHub SVG icon ─── */
const GithubSvg = ({ size = 28, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.79-.26.79-.58v-2.23c-3.34.73-4.03-1.42-4.03-1.42-.55-1.39-1.33-1.76-1.33-1.76-1.09-.74.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.49.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23.96-.27 1.98-.4 3-.4s2.04.13 3 .4c2.28-1.55 3.29-1.23 3.29-1.23.66 1.65.24 2.87.12 3.18.77.84 1.24 1.9 1.24 3.22 0 4.61-2.8 5.62-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.19.69.8.57C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
)

/* ─── Dashboard Panel (matches reference content exactly) ─── */
function DashboardPanel() {
  const todayTasks = [
    { text: 'Review open PRs', badge: 'Review', color: '#22c55e' },
    { text: 'Fix authentication PR', badge: 'High', color: '#f59e0b' },
    { text: 'Optimize API routes', badge: 'Medium', color: '#3b82f6' },
    { text: 'Update dashboard UI', badge: 'Low', color: '#94a3b8' },
  ]
  const aiSuggestions = [
    { text: 'Review open PRs', badge: 'Review', color: '#22c55e' },
    { text: 'Fix authentication PR', badge: 'High', color: '#f59e0b' },
    { text: 'Japanese dashboard UI', badge: 'Backlog', color: '#a78bfa' },
    { text: 'Optimize AI nodes', badge: 'Low', color: '#94a3b8' },
  ]
  const bars = [38, 55, 45, 72, 60, 88, 65]
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

  return (
    <div style={{
      background: '#FFFFFF',
      borderRadius: 20,
      overflow: 'hidden',
      boxShadow: '0 2px 4px rgba(29,29,31,0.04), 0 16px 48px rgba(29,29,31,0.12), 0 40px 80px rgba(29,29,31,0.08)',
      border: '1px solid rgba(255,255,255,0.8)',
      width: '100%',
      fontSize: 11,
    }}>
      {/* Chrome bar */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(29,29,31,0.06)', background: 'rgba(252,250,247,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 5 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#FF5F56', display: 'block' }} />
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#FFBD2E', display: 'block' }} />
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#27C93F', display: 'block' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 20, height: 20, borderRadius: 5, background: 'linear-gradient(135deg,#E67E22,#F0A050)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 11, fontWeight: 900, color: '#fff' }}>D</span>
          </div>
          <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(29,29,31,0.5)' }}>DevFlow</span>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          <span style={{ width: 14, height: 14, borderRadius: 3, background: 'rgba(29,29,31,0.06)', display: 'block' }} />
          <span style={{ width: 14, height: 14, borderRadius: 3, background: 'rgba(29,29,31,0.06)', display: 'block' }} />
          <span style={{ width: 14, height: 14, borderRadius: 3, background: 'rgba(29,29,31,0.06)', display: 'block' }} />
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Greeting */}
        <div>
          <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0, color: '#1D1D1F' }}>Good morning, Nisith 👋</h3>
          <p style={{ fontSize: 10, color: 'rgba(29,29,31,0.4)', margin: '2px 0 0' }}>Here's your workspace for today</p>
        </div>

        {/* Two-column task grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {/* Today's Plan */}
          <div>
            <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(29,29,31,0.38)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Today's Plan</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {todayTasks.map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.6 + i * 0.1 }}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 8px', background: 'rgba(29,29,31,0.025)', borderRadius: 7, border: '1px solid rgba(29,29,31,0.04)' }}
                >
                  <span style={{ fontSize: 10, color: 'rgba(29,29,31,0.7)', flex: 1, marginRight: 4, lineHeight: 1.3 }}>{t.text}</span>
                  <span style={{ fontSize: 8.5, fontWeight: 700, color: t.color, background: `${t.color}18`, padding: '2px 5px', borderRadius: 4, flexShrink: 0 }}>{t.badge}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* AI Suggestions */}
          <div>
            <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(29,29,31,0.38)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>AI Suggestions</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {aiSuggestions.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.7 + i * 0.1 }}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 8px', background: 'rgba(29,29,31,0.025)', borderRadius: 7, border: '1px solid rgba(29,29,31,0.04)' }}
                >
                  <span style={{ fontSize: 10, color: 'rgba(29,29,31,0.7)', flex: 1, marginRight: 4, lineHeight: 1.3 }}>{s.text}</span>
                  <span style={{ fontSize: 8.5, fontWeight: 700, color: s.color, background: `${s.color}18`, padding: '2px 5px', borderRadius: 4, flexShrink: 0 }}>{s.badge}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Productivity chart */}
        <div style={{ background: 'rgba(29,29,31,0.02)', borderRadius: 10, padding: '10px 12px', border: '1px solid rgba(29,29,31,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(29,29,31,0.6)' }}>Productivity</span>
            <span style={{ fontSize: 9.5, color: 'var(--lp-orange)', fontWeight: 600 }}>This Week →</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 40 }}>
            {bars.map((h, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, height: '100%', justifyContent: 'flex-end' }}>
                <motion.div
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: 1.4 + i * 0.07, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    width: '100%',
                    height: `${h}%`,
                    background: i === 5 ? 'var(--lp-orange)' : 'rgba(230,126,34,0.18)',
                    borderRadius: '2px 2px 0 0',
                    transformOrigin: 'bottom',
                  }}
                />
                <span style={{ fontSize: 7.5, color: 'rgba(29,29,31,0.3)', fontFamily: 'var(--font-mono)' }}>{days[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* GitHub Activity */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(29,29,31,0.38)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>GitHub Activity</div>
          {[
            { label: 'Commits today', value: 23 },
            { label: 'Pull requests', value: 5 },
            { label: 'Have Alias', value: 3 },
          ].map((s, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 8px', background: 'rgba(255,255,255,0.6)', borderRadius: 7, border: '1px solid rgba(29,29,31,0.04)' }}>
              <span style={{ fontSize: 10, color: 'rgba(29,29,31,0.55)' }}>{s.label}</span>
              <span style={{ fontSize: 11, fontWeight: 800, color: '#1D1D1F', fontFamily: 'var(--font-mono)' }}>{s.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Hero() {
  const navigate = useNavigate()
  const containerRef = useRef(null)
  const canvasRef = useRef(null)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springCfg = { stiffness: 100, damping: 20, mass: 0.8 }
  const rotateY = useSpring(useTransform(mouseX, [-1, 1], [4, -4]), springCfg)
  const rotateX = useSpring(useTransform(mouseY, [-1, 1], [-3, 3]), springCfg)

  const handleMouseMove = (e) => {
    if (!containerRef.current) return
    const r = containerRef.current.getBoundingClientRect()
    mouseX.set(((e.clientX - r.left) / r.width) * 2 - 1)
    mouseY.set(((e.clientY - r.top) / r.height) * 2 - 1)
  }
  const handleMouseLeave = () => { mouseX.set(0); mouseY.set(0) }

  // Canvas particles
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let raf
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)
    const pts = Array.from({ length: 24 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.4 + 0.4,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      a: Math.random() * 0.22 + 0.06,
    }))
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(230,126,34,${p.a})`; ctx.fill()
      })
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(raf) }
  }, [])

  const T = { badge: 0.1, your: 0.38, day: 0.52, structured: 0.68, before: 1.52, you: 1.65, open: 1.78, your2: 1.9, editor: 2.02, sub: 2.45, btns: 2.62, trusted: 2.8 }

  return (
    <section ref={containerRef} className="lp-hero" id="home" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }} />
      <div className="lp-bg-glow-1" />
      <div className="lp-bg-glow-2" />

      <div className="lp-wrap">
        <div className="lp-hero-inner">

          {/* ── LEFT COPY ── */}
          <div className="lp-hero-copy">
            {/* Badge */}
            <motion.div
              className="lp-label"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: T.badge }}
            >
              <Sparkles size={11} />
              DevFlow's Workspace
            </motion.div>

            {/* Headline */}
            <h1 className="lp-hero-headline">
              <span style={{ display: 'block' }}>
                <AnimWord word="Your" delay={T.your} />&nbsp;
                <AnimWord word="day," delay={T.day} />
              </span>
              <span style={{ display: 'block' }}>
                <StructuredWord delay={T.structured} />
              </span>
              <span style={{ display: 'block' }}>
                <AnimWord word="before" delay={T.before} />&nbsp;
                <AnimWord word="you" delay={T.you} />&nbsp;
                <AnimWord word="open" delay={T.open} />
              </span>
              <span style={{ display: 'block' }}>
                <AnimWord word="your" delay={T.your2} />&nbsp;
                <AnimWord word="editor." delay={T.editor} />
              </span>
            </h1>

            {/* Subtitle */}
            <motion.p
              className="lp-hero-sub"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: T.sub }}
            >
              DevFlow reads your commits, flags what needs attention, and hands you a clear plan for the day — so the first ten minutes of your morning aren't spent figuring out where you left off.
            </motion.p>

            {/* CTAs */}
            <motion.div className="lp-hero-ctas" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: T.btns }}>
              <motion.button className="lp-btn lp-btn-primary" onClick={() => navigate('/register')} whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }} style={{ padding: '12px 26px', fontSize: 14 }}>
                Start Free <ArrowRight size={14} />
              </motion.button>
              <motion.a href="#how-it-works" className="lp-btn lp-btn-secondary" onClick={e => { e.preventDefault(); document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' }) }} whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }} style={{ padding: '12px 22px', fontSize: 14 }}>
                See How It Works
              </motion.a>
            </motion.div>

            {/* Trusted */}
            <motion.div className="lp-trusted" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: T.trusted }}>
              <span className="lp-trusted-title">Trusted by devs, open at</span>
              <div className="lp-trusted-logos">
                {TRUSTED.map(({ name, Icon }, i) => (
                  <motion.span key={name} className="lp-trusted-logo" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: T.trusted + 0.1 + i * 0.09 }}>
                    <Icon />{name}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ── RIGHT: 3D Dashboard Visual ── */}
          <div className="lp-hero-visual">
            {/* Floating app icons — outside perspective so they stay crisp */}
            {/* Code icon — top left */}
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: 0 }}
              style={{ position: 'absolute', top: '2%', left: '0%', width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(145deg, rgba(255,255,255,0.95), rgba(245,244,242,0.9))', boxShadow: '0 8px 24px rgba(29,29,31,0.12), 0 2px 6px rgba(29,29,31,0.06)', border: '1px solid rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 30 }}
            >
              <Code2 size={24} color="rgba(29,29,31,0.6)" strokeWidth={1.5} />
            </motion.div>

            {/* GitHub icon — left middle */}
            <motion.div
              animate={{ y: [0, 9, 0] }}
              transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
              style={{ position: 'absolute', bottom: '28%', left: '-2%', width: 52, height: 52, borderRadius: '50%', background: '#1D1D1F', boxShadow: '0 8px 24px rgba(0,0,0,0.2), 0 2px 6px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 30 }}
            >
              <GithubSvg size={26} color="#fff" />
            </motion.div>

            {/* Analytics icon — top right */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
              style={{ position: 'absolute', top: '8%', right: '-4%', width: 58, height: 58, borderRadius: 17, background: 'linear-gradient(145deg, #E67E22, #D4711A)', boxShadow: '0 8px 24px rgba(230,126,34,0.35), 0 2px 8px rgba(230,126,34,0.2)', border: '1px solid rgba(240,160,80,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 30 }}
            >
              <BarChart3 size={26} color="#fff" strokeWidth={1.8} />
            </motion.div>

            {/* Sparkle/app icon — bottom right */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1.1 }}
              style={{ position: 'absolute', bottom: '3%', right: '-5%', width: 60, height: 60, borderRadius: 18, background: 'linear-gradient(145deg, #F0A050, #E67E22)', boxShadow: '0 8px 28px rgba(230,126,34,0.4), 0 2px 8px rgba(230,126,34,0.25)', border: '1px solid rgba(255,180,100,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 30 }}
            >
              <Sparkles size={28} color="#fff" strokeWidth={1.6} />
            </motion.div>

            {/* 3D Perspective Dashboard */}
            <motion.div
              className="lp-floating-scene"
              initial={{ opacity: 0, y: 50, rotateX: 12 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
            >
              {/* Ambient glow beneath */}
              <div style={{ position: 'absolute', bottom: -50, left: '50%', transform: 'translateX(-50%)', width: '75%', height: 100, background: 'radial-gradient(ellipse, rgba(230,126,34,0.18) 0%, transparent 70%)', filter: 'blur(18px)', pointerEvents: 'none', zIndex: 1 }} />

              {/* Dashboard */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                style={{ position: 'relative', zIndex: 10 }}
              >
                <DashboardPanel />
              </motion.div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  )
}
