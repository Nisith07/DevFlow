import { useState, useEffect } from 'react'
import { X, LoaderCircle } from 'lucide-react'
import api from '@/shared/lib/axios'

const PRESETS = {
  colors: ['#4FB8A8', '#E8A33D', '#E2574C', '#3B82F6', '#A78BFA', '#10B981'],
  icons: ['📁', '💻', '⚡', '🚀', '🛠️', '🎨', '🔥', '📚', '🎯', '🧪'],
}

export default function ProjectForm({ project, onClose, onSubmit, isSubmitting }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [color, setColor] = useState('#4FB8A8')
  const [icon, setIcon] = useState('📁')
  const [status, setStatus] = useState('active')
  const [priority, setPriority] = useState('medium')
  const [startDate, setStartDate] = useState('')
  const [deadline, setDeadline] = useState('')
  const [githubRepo, setGithubRepo] = useState('')
  const [technologies, setTechnologies] = useState('')
  const [progress, setProgress] = useState(0)

  // Team members selection state
  const [allUsers, setAllUsers] = useState([])
  const [selectedMembers, setSelectedMembers] = useState([])
  const [userSearchQuery, setUserSearchQuery] = useState('')

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
    if (project) {
      setTitle(project.title || project.name || '')
      setDescription(project.description || '')
      setColor(project.color || '#4FB8A8')
      setIcon(project.icon || '📁')
      setStatus(project.status || 'active')
      setPriority(project.priority || 'medium')
      setStartDate(project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : '')
      setDeadline(
        project.deadline || project.dueDate
          ? new Date(project.deadline || project.dueDate).toISOString().split('T')[0]
          : ''
      )
      setGithubRepo(project.githubRepo || '')
      setTechnologies(
        Array.isArray(project.technologies)
          ? project.technologies.join(', ')
          : Array.isArray(project.techStack)
          ? project.techStack.join(', ')
          : ''
      )
      setProgress(project.progress !== undefined ? project.progress : project.metrics?.progress || 0)
      setSelectedMembers(project.teamMembers || [])
    }
  }, [project])

  const handleSubmit = (e) => {
    e.preventDefault()
    const nameOrTitle = title.trim()
    if (!nameOrTitle) return

    const techArray = technologies
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0)

    onSubmit({
      name: nameOrTitle,
      title: nameOrTitle,
      description: description.trim(),
      color,
      icon,
      status,
      priority,
      startDate: startDate || null,
      deadline: deadline || null,
      dueDate: deadline || null,
      githubRepo: githubRepo.trim(),
      technologies: techArray,
      techStack: techArray,
      progress: Number(progress),
      teamMembers: selectedMembers.map((m) => m.id || m._id),
      sprints: project ? project.sprints : [],
    })
  }

  const filteredUsers = allUsers.filter((u) => {
    const match =
      u.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearchQuery.toLowerCase())
    const alreadySelected = selectedMembers.some((sm) => (sm.id || sm._id) === u.id)
    return match && !alreadySelected
  })

  return (
    <div className="auth-overlay" role="presentation" onMouseDown={onClose}>
      <div
        className="auth-modal"
        role="dialog"
        aria-modal="true"
        onMouseDown={(e) => e.stopPropagation()}
        style={{ maxWidth: '550px', width: '90%', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
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

        <form onSubmit={handleSubmit} className="auth-form" style={{ gap: 16, overflowY: 'auto', flex: 1, paddingRight: '4px' }}>
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
              <label className="df-timer-label">Project Title</label>
              <input
                type="text"
                placeholder="Devflow API"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
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

          {/* GitHub Repo & Technologies */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label className="df-timer-label">GitHub Repository</label>
              <input
                type="text"
                placeholder="owner/repo"
                value={githubRepo}
                onChange={(e) => setGithubRepo(e.target.value)}
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
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label className="df-timer-label">Technologies (comma-separated)</label>
              <input
                type="text"
                placeholder="React, Node.js, MongoDB"
                value={technologies}
                onChange={(e) => setTechnologies(e.target.value)}
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
                  cursor: 'pointer',
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
                  cursor: 'pointer',
                }}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          {/* Start Date & Deadline Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label className="df-timer-label">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
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
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label className="df-timer-label">Deadline</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
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
          </div>

          {/* Progress Slider */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <label className="df-timer-label" style={{ margin: 0 }}>Progress (%)</label>
              <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--color-app-text)' }}>{progress}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={(e) => setProgress(Number(e.target.value))}
              style={{
                cursor: 'pointer',
                accentColor: color || 'var(--color-teal)',
                width: '100%',
                height: '6px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '4px',
                outline: 'none',
              }}
            />
          </div>

          {/* Team Members */}
          <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
            <label className="df-timer-label">Team Members</label>
            
            {/* Selected Members Badges */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: selectedMembers.length > 0 ? '8px' : '0' }}>
              {selectedMembers.map((member) => (
                <div 
                  key={member.id || member._id} 
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 8px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '6px',
                    fontSize: '12px',
                    color: 'var(--color-app-text)'
                  }}
                >
                  {member.avatarUrl ? (
                    <img src={member.avatarUrl} alt={member.name} style={{ width: 14, height: 14, borderRadius: '50%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ width: 14, height: 14, borderRadius: '50%', background: 'var(--color-violet)', color: '#fff', fontSize: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                      {member.name.charAt(0)}
                    </span>
                  )}
                  <span>{member.name}</span>
                  <button 
                    type="button" 
                    onClick={() => setSelectedMembers(selectedMembers.filter(m => (m.id || m._id) !== (member.id || member._id)))}
                    style={{
                      background: 'none', border: 'none', color: 'var(--color-app-faint)', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', marginLeft: '2px'
                    }}
                  >
                    <X size={11} />
                  </button>
                </div>
              ))}
            </div>

            {/* Search Input for Members */}
            <input
              type="text"
              placeholder="Search users by name/email..."
              value={userSearchQuery}
              onChange={(e) => setUserSearchQuery(e.target.value)}
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

            {/* Dropdown Suggestions */}
            {userSearchQuery && (
              <div 
                style={{
                  position: 'absolute',
                  top: '100%', left: 0, right: 0,
                  maxHeight: '150px',
                  overflowY: 'auto',
                  background: 'var(--color-app-surface)',
                  border: '1px solid var(--color-app-border)',
                  borderRadius: '8px',
                  zIndex: 200,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                  marginTop: '4px'
                }}
              >
                {filteredUsers.length === 0 ? (
                  <div style={{ padding: '10px', fontSize: '13px', color: 'var(--color-app-faint)' }}>
                    No users found
                  </div>
                ) : (
                  filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      onClick={() => {
                        setSelectedMembers([...selectedMembers, user])
                        setUserSearchQuery('')
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 12px',
                        cursor: 'pointer',
                        transition: 'background 0.15s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      {user.avatarUrl ? (
                        <img src={user.avatarUrl} alt={user.name} style={{ width: 20, height: 20, borderRadius: '50%', objectFit: 'cover' }} />
                      ) : (
                        <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--color-violet)', color: '#fff', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                          {user.name.charAt(0)}
                        </span>
                      )}
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '13px', color: 'var(--color-app-text)' }}>{user.name}</span>
                        <span style={{ fontSize: '11px', color: 'var(--color-app-faint)' }}>{user.email}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
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
