import { useState } from 'react'
import { Plus, Unlink, Star, GitFork, AlertCircle, Key, Shield } from 'lucide-react'
import PageHeader from '@/shared/components/PageHeader'
import TokenSetup from './components/TokenSetup'
import CreateRepoModal from './components/CreateRepoModal'
import RepoDetails from './components/RepoDetails'
import { useGitHubTokenStatus, useGitHubRepos, useDeleteGitHubToken } from './hooks/useGitHub'
import LoadingSpinner from '@/shared/components/LoadingSpinner'
import EmptyState from '@/shared/components/EmptyState'

const Github = ({ size = 20, style }) => (
  <svg width={size} height={size} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
)

export default function GitHubPage() {
  const { data: status, isLoading: isLoadingStatus } = useGitHubTokenStatus()
  const { data: repos = [], isLoading: isLoadingRepos, refetch } = useGitHubRepos()
  const deleteToken = useDeleteGitHubToken()

  // Navigation / Modal state
  const [selectedRepo, setSelectedRepo] = useState(null) // { owner, name }
  const [showCreateModal, setShowCreateModal] = useState(false)

  const handleDisconnect = async () => {
    if (window.confirm('Disconnect and clear your GitHub PAT token settings?')) {
      try {
        await deleteToken.mutateAsync()
        setSelectedRepo(null)
      } catch (err) {
        alert('Failed to disconnect token.')
      }
    }
  }

  if (isLoadingStatus) {
    return <LoadingSpinner size={40} />
  }

  const hasToken = status?.hasToken

  // If token is missing, show setup screen
  if (!hasToken) {
    return (
      <div className="view-enter">
        <PageHeader
          title="GitHub Integration"
          subtitle="Configure GitHub OAuth Personal Access tokens to load branches, commits, and pull requests."
        />
        <TokenSetup />
      </div>
    )
  }

  return (
    <div className="view-enter" style={{ display: 'flex', flexDirection: 'column', gap: 24, height: '100%', overflow: 'hidden' }}>
      
      {/* Page Header */}
      {!selectedRepo ? (
        <PageHeader
          title="GitHub Repositories"
          subtitle="Inspect and configure connected code repositories."
          action={
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="app-btn" onClick={handleDisconnect} style={{ color: 'var(--color-danger)', border: '1px solid rgba(239, 68, 68, 0.2)', background: 'rgba(239, 68, 68, 0.05)', display: 'flex', alignItems: 'center', gap: 6 }}>
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
            <button className="app-btn" onClick={handleDisconnect} style={{ color: 'var(--color-danger)', border: '1px solid rgba(239, 68, 68, 0.2)', background: 'rgba(239, 68, 68, 0.05)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Unlink size={14} />
              <span>Disconnect</span>
            </button>
          }
        />
      )}

      {/* Main Panel Content */}
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
            title="No Connected Repositories"
            description="Create a new repository or link code assets directly using GitHub settings."
            action={
              <button className="app-btn primary" onClick={() => setShowCreateModal(true)}>
                Create Repository
              </button>
            }
          />
        ) : (
          /* Grid list of user repositories */
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: 20,
            }}
          >
            {repos.map((r) => (
              <div
                key={r.id}
                className="card hover-lift"
                onClick={() => setSelectedRepo({ owner: r.owner, name: r.name })}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '20px',
                  background: 'var(--color-app-surface)',
                  border: '1px solid rgba(255, 255, 255, 0.03)',
                  borderRadius: '14px',
                  cursor: 'pointer',
                  minHeight: '170px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, gap: 10 }}>
                    <h4
                      style={{
                        fontSize: '14px',
                        fontWeight: '800',
                        color: 'var(--color-app-text)',
                        margin: 0,
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        flex: 1
                      }}
                      title={r.name}
                    >
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
                    fontSize: '12px',
                    color: 'var(--color-app-muted)',
                    lineHeight: 1.5,
                    margin: '0 0 16px 0',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {r.description || 'No description provided.'}
                  </p>
                </div>

                {/* Footer Metrics */}
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

      {/* Create Repo Modal Overlay */}
      {showCreateModal && (
        <CreateRepoModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={refetch}
        />
      )}
    </div>
  )
}
