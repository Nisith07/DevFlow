import { useState } from 'react'
import {
  GitCommit, GitPullRequest, GitBranch, Tag, Star, GitFork, AlertCircle, Copy, Check, ExternalLink
} from 'lucide-react'
import {
  useGitHubRepoMeta,
  useGitHubBranches,
  useGitHubPRs,
  useGitHubCommits,
  useGitHubReleases
} from '../hooks/useGitHub'
import LoadingSpinner from '@/shared/components/LoadingSpinner'

export default function RepoDetails({ owner, repo, onBack }) {
  const [activeTab, setActiveTab] = useState('commits') // commits, prs, branches, releases
  const [copied, setCopied] = useState(false)

  // Queries
  const { data: meta, isLoading: isLoadingMeta } = useGitHubRepoMeta(owner, repo)
  const { data: branches = [], isLoading: isLoadingBranches } = useGitHubBranches(owner, repo)
  const { data: prs = [], isLoading: isLoadingPRs } = useGitHubPRs(owner, repo)
  const { data: commits = [], isLoading: isLoadingCommits } = useGitHubCommits(owner, repo)
  const { data: releases = [], isLoading: isLoadingReleases } = useGitHubReleases(owner, repo)

  const handleCopyCloneUrl = () => {
    if (!meta?.cloneUrl) return
    navigator.clipboard.writeText(meta.cloneUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (isLoadingMeta) {
    return <LoadingSpinner size={40} />
  }

  if (!meta) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <p style={{ color: 'var(--color-app-muted)' }}>Could not load repository metadata details.</p>
        <button className="app-btn" onClick={onBack}>Back to Repositories</button>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Back button */}
      <div>
        <button className="app-btn" onClick={onBack} style={{ padding: '6px 12px', fontSize: '12px' }}>
          &larr; Back to Repositories
        </button>
      </div>

      {/* Repo Header block */}
      <div className="card" style={{ padding: 24, background: 'var(--color-app-surface)', border: '1px solid rgba(255,255,255,0.03)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '800', margin: 0, color: 'var(--color-app-text)' }}>{meta.name}</h2>
              <span style={{
                fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase',
                padding: '2px 8px', borderRadius: '12px',
                color: meta.private ? 'var(--color-amber)' : 'var(--color-teal)',
                background: meta.private ? 'rgba(232, 163, 61, 0.1)' : 'rgba(79, 184, 168, 0.1)'
              }}>
                {meta.private ? 'Private' : 'Public'}
              </span>
            </div>
            
            <p style={{ margin: '6px 0 0', fontSize: '13px', color: 'var(--color-app-muted)', lineHeight: 1.5 }}>
              {meta.description || 'No description provided.'}
            </p>
          </div>

          <a href={meta.htmlUrl} target="_blank" rel="noopener noreferrer" className="app-btn" style={{ padding: '6px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>Open in GitHub</span>
            <ExternalLink size={12} />
          </a>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'flex', gap: '20px', margin: '20px 0', padding: '14px 0', borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '13px', color: 'var(--color-app-muted)' }}>
            <Star size={14} style={{ color: 'var(--color-amber)' }} />
            <strong>{meta.stars}</strong> stars
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '13px', color: 'var(--color-app-muted)' }}>
            <GitFork size={14} style={{ color: 'var(--color-teal)' }} />
            <strong>{meta.forks}</strong> forks
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '13px', color: 'var(--color-app-muted)' }}>
            <AlertCircle size={14} style={{ color: 'var(--color-danger)' }} />
            <strong>{meta.openIssues}</strong> open issues
          </div>
        </div>

        {/* Clone URL block */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontSize: '10.5px', fontWeight: 'bold', color: 'var(--color-app-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>HTTPS Clone URL</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="text"
              readOnly
              value={meta.cloneUrl}
              style={{
                flex: 1,
                padding: '8px 12px',
                background: 'var(--color-app-bg)',
                border: '1px solid var(--color-app-border)',
                borderRadius: '8px',
                color: '#38bdf8',
                fontSize: '12px',
                fontFamily: 'monospace',
                outline: 'none'
              }}
            />
            <button className="app-btn primary" onClick={handleCopyCloneUrl} style={{ padding: '0 16px', display: 'flex', alignItems: 'center', gap: 6 }}>
              {copied ? <Check size={14} /> : <Copy size={14} />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs list */}
      <div style={{ display: 'flex', gap: 4, background: 'var(--color-app-surface)', padding: 4, borderRadius: 8, width: 'fit-content', border: '1px solid var(--color-app-border)' }}>
        <button
          onClick={() => setActiveTab('commits')}
          style={{
            padding: '6px 14px', borderRadius: 6, fontSize: '12px', fontWeight: '600', cursor: 'pointer', border: 'none',
            background: activeTab === 'commits' ? 'var(--color-app-bg)' : 'transparent',
            color: activeTab === 'commits' ? '#fff' : 'var(--color-app-faint)'
          }}
        >
          Commits ({commits.length})
        </button>
        <button
          onClick={() => setActiveTab('prs')}
          style={{
            padding: '6px 14px', borderRadius: 6, fontSize: '12px', fontWeight: '600', cursor: 'pointer', border: 'none',
            background: activeTab === 'prs' ? 'var(--color-app-bg)' : 'transparent',
            color: activeTab === 'prs' ? '#fff' : 'var(--color-app-faint)'
          }}
        >
          Pull Requests ({prs.length})
        </button>
        <button
          onClick={() => setActiveTab('branches')}
          style={{
            padding: '6px 14px', borderRadius: 6, fontSize: '12px', fontWeight: '600', cursor: 'pointer', border: 'none',
            background: activeTab === 'branches' ? 'var(--color-app-bg)' : 'transparent',
            color: activeTab === 'branches' ? '#fff' : 'var(--color-app-faint)'
          }}
        >
          Branches ({branches.length})
        </button>
        <button
          onClick={() => setActiveTab('releases')}
          style={{
            padding: '6px 14px', borderRadius: 6, fontSize: '12px', fontWeight: '600', cursor: 'pointer', border: 'none',
            background: activeTab === 'releases' ? 'var(--color-app-bg)' : 'transparent',
            color: activeTab === 'releases' ? '#fff' : 'var(--color-app-faint)'
          }}
        >
          Releases ({releases.length})
        </button>
      </div>

      {/* Tab Data Table panels */}
      <div className="card" style={{ padding: '20px', minHeight: '300px' }}>
        {/* COMMITS */}
        {activeTab === 'commits' && (
          isLoadingCommits ? (
            <LoadingSpinner size={24} />
          ) : commits.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--color-app-faint)', fontSize: '13px', padding: '40px 0' }}>No commits found.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {commits.map((c, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: 'var(--color-app-surface)', border: '1px solid var(--color-app-border)', borderRadius: '8px', gap: '10px' }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', minWidth: 0 }}>
                    <GitCommit size={15} style={{ color: 'var(--color-teal)', marginTop: '2px', flexShrink: 0 }} />
                    <div style={{ minWidth: 0 }}>
                      <p style={{ margin: 0, fontSize: '12.5px', fontWeight: '600', color: 'var(--color-app-text)', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>{c.message}</p>
                      <span style={{ fontSize: '10px', color: 'var(--color-app-muted)' }}>By {c.author} on {new Date(c.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <a href={c.htmlUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '10px', fontFamily: 'monospace', color: 'var(--color-teal)', background: 'rgba(79, 184, 168, 0.08)', padding: '2px 6px', borderRadius: '4px', textDecoration: 'none' }}>
                    {c.sha.slice(0, 7)}
                  </a>
                </div>
              ))}
            </div>
          )
        )}

        {/* PULL REQUESTS */}
        {activeTab === 'prs' && (
          isLoadingPRs ? (
            <LoadingSpinner size={24} />
          ) : prs.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--color-app-faint)', fontSize: '13px', padding: '40px 0' }}>No pull requests found.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {prs.map((p, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: 'var(--color-app-surface)', border: '1px solid var(--color-app-border)', borderRadius: '8px', gap: '10px' }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', minWidth: 0 }}>
                    <GitPullRequest size={15} style={{ color: p.state === 'open' ? 'var(--color-teal)' : '#a78bfa', marginTop: '2px', flexShrink: 0 }} />
                    <div style={{ minWidth: 0 }}>
                      <p style={{ margin: 0, fontSize: '12.5px', fontWeight: '600', color: 'var(--color-app-text)', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>{p.title}</p>
                      <span style={{ fontSize: '10px', color: 'var(--color-app-muted)' }}>#{p.number} opened by {p.user}</span>
                    </div>
                  </div>

                  <a href={p.htmlUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', color: p.state === 'open' ? 'var(--color-teal)' : '#a78bfa', background: p.state === 'open' ? 'rgba(79, 184, 168, 0.08)' : 'rgba(167, 139, 250, 0.08)', padding: '2px 6px', borderRadius: '4px', textDecoration: 'none' }}>
                    {p.state}
                  </a>
                </div>
              ))}
            </div>
          )
        )}

        {/* BRANCHES */}
        {activeTab === 'branches' && (
          isLoadingBranches ? (
            <LoadingSpinner size={24} />
          ) : branches.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--color-app-faint)', fontSize: '13px', padding: '40px 0' }}>No branches found.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {branches.map((b, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: 'var(--color-app-surface)', border: '1px solid var(--color-app-border)', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <GitBranch size={15} style={{ color: 'var(--color-app-muted)' }} />
                    <span style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--color-app-text)' }}>{b.name}</span>
                  </div>
                  {b.protected && (
                    <span style={{ fontSize: '9px', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--color-danger)', background: 'rgba(239, 68, 68, 0.08)', padding: '2px 6px', borderRadius: '4px' }}>
                      Protected
                    </span>
                  )}
                </div>
              ))}
            </div>
          )
        )}

        {/* RELEASES */}
        {activeTab === 'releases' && (
          isLoadingReleases ? (
            <LoadingSpinner size={24} />
          ) : releases.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--color-app-faint)', fontSize: '13px', padding: '40px 0' }}>No releases found.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {releases.map((r, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: 'var(--color-app-surface)', border: '1px solid var(--color-app-border)', borderRadius: '8px', gap: '10px' }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', minWidth: 0 }}>
                    <Tag size={15} style={{ color: 'var(--color-amber)', marginTop: '2px', flexShrink: 0 }} />
                    <div style={{ minWidth: 0 }}>
                      <p style={{ margin: 0, fontSize: '12.5px', fontWeight: '600', color: 'var(--color-app-text)', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>{r.name || r.tagName}</p>
                      <span style={{ fontSize: '10px', color: 'var(--color-app-muted)' }}>Published {new Date(r.publishedAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <a href={r.htmlUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '10px', fontWeight: 'bold', color: 'var(--color-amber)', background: 'rgba(232, 163, 61, 0.08)', padding: '2px 6px', borderRadius: '4px', textDecoration: 'none' }}>
                    {r.tagName}
                  </a>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  )
}
