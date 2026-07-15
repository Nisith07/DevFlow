import TaskCard from './TaskCard'
import LoadingSpinner from '@/shared/components/LoadingSpinner'
import EmptyState from '@/shared/components/EmptyState'
import { ListTodo } from 'lucide-react'

export default function TaskList({
  tasks,
  isLoading,
  onEdit,
  onDelete,
  onComplete,
  onAddSubtask,
  onToggleSubtask,
  onDeleteSubtask,
  onCreateClick,
}) {
  if (isLoading) return <LoadingSpinner size={40} />

  if (!tasks || tasks.length === 0) {
    return (
      <EmptyState
        icon={<ListTodo size={48} />}
        title="No Tasks Found"
        description="Create your first task or try changing the filters."
        action={
          <button className="app-btn primary" onClick={onCreateClick}>
            Create Task
          </button>
        }
      />
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onComplete={onComplete}
          onAddSubtask={onAddSubtask}
          onToggleSubtask={onToggleSubtask}
          onDeleteSubtask={onDeleteSubtask}
        />
      ))}
    </div>
  )
}
