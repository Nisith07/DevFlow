import { FolderKanban, ExternalLink } from 'lucide-react'

const PROJECTS = [
  {
    id: 'devflow',
    name: 'DevFlow',
    desc: 'Project Dashboard',
    icon: '⚡',
    badge: 'MERN',
    badgeColor: 'violet',
    status: 'active',
    link: '#',
  },
  {
    id: 'swadify',
    name: 'Swadify',
    desc: 'Food Delivery',
    icon: '🍕',
    badge: 'MERN',
    badgeColor: 'violet',
    status: 'wip',
    link: '#',
  },
  {
    id: 'otp-auth',
    name: 'OTP Auth',
    desc: 'Secure Auth API',
    icon: '🔐',
    badge: 'React',
    badgeColor: 'blue',
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
    <div className="card" id="recent-projects-card" style={{ flex: '1.2', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
      <div className="card-head">
        <h2 className="card-title">
          <FolderKanban size={14} className="card-title-icon" />
          Recent Projects
        </h2>
      </div>

      <div className="project-list">
        {PROJECTS.map(({ id, name, desc, icon, badge, badgeColor, status, link }) => (
          <div
            key={id}
            className="project-item neu-inset"
            id={`project-${id}`}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1 }}>
              <div className="project-icon-wrap" style={{ fontSize: '14px', flexShrink: 0 }}>{icon}</div>
              <div className="project-info">
                <div className="project-name">{name}</div>
                <div className="project-desc">{desc}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '6px' }}>
              <span className={`tech-badge ${badgeColor}`}>{badge}</span>
              <span
                className={`status-dot ${status}`}
                title={STATUS_LABELS[status]}
              />
              <a
                href={link}
                className="project-link-btn neu-btn"
                target="_blank"
                rel="noopener noreferrer"
                id={`open-project-${id}`}
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
