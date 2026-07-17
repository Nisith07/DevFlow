import { useNavigate } from 'react-router-dom'

/* ── Inline brand SVG icons (lucide-react doesn't export these) ──────── */
const GithubIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.79-.26.79-.58v-2.23c-3.34.73-4.03-1.42-4.03-1.42-.55-1.39-1.33-1.76-1.33-1.76-1.09-.74.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.49.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23.96-.27 1.98-.4 3-.4s2.04.13 3 .4c2.28-1.55 3.29-1.23 3.29-1.23.66 1.65.24 2.87.12 3.18.77.84 1.24 1.9 1.24 3.22 0 4.61-2.8 5.62-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.19.69.8.57C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"/>
  </svg>
)

const LinkedinIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM6.9 20.45H3.78V9H6.9v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45C23.2 24 24 23.23 24 22.27V1.73C24 .77 23.2 0 22.22 0z"/>
  </svg>
)

const InstagramIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
)

const FacebookIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.41 0 12.07c0 5.99 4.39 10.95 10.13 11.85v-8.38H7.08v-3.47h3.05V9.43c0-3.02 1.8-4.67 4.53-4.67 1.31 0 2.69.24 2.69.24v2.95h-1.51c-1.49 0-1.96.93-1.96 1.87v2.25h3.33l-.53 3.47h-2.8v8.38C19.61 23.02 24 18.06 24 12.07z"/>
  </svg>
)

const SOCIALS = [
  { Icon: GithubIcon,    href: 'https://github.com',    label: 'GitHub' },
  { Icon: LinkedinIcon,  href: 'https://linkedin.com',  label: 'LinkedIn' },
  { Icon: InstagramIcon, href: '#',                     label: 'Instagram' },
  { Icon: FacebookIcon,  href: '#',                     label: 'Facebook' },
]

const COLS = [
  {
    title: 'Product',
    links: [
      { label: 'Features',    href: '#features' },
      { label: 'How It Works',href: '#how-it-works' },
      { label: 'Pricing',     href: '#' },
      { label: 'Changelog',   href: '#' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Documentation', href: '#' },
      { label: 'GitHub',        href: 'https://github.com' },
      { label: 'Blog',          href: '#' },
      { label: 'API Status',    href: '#' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About',   href: '#about' },
      { label: 'Privacy', href: '#' },
      { label: 'Terms',   href: '#' },
    ],
  },
]

export default function Footer() {
  const navigate = useNavigate()

  const scroll = (href, e) => {
    e.preventDefault()
    const id = href.replace('#', '')
    if (!id) return
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer className="lp-footer">
      <div className="lp-wrap">
        <div className="lp-footer-grid">

          {/* Brand column */}
          <div>
            <button
              className="lp-brand"
              onClick={(e) => scroll('#home', e)}
              style={{ marginBottom: 0 }}
            >
              <span className="lp-brand-dot" />
              DevFlow
            </button>
            <p className="lp-footer-desc">
              The daily workspace for developers who'd rather ship than status-report.
              Unifying tasks, commits, and AI in one focused view.
            </p>
            <div className="lp-footer-socials">
              {SOCIALS.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  className="lp-footer-social"
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  aria-label={label}
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {COLS.map(({ title, links }) => (
            <div key={title}>
              <div className="lp-footer-col-title">{title}</div>
              <ul className="lp-footer-col-links">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <a
                      href={href}
                      onClick={href.startsWith('#') && href !== '#' ? (e) => scroll(href, e) : undefined}
                      target={href.startsWith('http') ? '_blank' : undefined}
                      rel="noopener noreferrer"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        <div className="lp-footer-bottom">
          <span className="lp-footer-copy">
            © {new Date().getFullYear()} DevFlow. All rights reserved.
          </span>
          <span className="lp-footer-copy" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
            built by nisith
          </span>
        </div>
      </div>
    </footer>
  )
}
