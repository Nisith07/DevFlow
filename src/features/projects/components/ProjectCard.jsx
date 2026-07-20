import { Calendar, Edit, Trash2, Clock, Star, Archive, GitBranch, Milestone } from 'lucide-react'
import { formatDate } from '@/shared/lib/utils'
import { PROJECT_STATUSES } from '@/shared/constants/taskStatuses'

export default function ProjectCard({ project, onEdit, onDelete, onFavorite, onArchive, onOpenSprints }) {
  const statusInfo = PROJECT_STATUSES[project.status] || { label: project.status, color: '#FFF' }
  const metrics = project.metrics || { progress: 0, openIssues: 0, features: 0, lastUpdated: project.updatedAt }
  
  const progressPercent = project.progress !== undefined ? project.progress : (metrics.progress || 0)

  const startFormatted = project.startDate ? formatDate(project.startDate) : ''
  const deadlineFormatted = project.deadline || project.dueDate ? formatDate(project.deadline || project.dueDate) : ''

  const getGithubUrl = (repo) => {
    if (repo.startsWith('http://') || repo.startsWith('https://')) return repo
    return `https://github.com/${repo}`
  }

  const getGithubDisplay = (repo) => {
    if (repo.startsWith('http://') || repo.startsWith('https://')) {
      const parts = repo.replace(/\/$/, '').split('/')
      if (parts.length >= 2) return `${parts[parts.length - 2]}/${parts[parts.length - 1]}`
      return 'GitHub Repo'
    }
    return repo
  }

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
        minHeight: '340px'
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0, flex: 1 }}>
            <div style={{
              width: '44px', height: '44px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '22px',
              boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.05)',
              flexShrink: 0
            }}>
              {project.icon || '📁'}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <h3 
                style={{ 
                  fontSize: '17px', 
                  fontWeight: '700', 
                  margin: '0 0 4px 0', 
                  color: 'var(--color-app-text)', 
                  letterSpacing: '-0.01em',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
                title={project.title || project.name}
              >
                {project.title || project.name}
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  fontSize: '10px', fontWeight: '700', textTransform: 'uppercase',
                  color: statusInfo.color, background: `${statusInfo.color}15`,
                  padding: '3px 8px', borderRadius: '12px', letterSpacing: '0.05em'
                }}>
                  {statusInfo.label}
                </span>
                {project.priority && (
                  <span style={{
                    fontSize: '10px', fontWeight: '650', textTransform: 'uppercase',
                    color: project.priority === 'urgent' ? 'var(--color-danger)' : project.priority === 'high' ? 'var(--color-amber)' : 'var(--color-app-muted)',
                    background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)',
                    padding: '2px 6px', borderRadius: '4px'
                  }}>
                    {project.priority}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div style={{ display: 'flex', gap: '2px', zIndex: 1, flexShrink: 0 }}>
            <button 
              onClick={() => onFavorite(project)} 
              className="df-sugg-dismiss" 
              style={{ padding: '6px', color: project.isFavorite ? 'var(--color-amber)' : 'var(--color-app-faint)' }} 
              title={project.isFavorite ? "Unfavorite" : "Favorite"}
            >
              <Star size={13} fill={project.isFavorite ? "var(--color-amber)" : "none"} />
            </button>
            <button 
              onClick={() => onArchive(project)} 
              className="df-sugg-dismiss" 
              style={{ padding: '6px', color: project.status === 'archived' ? 'var(--color-teal)' : 'var(--color-app-faint)' }} 
              title={project.status === 'archived' ? "Unarchive" : "Archive"}
            >
              <Archive size={13} />
            </button>
            <button onClick={() => onEdit(project)} className="df-sugg-dismiss" style={{ padding: '6px' }} title="Edit">
              <Edit size={13} />
            </button>
            <button onClick={() => onDelete(project.id)} className="df-sugg-dismiss" style={{ padding: '6px', color: 'var(--color-danger)' }} title="Delete Permanently">
              <Trash2 size={13} />
            </button>
          </div>
        </div>

        {/* Dates */}
        {(startFormatted || deadlineFormatted) && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--color-app-muted)', marginBottom: '14px' }}>
            <Calendar size={13} />
            <span>
              {startFormatted ? startFormatted : 'Start'}
              {' – '}
              {deadlineFormatted ? deadlineFormatted : 'No deadline'}
            </span>
          </div>
        )}

        {/* Description */}
        {project.description && (
          <p style={{
            fontSize: '13.5px',
            color: 'var(--color-app-muted)',
            lineHeight: '1.5',
            margin: '0 0 14px 0',
            display: '-webkit-box',
            WebkitLineClamp: '2',
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {project.description}
          </p>
        )}

        {/* GitHub Link */}
        {project.githubRepo && (
          <div style={{ marginBottom: '14px' }}>
            <a 
              href={getGithubUrl(project.githubRepo)} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12.5px',
                color: 'var(--color-app-muted)',
                textDecoration: 'none',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = project.color || 'var(--color-teal)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-app-muted)'}
              onClick={(e) => e.stopPropagation()}
            >
              <GitBranch size={13} />
              <span style={{ fontWeight: '500' }}>{getGithubDisplay(project.githubRepo)}</span>
            </a>
          </div>
        )}

        {/* Technologies */}
        {Array.isArray(project.technologies || project.techStack) && (project.technologies || project.techStack).length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
            {(project.technologies || project.techStack).slice(0, 4).map((tech) => (
              <span 
                key={tech} 
                style={{
                  fontSize: '11px',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  color: 'var(--color-app-muted)',
                  fontWeight: '500'
                }}
              >
                {tech}
              </span>
            ))}
            {(project.technologies || project.techStack).length > 4 && (
              <span style={{ fontSize: '11px', color: 'var(--color-app-faint)', alignSelf: 'center' }}>
                +{ (project.technologies || project.techStack).length - 4 } more
              </span>
            )}
          </div>
        )}

        {/* Progress Bar */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContext: 'space-between', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px', fontWeight: '600', color: 'var(--color-app-muted)' }}>
            <span>Progress</span>
            <span style={{ color: 'var(--color-app-text)' }}>{progressPercent}%</span>
          </div>
          <div style={{ height: '6px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{
              width: `${progressPercent}%`,
              height: '100%',
              background: project.color || 'var(--color-violet-bright)',
              borderRadius: '4px',
              transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)'
            }} />
          </div>
        </div>
      </div>

      {/* Footer Row */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        paddingTop: '14px', borderTop: '1px solid rgba(255, 255, 255, 0.04)',
        fontSize: '12px', color: 'var(--color-app-faint)', fontWeight: '500',
        gap: '12px', flexWrap: 'wrap', marginTop: 'auto'
      }}>
        {/* Team Members List */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {Array.isArray(project.teamMembers) && project.teamMembers.length > 0 ? (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {project.teamMembers.slice(0, 3).map((member, i) => (
                <div
                  key={member._id || member.id}
                  title={`${member.name} (${member.email})`}
                  style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    border: '1.5px solid var(--color-app-surface)',
                    background: 'var(--color-violet)',
                    color: '#fff',
                    fontSize: '9px',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: i > 0 ? '-6px' : '0',
                    overflow: 'hidden',
                    flexShrink: 0
                  }}
                >
                  {member.avatarUrl ? (
                    <img src={member.avatarUrl} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span>{member.name.charAt(0)}</span>
                  )}
                </div>
              ))}
              {project.teamMembers.length > 3 && (
                <span style={{ fontSize: '11px', color: 'var(--color-app-muted)', marginLeft: '4px' }}>
                  +{project.teamMembers.length - 3}
                </span>
              )}
            </div>
          ) : (
            <span style={{ fontSize: '11px', color: 'var(--color-app-faint)' }}>Solo</span>
          )}
        </div>

        {/* Sprint Management Trigger */}
        <div>
          <button 
            onClick={() => onOpenSprints(project)} 
            className="app-btn" 
            style={{
              padding: '4px 8px',
              fontSize: '11px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              background: 'rgba(255, 255, 255, 0.02)',
              color: 'var(--color-app-muted)',
              borderRadius: '6px',
              cursor: 'pointer',
              height: '24px'
            }}
          >
            <Milestone size={11} style={{ color: project.color || 'var(--color-teal)' }} />
            <span>Sprints ({project.sprints?.length || 0})</span>
          </button>
        </div>
      </div>
    </div>
  )
}
