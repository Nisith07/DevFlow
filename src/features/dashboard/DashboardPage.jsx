import { useState } from 'react'
import {
  ArrowRight,
  Sparkles,
  AlertCircle,
  CheckSquare,
  Flame,
  Calendar,
  Layers,
  CheckCircle2
} from 'lucide-react'
import DashboardHeader from './components/DashboardHeader'
import QuickActions from './components/QuickActions'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useDashboard, useCompleteTask } from '@/features/dashboard/hooks/useDashboard'
import { useProjects } from '@/features/projects/hooks/useProjects'

const GithubIcon = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
)

export default function DashboardPage() {
  const { user } = useAuth()
  const cleanName = user?.name ? user.name.replace(/:+$/, '') : 'Nisith'
  const firstName = cleanName.split(' ')[0]

  // Dynamic backend queries
  const { data: dashboardData, isLoading: dashboardLoading } = useDashboard()
  const { projects, isLoading: projectsLoading } = useProjects()
  const completeTaskMutation = useCompleteTask()

  // Fallback initial list state
  const [tasks, setTasks] = useState([
    { id: 'mock-1', title: 'Finish Authentication', priority: 'High', completed: false, status: 'todo' },
    { id: 'mock-2', title: 'Fix Render Deployment', priority: 'High', completed: false, status: 'todo' },
    { id: 'mock-3', title: 'Push Backend Changes', priority: 'Medium', completed: false, status: 'todo' },
    { id: 'mock-4', title: 'Review PR #14', priority: 'Medium', completed: false, status: 'todo' },
  ])

  // Bind live tasks or mock fallbacks
  const dbTasks = dashboardData?.todayTasks || []
  const displayTasks = dbTasks.length > 0 ? dbTasks : tasks

  const toggleTask = async (id) => {
    // Check if it is a mock task
    if (String(id).startsWith('mock-')) {
      setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed, status: t.completed ? 'todo' : 'done' } : t))
      return
    }
    try {
      await completeTaskMutation.mutateAsync(id)
    } catch (e) {
      console.error(e)
    }
  }

  // Calculate completed tasks for today's focus card
  const completedCount = displayTasks.filter(t => t.status === 'done' || t.completed).length
  const totalTasks = displayTasks.length

  return (
    <div className="dashboard-viewport-fit" style={{
      background: 'var(--color-app-bg)',
      color: 'var(--color-app-text)',
      height: 'calc(100vh - 24px)',
      padding: '4px 12px 10px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      overflow: 'hidden',
      fontFamily: "'Inter', sans-serif",
      boxSizing: 'border-box'
    }}>

      {/* ── HEADER & QUICK ACTIONS ─────────────────────────────────── */}
      <DashboardHeader onNewTask={() => {}} />
      <QuickActions 
        onNewProject={() => console.log('New Project')}
        onNewTask={() => console.log('New Task')}
        onGenerateCode={() => console.log('Generate Code')}
        onAPI={() => console.log('API')}
        onGithub={() => console.log('GitHub')}
        onFocusMode={() => console.log('Focus Mode')}
      />

      {/* ── DASHBOARD GRID ───────────────────────────────────────── */}
      <div style={{
        flex: 1,
        display: 'grid',
        gridTemplateRows: 'repeat(4, 1fr)',
        gap: '10px',
        minHeight: 0
      }}>

        {/* ── ROW 1 ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', minHeight: 0 }}>
          {/* CARD 1: TODAY'S FOCUS */}
          <div className="card" style={{ background: 'var(--color-app-surface)', border: '1px solid var(--color-app-border)', borderRadius: '10px', padding: '8px 10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <CheckSquare size={12} style={{ color: '#8b5cf6' }} />
              <span style={{ fontSize: '9px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-app-muted)' }}>Today's Focus</span>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flex: 1, minHeight: 0 }}>
              <div style={{ position: 'relative', width: '44px', height: '44px', flexShrink: 0 }}>
                <svg width="44" height="44" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="var(--color-app-border)" strokeWidth="3" />
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="#8b5cf6" strokeWidth="3" strokeDasharray={`${(completedCount / totalTasks) * 100} ${100 - (completedCount / totalTasks) * 100}`} strokeDashoffset="25" />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '10px', fontWeight: '900', color: 'var(--color-app-text)' }}>{totalTasks}</span>
                  <span style={{ fontSize: '6px', color: 'var(--color-app-muted)' }}>Tasks</span>
                </div>
              </div>

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '3px', minWidth: 0, overflow: 'hidden' }}>
                {displayTasks.map(t => {
                  const isDone = t.status === 'done' || !!t.completed
                  return (
                    <label key={t.id} style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', minWidth: 0 }}>
                      <input
                        type="checkbox"
                        checked={isDone}
                        onChange={() => toggleTask(t.id)}
                        style={{ accentColor: '#8b5cf6', width: '10px', height: '10px', cursor: 'pointer', flexShrink: 0 }}
                      />
                      <span style={{
                        fontSize: '9px',
                        textDecoration: isDone ? 'line-through' : 'none',
                        color: isDone ? 'var(--color-app-faint)' : 'var(--color-app-text)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        width: '100%'
                      }}>{t.title}</span>
                    </label>
                  )
                })}
              </div>
            </div>

            <a href="#tasks" style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '9px', color: '#8b5cf6', textDecoration: 'none', fontWeight: '700' }}>
              View all tasks <ArrowRight size={9} />
            </a>
          </div>

          {/* CARD 2: CONTINUE WORKING */}
          <div className="card" style={{ background: 'var(--color-app-surface)', border: '1px solid var(--color-app-border)', borderRadius: '10px', padding: '8px 10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Code size={12} style={{ color: '#06b6d4' }} />
              <span style={{ fontSize: '9px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-app-muted)' }}>Continue Working</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--color-app-surface-2)', padding: '5px 6px', borderRadius: '6px', border: '1px solid var(--color-app-border)' }}>
              <img src="/logo-icon.svg" alt="" style={{ width: 16, height: 16 }} />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '10px', fontWeight: '700', color: 'var(--color-app-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>DevFlow</div>
                <div style={{ fontSize: '7.5px', color: 'var(--color-app-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>All-in-one Workspace</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <div style={{ display: 'flex', justifySelf: 'space-between', justifyContent: 'space-between', fontSize: '9.5px' }}>
                <span style={{ color: 'var(--color-app-muted)' }}>Current Branch</span>
                <span style={{ color: 'var(--color-app-text)', fontWeight: '600', fontFamily: 'monospace' }}>feature/auth</span>
              </div>
              <div style={{ display: 'flex', justifySelf: 'space-between', justifyContent: 'space-between', fontSize: '9.5px' }}>
                <span style={{ color: 'var(--color-app-muted)' }}>Last Commit</span>
                <span style={{ color: 'var(--color-app-text)', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '80px' }}>Fix: OAuth callback</span>
              </div>
            </div>

            <a href="#projects" style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '9px', color: '#8b5cf6', textDecoration: 'none', fontWeight: '700' }}>
              Resume Work <ArrowRight size={9} />
            </a>
          </div>

          {/* CARD 3: AI DAILY BRIEF */}
          <div className="card" style={{ background: 'var(--color-app-surface)', border: '1px solid var(--color-app-border)', borderRadius: '10px', padding: '8px 10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifySelf: 'start', justifyContent: 'space-between', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Sparkles size={12} style={{ color: '#ef4444' }} />
                <span style={{ fontSize: '9px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-app-muted)' }}>AI Daily Brief</span>
              </div>
              <span style={{ fontSize: '7.5px', fontWeight: '700', color: '#a78bfa', background: 'rgba(167, 139, 250, 0.15)', padding: '0px 3px', borderRadius: '3px' }}>BETA</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1, minHeight: 0, overflow: 'hidden', margin: '2px 0', justifyContent: 'center' }}>
              <div style={{ fontSize: '9px', color: 'var(--color-app-text)', fontStyle: 'italic', lineHeight: '1.25', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                "If you complete Authentication first, Deployment can be finished today."
              </div>
            </div>

            <a href="#ai" style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '9px', color: '#8b5cf6', textDecoration: 'none', fontWeight: '700' }}>
              Open AI Copilot <ArrowRight size={9} />
            </a>
          </div>
        </div>

        {/* ── ROW 2 ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', minHeight: 0 }}>
          {/* CARD 1: SPRINT PROGRESS */}
          <div className="card" style={{ background: 'var(--color-app-surface)', border: '1px solid var(--color-app-border)', borderRadius: '10px', padding: '8px 10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifySelf: 'start', justifyContent: 'space-between', width: '100%' }}>
              <span style={{ fontSize: '10px', fontWeight: '700', color: 'var(--color-app-text)' }}>Sprint 4</span>
              <span style={{ fontSize: '8px', color: 'var(--color-app-muted)' }}>3 days left</span>
            </div>

            <div>
              <div style={{ display: 'flex', justifySelf: 'space-between', justifyContent: 'space-between', fontSize: '9px', marginBottom: '2px' }}>
                <span style={{ color: 'var(--color-app-muted)' }}>Progress</span>
                <span style={{ color: 'var(--color-app-text)', fontWeight: '700' }}>82%</span>
              </div>
              <div style={{ height: '3px', background: 'var(--color-app-border)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ width: '82%', height: '100%', background: '#8b5cf6' }} />
              </div>
            </div>

            <a href="#tasks" style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '9px', color: '#8b5cf6', textDecoration: 'none', fontWeight: '700' }}>
              View Sprint Board <ArrowRight size={9} />
            </a>
          </div>

          {/* CARD 2: ACTIVE PROJECTS */}
          <div className="card" style={{ background: 'var(--color-app-surface)', border: '1px solid var(--color-app-border)', borderRadius: '10px', padding: '8px 10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifySelf: 'start', justifyContent: 'space-between', width: '100%' }}>
              <span style={{ fontSize: '9px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-app-muted)' }}>Active Projects</span>
              <a href="#projects" style={{ fontSize: '8.5px', color: '#8b5cf6', textDecoration: 'none' }}>View all</a>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, justifyContent: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <img src="/logo-icon.svg" alt="" style={{ width: 12, height: 12 }} />
                <span style={{ fontSize: '10px', color: 'var(--color-app-text)', fontWeight: '700' }}>DevFlow (72%)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '12px', height: '12px', background: '#f59e0b', borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '7px', fontWeight: 'bold' }}>S</div>
                <span style={{ fontSize: '10px', color: 'var(--color-app-text)', fontWeight: '700' }}>Swadify (45%)</span>
              </div>
            </div>
          </div>

          {/* CARD 3: OPEN ISSUES */}
          <div className="card" style={{ background: 'var(--color-app-surface)', border: '1px solid var(--color-app-border)', borderRadius: '10px', padding: '8px 10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifySelf: 'start', justifyContent: 'space-between', width: '100%' }}>
              <span style={{ fontSize: '9px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-app-muted)' }}>Open Issues</span>
              <a href="#issues" style={{ fontSize: '8.5px', color: '#8b5cf6', textDecoration: 'none' }}>View all</a>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', flex: 1, minHeight: 0, overflow: 'hidden', justifyContent: 'center' }}>
              <div style={{ fontSize: '9.5px', color: 'var(--color-app-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>• Auth Error on Login</div>
              <div style={{ fontSize: '9.5px', color: 'var(--color-app-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>• Render Deploy Failing</div>
            </div>
          </div>
        </div>

        {/* ── ROW 3 ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', minHeight: 0 }}>
          {/* CARD 1: GITHUB ACTIVITY */}
          <div className="card" style={{ background: 'var(--color-app-surface)', border: '1px solid var(--color-app-border)', borderRadius: '10px', padding: '8px 10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifySelf: 'start', justifyContent: 'space-between', width: '100%' }}>
              <span style={{ fontSize: '9px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-app-muted)' }}>GitHub Activity</span>
              <span style={{ fontSize: '8.5px', color: '#8b5cf6' }}>This Week</span>
            </div>

            <div style={{ display: 'flex', justifySelf: 'space-between', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--color-app-text)' }}>23 Commits</span>
              <span style={{ fontSize: '8px', color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '0px 3px', borderRadius: '3px' }}>+12%</span>
            </div>

            {/* Simple heatmap strip */}
            <div style={{ display: 'flex', gap: '2px', marginTop: '2px' }}>
              {[3,0,5,8,2,6,1,7,4,0,8,3,9,2,6,4,0,9].map((v, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: '6px',
                    borderRadius: '1px',
                    background: v > 6 ? '#10b981' : v > 3 ? '#047857' : v > 0 ? '#065f46' : 'var(--color-app-surface-2)'
                  }}
                />
              ))}
            </div>
          </div>

          {/* CARD 2: CODING TIME */}
          <div className="card" style={{ background: 'var(--color-app-surface)', border: '1px solid var(--color-app-border)', borderRadius: '10px', padding: '8px 10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifySelf: 'start', justifyContent: 'space-between', width: '100%' }}>
              <span style={{ fontSize: '9px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-app-muted)' }}>Coding Time</span>
              <span style={{ fontSize: '8.5px', color: '#8b5cf6' }}>This Week</span>
            </div>

            <div style={{ display: 'flex', justifySelf: 'space-between', justifyContent: 'space-between', alignItems: 'center', flex: 1 }}>
              <span style={{ fontSize: '12px', fontWeight: '900', color: 'var(--color-app-text)' }}>30h 45m</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', fontSize: '8px', color: 'var(--color-app-muted)' }}>
                <span>• React: 14h</span>
                <span>• Node: 9h</span>
              </div>
            </div>
          </div>

          {/* CARD 3: UPCOMING EVENTS */}
          <div className="card" style={{ background: 'var(--color-app-surface)', border: '1px solid var(--color-app-border)', borderRadius: '10px', padding: '8px 10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifySelf: 'start', justifyContent: 'space-between', width: '100%' }}>
              <span style={{ fontSize: '9px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-app-muted)' }}>Upcoming Events</span>
              <span style={{ fontSize: '8.5px', color: '#8b5cf6' }}>This Week</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', flex: 1, minHeight: 0, overflow: 'hidden', justifyContent: 'center' }}>
              <div style={{ fontSize: '9.5px', color: 'var(--color-app-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>• 17 JUL: Team Standup</div>
              <div style={{ fontSize: '9.5px', color: 'var(--color-app-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>• 17 JUL: Deploy Backend</div>
            </div>
          </div>
        </div>

        {/* ── ROW 4 ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', minHeight: 0 }}>
          {/* CARD 1: DEPLOYMENTS */}
          <div className="card" style={{ background: 'var(--color-app-surface)', border: '1px solid var(--color-app-border)', borderRadius: '10px', padding: '8px 10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Layers size={12} style={{ color: '#10b981' }} />
              <span style={{ fontSize: '9px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-app-muted)' }}>Deployments</span>
            </div>

            <div style={{ display: 'flex', justifySelf: 'space-between', justifyContent: 'space-between', alignItems: 'center', flex: 1 }}>
              <div>
                <div style={{ fontSize: '10px', fontWeight: '700', color: 'var(--color-app-text)' }}>DevFlow Backend</div>
                <div style={{ fontSize: '7.5px', color: '#10b981', marginTop: '1px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <span style={{ width: '3px', height: '3px', borderRadius: '50%', background: '#10b981' }} /> Live
                </div>
              </div>
              <span style={{ fontSize: '8px', color: 'var(--color-app-muted)' }}>2h ago</span>
            </div>

            <a href="#deployments" style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '9px', color: '#8b5cf6', textDecoration: 'none', fontWeight: '700' }}>
              View all <ArrowRight size={9} />
            </a>
          </div>

          {/* CARD 2: RECENT COMMITS */}
          <div className="card" style={{ background: 'var(--color-app-surface)', border: '1px solid var(--color-app-border)', borderRadius: '10px', padding: '8px 10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <GithubIcon size={12} style={{ color: 'var(--color-app-text)' }} />
              <span style={{ fontSize: '9px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-app-muted)' }}>Recent Commits</span>
            </div>

            <div style={{ display: 'flex', justifySelf: 'space-between', justifyContent: 'space-between', alignItems: 'center', flex: 1 }}>
              <div>
                <div style={{ fontSize: '10px', fontWeight: '700', color: 'var(--color-app-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100px' }}>Fix: OAuth callback</div>
                <div style={{ fontSize: '7.5px', color: '#8b5cf6', fontFamily: 'monospace', marginTop: '1px' }}>a7f4d2e</div>
              </div>
              <span style={{ fontSize: '8px', color: 'var(--color-app-muted)' }}>27m ago</span>
            </div>

            <a href="#github" style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '9px', color: '#8b5cf6', textDecoration: 'none', fontWeight: '700' }}>
              View all <ArrowRight size={9} />
            </a>
          </div>

          {/* CARD 3: NOTIFICATIONS */}
          <div className="card" style={{ background: 'var(--color-app-surface)', border: '1px solid var(--color-app-border)', borderRadius: '10px', padding: '8px 10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Bell size={12} style={{ color: '#f59e0b' }} />
              <span style={{ fontSize: '9px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-app-muted)' }}>Notifications</span>
            </div>

            <div style={{ display: 'flex', justifySelf: 'space-between', justifyContent: 'space-between', alignItems: 'center', flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <CheckCircle2 size={10} style={{ color: '#10b981' }} />
                <span style={{ fontSize: '9.5px', color: 'var(--color-app-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100px' }}>PR #14 has been merged</span>
              </div>
              <span style={{ fontSize: '8px', color: 'var(--color-app-muted)' }}>1h ago</span>
            </div>

            <a href="#notifications" style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '9px', color: '#8b5cf6', textDecoration: 'none', fontWeight: '700' }}>
              View all <ArrowRight size={9} />
            </a>
          </div>
        </div>

      </div>

      {/* Wave keyframes style block */}
      <style>{`
        @keyframes wave {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(15deg); }
        }
      `}</style>

    </div>
  )
}
