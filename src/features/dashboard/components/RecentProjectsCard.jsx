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
    <div className="card" id="recent-projects-card" style={{ flex: '1.2', minHeight: 0, display: 'flex', flexDirection: 'column', padding: '10px 12px !important' }}>
      <div className="card-head" style={{ marginBottom: '6px' }}>
        <h2 className="card-title" style={{ fontSize: '13px' }}>
          <FolderKanban size={14} className="card-title-icon" />
          Recent Projects
        </h2>
      </div>

      <div className="project-list" style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, minHeight: 0, overflowY: 'auto' }}>
        {PROJECTS.map(({ id, name, desc, icon, badge, badgeColor, status, link }) => (
          <div
            key={id}
            className="project-item neu-inset"
            id={`project-${id}`}
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
              <div style={{ fontSize: '14px' }}>{icon}</div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '11.5px', fontWeight: 'bold', color: 'var(--color-app-text)' }}>{name}</div>
                <div style={{ fontSize: '10px', color: 'var(--color-app-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{desc}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: '6px' }}>
              <span className={`tech-badge ${badgeColor}`} style={{ fontSize: '9px', padding: '2px 4px' }}>{badge}</span>
              <span
                className={`status-dot ${status}`}
                title={STATUS_LABELS[status]}
                style={{ width: '6px', height: '6px' }}
              />
              <a
                href={link}
                className="project-link-btn neu-btn"
                target="_blank"
                rel="noopener noreferrer"
                id={`open-project-${id}`}
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
