import PageHeader from '@/shared/components/PageHeader'
import { useAnalytics } from './hooks/useAnalytics'
import LoadingSpinner from '@/shared/components/LoadingSpinner'
import {
  CheckCircle2, Clock, XCircle, TrendingUp, BarChart2, Target, Zap, Code2, AlertTriangle, HelpCircle
} from 'lucide-react'

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

function StatCard({ icon: Icon, color, label, value, sub }) {
  return (
    <div className="card hover-lift" style={{ display: 'flex', alignItems: 'flex-start', gap: 14, background: 'var(--color-app-surface)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '12px', padding: '16px' }}>
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: 10,
          background: `${color}15`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Icon size={18} style={{ color }} />
      </div>
      <div>
        <p style={{ margin: 0, fontSize: 24, fontWeight: '800', color: 'var(--color-app-text)', lineHeight: 1.1 }}>
          {value}
        </p>
        <p style={{ margin: '3px 0 0', fontSize: 12, color: 'var(--color-app-muted)', fontWeight: '500' }}>
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

function MiniBarChart({ title, data, dataKey, color, labelKey, maxVal }) {
  const max = maxVal || Math.max(...data.map(d => d[dataKey]), 1)
  return (
    <div className="card" style={{ flex: 1 }}>
      <h4 style={{ margin: '0 0 16px 0', fontSize: '13px', fontWeight: '800', color: 'var(--color-app-text)', display: 'flex', alignItems: 'center', gap: 6 }}>
        <BarChart2 size={13} style={{ color }} />
        <span>{title}</span>
      </h4>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '140px', padding: '10px 0', gap: 8 }}>
        {data.map((item, idx) => {
          const val = item[dataKey]
          const pct = Math.min((val / max) * 100, 100)
          return (
            <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
              <span style={{ fontSize: '10px', color: '#fff', fontWeight: 'bold', marginBottom: '4px' }}>{val}</span>
              <div
                style={{
                  width: '100%',
                  height: `${pct}%`,
                  background: color,
                  borderRadius: '4px 4px 0 0',
                  boxShadow: `0 2px 8px ${color}33`,
                  transition: 'height 0.6s ease'
                }}
              />
              <span style={{ fontSize: '10.5px', color: 'var(--color-app-faint)', marginTop: '6px', textTransform: 'uppercase', fontWeight: 'bold' }}>{item[labelKey]}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

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

  const {
    overview = { total: 0, done: 0, active: 0, productivityScore: 0 },
    statusBreakdown = {},
    priorities = {},
    projectStats = [],
    heatmap = [],
    weeklyProgress = [],
    codingTime = [],
    githubCommits = [],
    aiUsage = { queries: 0, tokens: 0 },
    sprintVelocity = { current: 0, target: 0, history: [] },
  } = data ?? {}

  const maxStatus = Math.max(...Object.values(statusBreakdown), 1)

  return (
    <div className="view-enter" style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingBottom: 30 }}>
      <PageHeader
        title="Analytics Workspace"
        subtitle="Developer insights, sprint velocities, and live coding performance statistics."
      />

      {/* 1. OVERVIEW STATISTICS CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
        <StatCard icon={Target} color="var(--color-teal)" label="Total Tasks" value={overview.total} />
        <StatCard icon={CheckCircle2} color="var(--color-priority-low)" label="Completed Tasks" value={overview.done} sub={`${overview.completionRate}% completions`} />
        <StatCard icon={Clock} color="var(--color-amber)" label="Active Tasks" value={overview.active} sub="In progress or in review" />
        <StatCard icon={Code2} color="var(--color-teal)" label="Productivity Score" value={`${overview.productivityScore}%`} sub="Overall index rating" />
        <StatCard icon={Zap} color="var(--color-priority-medium)" label="AI Assistance" value={aiUsage.queries} sub="Queries saved hours" />
      </div>

      {/* 2. PRODUCTIVITY SCORE & VELOCITY DIAL SECTION */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 20 }}>
        
        {/* Productivity rating gauge dial */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '20px' }}>
          <div>
            <h4 style={{ margin: '0 0 4px 0', fontSize: '13.5px', fontWeight: '800', color: 'var(--color-app-text)' }}>Focus productivity Rating</h4>
            <p style={{ margin: 0, fontSize: '11.5px', color: 'var(--color-app-muted)' }}>Index of commits frequency, tasks completions and AI saves.</p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '20px 0', position: 'relative' }}>
            {/* Glowing gauge ring */}
            <div style={{ width: '130px', height: '130px', borderRadius: '50%', background: 'conic-gradient(var(--color-teal) 75%, rgba(255,255,255,0.03) 0%)', display: 'flex', alignItems: 'center', justifyContents: 'center', position: 'relative', boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)' }}>
              <div style={{ width: '106px', height: '106px', borderRadius: '50%', background: '#0b0f19', margin: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 10 }}>
                <span style={{ fontSize: '26px', fontWeight: '900', color: '#fff', textShadow: '0 0 10px rgba(79, 184, 168, 0.4)' }}>
                  {overview.productivityScore}%
                </span>
                <span style={{ fontSize: '9px', textTransform: 'uppercase', fontWeight: 'bold', color: 'var(--color-teal)', letterSpacing: '0.04em', marginTop: '2px' }}>
                  OPTIMAL
                </span>
              </div>
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '10px', padding: '10px 14px', fontSize: '11.5px', color: 'var(--color-app-muted)', lineHeight: 1.4 }}>
            🔥 <strong>Performance note:</strong> Task velocity is up 12% compared to last week. Continue applying AI auto-schedules to maintain focus blocks.
          </div>
        </div>

        {/* Sprint Velocity Comparison dial */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '20px' }}>
          <div>
            <h4 style={{ margin: '0 0 4px 0', fontSize: '13.5px', fontWeight: '800', color: 'var(--color-app-text)' }}>Sprint Velocity comparison</h4>
            <p style={{ margin: 0, fontSize: '11.5px', color: 'var(--color-app-muted)' }}>Comparison of completed sprint backlog cards vs target backlog cards.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, margin: '20px 0' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--color-app-muted)', marginBottom: 6 }}>
                <span>Backlog completed ({sprintVelocity.current} of {sprintVelocity.target} cards)</span>
                <span style={{ fontWeight: 'bold', color: '#fff' }}>{Math.round((sprintVelocity.current / sprintVelocity.target) * 100)}%</span>
              </div>
              <div style={{ height: 10, background: 'var(--color-app-border)', borderRadius: 5, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${(sprintVelocity.current / sprintVelocity.target) * 100}%`, background: 'var(--color-teal)', borderRadius: 5 }} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
              {sprintVelocity.history.map((vel, idx) => (
                <div key={idx} style={{ flex: 1, padding: '10px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '8px', textAlign: 'center' }}>
                  <span style={{ fontSize: '10px', color: 'var(--color-app-muted)', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>Sprint {idx+1}</span>
                  <strong style={{ fontSize: '15px', color: '#fff' }}>{vel} done</strong>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* 3. MULTI-BAR PERFORMANCE METRICS CHARTS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
        {/* Weekly progress Completed Tasks bar chart */}
        <MiniBarChart
          title="Weekly Progress (Tasks Completed)"
          data={weeklyProgress}
          dataKey="count"
          color="var(--color-teal)"
          labelKey="day"
        />

        {/* Coding Time bar chart */}
        <MiniBarChart
          title="Tracked Coding Time (Hours)"
          data={codingTime}
          dataKey="hours"
          color="var(--color-amber)"
          labelKey="day"
        />

        {/* GitHub commits bar chart */}
        <MiniBarChart
          title="GitHub Commits Activity"
          data={githubCommits}
          dataKey="commits"
          color="var(--color-priority-medium)"
          labelKey="day"
        />
      </div>

      {/* 4. AI USAGE AND PROJECT HEALTH SUMMARY */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 20 }}>
        
        {/* AI Usage totals block */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <h4 style={{ margin: 0, fontSize: '13.5px', fontWeight: '800', color: 'var(--color-app-text)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Zap size={14} style={{ color: 'var(--color-amber)' }} />
            <span>AI Copilot Usage Log</span>
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ padding: '16px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '10px' }}>
              <span style={{ fontSize: '11px', color: 'var(--color-app-muted)', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Queries Run</span>
              <strong style={{ fontSize: '22px', color: '#fff' }}>{aiUsage.queries}</strong>
            </div>

            <div style={{ padding: '16px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '10px' }}>
              <span style={{ fontSize: '11px', color: 'var(--color-app-muted)', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Tokens Consumed</span>
              <strong style={{ fontSize: '22px', color: '#fff' }}>{aiUsage.tokens.toLocaleString()}</strong>
            </div>
          </div>

          <div style={{ flex: 1, padding: '12px 16px', background: 'rgba(79, 184, 168, 0.05)', border: '1px solid rgba(79, 184, 168, 0.1)', borderRadius: '10px', color: 'var(--color-teal)', fontSize: '12px', lineHeight: 1.5 }}>
            🚀 <strong>Developer AI Savings:</strong> Estimated <strong>{Math.round(aiUsage.queries * 15 / 60 * 10) / 10} hours</strong> of typing, formatting, and debugging saved by using the AI Assistant and SQL Generator capabilities.
          </div>
        </div>

        {/* Project Health Progress index */}
        {projectStats.length > 0 && (
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h4 style={{ margin: 0, fontSize: '13.5px', fontWeight: '800', color: 'var(--color-app-text)' }}>Project Velocity Summary</h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto', maxHeight: '180px' }}>
              {projectStats.map((proj) => (
                <div key={proj.projectId} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)', paddingBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ fontSize: '12.5px', color: 'var(--color-app-text)', fontWeight: '600' }}>{proj.icon} {proj.name}</span>
                    <span style={{ fontSize: '11.5px', color: 'var(--color-app-muted)' }}>{proj.done}/{proj.total} done &middot; {proj.completion}%</span>
                  </div>
                  <div style={{ height: 6, background: 'var(--color-app-border)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${proj.completion}%`, background: proj.color || 'var(--color-teal)', borderRadius: 3 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
