import { ChevronDown, Globe2, LogIn, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Navbar({ onGetStarted, onLoginClick }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="navbar">
      <div className="navbar-container">
        <button className="navbar-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Devflow home">
          <span className="navbar-logo-icon">D</span>
          <span className="navbar-logo-text">Dev<span>flow</span></span>
        </button>

        <nav className={`navbar-links ${menuOpen ? 'open' : ''}`} aria-label="Main navigation">
          <a href="#home" className="navbar-link" onClick={() => setMenuOpen(false)}>Home</a>
          <a href="#features" className="navbar-link" onClick={() => setMenuOpen(false)}>Features</a>
          <a href="#how-it-works" className="navbar-link" onClick={() => setMenuOpen(false)}>Works</a>
          <a href="#blog" className="navbar-link" onClick={() => setMenuOpen(false)}>Blog</a>
          <a href="#about" className="navbar-link" onClick={() => setMenuOpen(false)}>About</a>
        </nav>

        <div className="navbar-actions">
          <button className="navbar-language" type="button" aria-label="Language: English">
            <Globe2 size={15} aria-hidden="true" /> ENG <ChevronDown size={14} aria-hidden="true" />
          </button>
          <button className="navbar-login-btn" onClick={onLoginClick}>
            <LogIn size={16} aria-hidden="true" /> <span>Log in</span>
          </button>
          <button className="navbar-get-started" onClick={onGetStarted}>
            Get started
          </button>
        </div>

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
