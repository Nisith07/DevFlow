import { Calendar, AlertCircle, Edit, Trash2, GitPullRequest, LayoutTemplate, Clock, MoreVertical } from 'lucide-react'
import { formatDate } from '@/shared/lib/utils'
import { PROJECT_STATUSES } from '@/shared/constants/taskStatuses'

export default function ProjectCard({ project, onEdit, onDelete }) {
  const statusInfo = PROJECT_STATUSES[project.status] || { label: project.status, color: '#FFF' }
  const metrics = project.metrics || { progress: 0, openIssues: 0, features: 0, lastUpdated: project.updatedAt }

  return (
    <div
      className="card hover-lift"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '24px',
        background: 'var(--color-app-surface)',
        border: '1px solid rgba(255, 255, 255, 0.03)',
        borderRadius: '16px',
        position: 'relative',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
      }}
    >
      {/* Decorative Gradient Glow matching project color */}
      <div 
        style={{
          position: 'absolute',
          top: 0, right: 0,
          width: '150px', height: '150px',
          background: `radial-gradient(circle at top right, ${project.color || 'var(--color-violet-dim)'}25, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      <div>
        {/* Header: Icon, Name & Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '44px', height: '44px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '22px',
              boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.05)'
            }}>
              {project.icon || '📁'}
            </div>
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: '700', margin: '0 0 4px 0', color: 'var(--color-app-text)', letterSpacing: '-0.01em' }}>
                {project.name}
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  fontSize: '10px', fontWeight: '700', textTransform: 'uppercase',
                  color: statusInfo.color, background: `${statusInfo.color}15`,
                  padding: '3px 8px', borderRadius: '12px', letterSpacing: '0.05em'
                }}>
                  {statusInfo.label}
                </span>
              </div>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '4px', zIndex: 1 }}>
            <button onClick={() => onEdit(project)} className="df-sugg-dismiss" style={{ padding: '6px' }} title="Edit">
              <Edit size={14} />
            </button>
            <button onClick={() => onDelete(project.id)} className="df-sugg-dismiss" style={{ padding: '6px', color: 'var(--color-danger)' }} title="Archive">
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px', fontWeight: '600', color: 'var(--color-app-muted)' }}>
            <span>Progress</span>
            <span style={{ color: 'var(--color-app-text)' }}>{metrics.progress}%</span>
          </div>
          <div style={{ height: '6px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{
              width: `${metrics.progress}%`,
              height: '100%',
              background: project.color || 'var(--color-violet-bright)',
              borderRadius: '4px',
              transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)'
            }} />
          </div>
        </div>

        {/* Metrics Grid */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px'
        }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-app-faint)', fontSize: '12px', marginBottom: '6px' }}>
              <GitPullRequest size={14} />
              Open Issues
            </div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: 'var(--color-app-text)' }}>{metrics.openIssues}</div>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-app-faint)', fontSize: '12px', marginBottom: '6px' }}>
              <LayoutTemplate size={14} />
              Features
            </div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: 'var(--color-app-text)' }}>{metrics.features}</div>
          </div>
        </div>
      </div>

      {/* Footer: Date updated */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.04)',
        fontSize: '12px', color: 'var(--color-app-faint)', fontWeight: '500'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Clock size={13} />
          <span>Last Updated {formatDate(metrics.lastUpdated || project.updatedAt)}</span>
        </div>
      </div>
    </div>
  )
}
