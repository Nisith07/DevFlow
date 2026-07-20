import { useState, useEffect } from 'react'
import { X, LoaderCircle, Bug, Sparkles, BookOpen, AlertCircle, Plus, Trash2 } from 'lucide-react'
import { useProjects } from '@/features/projects/hooks/useProjects'
import api from '@/shared/lib/axios'

const TYPE_LABELS = { bug: 'Bug Report', feature_request: 'Feature Request', documentation: 'Documentation' }
const PRIORITY_LABELS = { low: 'Low', medium: 'Medium', high: 'High', urgent: 'Urgent' }
const STATUS_LABELS = { open: 'Open', closed: 'Closed' }

export default function IssueForm({ issue, onClose, onSubmit, isSubmitting }) {
  const { projects } = useProjects()

  // Form Fields State
  const [title, setTitle] = useState(issue?.title ?? '')
  const [description, setDescription] = useState(issue?.description ?? '')
  const [type, setType] = useState(issue?.type ?? 'bug')
  const [priority, setPriority] = useState(issue?.priority ?? 'medium')
  const [project, setProject] = useState(issue?.project?._id || issue?.project || '')
  const [status, setStatus] = useState(issue?.status ?? 'open')
  const [assignee, setAssignee] = useState(issue?.assignee?._id || issue?.assignee || '')

  // Lookup data
  const [allUsers, setAllUsers] = useState([])
  const [liveIssue, setLiveIssue] = useState(issue)
  const [newComment, setNewComment] = useState('')

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await api.get('/auth/users')
        setAllUsers(data.data || [])
      } catch (err) {
        console.error('Failed to fetch users:', err)
      }
    }
    fetchUsers()
  }, [])

  useEffect(() => {
    const fetchLiveIssue = async () => {
      if (!issue?.id) return
      try {
        const { data } = await api.get(`/issues/${issue.id}`)
        setLiveIssue(data.data)
      } catch (err) {
        console.error('Failed to fetch live issue details:', err)
      }
    }
    fetchLiveIssue()
  }, [issue?.id])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim()) return
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      type,
      priority,
      project: project || undefined,
      status,
      assignee: assignee || null,
    })
  }

  // Comments Management
  const handleAddComment = async (e) => {
    e.preventDefault()
    if (!newComment.trim() || !issue?.id) return
    try {
      const { data } = await api.post(`/issues/${issue.id}/comments`, { content: newComment })
      setLiveIssue(data.data)
      setNewComment('')
    } catch (err) {
      alert('Failed to add comment')
    }
  }

  const handleDeleteComment = async (commentId) => {
    if (!issue?.id) return
    try {
      const { data } = await api.delete(`/issues/${issue.id}/comments/${commentId}`)
      setLiveIssue(data.data)
    } catch (err) {
      alert('Failed to delete comment')
    }
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

  const isEditMode = !!issue

  return (
    <div className="auth-overlay" role="presentation" onMouseDown={onClose}>
      <div
        className="auth-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="issue-form-title"
        onMouseDown={(e) => e.stopPropagation()}
        style={{ maxWidth: isEditMode ? 900 : 520, width: '95%', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
      >
        <button className="auth-close" type="button" onClick={onClose} aria-label="Close">
          <X size={19} />
        </button>

        <h2 id="issue-form-title" style={{ marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
          {isEditMode ? 'Edit Issue' : 'Report Issue'}
        </h2>
        <p className="auth-subtitle" style={{ marginBottom: 20 }}>
          {isEditMode ? 'Update issue details and review discussion.' : 'Report bugs or suggest new features.'}
        </p>

        {/* Form Container Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isEditMode ? '3fr 2fr' : '1fr',
          gap: '24px',
          overflowY: 'auto',
          flex: 1,
          paddingRight: '4px'
        }}>
          
          {/* Left Column: Form inputs */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Title */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label className="df-timer-label">Issue Title *</label>
              <input
                autoFocus={!isEditMode}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Broken authentication routing"
                required
                maxLength={200}
                style={{ ...selectStyle }}
              />
            </div>

            {/* Description */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label className="df-timer-label">Description / Steps to Reproduce</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide steps to reproduce, actual vs expected results..."
                rows={isEditMode ? 5 : 3}
                maxLength={5000}
                style={{ ...selectStyle, resize: 'none' }}
              />
            </div>

            {/* Type & Priority */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label className="df-timer-label">Type</label>
                <select value={type} onChange={(e) => setType(e.target.value)} style={selectStyle}>
                  <option value="bug">Bug Report 🐞</option>
                  <option value="feature_request">Feature Request 🚀</option>
                  <option value="documentation">Documentation 📖</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label className="df-timer-label">Priority</label>
                <select value={priority} onChange={(e) => setPriority(e.target.value)} style={selectStyle}>
                  {Object.entries(PRIORITY_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Project & Assignee */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label className="df-timer-label">Project</label>
                <select value={project} onChange={(e) => setProject(e.target.value)} style={selectStyle}>
                  <option value="">— No project —</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>{p.icon} {p.name}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label className="df-timer-label">Assignee</label>
                <select value={assignee} onChange={(e) => setAssignee(e.target.value)} style={selectStyle}>
                  <option value="">— Unassigned —</option>
                  {allUsers.map((u) => (
                    <option key={u.id || u._id} value={u.id || u._id}>{u.name} ({u.email})</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Status (Edit Mode only) */}
            {isEditMode && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label className="df-timer-label">Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)} style={selectStyle}>
                  {Object.entries(STATUS_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>
            )}

            <button
              type="submit"
              className="auth-submit"
              disabled={isSubmitting}
              style={{ marginTop: 6 }}
            >
              <span className="auth-submit-label">
                {isSubmitting && <LoaderCircle size={17} className="auth-spinner" />}
                {isSubmitting ? 'Saving…' : issue ? 'Save Changes' : 'Submit Report'}
              </span>
            </button>
          </form>

          {/* Right Column: Comments & Discussion thread (EDIT MODE ONLY) */}
          {isEditMode && (
            <div style={{ display: 'flex', flexDirection: 'column', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '14px', padding: '16px', minHeight: '350px' }}>
              <h3 style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-app-muted)', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px', marginBottom: '14px', marginTop: 0 }}>
                Discussion Thread ({liveIssue?.comments?.length || 0})
              </h3>
              
              {/* Live Comments list */}
              <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '12px', paddingRight: '4px' }}>
                {liveIssue?.comments?.length > 0 ? (
                  liveIssue.comments.map((comm) => {
                    const authorName = comm.author?.name || 'User'
                    const authorInitial = authorName.charAt(0)
                    return (
                      <div 
                        key={comm._id || comm.id} 
                        style={{ 
                          display: 'flex', 
                          gap: '10px',
                          background: 'rgba(255,255,255,0.01)',
                          padding: '10px',
                          borderRadius: '8px',
                          border: '1px solid rgba(255,255,255,0.02)'
                        }}
                      >
                        <div style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: 'var(--color-violet)',
                          color: '#fff',
                          fontSize: '11px',
                          fontWeight: 'bold',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          {comm.author?.avatarUrl ? (
                            <img src={comm.author.avatarUrl} alt={authorName} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                          ) : (
                            <span>{authorInitial}</span>
                          )}
                        </div>
                        
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                            <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-app-text)' }}>{authorName}</span>
                            <button
                              type="button"
                              onClick={() => handleDeleteComment(comm._id || comm.id)}
                              style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer', padding: '2px' }}
                              title="Delete comment"
                            >
                              <Trash2 size={11} />
                            </button>
                          </div>
                          <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--color-app-muted)', lineHeight: '1.4', wordBreak: 'break-word' }}>
                            {comm.content}
                          </p>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-app-faint)', fontSize: '12px', textAlign: 'center', padding: '20px' }}>
                    No feedback or comments yet. Add the first response below.
                  </div>
                )}
              </div>

              {/* Add Comment */}
              <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                <input
                  type="text"
                  placeholder="Post comment response..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '6px 10px',
                    fontSize: '13px',
                    background: 'var(--color-app-bg)',
                    border: '1px solid var(--color-app-border)',
                    borderRadius: '6px',
                    color: '#fff',
                    outline: 'none'
                  }}
                />
                <button 
                  type="submit" 
                  style={{
                    padding: '6px 14px',
                    background: 'var(--color-teal)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12.5px',
                    fontWeight: '600'
                  }}
                >
                  Post
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
