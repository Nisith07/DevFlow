import { useState } from 'react'
import { Plus } from 'lucide-react'
import PageHeader from '@/shared/components/PageHeader'
import ProjectList from './components/ProjectList'
import ProjectForm from './components/ProjectForm'
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
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProject(id)
      } catch (err) {
        alert(err.message || 'Failed to delete project.')
      }
    }
  }

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

      <ProjectList
        projects={projects}
        isLoading={isLoading}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
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
    </div>
  )
}
