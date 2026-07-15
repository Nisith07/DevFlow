import { Calendar, AlertCircle, Edit, Trash2 } from 'lucide-react'
import { formatDate } from '@/shared/lib/utils'
import { PROJECT_STATUSES } from '@/shared/constants/taskStatuses'
import { PRIORITIES } from '@/shared/constants/priorities'

export default function ProjectCard({ project, onEdit, onDelete }) {
  const statusInfo = PROJECT_STATUSES[project.status] || { label: project.status, color: '#FFF' }
  const priorityInfo = PRIORITIES[project.priority] || { label: project.priority, color: '#FFF' }

  return (
    <div
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderLeft: `4px solid ${project.color || 'var(--color-lp-accent)'}`,
        position: 'relative',
        transition: 'transform 0.15s ease, border-color 0.15s ease',
      }}
    >
      <div>
        {/* Top: Icon, Status & Action row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 24 }} role="img" aria-label="project icon">
              {project.icon || '📁'}
            </span>
            <div>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  color: statusInfo.color,
                  background: `${statusInfo.color}15`,
                  padding: '3px 8px',
                  borderRadius: '12px',
                }}
              >
                {statusInfo.label}
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              onClick={() => onEdit(project)}
              className="df-sugg-dismiss"
              style={{ padding: 4 }}
              title="Edit project"
            >
              <Edit size={14} />
            </button>
            <button
              onClick={() => onDelete(project.id)}
              className="df-sugg-dismiss"
              style={{ padding: 4, color: 'var(--color-danger)' }}
              title="Delete project"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {/* Title & Description */}
        <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 6px 0', color: 'var(--color-app-text)' }}>
          {project.name}
        </h3>
        <p
          style={{
            fontSize: 13,
            color: 'var(--color-app-muted)',
            margin: '0 0 16px 0',
            lineHeight: 1.4,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {project.description || 'No description provided.'}
        </p>
      </div>

      {/* Footer: Date & Priority */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: 12,
          borderTop: '1px solid var(--color-app-border)',
          fontSize: 12,
          color: 'var(--color-app-faint)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Calendar size={13} />
          <span>{project.dueDate ? formatDate(project.dueDate) : 'No due date'}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <AlertCircle size={13} style={{ color: priorityInfo.color }} />
          <span style={{ color: 'var(--color-app-muted)', fontWeight: 500 }}>
            {priorityInfo.label}
          </span>
        </div>
      </div>
    </div>
  )
}
