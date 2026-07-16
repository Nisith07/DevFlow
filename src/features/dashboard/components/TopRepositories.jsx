import { BookOpen, Star, GitFork, Clock, ExternalLink, ArrowRight } from 'lucide-react'

/** Language color map — expand as needed */
const LANG_COLORS = {
  JavaScript: '#F7DF1E',
  TypeScript: '#3178C6',
  Java:       '#f89820',
  Python:     '#3776AB',
  HTML:       '#E34F26',
  CSS:        '#1572B6',
  Go:         '#00ADD8',
}

const REPOSITORIES = [
  {
    id: 'devflow-repo',
    name: 'DevFlow',
    desc: 'A full stack project management tool',
    lang: 'JavaScript',
    stars: 24,
    forks: 8,
    updated: '2 days ago',
    link: 'https://github.com/nisith-bhowmik/devflow',
  },
  {
    id: 'swadify-repo',
    name: 'Swadify',
    desc: 'Food delivery platform',
    lang: 'JavaScript',
    stars: 18,
    forks: 5,
    updated: '1 week ago',
    link: 'https://github.com/nisith-bhowmik/swadify',
  },
  {
    id: 'otp-auth-repo',
    name: 'OTP-Auth',
    desc: 'Email OTP authentication system',
    lang: 'JavaScript',
    stars: 15,
    forks: 4,
    updated: '2 weeks ago',
    link: 'https://github.com/nisith-bhowmik/otp-auth',
  },
  {
    id: 'spotify-clone-repo',
    name: 'Spotify Clone',
    desc: 'Spotify UI clone using React',
    lang: 'JavaScript',
    stars: 12,
    forks: 3,
    updated: '1 month ago',
    link: 'https://github.com/nisith-bhowmik/spotify-clone',
  },
]

export default function TopRepositories() {
  return (
    <div className="card" id="top-repositories-card">
      <div className="card-head">
        <h2 className="card-title">
          <BookOpen size={13} className="card-title-icon" />
          Top Repositories
        </h2>
      </div>

      <div className="repo-list">
        {REPOSITORIES.map(({ id, name, desc, lang, stars, forks, updated, link }) => (
          <div key={id} className="repo-item" id={`repo-${id}`}>
            <div className="repo-icon">
              <BookOpen size={13} />
            </div>

            <div className="repo-info">
              <div className="repo-name">{name}</div>
              <div className="repo-desc">{desc}</div>
            </div>

            <div className="repo-meta">
              {lang && (
                <div className="repo-meta-item">
                  <span
                    className="repo-lang-dot"
                    style={{ background: LANG_COLORS[lang] || '#6B7280' }}
                    aria-hidden="true"
                  />
                  {lang}
                </div>
              )}
              <div className="repo-meta-item repo-star" aria-label={`${stars} stars`}>
                <Star size={11} />
                {stars}
              </div>
              <div className="repo-meta-item repo-fork" aria-label={`${forks} forks`}>
                <GitFork size={11} />
                {forks}
              </div>
              <div className="repo-meta-item" aria-label={`Updated ${updated}`}>
                <Clock size={10} />
                {updated}
              </div>
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="project-link-btn"
                aria-label={`Open ${name} on GitHub`}
                id={`github-repo-${id}`}
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink size={11} />
              </a>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--color-app-border)' }}>
        <a
          href="https://github.com/nisith-bhowmik?tab=repositories"
          target="_blank"
          rel="noopener noreferrer"
          className="card-link-btn"
          id="view-all-repositories-btn"
          aria-label="View all repositories on GitHub"
          style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 5, justifyContent: 'center', width: '100%' }}
        >
          View All Repositories
          <ArrowRight size={13} />
        </a>
      </div>
    </div>
  )
}
