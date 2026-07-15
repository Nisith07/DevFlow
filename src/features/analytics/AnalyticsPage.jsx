import PageHeader from '@/shared/components/PageHeader'
import { useAnalytics } from './hooks/useAnalytics'
import LoadingSpinner from '@/shared/components/LoadingSpinner'
import { CheckCircle2, Clock, XCircle, TrendingUp, BarChart2, Target } from 'lucide-react'

// ── Helpers ────────────────────────────────────────────────────────────────────

const PRIORITY_COLORS = {
  urgent: 'var(--color-priority-urgent)',
  high:   'var(--color-priority-high)',
  medium: 'var(--color-priority-medium)',
  low:    'var(--color-priority-low)',
  none:   'var(--color-app-border)',
}

const STATUS_COLORS = {
  todo:        'var(--color-app-faint)',
  in_progress: 'var(--color-amber)',
  in_review:   'var(--color-priority-medium)',
  done:        'var(--color-priority-low)',
  cancelled:   'var(--color-danger)',
}

const STATUS_LABELS = {
  todo:        'To Do',
  in_progress: 'In Progress',
  in_review:   'In Review',
  done:        'Done',
  cancelled:   'Cancelled',
}

// Build the last-N-days date list for the heatmap
function buildDateRange(days) {
  const arr = []
  const now = new Date()
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    arr.push(d.toLocaleDateString('en-CA')) // YYYY-MM-DD
  }
  return arr
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function StatCard({ icon: Icon, color, label, value, sub }) {
  return (
    <div
      className="card"
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 14,
      }}
    >
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: 10,
          background: `${color}22`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Icon size={18} style={{ color }} />
      </div>
      <div>
        <p
          style={{
            margin: 0,
            fontSize: 24,
            fontWeight: 800,
            color: 'var(--color-app-text)',
            lineHeight: 1.1,
          }}
        >
          {value}
        </p>
        <p style={{ margin: '3px 0 0', fontSize: 12, color: 'var(--color-app-muted)' }}>
          {label}
        </p>
        {sub && (
          <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--color-app-faint)' }}>
            {sub}
          </p>
        )}
      </div>
    </div>
  )
}

function HorizontalBar({ label, value, max, color }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <span
        style={{
          fontSize: 12,
          color: 'var(--color-app-muted)',
          width: 80,
          flexShrink: 0,
          textAlign: 'right',
          textTransform: 'capitalize',
        }}
      >
        {label}
      </span>
      <div
        style={{
          flex: 1,
          height: 8,
          background: 'var(--color-app-border)',
          borderRadius: 4,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${pct}%`,
            background: color,
            borderRadius: 4,
            transition: 'width 0.5s ease',
          }}
        />
      </div>
      <span
        style={{
          fontSize: 12,
          color: 'var(--color-app-faint)',
          width: 28,
          textAlign: 'right',
          flexShrink: 0,
        }}
      >
        {value}
      </span>
    </div>
  )
}

function Heatmap({ heatmap }) {
  const DAYS = 30
  const dates = buildDateRange(DAYS)
  const countMap = Object.fromEntries(heatmap.map((h) => [h.date, h.count]))
  const maxCount = Math.max(...heatmap.map((h) => h.count), 1)

  return (
    <div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${DAYS}, 1fr)`,
          gap: 3,
        }}
      >
        {dates.map((d) => {
          const count = countMap[d] ?? 0
          const opacity = count === 0 ? 0.08 : 0.2 + (count / maxCount) * 0.8
          return (
            <div
              key={d}
              title={`${d}: ${count} task${count !== 1 ? 's' : ''} completed`}
              style={{
                height: 14,
                borderRadius: 2,
                background: `rgba(79,184,168,${opacity})`,
                cursor: 'default',
              }}
            />
          )
        })}
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: 6,
        }}
      >
        <span style={{ fontSize: 10, color: 'var(--color-app-faint)' }}>30 days ago</span>
        <span style={{ fontSize: 10, color: 'var(--color-app-faint)' }}>Today</span>
      </div>
    </div>
  )
}

// ── Main Page ──────────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  const { data, isLoading, error } = useAnalytics()

  if (isLoading) return <LoadingSpinner size={48} />

  if (error || !data) {
    return (
      <div className="view-enter">
        <PageHeader title="Analytics" subtitle="Insights into your productivity." />
        <div className="card" style={{ textAlign: 'center', padding: '32px 24px' }}>
          <p style={{ color: 'var(--color-danger)', fontSize: 14 }}>
            Failed to load analytics. Please refresh.
          </p>
        </div>
      </div>
    )
  }

  const { overview, statusBreakdown, priorities, projectStats, heatmap } = data
  const maxPriority = Math.max(...priorities.map((p) => p.count), 1)
  const maxStatus   = Math.max(...Object.values(statusBreakdown), 1)

  return (
    <div className="view-enter" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <PageHeader
        title="Analytics"
        subtitle="Insights into your productivity and project health."
      />

      {/* ── Overview stat cards ─────────────────────────────────────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 16,
        }}
      >
        <StatCard
          icon={Target}
          color="var(--color-teal)"
          label="Total Tasks"
          value={overview.total}
        />
        <StatCard
          icon={CheckCircle2}
          color="var(--color-priority-low)"
          label="Completed"
          value={overview.done}
          sub={`${overview.completionRate}% completion rate`}
        />
        <StatCard
          icon={Clock}
          color="var(--color-amber)"
          label="Active"
          value={overview.active}
          sub="In progress or in review"
        />
        <StatCard
          icon={XCircle}
          color="var(--color-danger)"
          label="Cancelled"
          value={overview.cancelled}
        />
        <StatCard
          icon={TrendingUp}
          color="var(--color-teal)"
          label="Completion Rate"
          value={`${overview.completionRate}%`}
          sub="All time"
        />
      </div>

      {/* ── Heatmap + Status breakdown ──────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 16 }}>
        <div className="card">
          <p className="card-title" style={{ marginBottom: 14 }}>
            <BarChart2 size={13} style={{ marginRight: 6, verticalAlign: -2 }} />
            Task Completion — Last 30 Days
          </p>
          <Heatmap heatmap={heatmap} />
        </div>

        <div className="card" style={{ minWidth: 220 }}>
          <p className="card-title" style={{ marginBottom: 14 }}>Status Breakdown</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {Object.entries(statusBreakdown).map(([status, count]) => (
              <HorizontalBar
                key={status}
                label={STATUS_LABELS[status] ?? status}
                value={count}
                max={maxStatus}
                color={STATUS_COLORS[status] ?? 'var(--color-app-faint)'}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Priority breakdown ──────────────────────────────────────────────── */}
      <div className="card">
        <p className="card-title" style={{ marginBottom: 14 }}>Tasks by Priority</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {priorities.map(({ priority, count }) => (
            <HorizontalBar
              key={priority}
              label={priority}
              value={count}
              max={maxPriority}
              color={PRIORITY_COLORS[priority] ?? 'var(--color-app-border)'}
            />
          ))}
        </div>
      </div>

      {/* ── Project stats ───────────────────────────────────────────────────── */}
      {projectStats.length > 0 && (
        <div className="card">
          <p className="card-title" style={{ marginBottom: 14 }}>Project Progress</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {projectStats.map((proj) => (
              <div key={proj.projectId}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 6,
                  }}
                >
                  <span style={{ fontSize: 13, color: 'var(--color-app-text)', fontWeight: 600 }}>
                    {proj.icon} {proj.name}
                  </span>
                  <span style={{ fontSize: 12, color: 'var(--color-app-muted)' }}>
                    {proj.done}/{proj.total} · {proj.completion}%
                  </span>
                </div>
                <div
                  style={{
                    height: 6,
                    background: 'var(--color-app-border)',
                    borderRadius: 4,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${proj.completion}%`,
                      background: proj.color || 'var(--color-teal)',
                      borderRadius: 4,
                      transition: 'width 0.5s ease',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
