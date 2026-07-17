import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ChevronDown, Globe2, LogIn, Menu, Sparkles, X } from 'lucide-react'
import { useAuth } from '@/features/auth/hooks/useAuth'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Track scroll position for glassmorphism and active section link highlighting
  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 12)

      // Only track active sections on the home/landing page '/'
      if (location.pathname !== '/') return

      const sections = ['home', 'features', 'how-it-works', 'about']
      const scrollPos = window.scrollY + 200

      for (const section of sections) {
        const el = document.getElementById(section)
        if (el) {
          const top = el.offsetTop
          const height = el.offsetHeight
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [location])

  const handleNavClick = (sectionId, e) => {
    e.preventDefault()
    setMenuOpen(false)
    
    if (location.pathname !== '/') {
      navigate(`/#${sectionId}`)
      return
    }

    const isMobile = window.innerWidth <= 768 || 'ontouchstart' in window
    if (!isMobile) {
      const sectionIndices = {
        'home': 0,
        'features': 1,
        'how-it-works': 2,
        'about': 3
      }
      const idx = sectionIndices[sectionId] !== undefined ? sectionIndices[sectionId] : 0
      window.scrollTo({
        top: window.innerHeight * idx,
        behavior: 'smooth'
      })
      setActiveSection(sectionId)
      return
    }

    const el = document.getElementById(sectionId)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
      setActiveSection(sectionId)
    }
  }

  const goToDashboard = () => navigate('/dashboard')

  return (
    <header className={`lp-nav ${hasScrolled ? 'lp-nav-scrolled' : ''}`} style={hasScrolled ? { background: 'rgba(3, 5, 12, 0.9)', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)' } : {}}>
      <div className="lp-nav-inner">
        {/* Brand logo */}
        <button
          className="lp-brand"
          onClick={(e) => handleNavClick('home', e)}
          aria-label="DevFlow home"
        >
          <span className="lp-brand-mark" aria-hidden="true">⌘</span>
          <span>Dev<span className="lp-brand-sub">Flow</span></span>
        </button>

        {/* Links (Desktop) */}
        <nav className="lp-links" aria-label="Main navigation">
          {['home', 'features', 'how-it-works', 'about'].map((sec) => (
            <a
              key={sec}
              href={`#${sec}`}
              onClick={(e) => handleNavClick(sec, e)}
              className={activeSection === sec ? 'active' : ''}
              style={{ textTransform: 'capitalize' }}
            >
              {sec.replace('-', ' ')}
            </a>
          ))}
        </nav>

        {/* Actions (Desktop) */}
        <div className="lp-nav-actions">
          <button
            className="lp-btn lp-btn-ghost"
            style={{ padding: '6px 12px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px', border: '1px solid var(--color-lp-line)' }}
            type="button"
            aria-label="Language Selector"
          >
            <Globe2 size={13} />
            ENG
            <ChevronDown size={12} />
          </button>

          {/* AI Copilot Button */}
          <button
            className="lp-btn lp-btn-ghost"
            onClick={() => isAuthenticated ? navigate('/ai') : navigate('/login', { state: { from: { pathname: '/ai' } } })}
            style={{ padding: '8px 14px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', border: '1px solid rgba(6, 182, 212, 0.3)', color: 'var(--color-lp-cyan)' }}
          >
            <Sparkles size={13} style={{ color: 'var(--color-lp-cyan)' }} />
            <span>AI Copilot</span>
          </button>

          {isAuthenticated ? (
            <button className="lp-btn lp-btn-primary" style={{ padding: '8px 16px', fontSize: '13px' }} onClick={goToDashboard}>
              Go to Dashboard
            </button>
          ) : (
            <>
              <button
                className="lp-btn lp-btn-ghost"
                style={{ padding: '8px 14px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
                onClick={() => navigate('/login')}
              >
                <LogIn size={13} />
                <span>Log in</span>
              </button>
              <button
                className="lp-btn lp-btn-primary"
                style={{ padding: '8px 16px', fontSize: '13px' }}
                onClick={() => navigate('/register')}
              >
                Get started
              </button>
            </>
          )}
        </div>

        {/* Hamburger toggle (Mobile) */}
        <button
          className="lp-nav-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle Navigation Menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Slide-over Mobile Navigation Menu */}
      {menuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: '72px 0 0 0',
            background: 'rgba(3, 5, 12, 0.98)',
            backdropFilter: 'blur(20px)',
            zIndex: 999,
            display: 'flex',
            flexDirection: 'column',
            padding: '32px 24px',
            gap: '24px',
            borderTop: '1px solid var(--color-lp-line)',
            animation: 'fadeIn 0.25s ease-out'
          }}
        >
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {['home', 'features', 'how-it-works', 'about'].map((sec) => (
              <a
                key={sec}
                href={`#${sec}`}
                onClick={(e) => handleNavClick(sec, e)}
                style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: activeSection === sec ? 'var(--color-lp-cyan)' : 'var(--color-lp-muted)',
                  textTransform: 'capitalize'
                }}
              >
                {sec.replace('-', ' ')}
              </a>
            ))}
          </nav>

          <hr style={{ border: 'none', borderTop: '1px solid var(--color-lp-line)' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              className="lp-btn lp-btn-ghost"
              onClick={() => { setMenuOpen(false); navigate(isAuthenticated ? '/ai' : '/login') }}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <Sparkles size={14} style={{ color: 'var(--color-lp-cyan)' }} />
              AI Copilot
            </button>

            {isAuthenticated ? (
              <button
                className="lp-btn lp-btn-primary"
                onClick={() => { setMenuOpen(false); goToDashboard() }}
                style={{ width: '100%' }}
              >
                Go to Dashboard
              </button>
            ) : (
              <>
                <button
                  className="lp-btn lp-btn-ghost"
                  onClick={() => { setMenuOpen(false); navigate('/login') }}
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  Log in
                </button>
                <button
                  className="lp-btn lp-btn-primary"
                  onClick={() => { setMenuOpen(false); navigate('/register') }}
                  style={{ width: '100%' }}
                >
                  Get started
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
