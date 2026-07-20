import { useState } from 'react'
import {
  Rocket, RefreshCw, RotateCcw, Trash2, ChevronDown, ChevronRight,
  CheckCircle2, XCircle, Clock, AlertTriangle, Loader2, Plus,
  GitBranch, GitCommit, Globe, Layers, Terminal, ExternalLink
} from 'lucide-react'
import PageHeader from '@/shared/components/PageHeader'
import LoadingSpinner from '@/shared/components/LoadingSpinner'
import {
  useDeployments, useRollbackDeployment, useDeleteDeployment, useCreateDeployment
} from './hooks/useDeployments'

// ── Helpers ───────────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  success:     { label: 'Success',    color: 'var(--color-teal)',    bg: 'rgba(79,184,168,0.1)',  Icon: CheckCircle2 },
  failed:      { label: 'Failed',     color: 'var(--color-danger)',  bg: 'rgba(239,68,68,0.1)',   Icon: XCircle },
  running:     { label: 'Running',    color: '#60a5fa',              bg: 'rgba(96,165,250,0.1)',  Icon: Loader2 },
  cancelled:   { label: 'Cancelled',  color: 'var(--color-app-muted)', bg: 'rgba(255,255,255,0.05)', Icon: AlertTriangle },
  rolled_back: { label: 'Rolled Back', color: 'var(--color-amber)',  bg: 'rgba(232,163,61,0.1)', Icon: RotateCcw },
}

const ENV_COLOR = {
  production:  { color: 'var(--color-danger)',  bg: 'rgba(239,68,68,0.08)' },
  staging:     { color: 'var(--color-amber)',   bg: 'rgba(232,163,61,0.08)' },
  preview:     { color: '#60a5fa',              bg: 'rgba(96,165,250,0.08)' },
  development: { color: 'var(--color-teal)',    bg: 'rgba(79,184,168,0.08)' },
}

const LOG_COLOR = { info: 'var(--color-app-muted)', warn: 'var(--color-amber)', error: 'var(--color-danger)' }
const LOG_PREFIX = { info: '  ', warn: '⚠ ', error: '✖ ' }

const PLATFORM_EMOJI = { render: '🟣', vercel: '▲', netlify: '🟩', railway: '🚂', fly: '🪁', custom: '⚙️' }

function fmtDuration(s) {
  if (!s) return '—'
  if (s < 60) return `${s}s`
  return `${Math.floor(s / 60)}m ${s % 60}s`
}

function fmtDate(d) {
  const date = new Date(d)
  return date.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

// ── Log Viewer ────────────────────────────────────────────────────────────────
function LogViewer({ logs }) {
  return (
    <div style={{
      background: '#0d1117', borderRadius: '10px', padding: '14px 16px',
      fontFamily: '"JetBrains Mono", "Fira Code", monospace', fontSize: '11.5px',
      lineHeight: 1.7, overflowX: 'auto', maxHeight: '260px', overflowY: 'auto',
      border: '1px solid rgba(255,255,255,0.06)', marginTop: '12px'
    }}>
      {logs && logs.length > 0 ? logs.map((log, i) => (
        <div key={i} style={{ color: LOG_COLOR[log.level] || LOG_COLOR.info, whiteSpace: 'pre' }}>
          <span style={{ color: 'rgba(255,255,255,0.2)', userSelect: 'none', marginRight: '12px' }}>
            {String(i + 1).padStart(2, ' ')}
          </span>
          <span style={{ color: LOG_COLOR[log.level] === LOG_COLOR.info ? 'rgba(255,255,255,0.18)' : LOG_COLOR[log.level], marginRight: '6px' }}>
            {LOG_PREFIX[log.level]}
          </span>
          <span style={{ color: LOG_COLOR[log.level] }}>{log.message}</span>
        </div>
      )) : (
        <span style={{ color: 'rgba(255,255,255,0.2)' }}>No build logs available.</span>
      )}
    </div>
  )
}

// ── Status Badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.cancelled
  const { Icon } = cfg
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      fontSize: '11px', fontWeight: '700', padding: '3px 8px', borderRadius: '20px',
      color: cfg.color, background: cfg.bg, flexShrink: 0
    }}>
      <Icon size={10} className={status === 'running' ? 'auth-spinner' : ''} />
      {cfg.label}
    </span>
  )
}

// ── Deployment Card ───────────────────────────────────────────────────────────
function DeploymentCard({ deployment, onRollback, onDelete, isRollingBack }) {
  const [expanded, setExpanded] = useState(false)
  const envCfg = ENV_COLOR[deployment.environment] || ENV_COLOR.development

  return (
    <div style={{
      background: 'var(--color-app-surface)',
      border: deployment.isProduction
        ? '1px solid rgba(79,184,168,0.25)'
        : '1px solid rgba(255,255,255,0.04)',
      borderRadius: '14px',
      overflow: 'hidden',
      transition: 'border-color 0.2s',
    }}>
      {/* Production banner */}
      {deployment.isProduction && (
        <div style={{
          background: 'linear-gradient(90deg, rgba(79,184,168,0.12) 0%, transparent 100%)',
          borderBottom: '1px solid rgba(79,184,168,0.12)',
          padding: '5px 16px',
          display: 'flex', alignItems: 'center', gap: '6px',
          fontSize: '10px', fontWeight: '700', color: 'var(--color-teal)',
          letterSpacing: '0.06em', textTransform: 'uppercase'
        }}>
          <Rocket size={10} /> Current Production
        </div>
      )}

      {/* Main card row */}
      <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'flex-start', gap: '16px' }}>

        {/* Platform icon */}
        <div style={{
          fontSize: '22px', width: '40px', height: '40px', borderRadius: '10px',
          background: 'var(--color-app-bg)', border: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
        }}>
          {PLATFORM_EMOJI[deployment.platform] || '⚙️'}
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '6px' }}>
            <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--color-app-text)' }}>
              {deployment.projectName}
            </span>
            <StatusBadge status={deployment.status} />
            <span style={{
              fontSize: '10px', fontWeight: '700', padding: '2px 7px', borderRadius: '20px',
              color: envCfg.color, background: envCfg.bg, textTransform: 'uppercase', letterSpacing: '0.04em'
            }}>
              {deployment.environment}
            </span>
          </div>

          {/* Commit info */}
          {deployment.commitMessage && (
            <div style={{ fontSize: '12px', color: 'var(--color-app-muted)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <GitCommit size={11} style={{ flexShrink: 0 }} />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {deployment.commitMessage}
              </span>
              {deployment.commitSha && (
                <code style={{ fontSize: '10px', color: 'var(--color-app-faint)', background: 'rgba(255,255,255,0.05)', padding: '1px 5px', borderRadius: '4px', flexShrink: 0 }}>
                  {deployment.commitSha}
                </code>
              )}
            </div>
          )}

          {/* Meta row */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '11.5px', color: 'var(--color-app-faint)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <GitBranch size={10} /> {deployment.branch}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={10} /> {fmtDuration(deployment.duration)}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Layers size={10} /> {deployment.platform}
            </span>
            <span>{fmtDate(deployment.createdAt)}</span>
            {deployment.failedStep && (
              <span style={{ color: 'var(--color-danger)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <XCircle size={10} /> Failed at: <strong>{deployment.failedStep}</strong>
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
          {/* Live URL */}
          {deployment.url && (
            <a
              href={deployment.url}
              target="_blank"
              rel="noopener noreferrer"
              title="Open live deployment"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '28px', height: '28px', borderRadius: '7px',
                background: 'rgba(79,184,168,0.08)', border: '1px solid rgba(79,184,168,0.15)',
                color: 'var(--color-teal)', textDecoration: 'none', transition: 'all 0.15s'
              }}
            >
              <ExternalLink size={12} />
            </a>
          )}

          {/* Rollback */}
          {deployment.status === 'success' && !deployment.isProduction && (
            <button
              onClick={() => onRollback(deployment._id)}
              disabled={isRollingBack}
              title="Rollback to this version"
              style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                padding: '5px 10px', borderRadius: '7px', cursor: 'pointer', fontSize: '11px',
                fontWeight: '600', border: '1px solid rgba(232,163,61,0.2)',
                background: 'rgba(232,163,61,0.06)', color: 'var(--color-amber)',
                transition: 'all 0.15s'
              }}
            >
              <RotateCcw size={11} className={isRollingBack ? 'auth-spinner' : ''} />
              Rollback
            </button>
          )}

          {/* Expand logs */}
          <button
            onClick={() => setExpanded(e => !e)}
            title="View build logs"
            style={{
              display: 'flex', alignItems: 'center', gap: '5px',
              padding: '5px 10px', borderRadius: '7px', cursor: 'pointer', fontSize: '11px',
              fontWeight: '600', border: '1px solid rgba(255,255,255,0.06)',
              background: 'rgba(255,255,255,0.03)', color: 'var(--color-app-muted)',
              transition: 'all 0.15s'
            }}
          >
            <Terminal size={11} />
            Logs
            {expanded ? <ChevronDown size={10} /> : <ChevronRight size={10} />}
          </button>

          {/* Delete */}
          <button
            onClick={() => onDelete(deployment._id)}
            title="Delete record"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '28px', height: '28px', borderRadius: '7px', cursor: 'pointer',
              border: '1px solid rgba(239,68,68,0.12)', background: 'rgba(239,68,68,0.04)',
              color: 'rgba(239,68,68,0.5)', transition: 'all 0.15s'
            }}
          >
            <Trash2 size={11} />
          </button>
        </div>
      </div>

      {/* Expandable log panel */}
      {expanded && (
        <div style={{ padding: '0 20px 16px', borderTop: '1px solid rgba(255,255,255,0.03)' }}>
          <LogViewer logs={deployment.logs} />
        </div>
      )}
    </div>
  )
}

// ── Add Deployment Modal ──────────────────────────────────────────────────────
function AddDeploymentModal({ onClose, onCreate }) {
  const [form, setForm] = useState({
    projectName: '', branch: 'main', commitSha: '', commitMessage: '',
    environment: 'production', platform: 'render', status: 'success',
    duration: '', url: '', failedStep: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await onCreate({ ...form, duration: Number(form.duration) || 0 })
      onClose()
    } catch {
      alert('Failed to create deployment record.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputStyle = {
    width: '100%', padding: '8px 12px', background: 'var(--color-app-bg)',
    border: '1px solid var(--color-app-border)', borderRadius: '8px',
    color: '#fff', fontSize: '13px', outline: 'none', boxSizing: 'border-box'
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 999,
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16
    }}>
      <div style={{
        background: 'var(--color-app-surface)', borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.06)', padding: '28px',
        width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto'
      }}>
        <h3 style={{ margin: '0 0 20px', fontSize: '16px', fontWeight: '800' }}>Log a Deployment</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--color-app-muted)', textTransform: 'uppercase' }}>Project Name *</label>
              <input required value={form.projectName} onChange={set('projectName')} style={inputStyle} placeholder="e.g. DevFlow Backend" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--color-app-muted)', textTransform: 'uppercase' }}>Branch</label>
              <input value={form.branch} onChange={set('branch')} style={inputStyle} placeholder="main" />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--color-app-muted)', textTransform: 'uppercase' }}>Commit Message</label>
            <input value={form.commitMessage} onChange={set('commitMessage')} style={inputStyle} placeholder="feat: add feature..." />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--color-app-muted)', textTransform: 'uppercase' }}>Status</label>
              <select value={form.status} onChange={set('status')} style={inputStyle}>
                {['success', 'failed', 'running', 'cancelled', 'rolled_back'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--color-app-muted)', textTransform: 'uppercase' }}>Environment</label>
              <select value={form.environment} onChange={set('environment')} style={inputStyle}>
                {['production', 'staging', 'preview', 'development'].map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--color-app-muted)', textTransform: 'uppercase' }}>Platform</label>
              <select value={form.platform} onChange={set('platform')} style={inputStyle}>
                {['render', 'vercel', 'netlify', 'railway', 'fly', 'custom'].map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--color-app-muted)', textTransform: 'uppercase' }}>Duration (seconds)</label>
              <input type="number" min="0" value={form.duration} onChange={set('duration')} style={inputStyle} placeholder="45" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--color-app-muted)', textTransform: 'uppercase' }}>Commit SHA</label>
              <input value={form.commitSha} onChange={set('commitSha')} style={inputStyle} placeholder="abc1234" />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--color-app-muted)', textTransform: 'uppercase' }}>Live URL</label>
            <input type="url" value={form.url} onChange={set('url')} style={inputStyle} placeholder="https://..." />
          </div>

          {form.status === 'failed' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--color-danger)', textTransform: 'uppercase' }}>Failed Step</label>
              <input value={form.failedStep} onChange={set('failedStep')} style={{ ...inputStyle, borderColor: 'rgba(239,68,68,0.3)' }} placeholder="e.g. npm run start" />
            </div>
          )}

          <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
            <button type="submit" disabled={isSubmitting} className="app-btn primary" style={{ flex: 1, justifyContent: 'center' }}>
              {isSubmitting ? 'Saving...' : 'Log Deployment'}
            </button>
            <button type="button" onClick={onClose} className="app-btn">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function DeploymentsPage() {
  const { data: deployments = [], isLoading, refetch } = useDeployments()
  const rollback = useRollbackDeployment()
  const deleteDeployment = useDeleteDeployment()
  const createDeployment = useCreateDeployment()

  const [filter, setFilter] = useState('all')    // all, production, staging, preview
  const [statusFilter, setStatusFilter] = useState('all') // all, success, failed
  const [showModal, setShowModal] = useState(false)

  const handleRollback = async (id) => {
    if (!window.confirm('Create a rollback deployment? This will mark the selected version as production.')) return
    try {
      await rollback.mutateAsync(id)
    } catch {
      alert('Rollback failed.')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this deployment record?')) return
    try {
      await deleteDeployment.mutateAsync(id)
    } catch {
      alert('Delete failed.')
    }
  }

  // Derived stats
  const successCount = deployments.filter(d => d.status === 'success').length
  const failedCount  = deployments.filter(d => d.status === 'failed').length
  const production   = deployments.find(d => d.isProduction)
  const avgDuration  = deployments.length
    ? Math.round(deployments.reduce((s, d) => s + (d.duration || 0), 0) / deployments.length)
    : 0

  const filtered = deployments.filter(d => {
    const envOk = filter === 'all' || d.environment === filter
    const stOk  = statusFilter === 'all' || d.status === statusFilter
    return envOk && stOk
  })

  const FILTER_BTN = { padding: '5px 12px', borderRadius: '7px', cursor: 'pointer', fontSize: '11.5px', fontWeight: '600', border: '1px solid transparent', transition: 'all 0.15s' }

  return (
    <div className="view-enter" style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%', overflow: 'hidden' }}>

      <PageHeader
        title="Deployment Center"
        subtitle="Track every release, inspect build logs, rollback to any version, and monitor your production environment."
        action={
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="app-btn" onClick={() => refetch()} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <RefreshCw size={13} /> Refresh
            </button>
            <button className="app-btn primary" onClick={() => setShowModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Plus size={14} /> Log Deployment
            </button>
          </div>
        }
      />

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', flexShrink: 0 }}>
        {[
          { label: 'Total Deployments', value: deployments.length, color: '#60a5fa', icon: Rocket },
          { label: 'Successful',        value: successCount,       color: 'var(--color-teal)', icon: CheckCircle2 },
          { label: 'Failed',            value: failedCount,        color: 'var(--color-danger)', icon: XCircle },
          { label: 'Avg Build Time',    value: fmtDuration(avgDuration), color: 'var(--color-amber)', icon: Clock },
        ].map(({ label, value, color, icon: Icon }) => (
          <div key={label} style={{
            background: 'var(--color-app-surface)', border: '1px solid rgba(255,255,255,0.04)',
            borderRadius: '12px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px'
          }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '9px', background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon size={16} style={{ color }} />
            </div>
            <div>
              <div style={{ fontSize: '20px', fontWeight: '800', color, lineHeight: 1 }}>{value}</div>
              <div style={{ fontSize: '11px', color: 'var(--color-app-muted)', marginTop: '3px' }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Production banner */}
      {production && (
        <div style={{
          padding: '12px 20px', background: 'linear-gradient(90deg, rgba(79,184,168,0.07) 0%, transparent 100%)',
          border: '1px solid rgba(79,184,168,0.15)', borderRadius: '12px',
          display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0, flexWrap: 'wrap'
        }}>
          <Rocket size={16} style={{ color: 'var(--color-teal)', flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--color-teal)' }}>
              {production.projectName}
            </span>
            <span style={{ fontSize: '12px', color: 'var(--color-app-muted)', marginLeft: '8px' }}>
              is live — commit
            </span>
            {production.commitSha && (
              <code style={{ fontSize: '11px', background: 'rgba(255,255,255,0.06)', padding: '1px 6px', borderRadius: '4px', marginLeft: '6px', color: 'var(--color-app-text)' }}>
                {production.commitSha}
              </code>
            )}
          </div>
          {production.url && (
            <a href={production.url} target="_blank" rel="noopener noreferrer" style={{
              display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11.5px', fontWeight: '600',
              color: 'var(--color-teal)', textDecoration: 'none'
            }}>
              <Globe size={12} /> {production.url.replace('https://', '')} <ExternalLink size={10} />
            </a>
          )}
        </div>
      )}

      {/* Filters */}
      <div style={{ display: 'flex', gap: '8px', flexShrink: 0, flexWrap: 'wrap' }}>
        {['all', 'production', 'staging', 'preview', 'development'].map(env => (
          <button
            key={env}
            onClick={() => setFilter(env)}
            style={{
              ...FILTER_BTN,
              background: filter === env ? 'var(--color-app-bg)' : 'transparent',
              color: filter === env ? 'var(--color-teal)' : 'var(--color-app-muted)',
              borderColor: filter === env ? 'rgba(79,184,168,0.2)' : 'rgba(255,255,255,0.06)',
            }}
          >
            {env.charAt(0).toUpperCase() + env.slice(1)}
          </button>
        ))}
        <div style={{ width: '1px', background: 'rgba(255,255,255,0.06)', margin: '0 4px' }} />
        {['all', 'success', 'failed', 'running'].map(st => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            style={{
              ...FILTER_BTN,
              background: statusFilter === st ? 'var(--color-app-bg)' : 'transparent',
              color: statusFilter === st
                ? (STATUS_CONFIG[st]?.color || 'var(--color-teal)')
                : 'var(--color-app-muted)',
              borderColor: statusFilter === st ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.04)',
            }}
          >
            {st.charAt(0).toUpperCase() + st.slice(1)}
          </button>
        ))}
      </div>

      {/* Deployment list */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', paddingBottom: '16px' }}>
        {isLoading ? (
          <LoadingSpinner size={40} />
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--color-app-muted)' }}>
            <Rocket size={40} style={{ opacity: 0.2, marginBottom: '12px' }} />
            <p style={{ fontSize: '14px', margin: 0 }}>No deployments match your filters.</p>
          </div>
        ) : (
          filtered.map(d => (
            <DeploymentCard
              key={d._id}
              deployment={d}
              onRollback={handleRollback}
              onDelete={handleDelete}
              isRollingBack={rollback.isPending}
            />
          ))
        )}
      </div>

      {showModal && (
        <AddDeploymentModal
          onClose={() => setShowModal(false)}
          onCreate={createDeployment.mutateAsync}
        />
      )}
    </div>
  )
}
