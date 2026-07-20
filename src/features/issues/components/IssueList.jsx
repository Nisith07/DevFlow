import LoadingSpinner from '@/shared/components/LoadingSpinner'
import EmptyState from '@/shared/components/EmptyState'
import { AlertCircle } from 'lucide-react'
import IssueCard from './IssueCard'

export default function IssueList({ issues, isLoading, onEdit, onDelete, onCreateClick }) {
  if (isLoading) {
    return <LoadingSpinner size={40} />
  }

  if (!issues || issues.length === 0) {
    return (
      <EmptyState
        icon={<AlertCircle size={48} style={{ color: 'var(--color-app-muted)' }} />}
        title="No Issues Found"
        description="Everything looks clear! Create an issue to report bugs or track feature requests."
        action={
          <button className="app-btn primary" onClick={onCreateClick}>
            Report Issue
          </button>
        }
      />
    )
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
        gap: 20,
      }}
    >
      {issues.map((issue) => (
        <IssueCard
          key={issue.id}
          issue={issue}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
