import { useState } from 'react'
import { X, Plus, Trash2, Calendar, Edit, Play, CheckCircle, Clock, Save } from 'lucide-react'

export default function SprintModal({ project, onClose, onUpdateProject }) {
  const [sprints, setSprints] = useState(project.sprints || [])
  const [name, setName] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [status, setStatus] = useState('planned')
  
  const [editingSprintId, setEditingSprintId] = useState(null)
  const [editName, setEditName] = useState('')
  const [editStartDate, setEditStartDate] = useState('')
  const [editEndDate, setEditEndDate] = useState('')
  const [editStatus, setEditStatus] = useState('planned')

  const [isSaving, setIsSaving] = useState(false)

  const saveSprintsToDb = async (newSprintsList) => {
    setIsSaving(true)
    try {
      await onUpdateProject({ id: project.id, sprints: newSprintsList })
      setSprints(newSprintsList)
    } catch (err) {
      alert(err.message || 'Failed to update sprints.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddSprint = (e) => {
    e.preventDefault()
    if (!name.trim()) return

    const newSprint = {
      name: name.trim(),
      startDate: startDate || null,
      endDate: endDate || null,
      status: status
    }

    const updated = [...sprints, newSprint]
    saveSprintsToDb(updated)

    // Reset form
    setName('')
    setStartDate('')
    setEndDate('')
    setStatus('planned')
  }

  const handleDeleteSprint = (indexToDelete) => {
    if (window.confirm('Are you sure you want to delete this sprint?')) {
      const updated = sprints.filter((_, idx) => idx !== indexToDelete)
      saveSprintsToDb(updated)
    }
  }

  const startEdit = (sprint, idx) => {
    setEditingSprintId(sprint._id || idx)
    setEditName(sprint.name)
    setEditStartDate(sprint.startDate ? new Date(sprint.startDate).toISOString().split('T')[0] : '')
    setEditEndDate(sprint.endDate ? new Date(sprint.endDate).toISOString().split('T')[0] : '')
    setEditStatus(sprint.status)
  }

  const cancelEdit = () => {
    setEditingSprintId(null)
  }

  const handleSaveEdit = (idx) => {
    if (!editName.trim()) return

    const updated = sprints.map((s, i) => {
      if (i === idx) {
        return {
          ...s,
          name: editName.trim(),
          startDate: editStartDate || null,
          endDate: editEndDate || null,
          status: editStatus
        }
      }
      return s
    })

    saveSprintsToDb(updated)
    setEditingSprintId(null)
  }

  const getStatusIcon = (sprintStatus) => {
    switch (sprintStatus) {
      case 'active':
        return <Play size={12} style={{ color: 'var(--color-teal)' }} />
      case 'completed':
        return <CheckCircle size={12} style={{ color: 'var(--color-success)' }} />
      default:
        return <Clock size={12} style={{ color: 'var(--color-app-muted)' }} />
    }
  }

  return (
    <div className="auth-overlay" role="presentation" onMouseDown={onClose}>
      <div
        className="auth-modal"
        role="dialog"
        aria-modal="true"
        onMouseDown={(e) => e.stopPropagation()}
        style={{ maxWidth: '650px', width: '95%', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
      >
        <button
          className="auth-close"
          type="button"
          onClick={onClose}
          aria-label="Close modal"
        >
          <X size={19} />
        </button>

        <h2 style={{ marginBottom: 4, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>Sprint Management</span>
          {isSaving && <span style={{ fontSize: '12px', fontWeight: 'normal', color: 'var(--color-app-muted)' }}>(Saving...)</span>}
        </h2>
        <p className="auth-subtitle" style={{ marginBottom: 20 }}>
          Manage development cycles for <strong>{project.name}</strong>
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', overflowY: 'auto', flex: 1, paddingRight: '4px' }}>
          {/* Create Sprint Form */}
          <form onSubmit={handleAddSprint} className="neu-inset" style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.02)' }}>
            <h3 style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-app-muted)', marginBottom: '12px' }}>
              Add New Sprint
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '10px', alignItems: 'end' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label className="df-timer-label">Sprint Name</label>
                <input
                  type="text"
                  placeholder="e.g. Sprint 1 - Core Features"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={{
                    padding: '8px 10px',
                    background: 'var(--color-app-bg)',
                    border: '1px solid var(--color-app-border)',
                    borderRadius: '6px',
                    color: 'var(--color-app-text)',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label className="df-timer-label">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  style={{
                    padding: '8px 10px',
                    background: 'var(--color-app-bg)',
                    border: '1px solid var(--color-app-border)',
                    borderRadius: '6px',
                    color: 'var(--color-app-text)',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label className="df-timer-label">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  style={{
                    padding: '8px 10px',
                    background: 'var(--color-app-bg)',
                    border: '1px solid var(--color-app-border)',
                    borderRadius: '6px',
                    color: 'var(--color-app-text)',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                />
              </div>

              <button type="submit" className="app-btn primary" style={{ height: '34px', padding: '0 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', fontSize: '12px' }}>
                <Plus size={14} />
                <span>Add</span>
              </button>
            </div>
          </form>

          {/* Sprints List */}
          <div>
            <h3 style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-app-muted)', marginBottom: '12px' }}>
              Active & Planned Sprints ({sprints.length})
            </h3>

            {sprints.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px', color: 'var(--color-app-faint)', fontSize: '13px', border: '1px dashed rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                No sprints created yet. Start planning one above!
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {sprints.map((sprint, idx) => {
                  const isEditing = editingSprintId === (sprint._id || idx)
                  const startFormatted = sprint.startDate ? new Date(sprint.startDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric'}) : '-'
                  const endFormatted = sprint.endDate ? new Date(sprint.endDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric'}) : '-'
                  
                  return (
                    <div
                      key={sprint._id || idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 16px',
                        background: 'rgba(255,255,255,0.015)',
                        border: '1px solid rgba(255,255,255,0.03)',
                        borderRadius: '10px',
                        gap: '12px'
                      }}
                    >
                      {isEditing ? (
                        /* Edit mode */
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '8px', flex: 1, alignItems: 'center' }}>
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            required
                            style={{
                              padding: '6px 8px',
                              background: 'var(--color-app-bg)',
                              border: '1px solid var(--color-app-border)',
                              borderRadius: '4px',
                              color: 'var(--color-app-text)',
                              fontSize: '12px',
                              outline: 'none'
                            }}
                          />
                          <input
                            type="date"
                            value={editStartDate}
                            onChange={(e) => setEditStartDate(e.target.value)}
                            style={{
                              padding: '6px 8px',
                              background: 'var(--color-app-bg)',
                              border: '1px solid var(--color-app-border)',
                              borderRadius: '4px',
                              color: 'var(--color-app-text)',
                              fontSize: '12px',
                              outline: 'none'
                            }}
                          />
                          <input
                            type="date"
                            value={editEndDate}
                            onChange={(e) => setEditEndDate(e.target.value)}
                            style={{
                              padding: '6px 8px',
                              background: 'var(--color-app-bg)',
                              border: '1px solid var(--color-app-border)',
                              borderRadius: '4px',
                              color: 'var(--color-app-text)',
                              fontSize: '12px',
                              outline: 'none'
                            }}
                          />
                          <select
                            value={editStatus}
                            onChange={(e) => setEditStatus(e.target.value)}
                            style={{
                              padding: '6px 8px',
                              background: 'var(--color-app-bg)',
                              border: '1px solid var(--color-app-border)',
                              borderRadius: '4px',
                              color: 'var(--color-app-text)',
                              fontSize: '12px',
                              outline: 'none',
                              cursor: 'pointer'
                            }}
                          >
                            <option value="planned">Planned</option>
                            <option value="active">Active</option>
                            <option value="completed">Completed</option>
                          </select>
                        </div>
                      ) : (
                        /* Read mode */
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, minWidth: 0 }}>
                          {/* Status Badge Icon */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: '85px' }}>
                            {getStatusIcon(sprint.status)}
                            <span style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: '700', color: sprint.status === 'active' ? 'var(--color-teal)' : sprint.status === 'completed' ? 'var(--color-success)' : 'var(--color-app-muted)', letterSpacing: '0.02em' }}>
                              {sprint.status}
                            </span>
                          </div>

                          {/* Name */}
                          <span style={{ fontSize: '13.5px', fontWeight: '600', color: 'var(--color-app-text)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {sprint.name}
                          </span>

                          {/* Dates */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--color-app-muted)', marginRight: '16px' }}>
                            <Calendar size={12} />
                            <span>{startFormatted} – {endFormatted}</span>
                          </div>
                        </div>
                      )}

                      {/* Action buttons */}
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {isEditing ? (
                          <>
                            <button onClick={() => handleSaveEdit(idx)} className="app-btn primary" style={{ padding: '6px 10px', fontSize: '11px', height: '28px' }}>
                              <Save size={12} />
                            </button>
                            <button onClick={cancelEdit} className="app-btn secondary" style={{ padding: '6px 10px', fontSize: '11px', height: '28px', border: '1px solid var(--color-app-border)', background: 'transparent' }}>
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => startEdit(sprint, idx)} className="df-sugg-dismiss" style={{ padding: '6px' }} title="Edit Sprint">
                              <Edit size={13} />
                            </button>
                            <button onClick={() => handleDeleteSprint(idx)} className="df-sugg-dismiss" style={{ padding: '6px', color: 'var(--color-danger)' }} title="Delete Sprint">
                              <Trash2 size={13} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
