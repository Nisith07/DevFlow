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
    <div className="card" id="top-repositories-card" style={{ flex: '1', minHeight: 0, display: 'flex', flexDirection: 'column', padding: '10px 12px !important' }}>
      <div className="card-head" style={{ marginBottom: '6px' }}>
        <h2 className="card-title" style={{ fontSize: '13px' }}>
          <BookOpen size={14} className="card-title-icon" />
          Top Repositories
        </h2>
      </div>

      <div className="repo-list" style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, minHeight: 0, overflowY: 'auto' }}>
        {REPOSITORIES.map(({ id, name, desc, lang, stars, forks, link }) => (
          <div
            key={id}
            className="repo-item neu-inset"
            id={`repo-${id}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '6px 10px',
              borderRadius: '8px',
              border: 'none',
              boxShadow: 'var(--neu-shadow-inset-sm)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1 }}>
              <BookOpen size={11} style={{ color: 'var(--color-violet-bright)', flexShrink: 0 }} />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '11.5px', fontWeight: 'bold', color: 'var(--color-app-text)' }}>{name}</div>
                <div style={{ fontSize: '10px', color: 'var(--color-app-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{desc}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '6px', fontSize: '10px', color: 'var(--color-app-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
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
                <Star size={10} />
                <span>{stars}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1px' }}>
                <GitFork size={10} />
                <span>{forks}</span>
              </div>
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="project-link-btn neu-btn"
                id={`github-repo-${id}`}
                onClick={(e) => e.stopPropagation()}
                style={{ width: '22px', height: '22px', border: 'none', borderRadius: '4px' }}
              >
                <ExternalLink size={10} style={{ color: 'var(--color-app-text)' }} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
