import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight, Sparkles, AlertCircle, CheckSquare,
  Layers, CheckCircle2, Code, Bell, GitCommit,
  Activity, BarChart2, Calendar, Briefcase,
  PlusCircle, FolderPlus, RefreshCcw, Trash2,
  GitPullRequest, Globe, Rocket
} from 'lucide-react'
import DashboardHeader from './components/DashboardHeader'
import QuickActions from './components/QuickActions'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useDashboard, useCompleteTask } from '@/features/dashboard/hooks/useDashboard'
import { useProjects } from '@/features/projects/hooks/useProjects'
import { useDeployments } from '@/features/deployments/hooks/useDeployments'
import { useActivity } from '@/features/activity/hooks/useActivity'
import { useIssues } from '@/features/issues/hooks/useIssues'
import { relativeTime } from '@/shared/lib/utils'

// ── Mini helpers ──────────────────────────────────────────────────────────────
const GithubIcon = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
)

const ACTIVITY_CFG = {
  task_created:    { Icon: PlusCircle,  color: '#2dd4bf', route: '/tasks' },
  task_completed:  { Icon: CheckCircle2,color: '#10b981', route: '/tasks' },
  task_updated:    { Icon: RefreshCcw,  color: '#f59e0b', route: '/tasks' },
  task_deleted:    { Icon: Trash2,      color: '#ef4444', route: '/tasks' },
  project_created: { Icon: FolderPlus, color: '#a78bfa', route: '/projects' },
  project_updated: { Icon: RefreshCcw, color: '#f59e0b', route: '/projects' },
  project_deleted: { Icon: Trash2,     color: '#ef4444', route: '/projects' },
  github_committed:{ Icon: GitCommit,  color: '#d1d5db', route: '/github' },
  issue_created:   { Icon: AlertCircle,color: '#ef4444', route: '/issues' },
  issue_closed:    { Icon: CheckCircle2,color:'#10b981', route: '/issues' },
  ai_readme_generated:    { Icon: Sparkles, color: '#f43f5e', route: '/ai' },
  ai_component_generated: { Icon: Sparkles, color: '#f43f5e', route: '/ai' },
  portfolio_deployed:     { Icon: Globe,    color: '#60a5fa', route: '/portfolio' },
}

// Shared card style — premium neumorphic, theme-aware via CSS variables
const card = {
  background: 'var(--card-bg)',
  border: '1px solid var(--card-border)',
  borderTop: '1px solid var(--card-border-top)',
  borderLeft: '1px solid var(--card-border-left)',
  borderRadius: '12px',
  padding: '10px 12px',
  display: 'flex', flexDirection: 'column',
  justifyContent: 'space-between',
  height: '100%', boxSizing: 'border-box', overflow: 'hidden',
  boxShadow: 'var(--shadow-card-val)',
  transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
  position: 'relative',
}

const navLink = {
  display: 'flex', alignItems: 'center', gap: '2px',
  fontSize: '9px', color: '#8b5cf6', textDecoration: 'none', fontWeight: '700',
}

const sectionLabel = (color = '#8b5cf6') => ({
  fontSize: '9px', fontWeight: '800', textTransform: 'uppercase',
  letterSpacing: '0.08em', color: 'var(--color-app-muted)',
})

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [paletteOpen, setPaletteOpen] = useState(false)

  // Data
  const { data: dashboardData } = useDashboard()
  const { projects } = useProjects()
  const completeTaskMutation = useCompleteTask()
  const { data: deploymentsData } = useDeployments()
  const activityQuery = useActivity()
  const { issues } = useIssues({ status: 'open' })

  // Mock fallback tasks
  const [mockTasks] = useState([
    { id: 'mock-1', title: 'Finish Authentication', priority: 'High', status: 'todo' },
    { id: 'mock-2', title: 'Fix Render Deployment', priority: 'High', status: 'todo' },
    { id: 'mock-3', title: 'Push Backend Changes', priority: 'Medium', status: 'todo' },
    { id: 'mock-4', title: 'Review PR #14', priority: 'Medium', status: 'todo' },
  ])
  const [localMockTasks, setLocalMockTasks] = useState(mockTasks)

  const dbTasks = dashboardData?.todayTasks || []
  const displayTasks = dbTasks.length > 0 ? dbTasks : localMockTasks

  const toggleTask = async (id) => {
    if (String(id).startsWith('mock-')) {
      setLocalMockTasks(prev => prev.map(t =>
        t.id === id ? { ...t, status: t.status === 'done' ? 'todo' : 'done' } : t
      ))
      return
    }
    try { await completeTaskMutation.mutateAsync(id) } catch { /* silent */ }
  }

  const completedCount = displayTasks.filter(t => t.status === 'done' || t.completed).length
  const totalTasks = displayTasks.length

  // Deployments data
  const deployments = deploymentsData || []
  const liveDeployment = deployments.find(d => d.isProduction) || deployments[0]
  const failedDeployments = deployments.filter(d => d.status === 'failed').length
  const successDeployments = deployments.filter(d => d.status === 'success').length

  // Activity feed (flatten infinite pages)
  const activityItems = activityQuery.data?.pages?.flatMap(p => p.data) || []

  // Active projects list
  const activeProjects = (projects || []).slice(0, 3)

  // Issues
  const openIssues = (issues || []).slice(0, 3)

  // Workspace health score (0–100)
  const overdueTasks = dashboardData?.overdueTasks || 0
  const openPRs = 2 // static placeholder (no PR API yet)
  const healthScore = Math.max(0, Math.min(100,
    100
    - (failedDeployments * 20)
    - (Math.min(overdueTasks, 4) * 5)
    - (openIssues.length > 5 ? 15 : 0)
  ))
  const healthColor = healthScore >= 80 ? '#10b981' : healthScore >= 60 ? '#f59e0b' : '#ef4444'

  // Open command palette from header
  const openPalette = () => setPaletteOpen(true)

  return (
    <div className="dashboard-viewport-fit" style={{
      background: 'var(--color-app-bg)',
      color: 'var(--color-app-text)',
      height: 'calc(100vh - 24px)',
      padding: '4px 12px 10px',
      display: 'flex', flexDirection: 'column',
      justifyContent: 'space-between',
      overflow: 'hidden',
      fontFamily: "'Inter', sans-serif",
      boxSizing: 'border-box',
    }}>

      <DashboardHeader onOpenPalette={openPalette} />
      <QuickActions />

      {/* ── DASHBOARD GRID ──────────────────────────────────────────── */}
      <div style={{
        flex: 1, display: 'grid',
        gridTemplateRows: 'repeat(4, 1fr)',
        gap: '10px', minHeight: 0,
      }}>

        {/* ── ROW 1 ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', minHeight: 0 }}>

          {/* TODAY'S FOCUS */}
          <div className="card" style={card}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <CheckSquare size={12} style={{ color: '#8b5cf6' }} />
              <span style={sectionLabel()}>Today's Focus</span>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flex: 1, minHeight: 0 }}>
              <div style={{ position: 'relative', width: '44px', height: '44px', flexShrink: 0 }}>
                <svg width="44" height="44" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="var(--color-app-border)" strokeWidth="3" />
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="#8b5cf6" strokeWidth="3"
                    strokeDasharray={`${totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0} 100`}
                    strokeDashoffset="25" />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '10px', fontWeight: '900', color: 'var(--color-app-text)' }}>{totalTasks}</span>
                  <span style={{ fontSize: '6px', color: 'var(--color-app-muted)' }}>Tasks</span>
                </div>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '3px', minWidth: 0, overflow: 'hidden' }}>
                {displayTasks.slice(0, 4).map(t => {
                  const isDone = t.status === 'done' || !!t.completed
                  return (
                    <label key={t.id || t._id} style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', minWidth: 0 }}>
                      <input type="checkbox" checked={isDone}
                        onChange={() => toggleTask(t.id || t._id)}
                        style={{ accentColor: '#8b5cf6', width: '10px', height: '10px', cursor: 'pointer', flexShrink: 0 }}
                      />
                      <span style={{
                        fontSize: '9px',
                        textDecoration: isDone ? 'line-through' : 'none',
                        color: isDone ? 'var(--color-app-faint)' : 'var(--color-app-text)',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%',
                      }}>{t.title}</span>
                    </label>
                  )
                })}
              </div>
            </div>
            <Link to="/tasks" style={navLink}>View all tasks <ArrowRight size={9} /></Link>
          </div>

          {/* CONTINUE WORKING */}
          <div className="card" style={{ ...card, cursor: 'pointer' }} onClick={() => navigate('/projects')}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Code size={12} style={{ color: '#06b6d4' }} />
              <span style={sectionLabel()}>Continue Working</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--color-app-surface-2)', padding: '5px 6px', borderRadius: '6px', border: '1px solid var(--color-app-border)' }}>
              <img src="/logo-icon.svg" alt="" style={{ width: 16, height: 16 }} />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '10px', fontWeight: '700', color: 'var(--color-app-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {activeProjects[0]?.name || 'DevFlow'}
                </div>
                <div style={{ fontSize: '7.5px', color: 'var(--color-app-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {activeProjects[0]?.description || 'All-in-one Workspace'}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9.5px' }}>
                <span style={{ color: 'var(--color-app-muted)' }}>Current Branch</span>
                <span style={{ color: 'var(--color-app-text)', fontWeight: '600', fontFamily: 'monospace' }}>main</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9.5px' }}>
                <span style={{ color: 'var(--color-app-muted)' }}>Status</span>
                <span style={{ color: '#10b981', fontWeight: '600' }}>Active</span>
              </div>
            </div>
            <span style={{ ...navLink }}>Open Projects <ArrowRight size={9} /></span>
          </div>

          {/* AI DAILY BRIEF */}
          <div className="card" style={card}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Sparkles size={12} style={{ color: '#ef4444' }} />
                <span style={sectionLabel()}>AI Daily Brief</span>
              </div>
              <span style={{ fontSize: '7.5px', fontWeight: '700', color: '#a78bfa', background: 'rgba(167,139,250,0.15)', padding: '0px 3px', borderRadius: '3px' }}>BETA</span>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px', overflow: 'hidden', justifyContent: 'center' }}>
              <div style={{ fontSize: '9px', color: 'var(--color-app-text)', fontStyle: 'italic', lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {dashboardData?.streak > 0
                  ? `🔥 ${dashboardData.streak}-day streak! Complete ${dashboardData.todayTasks?.filter(t => t.status !== 'done').length || 0} remaining tasks to maintain it.`
                  : '"Focus on your highest-priority tasks. You have a great setup here — let\'s ship something today."'
                }
              </div>
            </div>
            <Link to="/ai" style={navLink}>Open AI Copilot <ArrowRight size={9} /></Link>
          </div>
        </div>

        {/* ── ROW 2 ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', minHeight: 0 }}>

          {/* SPRINT PROGRESS */}
          <div className="card" style={{ ...card, cursor: 'pointer' }} onClick={() => navigate('/tasks')}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <span style={{ fontSize: '10px', fontWeight: '700', color: 'var(--color-app-text)' }}>Sprint Progress</span>
              <span style={{ fontSize: '8px', color: 'var(--color-app-muted)' }}>
                {dashboardData?.completedToday || 0}/{totalTasks} done today
              </span>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', marginBottom: '2px' }}>
                <span style={{ color: 'var(--color-app-muted)' }}>Progress</span>
                <span style={{ color: 'var(--color-app-text)', fontWeight: '700' }}>
                  {totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0}%
                </span>
              </div>
              <div style={{ height: '3px', background: 'var(--color-app-border)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{
                  width: `${totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0}%`,
                  height: '100%', background: '#8b5cf6',
                  transition: 'width 0.3s ease',
                }} />
              </div>
            </div>
            <span style={{ ...navLink }}>Open Tasks <ArrowRight size={9} /></span>
          </div>

          {/* ACTIVE PROJECTS */}
          <div className="card" style={card}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <span style={sectionLabel()}>Active Projects</span>
              <Link to="/projects" style={{ fontSize: '8.5px', color: '#8b5cf6', textDecoration: 'none' }}>View all</Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', flex: 1, justifyContent: 'center' }}>
              {activeProjects.length > 0 ? activeProjects.map(p => (
                <div
                  key={p._id}
                  onClick={() => navigate('/projects')}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', padding: '2px 4px', borderRadius: '4px', transition: 'background 0.1s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ width: '12px', height: '12px', background: p.color || '#8b5cf6', borderRadius: '3px', flexShrink: 0 }} />
                  <span style={{ fontSize: '10px', color: 'var(--color-app-text)', fontWeight: '700', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {p.name}
                  </span>
                </div>
              )) : (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '12px', height: '12px', background: '#a78bfa', borderRadius: '3px' }} />
                    <span style={{ fontSize: '10px', color: 'var(--color-app-text)', fontWeight: '700' }}>DevFlow</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '12px', height: '12px', background: '#f59e0b', borderRadius: '3px' }} />
                    <span style={{ fontSize: '10px', color: 'var(--color-app-text)', fontWeight: '700' }}>Portfolio</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* OPEN ISSUES */}
          <div className="card" style={card}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <span style={sectionLabel()}>Open Issues</span>
              <Link to="/issues" style={{ fontSize: '8.5px', color: '#8b5cf6', textDecoration: 'none' }}>View all</Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', flex: 1, minHeight: 0, overflow: 'hidden', justifyContent: 'center' }}>
              {openIssues.length > 0 ? openIssues.map(issue => (
                <div
                  key={issue._id}
                  onClick={() => navigate('/issues')}
                  style={{ fontSize: '9.5px', color: 'var(--color-app-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', cursor: 'pointer', padding: '2px 0' }}
                >
                  <span style={{ color: '#ef4444' }}>• </span>{issue.title}
                </div>
              )) : (
                <>
                  <div style={{ fontSize: '9.5px', color: 'var(--color-app-text)' }}>• Auth Error on Login</div>
                  <div style={{ fontSize: '9.5px', color: 'var(--color-app-text)' }}>• Render Deploy Failing</div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ── ROW 3 ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', minHeight: 0 }}>

          {/* GITHUB ACTIVITY */}
          <div className="card" style={{ ...card, cursor: 'pointer' }} onClick={() => navigate('/github')}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <span style={sectionLabel()}>GitHub Activity</span>
              <span style={{ fontSize: '8.5px', color: '#8b5cf6' }}>This Week</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--color-app-text)' }}>
                {dashboardData?.githubStats?.commits || 23} Commits
              </span>
              <span style={{ fontSize: '8px', color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '0px 3px', borderRadius: '3px' }}>+12%</span>
            </div>
            <div style={{ display: 'flex', gap: '2px', marginTop: '2px' }}>
              {(dashboardData?.githubStats?.contributionGrid || [3,0,5,8,2,6,1,7,4,0,8,3,9,2,6,4,0,9]).map((v, i) => (
                <div key={i} style={{
                  flex: 1, height: '6px', borderRadius: '1px',
                  background: v > 6 ? '#10b981' : v > 3 ? '#047857' : v > 0 ? '#065f46' : 'var(--color-app-surface-2)',
                }} />
              ))}
            </div>
            <span style={{ ...navLink }}>Open GitHub <ArrowRight size={9} /></span>
          </div>

          {/* CODING TIME */}
          <div className="card" style={{ ...card, cursor: 'pointer' }} onClick={() => navigate('/analytics')}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <span style={sectionLabel()}>Coding Time</span>
              <span style={{ fontSize: '8.5px', color: '#8b5cf6' }}>This Week</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flex: 1 }}>
              <span style={{ fontSize: '12px', fontWeight: '900', color: 'var(--color-app-text)' }}>30h 45m</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', fontSize: '8px', color: 'var(--color-app-muted)' }}>
                <span>• React: 14h</span>
                <span>• Node: 9h</span>
                <span>• AI: 4h</span>
              </div>
            </div>
            <span style={{ ...navLink }}>View Analytics <ArrowRight size={9} /></span>
          </div>

          {/* UPCOMING EVENTS */}
          <div className="card" style={{ ...card, cursor: 'pointer' }} onClick={() => navigate('/planner')}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <span style={sectionLabel()}>Upcoming Events</span>
              <span style={{ fontSize: '8.5px', color: '#8b5cf6' }}>This Week</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', flex: 1, minHeight: 0, overflow: 'hidden', justifyContent: 'center' }}>
              <div style={{ fontSize: '9.5px', color: 'var(--color-app-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>📅 Team Standup — Today</div>
              <div style={{ fontSize: '9.5px', color: 'var(--color-app-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>🚀 Deploy Backend — Tomorrow</div>
            </div>
            <span style={{ ...navLink }}>Open Planner <ArrowRight size={9} /></span>
          </div>
        </div>

        {/* ── ROW 4 ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', minHeight: 0 }}>

          {/* DEPLOYMENTS */}
          <div className="card" style={{ ...card, cursor: 'pointer' }} onClick={() => navigate('/deployments')}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Layers size={12} style={{ color: '#10b981' }} />
              <span style={sectionLabel()}>Deployments</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', flex: 1, justifyContent: 'center' }}>
              {liveDeployment ? (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '10px', fontWeight: '700', color: 'var(--color-app-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '110px' }}>
                        {liveDeployment.projectName}
                      </div>
                      <div style={{ fontSize: '7.5px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <span style={{ width: '3px', height: '3px', borderRadius: '50%', background: '#10b981' }} />
                        {liveDeployment.status}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '7.5px', color: 'var(--color-app-muted)' }}>{liveDeployment.environment}</div>
                      <div style={{ fontSize: '7.5px', color: 'var(--color-app-faint)' }}>{liveDeployment.duration}s build</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', fontSize: '8px' }}>
                    <span style={{ color: '#10b981' }}>✓ {successDeployments} success</span>
                    {failedDeployments > 0 && <span style={{ color: '#ef4444' }}>✗ {failedDeployments} failed</span>}
                  </div>
                </>
              ) : (
                <div style={{ fontSize: '9px', color: 'var(--color-app-muted)' }}>No deployments yet</div>
              )}
            </div>
            <span style={{ ...navLink }}>View Logs <ArrowRight size={9} /></span>
          </div>

          {/* DEVELOPER FEED */}
          <div className="card" style={card}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Activity size={12} style={{ color: '#60a5fa' }} />
                <span style={sectionLabel()}>Developer Feed</span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', flex: 1, minHeight: 0, overflow: 'hidden', justifyContent: 'center' }}>
              {activityItems.length > 0 ? activityItems.slice(0, 3).map(item => {
                const cfg = ACTIVITY_CFG[item.action] || { Icon: Activity, color: '#60a5fa', route: '/activity' }
                const { Icon } = cfg
                return (
                  <div
                    key={item._id}
                    onClick={() => navigate(cfg.route)}
                    style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', padding: '1px 3px', borderRadius: '3px', transition: 'background 0.1s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <Icon size={9} style={{ color: cfg.color, flexShrink: 0 }} />
                    <span style={{ fontSize: '9px', color: 'var(--color-app-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                      {item.summary}
                    </span>
                  </div>
                )
              }) : (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <GitPullRequest size={9} style={{ color: '#d1d5db' }} />
                    <span style={{ fontSize: '9px', color: 'var(--color-app-text)' }}>PR #24 Approved</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Rocket size={9} style={{ color: '#10b981' }} />
                    <span style={{ fontSize: '9px', color: 'var(--color-app-text)' }}>Deployment Successful</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Sparkles size={9} style={{ color: '#f43f5e' }} />
                    <span style={{ fontSize: '9px', color: 'var(--color-app-text)' }}>AI Generated API docs</span>
                  </div>
                </>
              )}
            </div>
            <Link to="/activity" style={navLink}>View Feed <ArrowRight size={9} /></Link>
          </div>

          {/* WORKSPACE HEALTH */}
          <div className="card" style={card}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <BarChart2 size={12} style={{ color: healthColor }} />
                <span style={sectionLabel()}>Workspace Health</span>
              </div>
              <span style={{
                fontSize: '10px', fontWeight: '900', color: healthColor,
                background: `${healthColor}18`, padding: '0 5px', borderRadius: '4px',
              }}>
                {healthScore}%
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1, justifyContent: 'center' }}>
              {[
                { ok: liveDeployment?.status === 'success', label: 'Deployment Live', route: '/deployments' },
                { ok: failedDeployments === 0, label: failedDeployments > 0 ? `${failedDeployments} Failed Deploys` : 'No Failed Deploys', route: '/deployments' },
                { ok: openIssues.length <= 3, label: `${openIssues.length || 2} Open Issues`, route: '/issues' },
                { ok: overdueTasks === 0, label: overdueTasks > 0 ? `${overdueTasks} Overdue Tasks` : 'No Overdue Tasks', route: '/tasks' },
              ].map(({ ok, label, route }) => (
                <div
                  key={label}
                  onClick={() => navigate(route)}
                  style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', fontSize: '9px', padding: '1px 2px', borderRadius: '3px' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <span style={{ color: ok ? '#10b981' : '#f59e0b', fontSize: '10px' }}>{ok ? '✔' : '⚠'}</span>
                  <span style={{ color: ok ? 'var(--color-app-muted)' : 'var(--color-app-text)' }}>{label}</span>
                </div>
              ))}
            </div>
            <Link to="/analytics" style={navLink}>Full Report <ArrowRight size={9} /></Link>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes wave {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(15deg); }
        }
      `}</style>
    </div>
  )
}
