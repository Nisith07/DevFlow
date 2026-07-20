import { useState } from 'react'
import { Plus, Star } from 'lucide-react'
import PageHeader from '@/shared/components/PageHeader'
import ProjectList from './components/ProjectList'
import ProjectForm from './components/ProjectForm'
import SprintModal from './components/SprintModal'
import { useProjects } from './hooks/useProjects'

export default function ProjectsPage() {
  const {
    projects,
    isLoading,
    createProject,
    updateProject,
    deleteProject,
  } = useProjects()

  const [formOpen, setFormOpen] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false)

  // Sprint modal state
  const [sprintProject, setSprintProject] = useState(null)

  const handleOpenCreate = () => {
    setEditingProject(null)
    setFormOpen(true)
  }

  const handleOpenEdit = (project) => {
    setEditingProject(project)
    setFormOpen(true)
  }

  const handleClose = () => {
    setFormOpen(false)
    setEditingProject(null)
  }

  const handleSubmit = async (formData) => {
    setIsSubmitting(true)
    try {
      if (editingProject) {
        await updateProject({ id: editingProject.id, ...formData })
      } else {
        await createProject(formData)
      }
      handleClose()
    } catch (err) {
      alert(err.message || 'Failed to save project.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to permanently delete this project?')) {
      try {
        await deleteProject(id)
      } catch (err) {
        alert(err.message || 'Failed to delete project.')
      }
    }
  }

  const handleFavoriteToggle = async (project) => {
    try {
      await updateProject({ id: project.id, isFavorite: !project.isFavorite })
    } catch (err) {
      alert(err.message || 'Failed to update favorite.')
    }
  }

  const handleArchiveToggle = async (project) => {
    try {
      const isArchiving = project.status !== 'archived'
      await updateProject({
        id: project.id,
        status: isArchiving ? 'archived' : 'active',
        isArchived: isArchiving
      })
    } catch (err) {
      alert(err.message || 'Failed to toggle archive status.')
    }
  }

  // Client side filtering
  const filteredProjects = projects.filter((project) => {
    // 1. Status Filter
    if (statusFilter === 'archived') {
      if (project.status !== 'archived') return false
    } else if (statusFilter === 'all') {
      if (project.status === 'archived') return false
    } else {
      if (project.status !== statusFilter) return false
    }

    // 2. Favorites Filter
    if (showOnlyFavorites && !project.isFavorite) return false

    // 3. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      const titleMatch = (project.title || project.name || '').toLowerCase().includes(q)
      const descMatch = (project.description || '').toLowerCase().includes(q)
      const techList = project.technologies || project.techStack || []
      const techMatch = techList.some(tech => tech.toLowerCase().includes(q))
      return titleMatch || descMatch || techMatch
    }

    return true
  })

  return (
    <div className="view-enter" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <PageHeader
        title="Projects"
        subtitle="Organize your development work into dedicated workspaces."
        action={
          <button className="app-btn primary" onClick={handleOpenCreate}>
            <Plus size={16} />
            <span>New Project</span>
          </button>
        }
      />

      {/* Search & Filters Toolbar */}
      <div 
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
          flexWrap: 'wrap',
          background: 'var(--color-app-surface)',
          padding: '12px 18px',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.03)'
        }}
      >
        {/* Search Input */}
        <div style={{ flex: 1, minWidth: '240px' }}>
          <input
            type="text"
            placeholder="Search projects by title, description or technologies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              background: 'var(--color-app-bg)',
              border: '1px solid var(--color-app-border)',
              borderRadius: '8px',
              color: 'var(--color-app-text)',
              fontSize: '13.5px',
              outline: 'none'
            }}
          />
        </div>

        {/* Filters Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          {/* Status select */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '12px', color: 'var(--color-app-muted)', fontWeight: '600' }}>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: '6px 10px',
                background: 'var(--color-app-bg)',
                border: '1px solid var(--color-app-border)',
                borderRadius: '6px',
                color: 'var(--color-app-text)',
                fontSize: '13px',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="all">All (Active)</option>
              <option value="active">Active Only</option>
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Favorites toggle button */}
          <button
            onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
            style={{
              padding: '6px 12px',
              background: showOnlyFavorites ? 'rgba(232, 163, 61, 0.1)' : 'var(--color-app-bg)',
              border: `1px solid ${showOnlyFavorites ? 'rgba(232, 163, 61, 0.3)' : 'var(--color-app-border)'}`,
              color: showOnlyFavorites ? 'var(--color-amber)' : 'var(--color-app-text)',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '600',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s'
            }}
          >
            <Star size={13} fill={showOnlyFavorites ? "var(--color-amber)" : "none"} />
            <span>Favorites</span>
          </button>
        </div>
      </div>

      <ProjectList
        projects={filteredProjects}
        isLoading={isLoading}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
        onFavorite={handleFavoriteToggle}
        onArchive={handleArchiveToggle}
        onOpenSprints={(p) => setSprintProject(p)}
        onCreateClick={handleOpenCreate}
      />

      {formOpen && (
        <ProjectForm
          project={editingProject}
          onClose={handleClose}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      )}

      {sprintProject && (
        <SprintModal
          project={sprintProject}
          onClose={() => setSprintProject(null)}
          onUpdateProject={updateProject}
        />
      )}
    </div>
  )
}
