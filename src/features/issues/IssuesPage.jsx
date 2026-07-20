import { useState } from 'react'
import { Plus, Search, SlidersHorizontal, X, AlertCircle, CheckCircle2 } from 'lucide-react'
import PageHeader from '@/shared/components/PageHeader'
import IssueList from './components/IssueList'
import IssueForm from './components/IssueForm'
import { useIssues } from './hooks/useIssues'
import { useProjects } from '@/features/projects/hooks/useProjects'

export default function IssuesPage() {
  // Filters State
  const [statusFilter, setStatusFilter] = useState('open') // open, closed, all
  const [typeFilter, setTypeFilter] = useState('') // bug, feature_request, documentation, '' (all)
  const [projectFilter, setProjectFilter] = useState('')
  const [search, setSearch] = useState('')

  // Build backend filters
  const backendFilters = {}
  if (statusFilter !== 'all') backendFilters.status = statusFilter
  if (typeFilter) backendFilters.type = typeFilter
  if (projectFilter) backendFilters.project = projectFilter
  if (search.trim()) backendFilters.search = search.trim()

  const {
    issues,
    isLoading,
    createIssue,
    updateIssue,
    deleteIssue,
  } = useIssues(backendFilters)

  const { projects } = useProjects()

  // Modal form states
  const [formOpen, setFormOpen] = useState(false)
  const [editingIssue, setEditingIssue] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleOpenCreate = () => {
    setEditingIssue(null)
    setFormOpen(true)
  }

  const handleOpenEdit = (issue) => {
    setEditingIssue(issue)
    setFormOpen(true)
  }

  const handleClose = () => {
    setFormOpen(false)
    setEditingIssue(null)
  }

  const handleSubmit = async (formData) => {
    setIsSubmitting(true)
    try {
      if (editingIssue) {
        await updateIssue({ id: editingIssue.id, ...formData })
      } else {
        await createIssue(formData)
      }
      handleClose()
    } catch (err) {
      alert(err.message || 'Failed to save issue.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to permanently delete this issue report?')) {
      try {
        await deleteIssue(id)
      } catch (err) {
        alert(err.message || 'Failed to delete issue.')
      }
    }
  }

  const clearFilters = () => {
    setStatusFilter('open')
    setTypeFilter('')
    setProjectFilter('')
    setSearch('')
  }

  const hasFilters = statusFilter !== 'open' || typeFilter || projectFilter || search

  const selectStyle = {
    padding: '8px 12px',
    background: 'var(--color-app-surface)',
    border: '1px solid var(--color-app-border)',
    borderRadius: 8,
    color: 'var(--color-app-text)',
    fontSize: 13,
    outline: 'none',
    cursor: 'pointer',
  }

  return (
    <div className="view-enter" style={{ display: 'flex', flexDirection: 'column', gap: 24, height: '100%', overflow: 'hidden' }}>
      <PageHeader
        title="Issues"
        subtitle="Report bugs, suggest feature enhancements, and track documentation tasks."
        action={
          <button className="app-btn primary" onClick={handleOpenCreate}>
            <Plus size={16} />
            <span>Report Issue</span>
          </button>
        }
      />

      {/* Toolbar Filter Panel */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          flexWrap: 'wrap',
          background: 'var(--color-app-surface)',
          padding: '12px 16px',
          borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.03)'
        }}
      >
        {/* Search */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            flex: 1,
            minWidth: 180,
            padding: '8px 12px',
            background: 'var(--color-app-bg)',
            border: '1px solid var(--color-app-border)',
            borderRadius: 8,
          }}
        >
          <Search size={14} style={{ color: 'var(--color-app-faint)', flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search issues by title or description…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              background: 'none',
              border: 'none',
              outline: 'none',
              color: 'var(--color-app-text)',
              fontSize: 13,
              flex: 1,
            }}
          />
        </div>

        {/* Type Filter */}
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          style={selectStyle}
          aria-label="Filter by type"
        >
          <option value="">All Types</option>
          <option value="bug">Bug Reports</option>
          <option value="feature_request">Feature Requests</option>
          <option value="documentation">Documentation</option>
        </select>

        {/* Project Filter */}
        {projects.length > 0 && (
          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            style={selectStyle}
            aria-label="Filter by project"
          >
            <option value="">All Projects</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.icon} {p.name}</option>
            ))}
          </select>
        )}

        {/* Clear filters */}
        {hasFilters && (
          <button
            className="df-sugg-dismiss"
            onClick={clearFilters}
            style={{ 
              padding: '6px 12px', 
              color: 'var(--color-amber)', 
              border: '1px solid rgba(232, 163, 61, 0.2)', 
              background: 'rgba(232, 163, 61, 0.05)',
              borderRadius: 8, 
              fontSize: 12, 
              display: 'flex', 
              alignItems: 'center', 
              gap: 4 
            }}
          >
            <X size={13} /> Clear Filters
          </button>
        )}

        {/* Status Toggle Tabs */}
        <div style={{ display: 'flex', background: 'var(--color-app-bg)', borderRadius: 8, padding: 3, marginLeft: 'auto', border: '1px solid var(--color-app-border)' }}>
          <button
            onClick={() => setStatusFilter('open')}
            style={{ 
              padding: '6px 12px', 
              borderRadius: 6, 
              background: statusFilter === 'open' ? 'var(--color-app-surface)' : 'transparent', 
              color: statusFilter === 'open' ? '#10b981' : 'var(--color-app-faint)', 
              border: 'none', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              gap: 6,
              fontWeight: '600',
              fontSize: '12px'
            }}
          >
            <AlertCircle size={13} /> <span>Open</span>
          </button>
          <button
            onClick={() => setStatusFilter('closed')}
            style={{ 
              padding: '6px 12px', 
              borderRadius: 6, 
              background: statusFilter === 'closed' ? 'var(--color-app-surface)' : 'transparent', 
              color: statusFilter === 'closed' ? '#a78bfa' : 'var(--color-app-faint)', 
              border: 'none', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              gap: 6,
              fontWeight: '600',
              fontSize: '12px'
            }}
          >
            <CheckCircle2 size={13} /> <span>Closed</span>
          </button>
          <button
            onClick={() => setStatusFilter('all')}
            style={{ 
              padding: '6px 12px', 
              borderRadius: 6, 
              background: statusFilter === 'all' ? 'var(--color-app-surface)' : 'transparent', 
              color: statusFilter === 'all' ? '#fff' : 'var(--color-app-faint)', 
              border: 'none', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              gap: 6,
              fontWeight: '600',
              fontSize: '12px'
            }}
          >
            <span>All</span>
          </button>
        </div>
      </div>

      {/* Grid List */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
        <IssueList
          issues={issues}
          isLoading={isLoading}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          onCreateClick={handleOpenCreate}
        />
      </div>

      {/* Create / Edit Form Modal */}
      {formOpen && (
        <IssueForm
          issue={editingIssue}
          onClose={handleClose}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  )
}
