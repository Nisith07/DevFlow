import { useState } from 'react'
import { X, LoaderCircle } from 'lucide-react'
import { useCreateGitHubRepo } from '../hooks/useGitHub'

const Github = ({ size = 20, style }) => (
  <svg width={size} height={size} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
)

export default function CreateRepoModal({ onClose, onSuccess }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isPrivate, setIsPrivate] = useState(false)
  
  const createRepo = useCreateGitHubRepo()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) return
    try {
      await createRepo.mutateAsync({
        name: name.trim(),
        description: description.trim(),
        isPrivate
      })
      onSuccess?.()
      onClose()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create repository.')
    }
  }

  return (
    <div className="auth-overlay" role="presentation" onMouseDown={onClose}>
      <div
        className="auth-modal"
        role="dialog"
        aria-modal="true"
        onMouseDown={(e) => e.stopPropagation()}
        style={{ maxWidth: '460px', width: '95%' }}
      >
        <button className="auth-close" type="button" onClick={onClose} aria-label="Close">
          <X size={19} />
        </button>

        <h2 style={{ marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Github size={18} /> Create Repository
        </h2>
        <p className="auth-subtitle" style={{ marginBottom: 20 }}>
          Create a new repository directly on your GitHub account.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Name */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--color-app-muted)', textTransform: 'uppercase' }}>Repository Name *</label>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. awesome-next-app"
              required
              style={{
                padding: '8px 12px',
                background: 'var(--color-app-bg)',
                border: '1px solid var(--color-app-border)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '13px',
                outline: 'none'
              }}
            />
          </div>

          {/* Description */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--color-app-muted)', textTransform: 'uppercase' }}>Description</label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Code for the new frontend dashboard"
              style={{
                padding: '8px 12px',
                background: 'var(--color-app-bg)',
                border: '1px solid var(--color-app-border)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '13px',
                outline: 'none'
              }}
            />
          </div>

          {/* Private Checkbox */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0' }}>
            <input
              type="checkbox"
              id="isPrivate"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
              style={{ width: '15px', height: '15px', cursor: 'pointer' }}
            />
            <label htmlFor="isPrivate" style={{ fontSize: '13px', color: 'var(--color-app-text)', cursor: 'pointer', userSelect: 'none' }}>
              Make this repository private
            </label>
          </div>

          <button
            type="submit"
            className="app-btn primary"
            disabled={createRepo.isPending}
            style={{ width: '100%', justifyContent: 'center', height: '38px', marginTop: '6px' }}
          >
            {createRepo.isPending ? (
              <>
                <LoaderCircle size={14} className="auth-spinner" />
                <span>Creating Repo...</span>
              </>
            ) : (
              <span>Create Repository</span>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
