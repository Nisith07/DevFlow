import ProjectCard from './ProjectCard'
import LoadingSpinner from '@/shared/components/LoadingSpinner'
import EmptyState from '@/shared/components/EmptyState'
import { FolderKanban } from 'lucide-react'

export default function ProjectList({ projects, isLoading, onEdit, onDelete, onFavorite, onArchive, onOpenSprints, onCreateClick }) {
  if (isLoading) {
    return <LoadingSpinner size={40} />
  }

  if (!projects || projects.length === 0) {
    return (
      <EmptyState
        icon={<FolderKanban size={48} />}
        title="No Projects Yet"
        description="Get started by creating your first workspace project."
        action={
          <button className="app-btn primary" onClick={onCreateClick}>
            Create Project
          </button>
        }
      />
    )
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: 24,
      }}
    >
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onEdit={onEdit}
          onDelete={onDelete}
          onFavorite={onFavorite}
          onArchive={onArchive}
          onOpenSprints={onOpenSprints}
        />
      ))}
    </div>
  )
}
