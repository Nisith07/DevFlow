import { useState } from 'react'
import { Plus } from 'lucide-react'

export default function QuickAdd({ onAdd }) {
  const [title, setTitle] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim()) return
    if (onAdd) {
      onAdd(title.trim())
    } else {
      console.log('Quick add task:', title)
    }
    setTitle('')
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 10, marginTop: 12 }}>
      <input
        type="text"
        className="auth-form input"
        placeholder="Quick add a task for today..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{
          flex: 1,
          padding: '10px 12px',
          background: 'var(--color-app-bg)',
          border: '1px solid var(--color-app-border)',
          borderRadius: '8px',
          color: 'var(--color-app-text)',
          fontSize: '14px',
          outline: 'none',
        }}
      />
      <button
        type="submit"
        className="app-btn primary"
        style={{ padding: '0 16px', display: 'flex', alignItems: 'center', gap: 6 }}
      >
        <Plus size={16} />
        <span>Add</span>
      </button>
    </form>
  )
}
