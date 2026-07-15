import { useState } from 'react'
import { Check, Plus, Trash2, Circle } from 'lucide-react'

/**
 * @param {{
 *   subtasks: Array<{ _id: string, title: string, done: boolean }>,
 *   taskId: string,
 *   onToggle: (taskId: string, subId: string, done: boolean) => void,
 *   onAdd: (taskId: string, title: string) => void,
 *   onDelete: (taskId: string, subId: string) => void
 * }} props
 */
export default function SubtaskList({ subtasks = [], taskId, onToggle, onAdd, onDelete }) {
  const [newTitle, setNewTitle] = useState('')
  const [adding, setAdding] = useState(false)

  const handleAdd = (e) => {
    e.preventDefault()
    if (!newTitle.trim()) return
    onAdd(taskId, newTitle.trim())
    setNewTitle('')
    setAdding(false)
  }

  const done  = subtasks.filter((s) => s.done).length
  const total = subtasks.length

  return (
    <div style={{ marginTop: 16 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <p className="card-title" style={{ margin: 0 }}>
          Subtasks
          {total > 0 && (
            <span style={{ marginLeft: 8, color: 'var(--color-teal)' }}>
              {done}/{total}
            </span>
          )}
        </p>
        <button
          className="df-check-btn"
          onClick={() => setAdding((v) => !v)}
          title="Add subtask"
        >
          <Plus size={15} />
        </button>
      </div>

      {/* Progress bar */}
      {total > 0 && (
        <div
          style={{
            height: 3,
            borderRadius: 2,
            background: 'var(--color-app-border)',
            marginBottom: 12,
          }}
        >
          <div
            style={{
              height: '100%',
              borderRadius: 2,
              background: 'var(--color-teal)',
              width: `${Math.round((done / total) * 100)}%`,
              transition: 'width 0.3s ease',
            }}
          />
        </div>
      )}

      {/* Subtask rows */}
      {subtasks.map((sub) => (
        <div
          key={sub._id}
          className="df-row"
          style={{ gap: 10 }}
        >
          <button
            className={`df-check-btn ${sub.done ? 'checked' : ''}`}
            onClick={() => onToggle(taskId, sub._id, !sub.done)}
            aria-label={sub.done ? 'Mark incomplete' : 'Mark complete'}
          >
            {sub.done ? <Check size={15} /> : <Circle size={15} />}
          </button>
          <span
            className="df-row-text"
            style={sub.done ? { textDecoration: 'line-through', color: 'var(--color-app-faint)' } : {}}
          >
            {sub.title}
          </span>
          <button
            className="df-sugg-dismiss"
            style={{ marginLeft: 'auto', padding: 2 }}
            onClick={() => onDelete(taskId, sub._id)}
            aria-label="Delete subtask"
          >
            <Trash2 size={13} />
          </button>
        </div>
      ))}

      {subtasks.length === 0 && !adding && (
        <p style={{ fontSize: 13, color: 'var(--color-app-faint)', margin: '4px 0' }}>
          No subtasks yet.
        </p>
      )}

      {/* Add subtask form */}
      {adding && (
        <form onSubmit={handleAdd} style={{ display: 'flex', gap: 8, marginTop: 10 }}>
          <input
            autoFocus
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Subtask title…"
            style={{
              flex: 1,
              padding: '8px 10px',
              background: 'var(--color-app-bg)',
              border: '1px solid var(--color-app-border)',
              borderRadius: 7,
              color: 'var(--color-app-text)',
              fontSize: 13,
              outline: 'none',
            }}
          />
          <button type="submit" className="app-btn primary" style={{ padding: '0 12px' }}>
            Add
          </button>
          <button
            type="button"
            className="app-btn"
            onClick={() => setAdding(false)}
            style={{ padding: '0 10px' }}
          >
            ✕
          </button>
        </form>
      )}
    </div>
  )
}
