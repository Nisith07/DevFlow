import { useState, useEffect } from 'react'
import { X, LoaderCircle } from 'lucide-react'

const PRESETS = {
  colors: ['#4FB8A8', '#E8A33D', '#E2574C', '#3B82F6', '#A78BFA', '#10B981'],
  icons: ['📁', '💻', '⚡', '🚀', '🛠️', '🎨', '🔥', '📚', '🎯', '🧪'],
}

export default function ProjectForm({ project, onClose, onSubmit, isSubmitting }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [color, setColor] = useState('#4FB8A8')
  const [icon, setIcon] = useState('📁')
  const [status, setStatus] = useState('active')
  const [priority, setPriority] = useState('medium')
  const [dueDate, setDueDate] = useState('')

  useEffect(() => {
    if (project) {
      setName(project.name || '')
      setDescription(project.description || '')
      setColor(project.color || '#4FB8A8')
      setIcon(project.icon || '📁')
      setStatus(project.status || 'active')
      setPriority(project.priority || 'medium')
      setDueDate(project.dueDate ? new Date(project.dueDate).toISOString().split('T')[0] : '')
    }
  }, [project])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) return

    onSubmit({
      name: name.trim(),
      description: description.trim(),
      color,
      icon,
      status,
      priority,
      dueDate: dueDate || null,
    })
  }

  return (
    <div className="auth-overlay" role="presentation" onMouseDown={onClose}>
      <div
        className="auth-modal"
        role="dialog"
        aria-modal="true"
        onMouseDown={(e) => e.stopPropagation()}
        style={{ maxWidth: '500px', width: '90%' }}
      >
        <button
          className="auth-close"
          type="button"
          onClick={onClose}
          aria-label="Close form"
        >
          <X size={19} />
        </button>

        <h2 style={{ marginBottom: 4 }}>
          {project ? 'Edit Project' : 'New Project'}
        </h2>
        <p className="auth-subtitle" style={{ marginBottom: 20 }}>
          {project ? 'Update your project settings.' : 'Create a new project workspace.'}
        </p>

        <form onSubmit={handleSubmit} className="auth-form" style={{ gap: 16 }}>
          {/* Icon & Name Row */}
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ display: 'flex', flexDirection: 'column', width: '60px' }}>
              <label className="df-timer-label">Icon</label>
              <select
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                style={{
                  padding: '10px 8px',
                  background: 'var(--color-app-bg)',
                  border: '1px solid var(--color-app-border)',
                  borderRadius: '8px',
                  color: 'var(--color-app-text)',
                  fontSize: '18px',
                  cursor: 'pointer',
                  outline: 'none',
                }}
              >
                {PRESETS.icons.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <label className="df-timer-label">Project Name</label>
              <input
                type="text"
                placeholder="Devflow API"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                maxLength={120}
                style={{
                  padding: '11px 12px',
                  background: 'var(--color-app-bg)',
                  border: '1px solid var(--color-app-border)',
                  borderRadius: '8px',
                  color: 'var(--color-app-text)',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Description */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label className="df-timer-label">Description</label>
            <textarea
              placeholder="Describe what you are building..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={1000}
              rows={3}
              style={{
                padding: '10px 12px',
                background: 'var(--color-app-bg)',
                border: '1px solid var(--color-app-border)',
                borderRadius: '8px',
                color: 'var(--color-app-text)',
                fontSize: '14px',
                resize: 'none',
                outline: 'none',
              }}
            />
          </div>

          {/* Predefined Colors */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label className="df-timer-label" style={{ marginBottom: 6 }}>Theme Color</label>
            <div style={{ display: 'flex', gap: 10 }}>
              {PRESETS.colors.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    background: c,
                    border: color === c ? '2px solid #FFF' : '2px solid transparent',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                  }}
                  aria-label={`Select color ${c}`}
                />
              ))}
            </div>
          </div>

          {/* Status & Priority Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label className="df-timer-label">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                style={{
                  padding: '10px 12px',
                  background: 'var(--color-app-bg)',
                  border: '1px solid var(--color-app-border)',
                  borderRadius: '8px',
                  color: 'var(--color-app-text)',
                  fontSize: '14px',
                  outline: 'none',
                }}
              >
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="completed">Completed</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label className="df-timer-label">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                style={{
                  padding: '10px 12px',
                  background: 'var(--color-app-bg)',
                  border: '1px solid var(--color-app-border)',
                  borderRadius: '8px',
                  color: 'var(--color-app-text)',
                  fontSize: '14px',
                  outline: 'none',
                }}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          {/* Due Date */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label className="df-timer-label">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              style={{
                padding: '10px 12px',
                background: 'var(--color-app-bg)',
                border: '1px solid var(--color-app-border)',
                borderRadius: '8px',
                color: 'var(--color-app-text)',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>

          <button
            type="submit"
            className="auth-submit"
            disabled={isSubmitting}
            style={{ marginTop: 8 }}
          >
            <span className="auth-submit-label">
              {isSubmitting && <LoaderCircle size={17} className="auth-spinner" />}
              {isSubmitting ? 'Saving...' : project ? 'Save Changes' : 'Create Project'}
            </span>
          </button>
        </form>
      </div>
    </div>
  )
}
