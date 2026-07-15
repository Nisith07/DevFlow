import { useState } from 'react'
import { X, LoaderCircle } from 'lucide-react'
import { PRIORITY_ORDER } from '@/shared/constants/priorities'
import { STATUS_ORDER } from '@/shared/constants/taskStatuses'
import { useProjects } from '@/features/projects/hooks/useProjects'

const PRIORITY_LABELS = { none: 'None', low: 'Low', medium: 'Medium', high: 'High', urgent: 'Urgent' }
const STATUS_LABELS   = { todo: 'To Do', in_progress: 'In Progress', in_review: 'In Review', done: 'Done', cancelled: 'Cancelled' }

/**
 * @param {{ task?: object, onClose: () => void, onSubmit: (data: object) => void, isSubmitting: boolean }} props
 */
export default function TaskForm({ task, onClose, onSubmit, isSubmitting }) {
  const { projects } = useProjects()

  const [title,       setTitle]       = useState(task?.title ?? '')
  const [description, setDescription] = useState(task?.description ?? '')
  const [status,      setStatus]      = useState(task?.status ?? 'todo')
  const [priority,    setPriority]    = useState(task?.priority ?? 'none')
  const [project,     setProject]     = useState(task?.project ?? '')
  const [dueDate,     setDueDate]     = useState(
    task?.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
  )
  const [isToday, setIsToday] = useState(task?.isToday ?? false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim()) return
    onSubmit({
      title:       title.trim(),
      description: description.trim(),
      status,
      priority,
      project:     project || undefined,
      dueDate:     dueDate || null,
      isToday,
    })
  }

  const selectStyle = {
    padding: '10px 12px',
    background: 'var(--color-app-bg)',
    border: '1px solid var(--color-app-border)',
    borderRadius: 8,
    color: 'var(--color-app-text)',
    fontSize: 14,
    outline: 'none',
    width: '100%',
  }

  return (
    <div className="auth-overlay" role="presentation" onMouseDown={onClose}>
      <div
        className="auth-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-form-title"
        onMouseDown={(e) => e.stopPropagation()}
        style={{ maxWidth: 520, width: '90%' }}
      >
        <button className="auth-close" type="button" onClick={onClose} aria-label="Close">
          <X size={19} />
        </button>

        <h2 id="task-form-title" style={{ marginBottom: 4 }}>
          {task ? 'Edit Task' : 'New Task'}
        </h2>
        <p className="auth-subtitle" style={{ marginBottom: 20 }}>
          {task ? 'Update task details.' : 'Add a new task to your workspace.'}
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Title */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label className="df-timer-label">Task Title *</label>
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Fix payment API timeout"
              required
              maxLength={200}
              style={{ ...selectStyle }}
            />
          </div>

          {/* Description */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label className="df-timer-label">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details, acceptance criteria, links…"
              rows={3}
              maxLength={5000}
              style={{ ...selectStyle, resize: 'none' }}
            />
          </div>

          {/* Project */}
          {projects.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label className="df-timer-label">Project</label>
              <select value={project} onChange={(e) => setProject(e.target.value)} style={selectStyle}>
                <option value="">— No project —</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>{p.icon} {p.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Status + Priority */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label className="df-timer-label">Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} style={selectStyle}>
                {STATUS_ORDER.map((s) => (
                  <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                ))}
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label className="df-timer-label">Priority</label>
              <select value={priority} onChange={(e) => setPriority(e.target.value)} style={selectStyle}>
                {PRIORITY_ORDER.map((p) => (
                  <option key={p} value={p}>{PRIORITY_LABELS[p]}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Due date + Today checkbox */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, alignItems: 'end' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label className="df-timer-label">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                style={selectStyle}
              />
            </div>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 13,
                color: 'var(--color-app-muted)',
                cursor: 'pointer',
                paddingBottom: 11,
                whiteSpace: 'nowrap',
              }}
            >
              <input
                type="checkbox"
                checked={isToday}
                onChange={(e) => setIsToday(e.target.checked)}
                style={{ accentColor: 'var(--color-teal)', width: 15, height: 15 }}
              />
              Pin to Today
            </label>
          </div>

          <button
            type="submit"
            className="auth-submit"
            disabled={isSubmitting}
            style={{ marginTop: 6 }}
          >
            <span className="auth-submit-label">
              {isSubmitting && <LoaderCircle size={17} className="auth-spinner" />}
              {isSubmitting ? 'Saving…' : task ? 'Save Changes' : 'Create Task'}
            </span>
          </button>
        </form>
      </div>
    </div>
  )
}
