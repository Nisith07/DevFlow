import { Send, Terminal } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

// Define brand icons locally to match project's lucide version constraints
const InstagramIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
)

const LinkedinIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
)

const FacebookIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
)

const GithubIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
)

export default function Footer() {
  const navigate = useNavigate()

  const handleNavClick = (sectionId, e) => {
    e.preventDefault()
    const el = document.getElementById(sectionId)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const socialLinks = [
    { label: 'GitHub', href: 'https://github.com/nisith-bhowmik', Icon: GithubIcon },
    { label: 'LinkedIn', href: 'https://linkedin.com/in/nisith-bhowmik', Icon: LinkedinIcon },
    { label: 'Instagram', href: '#', Icon: InstagramIcon },
    { label: 'Facebook', href: '#', Icon: FacebookIcon }
  ]

  return (
    <footer className="lp-footer">
      <div className="lp-wrap">
        
        {/* Footer Top Grid */}
        <div className="lp-footer-grid">
          
          {/* Brand Info */}
          <div className="lp-footer-brand" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="lp-brand" onClick={(e) => handleNavClick('home', e)} style={{ cursor: 'pointer' }}>
              <span className="lp-brand-mark" aria-hidden="true">⌘</span>
              <span>Dev<span className="lp-brand-sub">Flow</span></span>
            </div>
            <p style={{ fontSize: '13.5px', color: 'var(--color-lp-muted)', lineHeight: '1.6', margin: 0 }}>
              The calm daily workspace and AI copilot for developers who would rather ship code than fill status reports.
            </p>
            
            {/* Social Icons Row */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              {socialLinks.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid var(--color-lp-line)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-lp-muted)',
                    transition: 'all 0.25s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-lp-cyan)'
                    e.currentTarget.style.color = '#fff'
                    e.currentTarget.style.background = 'rgba(6, 182, 212, 0.05)'
                    e.currentTarget.style.boxShadow = '0 0 10px rgba(6, 182, 212, 0.2)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-lp-line)'
                    e.currentTarget.style.color = 'var(--color-lp-muted)'
                    e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div className="lp-footer-col">
            <h4>Product</h4>
            <ul>
              <li><a href="#features" onClick={(e) => handleNavClick('features', e)}>Features</a></li>
              <li><a href="#how-it-works" onClick={(e) => handleNavClick('how-it-works', e)}>Workflow</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()}>Pricing</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()}>Changelog</a></li>
            </ul>
          </div>

          {/* Resources Links */}
          <div className="lp-footer-col">
            <h4>Resources</h4>
            <ul>
              <li><a href="#" onClick={(e) => e.preventDefault()}>Docs</a></li>
              <li><a href="https://github.com/nisith-bhowmik" target="_blank" rel="noopener noreferrer">GitHub</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); navigate('/ai') }}>AI Assistant</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()}>API Status</a></li>
            </ul>
          </div>

          {/* Cyber newsletter / about signup */}
          <div className="lp-footer-col" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h4>Join the Node</h4>
            <p style={{ fontSize: '12.5px', color: 'var(--color-lp-muted)', lineHeight: '1.5', margin: 0 }}>
              Subscribe to developer insights and major software release alerts.
            </p>
            <form 
              onSubmit={(e) => { e.preventDefault(); alert('Subscribed!') }}
              style={{ display: 'flex', gap: '6px', width: '100%', position: 'relative' }}
            >
              <input
                type="email"
                placeholder="developer@node.com"
                required
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid var(--color-lp-line)',
                  borderRadius: '6px',
                  fontSize: '12px',
                  color: '#fff',
                  outline: 'none',
                  transition: 'border-color 0.25s'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--color-lp-accent)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--color-lp-line)'}
              />
              <button
                type="submit"
                style={{
                  padding: '8px 12px',
                  background: 'linear-gradient(135deg, var(--color-lp-accent), var(--color-lp-cyan))',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#fff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                aria-label="Subscribe"
              >
                <Send size={12} />
              </button>
            </form>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="lp-footer-bottom">
          <span style={{ fontSize: '12px', color: 'var(--color-lp-muted)' }}>
            © {new Date().getFullYear()} DevFlow. All rights reserved.
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-lp-muted)' }}>
            <Terminal size={12} style={{ color: 'var(--color-lp-cyan)' }} />
            built by nisith
          </span>
        </div>

      </div>
    </footer>
  )
}
