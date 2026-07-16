import { BookOpen, Star, GitFork, ExternalLink } from 'lucide-react'

const LANG_COLORS = {
  JavaScript: '#F7DF1E',
  React: '#61DAFB',
}

const REPOSITORIES = [
  {
    id: 'devflow-repo',
    name: 'DevFlow',
    desc: 'Full-stack PM tool',
    lang: 'JavaScript',
    stars: 24,
    forks: 8,
    link: 'https://github.com/nisith-bhowmik/devflow',
  },
  {
    id: 'swadify-repo',
    name: 'Swadify',
    desc: 'Food delivery app',
    lang: 'JavaScript',
    stars: 18,
    forks: 5,
    link: 'https://github.com/nisith-bhowmik/swadify',
  },
  {
    id: 'otp-auth-repo',
    name: 'OTP-Auth',
    desc: 'Email OTP system',
    lang: 'JavaScript',
    stars: 15,
    forks: 4,
    link: 'https://github.com/nisith-bhowmik/otp-auth',
  },
]

export default function TopRepositories() {
  return (
    <div className="card" id="top-repositories-card" style={{ flex: '1', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
      <div className="card-head">
        <h2 className="card-title">
          <BookOpen size={14} className="card-title-icon" />
          Top Repositories
        </h2>
      </div>

      <div className="repo-list">
        {REPOSITORIES.map(({ id, name, desc, lang, stars, forks, link }) => (
          <div
            key={id}
            className="repo-item neu-inset"
            id={`repo-${id}`}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1 }}>
              <BookOpen size={12} style={{ color: 'var(--color-violet-bright)', flexShrink: 0 }} />
              <div className="repo-info">
                <div className="repo-name">{name}</div>
                <div className="repo-desc">{desc}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '6px', fontSize: '10px', color: 'var(--color-app-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: LANG_COLORS[lang] || '#6B7280'
                  }}
                />
                <span>JS</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1px', color: 'var(--color-amber)' }}>
                <Star size={11} />
                <span>{stars}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1px' }}>
                <GitFork size={11} />
                <span>{forks}</span>
              </div>
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="project-link-btn neu-btn"
                id={`github-repo-${id}`}
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink size={11} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
