import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useAuth } from '@/features/auth/hooks/useAuth'

import DevFlowLogo from '@/shared/components/DevFlowLogo'

const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Features', href: '#features' },
  { label: 'How it Works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Docs', href: '#docs' },
  { label: 'Changelog', href: '#' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeSection, setActive] = useState('home')
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  /* ── Scroll tracking ─────────────────────────────────────────────── */
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20)

      if (location.pathname !== '/') return
      const ids = ['home', 'features', 'how-it-works', 'about']
      const offset = window.scrollY + 140
      for (let i = ids.length - 1; i >= 0; i--) {
        const el = document.getElementById(ids[i])
        if (el && el.offsetTop <= offset) {
          setActive(ids[i])
          break
        }
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [location.pathname])

  /* ── Smooth scroll (or navigate then scroll) ─────────────────────── */
  const scrollTo = (href, e) => {
    e.preventDefault()
    setMobileOpen(false)
    const id = href.replace('#', '')

    if (location.pathname !== '/') {
      navigate('/')
      // Wait for page to mount, then scroll
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
      return
    }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <nav className={`lp-nav ${scrolled ? 'lp-nav-scrolled' : ''}`} aria-label="Main navigation">
        <div className="lp-nav-inner">

          {/* Brand */}
          <button className="lp-brand" onClick={(e) => scrollTo('#home', e)} aria-label="Devflow home">
            <DevFlowLogo size={32} iconSize={18} />
            <span>DevFlow</span>
          </button>

          {/* Desktop links */}
          <ul className="lp-nav-links" role="list">
            {NAV_LINKS.map(({ label, href }) => {
              const id = href.replace('#', '')
              return (
                <li key={href}>
                  <a
                    href={href}
                    onClick={(e) => scrollTo(href, e)}
                    className={activeSection === id ? 'lp-nav-active' : ''}
                  >
                    {label}
                  </a>
                </li>
              )
            })}
          </ul>

          {/* Desktop actions */}
          <div className="lp-nav-actions">
            {isAuthenticated ? (
              <button
                className="lp-btn lp-btn-primary"
                onClick={() => navigate('/dashboard')}
              >
                Dashboard
              </button>
            ) : (
              <>
                <button
                  className="lp-btn lp-btn-ghost"
                  onClick={() => navigate('/login')}
                >
                  Login
                </button>
                <button
                  className="lp-btn lp-btn-primary"
                  onClick={() => navigate('/register')}
                >
                  Get Started
                </button>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="lp-nav-toggle"
            onClick={() => setMobileOpen(v => !v)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lp-mobile-menu" role="dialog" aria-label="Mobile navigation">
          {NAV_LINKS.map(({ label, href }) => (
            <a key={href} href={href} onClick={(e) => scrollTo(href, e)}>
              {label}
            </a>
          ))}
          <hr className="lp-divider" />
          {isAuthenticated ? (
            <button className="lp-btn lp-btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => { setMobileOpen(false); navigate('/dashboard') }}>
              Dashboard
            </button>
          ) : (
            <>
              <button className="lp-btn lp-btn-ghost" style={{ width: '100%', justifyContent: 'center' }} onClick={() => { setMobileOpen(false); navigate('/login') }}>Login</button>
              <button className="lp-btn lp-btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => { setMobileOpen(false); navigate('/register') }}>Get Started</button>
            </>
          )}
        </div>
      )}
    </>
  )
}
