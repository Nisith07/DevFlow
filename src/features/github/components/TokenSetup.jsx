import { useState } from 'react'
import { Key, Info, LoaderCircle } from 'lucide-react'
import { useSaveGitHubToken } from '../hooks/useGitHub'

const Github = ({ size = 20, style }) => (
  <svg width={size} height={size} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
)

export default function TokenSetup() {
  const [token, setToken] = useState('')
  const saveToken = useSaveGitHubToken()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!token.trim()) return
    try {
      await saveToken.mutateAsync(token.trim())
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to authenticate token.')
    }
  }

  return (
    <div style={{ maxWidth: '500px', margin: '60px auto', padding: '30px', background: 'var(--color-app-surface)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.03)', boxShadow: '0 8px 30px rgba(0,0,0,0.2)' }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', borderRadius: '14px', background: 'rgba(255,255,255,0.03)', marginBottom: '16px', color: 'var(--color-app-text)' }}>
          <Github size={30} />
        </div>
        <h3 style={{ fontSize: '18px', fontWeight: '800', margin: 0, color: 'var(--color-app-text)' }}>Connect GitHub Account</h3>
        <p style={{ fontSize: '12.5px', color: 'var(--color-app-muted)', marginTop: '6px', lineHeight: 1.5 }}>
          A GitHub Personal Access Token (PAT) is required to interact with your repositories, pull requests, and commits directly.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--color-app-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Personal Access Token *</label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Key size={14} style={{ position: 'absolute', left: '12px', color: 'var(--color-app-faint)' }} />
            <input
              type="password"
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxx"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px 12px 10px 36px',
                background: 'var(--color-app-bg)',
                border: '1px solid var(--color-app-border)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '13px',
                outline: 'none'
              }}
            />
          </div>
        </div>

        {/* Tip Box */}
        <div style={{ display: 'flex', gap: '10px', background: 'rgba(56, 189, 248, 0.04)', border: '1px solid rgba(56, 189, 248, 0.1)', padding: '12px', borderRadius: '8px', color: '#38bdf8', fontSize: '12px', lineHeight: 1.5 }}>
          <Info size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
          <span>
            Ensure your PAT has the <strong>repo</strong> scope checked (for repository and issue tracking access). You can generate one on GitHub under Settings &gt; Developer Settings &gt; Personal Access Tokens.
          </span>
        </div>

        <button
          type="submit"
          className="app-btn primary"
          disabled={saveToken.isPending}
          style={{ width: '100%', justifyContent: 'center', height: '38px', fontSize: '13px', fontWeight: '600' }}
        >
          {saveToken.isPending ? (
            <>
              <LoaderCircle size={14} className="auth-spinner" />
              <span>Verifying Connection...</span>
            </>
          ) : (
            <span>Save GitHub Configuration</span>
          )}
        </button>
      </form>
    </div>
  )
}
