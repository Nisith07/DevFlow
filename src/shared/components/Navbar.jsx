import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, Globe2, LogIn, Menu, Sparkles, X } from 'lucide-react'
import { useAuth } from '@/features/auth/hooks/useAuth'

/**
 * Landing page top navbar. Auth-aware — shows "Go to Dashboard" when signed in.
 *
 * @param {{ onLoginClick: (redirectPath?: string) => void }} props
 */
export default function Navbar({ onLoginClick }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const update = () => setHasScrolled(window.scrollY > 12)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  const goToDashboard = () => navigate('/dashboard')

  return (
    <header className={`navbar ${hasScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Brand */}
        <button
          className="navbar-logo"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="DevFlow home"
        >
          <span className="navbar-logo-icon" aria-hidden="true">⌘</span>
          <span className="navbar-logo-text">
            Dev<span>Flow</span>
          </span>
        </button>

        {/* Links */}
        <nav
          className={`navbar-links ${menuOpen ? 'open' : ''}`}
          aria-label="Main navigation"
        >
          <a href="#home"         className="navbar-link" onClick={() => setMenuOpen(false)}>Home</a>
          <a href="#features"     className="navbar-link" onClick={() => setMenuOpen(false)}>Features</a>
          <a href="#how-it-works" className="navbar-link" onClick={() => setMenuOpen(false)}>How it works</a>
          <a href="#about"        className="navbar-link" onClick={() => setMenuOpen(false)}>About</a>
        </nav>

        {/* Actions */}
        <div className="navbar-actions">
          <button className="navbar-language" type="button" aria-label="Language: English">
            <Globe2 size={15} aria-hidden="true" />
            ENG
            <ChevronDown size={14} aria-hidden="true" />
          </button>

          {/* AI Copilot button — always visible */}
          <button
            className="navbar-ai-btn"
            onClick={() => isAuthenticated ? navigate('/ai') : onLoginClick('/ai')}
            aria-label="Open AI Copilot"
            title="AI Copilot"
          >
            <Sparkles size={15} aria-hidden="true" />
            <span>AI Copilot</span>
          </button>

          {isAuthenticated ? (
            <button className="navbar-get-started" onClick={goToDashboard}>
              Go to Dashboard
            </button>
          ) : (
            <>
              <button className="navbar-login-btn" onClick={onLoginClick}>
                <LogIn size={16} aria-hidden="true" />
                <span>Log in</span>
              </button>
              <button className="navbar-get-started" onClick={onLoginClick}>
                Get started
              </button>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="navbar-menu-toggle"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </header>
  )
}
