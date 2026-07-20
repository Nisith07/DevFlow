import { TASK_STATUSES } from '@/shared/constants/taskStatuses'
import PriorityBadge from './PriorityBadge'
import DueDateChip from './DueDateChip'
import { Check, Circle, ChevronDown, ChevronUp, Trash2, Edit } from 'lucide-react'
import { useState } from 'react'
import SubtaskList from './SubtaskList'

/**
 * @param {{
 *   task: object,
 *   onEdit: (task: object) => void,
 *   onDelete: (id: string) => void,
 *   onComplete: (id: string) => void,
 *   onAddSubtask: (taskId: string, title: string) => void,
 *   onToggleSubtask: (taskId: string, subId: string, done: boolean) => void,
 *   onDeleteSubtask: (taskId: string, subId: string) => void,
 * }} props
 */
export default function TaskCard({
  task,
  onEdit,
  onDelete,
  onComplete,
  onAddSubtask,
  onToggleSubtask,
  onDeleteSubtask,
}) {
  const [expanded, setExpanded] = useState(false)

  const isDone       = task.status === 'done'
  const statusInfo   = TASK_STATUSES[task.status] ?? { label: task.status, color: '#FFF' }
  const hasSubtasks  = task.subtasks?.length > 0
  const subtasksDone = task.subtasks?.filter((s) => s.done).length ?? 0

  return (
    <div
      className="card"
      style={{
        borderLeft: `3px solid ${statusInfo.color}`,
        opacity: isDone ? 0.7 : 1,
        transition: 'opacity 0.2s',
      }}
    >
      {/* Top row: checkbox + title + actions */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <button
          className={`df-check-btn ${isDone ? 'checked' : ''}`}
          style={{ marginTop: 2, flexShrink: 0 }}
          onClick={() => !isDone && onComplete(task.id)}
          aria-label={isDone ? 'Task completed' : 'Complete task'}
          disabled={isDone}
        >
          {isDone ? <Check size={17} /> : <Circle size={17} />}
        </button>

        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              margin: 0,
              fontSize: 14,
              fontWeight: 600,
              color: isDone ? 'var(--color-app-faint)' : 'var(--color-app-text)',
              textDecoration: isDone ? 'line-through' : 'none',
              lineHeight: 1.4,
            }}
          >
            {task.title}
          </p>

          {/* Meta badges & Assignee */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 650,
                  textTransform: 'uppercase',
                  color: statusInfo.color,
                  background: `${statusInfo.color}15`,
                  padding: '2px 7px',
                  borderRadius: 10,
                }}
              >
                {statusInfo.label}
              </span>
              <PriorityBadge priority={task.priority} showLabel />
              <DueDateChip dueDate={task.dueDate} />
              {hasSubtasks && (
                <span style={{ fontSize: 11, color: 'var(--color-app-muted)' }}>
                  {subtasksDone}/{task.subtasks.length} subtasks
                </span>
              )}
            </div>

            {task.assignee && (
              <div 
                title={`Assigned to ${task.assignee.name}`}
                style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  background: 'var(--color-violet)',
                  color: '#fff',
                  fontSize: '9px',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  flexShrink: 0
                }}
              >
                {task.assignee.avatarUrl ? (
                  <img src={task.assignee.avatarUrl} alt={task.assignee.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span>{task.assignee.name.charAt(0)}</span>
                )}
              </div>
            )}
          </div>

          {/* Description preview */}
          {task.description && !expanded && (
            <p
              style={{
                margin: '6px 0 0',
                fontSize: 12,
                color: 'var(--color-app-muted)',
                lineHeight: 1.5,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {task.description}
            </p>
          )}
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
          <button
            className="df-sugg-dismiss"
            style={{ padding: 4 }}
            onClick={() => onEdit(task)}
            title="Edit task"
          >
            <Edit size={13} />
          </button>
          <button
            className="df-sugg-dismiss"
            style={{ padding: 4 }}
            onClick={() => setExpanded((v) => !v)}
            title={expanded ? 'Collapse' : 'Expand'}
          >
            {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
          <button
            className="df-sugg-dismiss"
            style={{ padding: 4, color: 'var(--color-danger)' }}
            onClick={() => onDelete(task.id)}
            title="Delete task"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Expanded: full description + subtasks */}
      {expanded && (
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--color-app-border)' }}>
          {task.description && (
            <p style={{ fontSize: 13, color: 'var(--color-app-muted)', lineHeight: 1.6, margin: '0 0 4px' }}>
              {task.description}
            </p>
          )}
          <SubtaskList
            subtasks={task.subtasks ?? []}
            taskId={task.id}
            onToggle={onToggleSubtask}
            onAdd={onAddSubtask}
            onDelete={onDeleteSubtask}
          />
        </div>
      )}
    </div>
  )
}
