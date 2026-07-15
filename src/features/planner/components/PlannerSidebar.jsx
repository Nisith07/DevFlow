import { useState } from 'react'
import { Plus, Clock, ListTodo } from 'lucide-react'
import { useTasks } from '@/features/tasks/hooks/useTasks'
import LoadingSpinner from '@/shared/components/LoadingSpinner'

export default function PlannerSidebar({ onScheduleTask, onCreateFreeform }) {
  const { tasks, isLoading } = useTasks({ status: 'todo' }) // Only pull active tasks to schedule

  const [title, setTitle] = useState('')
  const [startTime, setStartTime] = useState('09:00')
  const [endTime, setEndTime] = useState('10:00')

  const handleFreeformSubmit = (e) => {
    e.preventDefault()
    if (!title.trim()) return
    onCreateFreeform({
      title: title.trim(),
      startTime,
      endTime,
    })
    setTitle('')
  }

  const activeTasks = tasks.filter(t => t.status !== 'done' && t.status !== 'cancelled')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%' }}>
      {/* Quick Block Form */}
      <div className="card">
        <h3 className="card-title" style={{ marginBottom: 12 }}>
          <Clock size={14} style={{ marginRight: 6, verticalAlign: -2 }} />
          Quick Time Block
        </h3>
        <form onSubmit={handleFreeformSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <input
            type="text"
            placeholder="e.g. Lunch break, Gym, Standup"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={120}
            style={{
              padding: '8px 12px',
              background: 'var(--color-app-bg)',
              border: '1px solid var(--color-app-border)',
              borderRadius: '8px',
              color: 'var(--color-app-text)',
              fontSize: '13px',
              outline: 'none',
            }}
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label style={{ fontSize: 10, color: 'var(--color-app-faint)', textTransform: 'uppercase' }}>Start</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                style={{
                  padding: '6px 10px',
                  background: 'var(--color-app-bg)',
                  border: '1px solid var(--color-app-border)',
                  borderRadius: '8px',
                  color: 'var(--color-app-text)',
                  fontSize: '13px',
                  outline: 'none',
                  width: '100%',
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: 10, color: 'var(--color-app-faint)', textTransform: 'uppercase' }}>End</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                style={{
                  padding: '6px 10px',
                  background: 'var(--color-app-bg)',
                  border: '1px solid var(--color-app-border)',
                  borderRadius: '8px',
                  color: 'var(--color-app-text)',
                  fontSize: '13px',
                  outline: 'none',
                  width: '100%',
                }}
              />
            </div>
          </div>
          <button type="submit" className="app-btn primary" style={{ width: '100%', justifyContent: 'center' }}>
            <Plus size={15} /> Add Block
          </button>
        </form>
      </div>

      {/* Unscheduled Tasks List */}
      <div className="card">
        <h3 className="card-title" style={{ marginBottom: 12 }}>
          <ListTodo size={14} style={{ marginRight: 6, verticalAlign: -2 }} />
          Backlog Tasks
        </h3>
        {isLoading ? (
          <LoadingSpinner size={24} />
        ) : activeTasks.length === 0 ? (
          <p style={{ fontSize: 13, color: 'var(--color-app-faint)', margin: 0, textAlign: 'center', padding: '16px 0' }}>
            No active backlog tasks.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 300, overflowY: 'auto', paddingRight: 4 }}>
            {activeTasks.map((task) => (
              <div
                key={task.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'var(--color-app-surface-hover)',
                  border: '1px solid var(--color-app-border)',
                  padding: '8px 10px',
                  borderRadius: 6,
                  gap: 8,
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: 12, fontWeight: 500, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--color-app-text)' }}>
                    {task.title}
                  </p>
                </div>
                <button
                  className="df-check-btn"
                  onClick={() => onScheduleTask(task)}
                  title="Schedule task"
                  style={{ color: 'var(--color-teal)' }}
                >
                  <Plus size={15} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
