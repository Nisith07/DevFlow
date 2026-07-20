import { useState } from 'react'
import { Plus, Clock, ListTodo, Video, BookOpen, Briefcase, HelpCircle } from 'lucide-react'
import { useTasks } from '@/features/tasks/hooks/useTasks'
import LoadingSpinner from '@/shared/components/LoadingSpinner'

export default function PlannerSidebar({ onScheduleTask, onCreateFreeform }) {
  const { tasks, isLoading } = useTasks()

  const [title, setTitle] = useState('')
  const [startTime, setStartTime] = useState('09:00')
  const [endTime, setEndTime] = useState('10:00')
  const [type, setType] = useState('focus_task')

  const handleFreeformSubmit = (e) => {
    e.preventDefault()
    if (!title.trim()) return
    onCreateFreeform({
      title: title.trim(),
      startTime,
      endTime,
      type,
    })
    setTitle('')
  }

  const activeTasks = tasks.filter(t => t.status !== 'done' && t.status !== 'cancelled')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%' }}>
      {/* Quick Block Form */}
      <div className="card" style={{ background: 'var(--color-app-surface)', border: '1px solid rgba(255,255,255,0.03)' }}>
        <h3 className="card-title" style={{ marginBottom: 12, fontSize: '14px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Clock size={14} style={{ color: 'var(--color-amber)' }} />
          <span>Quick Time Block</span>
        </h3>
        <form onSubmit={handleFreeformSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <input
            type="text"
            placeholder="e.g. Team standup, Lunch, Gym"
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
              <label style={{ fontSize: 10, color: 'var(--color-app-faint)', textTransform: 'uppercase', fontWeight: '600' }}>Start</label>
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
              <label style={{ fontSize: 10, color: 'var(--color-app-faint)', textTransform: 'uppercase', fontWeight: '600' }}>End</label>
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

          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 10, color: 'var(--color-app-faint)', textTransform: 'uppercase', fontWeight: '600' }}>Category Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              style={{
                padding: '8px 10px',
                background: 'var(--color-app-bg)',
                border: '1px solid var(--color-app-border)',
                borderRadius: '8px',
                color: 'var(--color-app-text)',
                fontSize: '13px',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="focus_task">Focus Task 🎯</option>
              <option value="meeting">Meeting / Sync 👥</option>
              <option value="routine">Routine / Admin ⚙️</option>
              <option value="other">Other ☕</option>
            </select>
          </div>

          <button type="submit" className="app-btn primary" style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}>
            <Plus size={15} /> Add Block
          </button>
        </form>
      </div>

      {/* Unscheduled Tasks List */}
      <div className="card" style={{ background: 'var(--color-app-surface)', border: '1px solid rgba(255,255,255,0.03)' }}>
        <h3 className="card-title" style={{ marginBottom: 12, fontSize: '14px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: 6 }}>
          <ListTodo size={14} style={{ color: 'var(--color-teal)' }} />
          <span>Backlog Tasks</span>
        </h3>
        {isLoading ? (
          <LoadingSpinner size={24} />
        ) : activeTasks.length === 0 ? (
          <p style={{ fontSize: 12, color: 'var(--color-app-faint)', margin: 0, textAlign: 'center', padding: '16px 0' }}>
            No active backlog tasks.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 240, overflowY: 'auto', paddingRight: 4 }}>
            {activeTasks.map((task) => (
              <div
                key={task.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'var(--color-app-bg)',
                  border: '1px solid var(--color-app-border)',
                  padding: '8px 10px',
                  borderRadius: 8,
                  gap: 8,
                }}
              >
                <div style={{ minWidth: 0, flex: 1 }}>
                  <p style={{ fontSize: 12, fontWeight: 600, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--color-app-text)' }}>
                    {task.title}
                  </p>
                  {task.project && (
                    <span style={{ fontSize: '10px', color: 'var(--color-app-faint)' }}>
                      {task.project.icon} {task.project.title || task.project.name}
                    </span>
                  )}
                </div>
                <button
                  className="df-check-btn"
                  onClick={() => onScheduleTask(task)}
                  title="Schedule task"
                  style={{ color: 'var(--color-teal)', padding: 4 }}
                >
                  <Plus size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
