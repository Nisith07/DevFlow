import { AlertCircle, Bug, BookOpen, Sparkles, MessageSquare, Trash2, Edit, CheckCircle } from 'lucide-react'

const PRIORITY_COLORS = {
  low: 'var(--color-app-muted)',
  medium: 'var(--color-violet)',
  high: 'var(--color-amber)',
  urgent: 'var(--color-danger)'
}

export default function IssueCard({ issue, onEdit, onDelete }) {
  const isClosed = issue.status === 'closed'
  const hasComments = issue.comments?.length > 0

  const getTypeIcon = () => {
    switch (issue.type) {
      case 'bug':
        return <Bug size={12} style={{ color: 'var(--color-danger)' }} />
      case 'feature_request':
        return <Sparkles size={12} style={{ color: 'var(--color-teal)' }} />
      case 'documentation':
        return <BookOpen size={12} style={{ color: 'var(--color-violet-bright)' }} />
      default:
        return <AlertCircle size={12} />
    }
  }

  const getTypeLabel = () => {
    switch (issue.type) {
      case 'bug': return 'Bug'
      case 'feature_request': return 'Feature'
      case 'documentation': return 'Docs'
      default: return issue.type
    }
  }

  const getTypeColor = () => {
    switch (issue.type) {
      case 'bug': return 'var(--color-danger)'
      case 'feature_request': return 'var(--color-teal)'
      case 'documentation': return 'var(--color-violet-bright)'
      default: return 'var(--color-app-muted)'
    }
  }

  return (
    <div
      className="card hover-lift"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '20px',
        background: 'var(--color-app-surface)',
        border: '1px solid rgba(255, 255, 255, 0.03)',
        borderRadius: '14px',
        position: 'relative',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        opacity: isClosed ? 0.65 : 1,
        minHeight: '190px'
      }}
    >
      <div>
        {/* Header: Status, Title, Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, minWidth: 0, flex: 1 }}>
            <div style={{ marginTop: 3, flexShrink: 0 }}>
              {isClosed ? (
                <CheckCircle size={15} style={{ color: '#a78bfa' }} title="Closed" />
              ) : (
                <AlertCircle size={15} style={{ color: '#10b981' }} title="Open" />
              )}
            </div>
            
            <div style={{ minWidth: 0, flex: 1 }}>
              <h4 
                style={{ 
                  fontSize: '14.5px', 
                  fontWeight: '700', 
                  margin: 0, 
                  color: 'var(--color-app-text)',
                  lineHeight: 1.4,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
                title={issue.title}
              >
                {issue.title}
              </h4>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 2, flexShrink: 0, zIndex: 1 }}>
            <button onClick={() => onEdit(issue)} className="df-sugg-dismiss" style={{ padding: '4px' }} title="Edit Issue">
              <Edit size={12} />
            </button>
            <button onClick={() => onDelete(issue.id)} className="df-sugg-dismiss" style={{ padding: '4px', color: 'var(--color-danger)' }} title="Delete Issue">
              <Trash2 size={12} />
            </button>
          </div>
        </div>

        {/* Badges Row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
          {/* Type Badge */}
          <span style={{
            fontSize: '10.5px', fontWeight: '700', textTransform: 'uppercase',
            color: getTypeColor(), background: `${getTypeColor()}12`,
            padding: '2px 8px', borderRadius: '12px', display: 'inline-flex', alignItems: 'center', gap: 4
          }}>
            {getTypeIcon()}
            <span>{getTypeLabel()}</span>
          </span>

          {/* Priority Badge */}
          {issue.priority && (
            <span style={{
              fontSize: '10.5px', fontWeight: '650', textTransform: 'uppercase',
              color: PRIORITY_COLORS[issue.priority] || 'var(--color-app-muted)',
              background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)',
              padding: '1px 6px', borderRadius: '4px'
            }}>
              {issue.priority}
            </span>
          )}

          {/* Project Tag */}
          {issue.project && (
            <span style={{
              fontSize: '10.5px', fontWeight: '500',
              color: 'var(--color-app-muted)',
              background: 'rgba(255,255,255,0.01)',
              border: '1px solid rgba(255,255,255,0.03)',
              padding: '1px 6px', borderRadius: '4px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4
            }}>
              <span>{issue.project.icon || '📁'}</span>
              <span>{issue.project.title || issue.project.name}</span>
            </span>
          )}
        </div>

        {/* Description (Truncated) */}
        {issue.description && (
          <p style={{
            fontSize: '12.5px',
            color: 'var(--color-app-muted)',
            lineHeight: 1.5,
            margin: '0 0 16px 0',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {issue.description}
          </p>
        )}
      </div>

      {/* Footer Details */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.04)',
        fontSize: '11px', color: 'var(--color-app-faint)', fontWeight: '500'
      }}>
        {/* Comments Count */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {hasComments ? (
            <>
              <MessageSquare size={12} style={{ color: 'var(--color-teal)' }} />
              <span style={{ color: 'var(--color-app-muted)', fontWeight: '600' }}>{issue.comments.length} comments</span>
            </>
          ) : (
            <span style={{ color: 'var(--color-app-faint)' }}>No comments</span>
          )}
        </div>

        {/* Assignee */}
        {issue.assignee && (
          <div 
            title={`Assigned to ${issue.assignee.name}`}
            style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              background: 'var(--color-violet)',
              color: '#fff',
              fontSize: '8.5px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              flexShrink: 0
            }}
          >
            {issue.assignee.avatarUrl ? (
              <img src={issue.assignee.avatarUrl} alt={issue.assignee.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span>{issue.assignee.name.charAt(0)}</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
