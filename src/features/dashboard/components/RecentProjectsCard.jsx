import { FolderKanban, ArrowRight, ExternalLink } from 'lucide-react'

const PROJECTS = [
  {
    id: 'devflow',
    name: 'DevFlow',
    desc: 'Project Management Platform',
    icon: '⚡',
    badge: 'MERN',
    badgeColor: 'violet',
    status: 'active',
    link: '#',
  },
  {
    id: 'swadify',
    name: 'Swadify',
    desc: 'Food Delivery Platform',
    icon: '🍕',
    badge: 'MERN',
    badgeColor: 'violet',
    status: 'wip',
    link: '#',
  },
  {
    id: 'otp-auth',
    name: 'OTP Auth',
    desc: 'Authentication System',
    icon: '🔐',
    badge: 'MERN',
    badgeColor: 'blue',
    status: 'done',
    link: '#',
  },
  {
    id: 'spotify-clone',
    name: 'Spotify Clone',
    desc: 'React-based Music UI',
    icon: '🎵',
    badge: 'React',
    badgeColor: 'green',
    status: 'done',
    link: '#',
  },
]

const STATUS_LABELS = {
  active: 'Live',
  wip: 'WIP',
  done: 'Done',
}

export default function RecentProjectsCard() {
  return (
    <div className="card" id="recent-projects-card">
      <div className="card-head">
        <h2 className="card-title">
          <FolderKanban size={13} className="card-title-icon" />
          Recent Projects
          <span style={{ color: 'var(--color-app-faint)', fontWeight: 400 }}>
            Some of my latest work
          </span>
        </h2>
      </div>

      <div className="project-list">
        {PROJECTS.map(({ id, name, desc, icon, badge, badgeColor, status, link }) => (
          <div key={id} className="project-item" id={`project-${id}`}>
            <div className="project-icon" aria-hidden="true">{icon}</div>

            <div className="project-info">
              <div className="project-name">{name}</div>
              <div className="project-desc">{desc}</div>
            </div>

            <div className="project-meta">
              <span className={`tech-badge ${badgeColor}`}>{badge}</span>
              <span
                className={`status-dot ${status}`}
                title={STATUS_LABELS[status]}
                aria-label={`Status: ${STATUS_LABELS[status]}`}
              />
              <a
                href={link}
                className="project-link-btn"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${name}`}
                id={`open-project-${id}`}
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink size={11} />
              </a>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--color-app-border)' }}>
        <button
          className="card-link-btn"
          id="view-all-projects-btn"
          aria-label="View all projects"
          style={{ width: '100%', justifyContent: 'center' }}
        >
          View All Projects
          <ArrowRight size={13} />
        </button>
      </div>
    </div>
  )
}
