import { useState, useEffect } from 'react'
import { Plus, Unlink, Star, GitFork, AlertCircle, CheckCircle2, XCircle } from 'lucide-react'
import PageHeader from '@/shared/components/PageHeader'
import TokenSetup from './components/TokenSetup'
import CreateRepoModal from './components/CreateRepoModal'
import RepoDetails from './components/RepoDetails'
import { useGitHubTokenStatus, useGitHubRepos, useDeleteGitHubToken } from './hooks/useGitHub'
import LoadingSpinner from '@/shared/components/LoadingSpinner'
import EmptyState from '@/shared/components/EmptyState'

const Github = ({ size = 20, style }) => (
  <svg width={size} height={size} style={style} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
)

export default function GitHubPage() {
  const { data: status, isLoading: isLoadingStatus, refetch: refetchStatus } = useGitHubTokenStatus()
  const { data: repos = [], isLoading: isLoadingRepos, refetch } = useGitHubRepos()
  const deleteToken = useDeleteGitHubToken()

  const [selectedRepo, setSelectedRepo] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [oauthBanner, setOauthBanner] = useState(null) // 'success' | 'error' | null

  // Detect OAuth callback result from query params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('connected') === '1') {
      setOauthBanner('success')
      // Refresh token status so the page transitions to connected state
      refetchStatus()
      // Clean up URL
      params.delete('connected')
      const newSearch = params.toString()
      window.history.replaceState({}, '', window.location.pathname + (newSearch ? `?${newSearch}` : ''))
      setTimeout(() => setOauthBanner(null), 5000)
    } else if (params.get('github_error')) {
      setOauthBanner('error')
      params.delete('github_error')
      const newSearch = params.toString()
      window.history.replaceState({}, '', window.location.pathname + (newSearch ? `?${newSearch}` : ''))
      setTimeout(() => setOauthBanner(null), 6000)
    }
  }, [refetchStatus])

  const handleDisconnect = async () => {
    if (window.confirm('Disconnect your GitHub account from DevFlow? You can reconnect at any time.')) {
      try {
        await deleteToken.mutateAsync()
        setSelectedRepo(null)
      } catch {
        alert('Failed to disconnect GitHub account.')
      }
    }
  }

  if (isLoadingStatus) {
    return <LoadingSpinner size={40} />
  }

  const hasToken = status?.hasToken

  // Not connected — show OAuth connect screen
  if (!hasToken) {
    return (
      <div className="view-enter">
        <PageHeader
          title="GitHub Integration"
          subtitle="Connect your GitHub account via OAuth to import repositories, track commits, and manage your workflow."
        />
        {/* OAuth error banner shown before the setup card */}
        {oauthBanner === 'error' && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px',
            background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: '10px', marginBottom: '16px', color: 'var(--color-danger)', fontSize: '13px'
          }}>
            <XCircle size={16} />
            <span>GitHub authorization failed or was cancelled. Please try again.</span>
          </div>
        )}
        <TokenSetup />
      </div>
    )
  }

  return (
    <div className="view-enter" style={{ display: 'flex', flexDirection: 'column', gap: 24, height: '100%', overflow: 'hidden' }}>

      {/* OAuth success banner */}
      {oauthBanner === 'success' && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px',
          background: 'rgba(79,184,168,0.08)', border: '1px solid rgba(79,184,168,0.2)',
          borderRadius: '10px', color: 'var(--color-teal)', fontSize: '13px', fontWeight: '600',
          animation: 'fadeIn 0.3s ease'
        }}>
          <CheckCircle2 size={16} />
          <span>GitHub connected successfully! Your repositories are loading below.</span>
        </div>
      )}

      {/* Page Header */}
      {!selectedRepo ? (
        <PageHeader
          title="GitHub Repositories"
          subtitle="Inspect and manage your connected code repositories."
          action={
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                className="app-btn"
                onClick={handleDisconnect}
                style={{ color: 'var(--color-danger)', border: '1px solid rgba(239, 68, 68, 0.2)', background: 'rgba(239, 68, 68, 0.05)', display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <Unlink size={14} />
                <span>Disconnect</span>
              </button>
              <button className="app-btn primary" onClick={() => setShowCreateModal(true)}>
                <Plus size={16} />
                <span>Create Repository</span>
              </button>
            </div>
          }
        />
      ) : (
        <PageHeader
          title="Repository Details"
          subtitle={`Connected repository: ${selectedRepo.owner}/${selectedRepo.name}`}
          action={
            <button
              className="app-btn"
              onClick={handleDisconnect}
              style={{ color: 'var(--color-danger)', border: '1px solid rgba(239, 68, 68, 0.2)', background: 'rgba(239, 68, 68, 0.05)', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <Unlink size={14} />
              <span>Disconnect</span>
            </button>
          }
        />
      )}

      {/* Main Panel */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
        {selectedRepo ? (
          <RepoDetails
            owner={selectedRepo.owner}
            repo={selectedRepo.name}
            onBack={() => setSelectedRepo(null)}
          />
        ) : isLoadingRepos ? (
          <LoadingSpinner size={40} />
        ) : repos.length === 0 ? (
          <EmptyState
            icon={<Github size={48} style={{ color: 'var(--color-app-muted)' }} />}
            title="No Repositories Found"
            description="Create a new repository or check your GitHub account permissions."
            action={
              <button className="app-btn primary" onClick={() => setShowCreateModal(true)}>
                Create Repository
              </button>
            }
          />
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 20,
          }}>
            {repos.map((r) => (
              <div
                key={r.id}
                className="card hover-lift"
                onClick={() => setSelectedRepo({ owner: r.owner, name: r.name })}
                style={{
                  display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                  padding: '20px', background: 'var(--color-app-surface)',
                  border: '1px solid rgba(255, 255, 255, 0.03)', borderRadius: '14px',
                  cursor: 'pointer', minHeight: '170px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, gap: 10 }}>
                    <h4 style={{
                      fontSize: '14px', fontWeight: '800', color: 'var(--color-app-text)',
                      margin: 0, textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', flex: 1
                    }} title={r.name}>
                      {r.name}
                    </h4>
                    <span style={{
                      fontSize: '9px', fontWeight: 'bold', textTransform: 'uppercase',
                      padding: '1px 6px', borderRadius: '4px',
                      color: r.private ? 'var(--color-amber)' : 'var(--color-teal)',
                      background: r.private ? 'rgba(232, 163, 61, 0.1)' : 'rgba(79, 184, 168, 0.1)',
                      flexShrink: 0
                    }}>
                      {r.private ? 'Private' : 'Public'}
                    </span>
                  </div>
                  <p style={{
                    fontSize: '12px', color: 'var(--color-app-muted)', lineHeight: 1.5,
                    margin: '0 0 16px 0', display: '-webkit-box', WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical', overflow: 'hidden'
                  }}>
                    {r.description || 'No description provided.'}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: 16, borderTop: '1px solid rgba(255, 255, 255, 0.04)', paddingTop: 12, fontSize: '11.5px', color: 'var(--color-app-muted)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Star size={12} style={{ color: 'var(--color-amber)' }} />
                    <span>{r.stars}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <GitFork size={12} style={{ color: 'var(--color-teal)' }} />
                    <span>{r.forks}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <AlertCircle size={12} style={{ color: 'var(--color-danger)' }} />
                    <span>{r.openIssues} open</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showCreateModal && (
        <CreateRepoModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={refetch}
        />
      )}
    </div>
  )
}
