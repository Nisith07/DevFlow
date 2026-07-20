import { useState, useEffect } from 'react'
import { X, LoaderCircle, Sparkles, Plus, Trash2, Paperclip, MessageSquare, CheckSquare, Link2, ExternalLink } from 'lucide-react'
import { PRIORITY_ORDER } from '@/shared/constants/priorities'
import { STATUS_ORDER } from '@/shared/constants/taskStatuses'
import { useProjects } from '@/features/projects/hooks/useProjects'
import { useEstimateTask } from '../hooks/useTasks'
import api from '@/shared/lib/axios'

const PRIORITY_LABELS = { none: 'None', low: 'Low', medium: 'Medium', high: 'High', urgent: 'Urgent' }
const STATUS_LABELS   = { todo: 'To Do', in_progress: 'In Progress', in_review: 'In Review', done: 'Done', cancelled: 'Cancelled' }

export default function TaskForm({ task, onClose, onSubmit, isSubmitting }) {
  const { projects } = useProjects()
  const { mutateAsync: estimateTask, isPending: isEstimating } = useEstimateTask()

  // Form State
  const [title,       setTitle]       = useState(task?.title ?? '')
  const [description, setDescription] = useState(task?.description ?? '')
  const [status,      setStatus]      = useState(task?.status ?? 'todo')
  const [priority,    setPriority]    = useState(task?.priority ?? 'none')
  const [project,     setProject]     = useState(task?.project ?? '')
  const [sprint,      setSprint]      = useState(task?.sprint ?? '')
  const [aiEstimate,  setAiEstimate]  = useState(task?.aiEstimate ?? '')
  const [dueDate,     setDueDate]     = useState(
    task?.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
  )
  const [isToday, setIsToday] = useState(task?.isToday ?? false)
  const [assignee, setAssignee] = useState(task?.assignee?._id || task?.assignee || '')

  // Users lookup
  const [allUsers, setAllUsers] = useState([])
  
  // Tabs & Live state (for edit mode)
  const [liveTask, setLiveTask] = useState(task)
  const [activeTab, setActiveTab] = useState('checklist')
  
  // Checklist inline state
  const [newSubtask, setNewSubtask] = useState('')
  // Comments inline state
  const [newComment, setNewComment] = useState('')
  // Attachments inline state
  const [attachmentName, setAttachmentName] = useState('')
  const [attachmentUrl, setAttachmentUrl] = useState('')

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
    const fetchLiveTask = async () => {
      if (!task?.id) return
      try {
        const { data } = await api.get(`/tasks/${task.id}`)
        setLiveTask(data.data)
      } catch (err) {
        console.error('Failed to fetch live task details:', err)
      }
    }
    fetchLiveTask()
  }, [task?.id])

  const handleEstimate = async () => {
    if (!title.trim()) return alert('Please enter a task title first.')
    try {
      const result = await estimateTask({ title, description })
      if (result?.estimate) setAiEstimate(result.estimate)
    } catch (err) {
      console.error('Estimate failed', err)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim()) return
    onSubmit({
      title:       title.trim(),
      description: description.trim(),
      status,
      priority,
      project:     project || undefined,
      sprint:      sprint || undefined,
      aiEstimate:  aiEstimate || undefined,
      dueDate:     dueDate || null,
      isToday,
      assignee:    assignee || null,
    })
  }

  // Checklist Actions
  const handleAddSubtask = async (e) => {
    e.preventDefault()
    if (!newSubtask.trim() || !task?.id) return
    try {
      const { data } = await api.post(`/tasks/${task.id}/subtasks`, { title: newSubtask })
      setLiveTask(data.data)
      setNewSubtask('')
    } catch (err) {
      alert('Failed to add checklist item')
    }
  }

  const handleToggleSubtask = async (subId, done) => {
    if (!task?.id) return
    try {
      const { data } = await api.patch(`/tasks/${task.id}/subtasks/${subId}`, { done })
      setLiveTask(data.data)
    } catch (err) {
      alert('Failed to update checklist item')
    }
  }

  const handleDeleteSubtask = async (subId) => {
    if (!task?.id) return
    try {
      const { data } = await api.delete(`/tasks/${task.id}/subtasks/${subId}`)
      setLiveTask(data.data)
    } catch (err) {
      alert('Failed to delete checklist item')
    }
  }

  // Comments Actions
  const handleAddComment = async (e) => {
    e.preventDefault()
    if (!newComment.trim() || !task?.id) return
    try {
      const { data } = await api.post(`/tasks/${task.id}/comments`, { content: newComment })
      setLiveTask(data.data)
      setNewComment('')
    } catch (err) {
      alert('Failed to add comment')
    }
  }

  const handleDeleteComment = async (commentId) => {
    if (!task?.id) return
    try {
      const { data } = await api.delete(`/tasks/${task.id}/comments/${commentId}`)
      setLiveTask(data.data)
    } catch (err) {
      alert('Failed to delete comment')
    }
  }

  // Attachments Actions
  const handleAddAttachment = async (e) => {
    e.preventDefault()
    if (!attachmentName.trim() || !attachmentUrl.trim() || !task?.id) return
    try {
      const { data } = await api.post(`/tasks/${task.id}/attachments`, { name: attachmentName, url: attachmentUrl })
      setLiveTask(data.data)
      setAttachmentName('')
      setAttachmentUrl('')
    } catch (err) {
      alert('Failed to add attachment')
    }
  }

  const handleDeleteAttachment = async (attachmentId) => {
    if (!task?.id) return
    try {
      const { data } = await api.delete(`/tasks/${task.id}/attachments/${attachmentId}`)
      setLiveTask(data.data)
    } catch (err) {
      alert('Failed to delete attachment')
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

  const isEditMode = !!task

  return (
    <div className="auth-overlay" role="presentation" onMouseDown={onClose}>
      <div
        className="auth-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-form-title"
        onMouseDown={(e) => e.stopPropagation()}
        style={{ maxWidth: isEditMode ? 900 : 520, width: '95%', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
      >
        <button className="auth-close" type="button" onClick={onClose} aria-label="Close">
          <X size={19} />
        </button>

        <h2 id="task-form-title" style={{ marginBottom: 4 }}>
          {isEditMode ? 'Edit Task' : 'New Task'}
        </h2>
        <p className="auth-subtitle" style={{ marginBottom: 20 }}>
          {isEditMode ? 'Update task details and manage collaboration.' : 'Add a new task to your workspace.'}
        </p>

        {/* Layout Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isEditMode ? '3fr 2fr' : '1fr',
          gap: '24px',
          overflowY: 'auto',
          flex: 1,
          paddingRight: '4px'
        }}>
          {/* Left Column: Core Fields */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Title */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label className="df-timer-label">Task Title *</label>
              <input
                autoFocus={!isEditMode}
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
                rows={isEditMode ? 4 : 3}
                maxLength={5000}
                style={{ ...selectStyle, resize: 'none' }}
              />
            </div>

            {/* Project and Sprint */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
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
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label className="df-timer-label">Sprint</label>
                <input
                  value={sprint}
                  onChange={(e) => setSprint(e.target.value)}
                  placeholder="e.g. Sprint 4"
                  style={{ ...selectStyle }}
                />
              </div>
            </div>

            {/* Assignee */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label className="df-timer-label">Assignee</label>
              <select 
                value={assignee} 
                onChange={(e) => setAssignee(e.target.value)} 
                style={selectStyle}
              >
                <option value="">— Unassigned —</option>
                {allUsers.map((u) => (
                  <option key={u.id || u._id} value={u.id || u._id}>
                    {u.name} ({u.email})
                  </option>
                ))}
              </select>
            </div>

            {/* AI Estimate and Status/Priority */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label className="df-timer-label" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Sparkles size={11} color="#8b5cf6" /> AI Estimate
                </label>
                <div style={{ display: 'flex', gap: 6 }}>
                  <input
                    value={aiEstimate}
                    onChange={(e) => setAiEstimate(e.target.value)}
                    placeholder="e.g. 2h"
                    style={{ ...selectStyle, flex: 1 }}
                  />
                  <button
                    type="button"
                    onClick={handleEstimate}
                    disabled={isEstimating}
                    style={{
                      background: 'rgba(139, 92, 246, 0.1)',
                      border: '1px solid rgba(139, 92, 246, 0.2)',
                      color: '#8b5cf6',
                      borderRadius: 8,
                      padding: '0 12px',
                      cursor: isEstimating ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    title="Generate Estimate"
                  >
                    {isEstimating ? <LoaderCircle size={14} className="auth-spinner" /> : <Sparkles size={14} />}
                  </button>
                </div>
              </div>

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

          {/* Right Column: Tabbed Checklist, Comments, and Attachments (EDIT MODE ONLY) */}
          {isEditMode && (
            <div style={{ display: 'flex', flexDirection: 'column', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '14px', padding: '16px', minHeight: '350px' }}>
              {/* Tabs list */}
              <div style={{ display: 'flex', gap: '4px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '10px', marginBottom: '14px' }}>
                <button
                  type="button"
                  onClick={() => setActiveTab('checklist')}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    background: activeTab === 'checklist' ? 'rgba(255,255,255,0.04)' : 'transparent',
                    color: activeTab === 'checklist' ? '#fff' : 'var(--color-app-muted)',
                    border: 'none',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <CheckSquare size={13} />
                  <span>Checklist</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('comments')}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    background: activeTab === 'comments' ? 'rgba(255,255,255,0.04)' : 'transparent',
                    color: activeTab === 'comments' ? '#fff' : 'var(--color-app-muted)',
                    border: 'none',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <MessageSquare size={13} />
                  <span>Comments ({liveTask?.comments?.length || 0})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('attachments')}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    background: activeTab === 'attachments' ? 'rgba(255,255,255,0.04)' : 'transparent',
                    color: activeTab === 'attachments' ? '#fff' : 'var(--color-app-muted)',
                    border: 'none',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Paperclip size={13} />
                  <span>Links ({liveTask?.attachments?.length || 0})</span>
                </button>
              </div>

              {/* Tab Content */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                {/* 1. Checklist Tab */}
                {activeTab === 'checklist' && (
                  <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
                    {/* List */}
                    <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
                      {liveTask?.subtasks?.length > 0 ? (
                        liveTask.subtasks.map((sub) => (
                          <div 
                            key={sub._id || sub.id} 
                            style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: '8px', 
                              padding: '6px 10px', 
                              borderRadius: '8px', 
                              background: 'rgba(255,255,255,0.015)',
                              border: '1px solid rgba(255,255,255,0.02)'
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={sub.done}
                              onChange={(e) => handleToggleSubtask(sub._id || sub.id, e.target.checked)}
                              style={{ accentColor: 'var(--color-teal)', cursor: 'pointer' }}
                            />
                            <span style={{
                              fontSize: '13px',
                              color: sub.done ? 'var(--color-app-faint)' : 'var(--color-app-text)',
                              textDecoration: sub.done ? 'line-through' : 'none',
                              flex: 1,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}>
                              {sub.title}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleDeleteSubtask(sub._id || sub.id)}
                              style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer', padding: '4px' }}
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        ))
                      ) : (
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-app-faint)', fontSize: '12px', textAlign: 'center', padding: '20px' }}>
                          No checklist items. Create one below to track progress.
                        </div>
                      )}
                    </div>

                    {/* Add Input */}
                    <form onSubmit={handleAddSubtask} style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                      <input
                        type="text"
                        placeholder="Add new checklist item..."
                        value={newSubtask}
                        onChange={(e) => setNewSubtask(e.target.value)}
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
                          padding: '6px 10px',
                          background: 'var(--color-teal)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Plus size={14} />
                      </button>
                    </form>
                  </div>
                )}

                {/* 2. Comments Tab */}
                {activeTab === 'comments' && (
                  <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
                    {/* Comments List */}
                    <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '12px', paddingRight: '4px' }}>
                      {liveTask?.comments?.length > 0 ? (
                        liveTask.comments.map((comm) => {
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
                          No comments yet. Start the conversation.
                        </div>
                      )}
                    </div>

                    {/* Add Comment Input */}
                    <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                      <input
                        type="text"
                        placeholder="Write a comment..."
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
                        Send
                      </button>
                    </form>
                  </div>
                )}

                {/* 3. Attachments Tab */}
                {activeTab === 'attachments' && (
                  <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
                    {/* Attachments List */}
                    <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
                      {liveTask?.attachments?.length > 0 ? (
                        liveTask.attachments.map((att) => (
                          <div 
                            key={att._id || att.id} 
                            style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: '8px', 
                              padding: '6px 10px', 
                              borderRadius: '8px', 
                              background: 'rgba(255,255,255,0.015)',
                              border: '1px solid rgba(255,255,255,0.02)'
                            }}
                          >
                            <Link2 size={13} style={{ color: 'var(--color-teal)', flexShrink: 0 }} />
                            <a 
                              href={att.url.startsWith('http') ? att.url : `https://${att.url}`} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              style={{ 
                                fontSize: '13px', 
                                color: 'var(--color-app-text)', 
                                textDecoration: 'none',
                                flex: 1, 
                                overflow: 'hidden', 
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                fontWeight: '500'
                              }}
                              className="hover-color-violet"
                              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-teal)'}
                              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-app-text)'}
                            >
                              {att.name}
                            </a>
                            <a
                              href={att.url.startsWith('http') ? att.url : `https://${att.url}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: 'var(--color-app-faint)', display: 'flex', alignItems: 'center', padding: '4px' }}
                            >
                              <ExternalLink size={12} />
                            </a>
                            <button
                              type="button"
                              onClick={() => handleDeleteAttachment(att._id || att.id)}
                              style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer', padding: '4px' }}
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        ))
                      ) : (
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-app-faint)', fontSize: '12px', textAlign: 'center', padding: '20px' }}>
                          No links or documents attached. Add one below.
                        </div>
                      )}
                    </div>

                    {/* Add Attachment Form */}
                    <form onSubmit={handleAddAttachment} style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: 'auto' }}>
                      <input
                        type="text"
                        placeholder="Link Display Name (e.g. Design Doc)"
                        value={attachmentName}
                        onChange={(e) => setAttachmentName(e.target.value)}
                        required
                        style={{
                          padding: '6px 10px',
                          fontSize: '12.5px',
                          background: 'var(--color-app-bg)',
                          border: '1px solid var(--color-app-border)',
                          borderRadius: '6px',
                          color: '#fff',
                          outline: 'none'
                        }}
                      />
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                          type="text"
                          placeholder="URL (e.g. google.com)"
                          value={attachmentUrl}
                          onChange={(e) => setAttachmentUrl(e.target.value)}
                          required
                          style={{
                            flex: 1,
                            padding: '6px 10px',
                            fontSize: '12.5px',
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
                            padding: '6px 12px',
                            background: 'var(--color-teal)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '12.5px',
                            fontWeight: '600'
                          }}
                        >
                          Attach
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
