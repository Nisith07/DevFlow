const FOOTER_COLS = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'Pricing',  href: '#' },
      { label: 'Changelog', href: '#' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Docs',   href: '#' },
      { label: 'GitHub', href: '#' },
      { label: 'Blog',   href: '#' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Terms',   href: '#' },
      { label: 'Privacy', href: '#' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="lp-footer" id="about">
      <div className="lp-wrap">
        <div className="lp-footer-grid">
          {/* Brand */}
          <div className="lp-footer-brand">
            <div className="lp-brand">
              <span className="lp-brand-mark">D</span>
              Dev<span className="lp-brand-sub">flow</span>
            </div>
            <p>The daily workspace for developers who&apos;d rather ship than status-report.</p>
          </div>

          {/* Link columns */}
          {FOOTER_COLS.map((col) => (
            <div key={col.title} className="lp-footer-col">
              <h4>{col.title}</h4>
              <ul>
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      onClick={link.href === '#' ? (e) => e.preventDefault() : undefined}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="lp-footer-bottom">
          <span>© {new Date().getFullYear()} Devflow. All rights reserved.</span>
          <span style={{ fontFamily: 'var(--font-mono)' }}>built by nisith</span>
        </div>
      </div>
    </footer>
  )
}
