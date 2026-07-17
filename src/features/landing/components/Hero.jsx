import { useEffect, useRef } from 'react'
import { ArrowRight, Sparkles, CheckCircle2, GitCommit, Clock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'

/* ── Minimal dashboard preview data ────────────────────────────────────── */
const PREVIEW_ROWS = [
  {
    icon: '✦',
    iconBg: 'rgba(139,92,246,0.15)',
    iconColor: '#8b5cf6',
    title: 'Fix auth middleware',
    meta: 'Today · 2 commits',
    badge: 'Done',
    badgeBg: 'rgba(16,185,129,0.15)',
    badgeColor: '#10b981',
  },
  {
    icon: '⚡',
    iconBg: 'rgba(6,182,212,0.15)',
    iconColor: '#06b6d4',
    title: 'AI flagged duplicate logic in routes',
    meta: 'Copilot suggestion',
    badge: 'Review',
    badgeBg: 'rgba(245,158,11,0.15)',
    badgeColor: '#f59e0b',
  },
  {
    icon: '○',
    iconBg: 'rgba(255,255,255,0.04)',
    iconColor: '#8c98ad',
    title: 'Payment API integration',
    meta: 'In progress · no commits',
    badge: 'Active',
    badgeBg: 'rgba(139,92,246,0.12)',
    badgeColor: '#8b5cf6',
  },
]

export default function Hero() {
  const navigate   = useNavigate()
  const copyRef    = useRef(null)
  const visualRef  = useRef(null)

  /* ── Entrance animation ─────────────────────────────────────────────── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Stagger in copy elements
      gsap.from('.lp-hero-label', { opacity: 0, y: 20, duration: 0.7, ease: 'power3.out', delay: 0.1 })
      gsap.from('.lp-hero-headline', { opacity: 0, y: 40, duration: 0.9, ease: 'power3.out', delay: 0.25 })
      gsap.from('.lp-hero-sub', { opacity: 0, y: 28, duration: 0.8, ease: 'power3.out', delay: 0.4 })
      gsap.from('.lp-hero-ctas', { opacity: 0, y: 20, duration: 0.7, ease: 'power3.out', delay: 0.55 })
      // Visual fades in slightly slower
      gsap.from(visualRef.current, { opacity: 0, y: 30, scale: 0.97, duration: 1.1, ease: 'power3.out', delay: 0.35 })
    })
    return () => ctx.revert()
  }, [])

  /* ── Subtle parallax on mouse move ──────────────────────────────────── */
  useEffect(() => {
    const visual = visualRef.current
    if (!visual) return
    if (window.matchMedia('(hover: none)').matches) return

    const onMove = (e) => {
      const cx = window.innerWidth  / 2
      const cy = window.innerHeight / 2
      const dx = (e.clientX - cx) / cx  // -1 to 1
      const dy = (e.clientY - cy) / cy

      gsap.to(visual, {
        x: dx * 12,
        y: dy * 8,
        rotateX: -dy * 4,
        rotateY:  dx * 4,
        duration: 0.8,
        ease: 'power2.out',
        overwrite: 'auto',
      })
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <section className="lp-hero" id="home">
      <div className="lp-hero-inner">

        {/* ── Left: copy ──────────────────────────────────────────────── */}
        <div className="lp-hero-copy" ref={copyRef}>
          <div className="lp-label lp-hero-label">
            <span className="lp-label-line" />
            Developer Workspace
          </div>

          <h1 className="lp-hero-headline">
            Your day,<br />
            <em>structured</em><br />
            before you code.
          </h1>

          <p className="lp-hero-sub">
            DevFlow unifies your tasks, commits, AI suggestions,
            and daily plans into one calm, intelligent workspace.
            Ship more. Context-switch less.
          </p>

          <div className="lp-hero-ctas">
            <button
              className="lp-btn lp-btn-primary"
              data-cursor="cta"
              onClick={() => navigate('/register')}
            >
              Start Free <ArrowRight size={15} />
            </button>
            <a
              href="#features"
              className="lp-btn lp-btn-ghost"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              See Features
            </a>
          </div>
        </div>

        {/* ── Right: visual ───────────────────────────────────────────── */}
        <div className="lp-hero-visual">
          <div className="lp-hero-glow" aria-hidden="true" />

          <div
            className="lp-preview-card"
            ref={visualRef}
            style={{ perspective: '800px', transformStyle: 'preserve-3d' }}
          >
            {/* Window chrome bar */}
            <div className="lp-preview-bar">
              <span className="lp-preview-dot" />
              <span className="lp-preview-dot" />
              <span className="lp-preview-dot" />
              <span style={{ fontSize: 10, color: '#4a5568', marginLeft: 8, fontFamily: 'JetBrains Mono, monospace' }}>
                devflow / today
              </span>
            </div>

            {/* Date header inside card */}
            <div style={{ padding: '16px 20px 4px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#4a5568', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Thursday · Jul 17
              </span>
              <span style={{ fontSize: 10, color: '#8b5cf6', fontWeight: 600 }}>
                <Sparkles size={10} style={{ display: 'inline', marginRight: 3 }} />
                AI Active
              </span>
            </div>

            <div className="lp-preview-body">
              {PREVIEW_ROWS.map((row, i) => (
                <div className="lp-preview-row" key={i}>
                  <div
                    className="lp-preview-icon"
                    style={{ background: row.iconBg, color: row.iconColor, fontSize: 14 }}
                  >
                    {row.icon}
                  </div>
                  <div className="lp-preview-text">
                    <div className="lp-preview-title">{row.title}</div>
                    <div className="lp-preview-meta">{row.meta}</div>
                  </div>
                  <span
                    className="lp-preview-badge"
                    style={{ background: row.badgeBg, color: row.badgeColor }}
                  >
                    {row.badge}
                  </span>
                </div>
              ))}

              {/* Mini commit heatmap strip */}
              <div style={{ display: 'flex', gap: 3, padding: '8px 0 4px' }}>
                {[2,5,1,7,3,8,4,9,2,6,3,5,1,8,4,9,2,6,3,5,1,7,4,8].map((v, i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      height: 20,
                      borderRadius: 3,
                      background: v > 6
                        ? 'rgba(139,92,246,0.7)'
                        : v > 4
                          ? 'rgba(139,92,246,0.35)'
                          : v > 2
                            ? 'rgba(139,92,246,0.18)'
                            : 'rgba(255,255,255,0.04)',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
