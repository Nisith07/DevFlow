import { Pin, PinOff, Trash2, FileText, Tag } from 'lucide-react'
import { relativeTime } from '@/shared/lib/utils'

/**
 * @param {{
 *   note: object,
 *   isActive: boolean,
 *   onSelect: (note: object) => void,
 *   onDelete: (id: string) => void,
 *   onTogglePin: (id: string) => void,
 * }} props
 */
export default function NoteCard({ note, isActive, onSelect, onDelete, onTogglePin }) {
  // Strip markdown for the preview snippet
  const preview = (note.body || '')
    .replace(/#{1,6}\s+/g, '')
    .replace(/[*_`~]/g, '')
    .replace(/\n+/g, ' ')
    .trim()
    .slice(0, 120)

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(note)}
      onKeyDown={(e) => e.key === 'Enter' && onSelect(note)}
      style={{
        padding: '12px 14px',
        borderRadius: 10,
        background: isActive ? 'var(--color-app-surface)' : 'transparent',
        border: isActive
          ? '1px solid var(--color-teal)'
          : '1px solid transparent',
        cursor: 'pointer',
        transition: 'background 0.15s, border-color 0.15s',
        position: 'relative',
        outline: 'none',
      }}
      onMouseEnter={(e) => {
        if (!isActive) e.currentTarget.style.background = 'var(--color-app-surface)'
      }}
      onMouseLeave={(e) => {
        if (!isActive) e.currentTarget.style.background = 'transparent'
      }}
    >
      {/* Title row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
        <FileText
          size={13}
          style={{ color: 'var(--color-teal)', flexShrink: 0, marginTop: 2 }}
          aria-hidden="true"
        />
        <p
          style={{
            margin: 0,
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--color-app-text)',
            flex: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {note.title || 'Untitled Note'} {note.isFavorite && <span style={{ color: 'var(--color-amber)', marginLeft: 4 }}>★</span>}
        </p>

        {/* Action buttons — shown on hover via CSS workaround */}
        <div
          className="note-card-actions"
          style={{ display: 'flex', gap: 2, flexShrink: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="df-sugg-dismiss"
            style={{ padding: 3, color: note.isPinned ? 'var(--color-amber)' : undefined }}
            onClick={() => onTogglePin(note.id)}
            title={note.isPinned ? 'Unpin' : 'Pin note'}
          >
            {note.isPinned ? <Pin size={12} /> : <PinOff size={12} />}
          </button>
          <button
            className="df-sugg-dismiss"
            style={{ padding: 3, color: 'var(--color-danger)' }}
            onClick={() => onDelete(note.id)}
            title="Delete note"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      {/* Preview body */}
      {preview && (
        <p
          style={{
            margin: '5px 0 0 21px',
            fontSize: 12,
            color: 'var(--color-app-muted)',
            lineHeight: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {preview}
        </p>
      )}

      {/* Footer: tags + date */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginTop: 8,
          marginLeft: 21,
          flexWrap: 'wrap',
        }}
      >
        {note.folder && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 3,
              fontSize: 10,
              fontWeight: 600,
              color: 'var(--color-teal)',
              background: 'rgba(79, 184, 168, 0.06)',
              padding: '2px 6px',
              borderRadius: 8,
            }}
          >
            📂 {note.folder}
          </span>
        )}
        {note.tags?.slice(0, 3).map((tag) => (
          <span
            key={tag}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 3,
              fontSize: 10,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--color-teal)',
              background: 'var(--color-teal-muted)',
              padding: '2px 6px',
              borderRadius: 8,
            }}
          >
            <Tag size={8} aria-hidden="true" />
            {tag}
          </span>
        ))}
        <span
          style={{
            marginLeft: 'auto',
            fontSize: 10,
            color: 'var(--color-app-faint)',
            whiteSpace: 'nowrap',
          }}
        >
          {relativeTime(note.updatedAt)}
        </span>
      </div>
    </div>
  )
}
