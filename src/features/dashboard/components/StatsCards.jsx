import {
  FolderKanban,
  Briefcase,
  Layers,
  GitCommit,
} from 'lucide-react'

const STAT_CARDS = [
  {
    id: 'projects',
    label: 'Projects',
    value: '12',
    icon: FolderKanban,
    colorClass: 'violet',
  },
  {
    id: 'experience',
    label: 'Experience',
    value: '1+ Years',
    icon: Briefcase,
    colorClass: 'green',
  },
  {
    id: 'technologies',
    label: 'Tech Stack',
    value: '20+ Skills',
    icon: Layers,
    colorClass: 'blue',
  },
  {
    id: 'github',
    label: 'Git Commits',
    value: '512+',
    icon: GitCommit,
    colorClass: 'amber',
  },
]

export default function StatsCards() {
  return (
    <div className="compact-stats-row">
      {STAT_CARDS.map(({ id, label, value, icon: Icon, colorClass }) => (
        <div key={id} className="stat-card" id={`stat-${id}`}>
          <div className="stat-card-info">
            <span className="stat-card-label">{label}</span>
            <span className="stat-card-value">{value}</span>
          </div>
          <div className={`stat-icon-container ${colorClass}`} style={{ width: '32px', height: '32px', borderRadius: '8px' }}>
            <Icon size={16} />
          </div>
        </div>
      ))}
    </div>
  )
}
