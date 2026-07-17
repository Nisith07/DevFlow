import { useState } from 'react'
import {
  Search,
  Plus,
  Bell,
  ArrowRight,
  Sparkles,
  Clock,
  AlertCircle,
  Code,
  Server,
  CheckSquare,
  Flame,
  Calendar,
  Layers,
  CheckCircle2
} from 'lucide-react'
import { useAuth } from '@/features/auth/hooks/useAuth'

const GithubIcon = ({ size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
)

export default function DashboardPage() {
  const { user } = useAuth()
  const cleanName = user?.name ? user.name.replace(/:+$/, '') : 'Nisith'
  const firstName = cleanName.split(' ')[0]

  // Mock State for interactivity
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Finish Authentication', priority: 'High', completed: false },
    { id: 2, title: 'Fix Render Deployment', priority: 'High', completed: false },
    { id: 3, title: 'Push Backend Changes', priority: 'Medium', completed: false },
    { id: 4, title: 'Review PR #14', priority: 'Medium', completed: false },
  ])

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
  }

  // Calculate completed tasks for today's focus card
  const completedCount = tasks.filter(t => t.completed).length
  const totalTasks = tasks.length

  return (
    <div style={{
      background: '#03050c',
      color: '#e8ecf1',
      height: '100vh',
      padding: '16px 24px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      overflow: 'hidden',
      fontFamily: "'Inter', sans-serif",
      boxSizing: 'border-box'
    }}>

      {/* ── HEADER ────────────────────────────────────────────────── */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '14px',
        flexShrink: 0
      }}>
        <div>
          <h1 style={{
            fontSize: '22px',
            fontWeight: '900',
            letterSpacing: '-0.03em',
            margin: '0 0 2px',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            Good afternoon, {firstName}! <span style={{ animation: 'wave 2s infinite' }}>👋</span>
          </h1>
          <p style={{ fontSize: '11.5px', color: '#8c98ad', margin: 0 }}>
            Let's ship something amazing today.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Search Box */}
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '8px',
            padding: '6px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            width: '220px'
          }}>
            <Search size={13} style={{ color: '#4a5568' }} />
            <input
              type="text"
              placeholder="Search anything..."
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#fff',
                fontSize: '11.5px',
                width: '100%'
              }}
            />
            <span style={{
              fontSize: '9px',
              color: '#4a5568',
              background: 'rgba(255,255,255,0.04)',
              padding: '1px 4px',
              borderRadius: '3px',
              fontFamily: 'monospace'
            }}>⌘K</span>
          </div>

          {/* Plus Button */}
          <button style={{
            background: 'rgba(139,92,246,0.12)',
            border: '1px solid rgba(139,92,246,0.25)',
            color: '#a78bfa',
            width: '30px',
            height: '30px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}>
            <Plus size={14} />
          </button>

          {/* Notifications Button */}
          <button style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
            color: '#8c98ad',
            width: '30px',
            height: '30px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            cursor: 'pointer'
          }}>
            <Bell size={14} />
            <span style={{
              position: 'absolute',
              top: '6px',
              right: '6px',
              width: '10px',
              height: '10px',
              background: '#ef4444',
              borderRadius: '50%',
              border: '2px solid #03050c',
              fontSize: '7px',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold'
            }}>3</span>
          </button>

          {/* Profile Picture */}
          <div style={{
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            overflow: 'hidden',
            border: '2px solid rgba(255,255,255,0.1)'
          }}>
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{
                width: '100%',
                height: '100%',
                background: 'var(--color-app-surface-2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                fontWeight: 'bold'
              }}>
                N
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── QUICK ACTIONS ROW ────────────────────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(6, 1fr)',
        gap: '10px',
        marginBottom: '14px',
        flexShrink: 0
      }}>
        {[
          { label: 'New Project', sub: 'Create new project', icon: Plus, color: 'rgba(139,92,246,0.12)', border: 'rgba(139,92,246,0.2)', text: '#a78bfa' },
          { label: 'New Task', sub: 'Add a task', icon: Plus, color: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.2)', text: '#34d399' },
          { label: 'Generate Code', sub: 'AI Code Generation', icon: Code, color: 'rgba(6,182,212,0.12)', border: 'rgba(6,182,212,0.2)', text: '#22d3ee' },
          { label: 'API', sub: 'Create API', icon: Server, color: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.2)', text: '#34d399' },
          { label: 'Open GitHub', sub: 'View Repos', icon: GithubIcon, color: 'rgba(255,255,255,0.02)', border: 'rgba(255,255,255,0.06)', text: '#fff' },
          { label: 'Focus Mode', sub: 'Start Session', icon: Clock, color: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.2)', text: '#60a5fa' },
        ].map((act, i) => (
          <button
            key={i}
            style={{
              background: 'rgba(13,17,28,0.7)',
              border: '1px solid rgba(255,255,255,0.04)',
              borderRadius: '9px',
              padding: '8px 10px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'transform 0.2s ease',
              boxSizing: 'border-box'
            }}
          >
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '6px',
              background: act.color,
              border: `1px solid ${act.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: act.text,
              flexShrink: 0
            }}>
              <act.icon size={12} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '11px', fontWeight: '700', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{act.label}</div>
              <div style={{ fontSize: '9px', color: '#8c98ad', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '1px' }}>{act.sub}</div>
            </div>
          </button>
        ))}
      </div>

      {/* ── DASHBOARD GRID ───────────────────────────────────────── */}
      <div style={{
        flex: 1,
        display: 'grid',
        gridTemplateRows: 'repeat(4, 1fr)',
        gap: '12px',
        minHeight: 0
      }}>

        {/* ── ROW 1 ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', minHeight: 0 }}>
          {/* CARD 1: TODAY'S FOCUS */}
          <div className="card" style={{ background: '#0f1322', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '12px 14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckSquare size={13} style={{ color: '#8b5cf6' }} />
              <span style={{ fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8c98ad' }}>Today's Focus</span>
            </div>

            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flex: 1, minHeight: 0 }}>
              <div style={{ position: 'relative', width: '56px', height: '56px', flexShrink: 0 }}>
                <svg width="56" height="56" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="3" />
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="#8b5cf6" strokeWidth="3" strokeDasharray={`${(completedCount / totalTasks) * 100} ${100 - (completedCount / totalTasks) * 100}`} strokeDashoffset="25" />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '12px', fontWeight: '900', color: '#fff' }}>{totalTasks}</span>
                  <span style={{ fontSize: '7px', color: '#8c98ad' }}>Tasks</span>
                </div>
              </div>

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', minWidth: 0, overflow: 'hidden' }}>
                {tasks.map(t => (
                  <label key={t.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', minWidth: 0 }}>
                    <input
                      type="checkbox"
                      checked={t.completed}
                      onChange={() => toggleTask(t.id)}
                      style={{ accentColor: '#8b5cf6', width: '11px', height: '11px', cursor: 'pointer', flexShrink: 0 }}
                    />
                    <span style={{
                      fontSize: '10px',
                      textDecoration: t.completed ? 'line-through' : 'none',
                      color: t.completed ? '#4a5568' : '#e8ecf1',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      width: '100%'
                    }}>{t.title}</span>
                  </label>
                ))}
              </div>
            </div>

            <a href="#tasks" style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '10px', color: '#8b5cf6', textDecoration: 'none', fontWeight: '700' }}>
              View all tasks <ArrowRight size={10} />
            </a>
          </div>

          {/* CARD 2: CONTINUE WORKING */}
          <div className="card" style={{ background: '#0f1322', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '12px 14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Code size={13} style={{ color: '#06b6d4' }} />
              <span style={{ fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8c98ad' }}>Continue Working</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.02)', padding: '6px 8px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
              <img src="/logo-icon.svg" alt="" style={{ width: 20, height: 20 }} />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '11.5px', fontWeight: '700', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>DevFlow</div>
                <div style={{ fontSize: '8.5px', color: '#8c98ad', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>All-in-one Developer Workspace</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', margin: '4px 0' }}>
              <div style={{ display: 'flex', justifySelf: 'space-between', justifyContent: 'space-between', fontSize: '10.5px' }}>
                <span style={{ color: '#8c98ad' }}>Current Branch</span>
                <span style={{ color: '#fff', fontWeight: '600', fontFamily: 'monospace' }}>feature/auth</span>
              </div>
              <div style={{ display: 'flex', justifySelf: 'space-between', justifyContent: 'space-between', fontSize: '10.5px' }}>
                <span style={{ color: '#8c98ad' }}>Last Commit</span>
                <span style={{ color: '#fff', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100px' }}>Fix: OAuth callback</span>
              </div>
            </div>

            <a href="#projects" style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '10px', color: '#8b5cf6', textDecoration: 'none', fontWeight: '700' }}>
              Resume Work <ArrowRight size={10} />
            </a>
          </div>

          {/* CARD 3: AI DAILY BRIEF */}
          <div className="card" style={{ background: '#0f1322', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '12px 14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifySelf: 'start', justifyContent: 'space-between', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={13} style={{ color: '#ef4444' }} />
                <span style={{ fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8c98ad' }}>AI Daily Brief</span>
              </div>
              <span style={{ fontSize: '8px', fontWeight: '700', color: '#a78bfa', background: 'rgba(167, 139, 250, 0.15)', padding: '0px 4px', borderRadius: '3px' }}>BETA</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, minHeight: 0, overflow: 'hidden', margin: '4px 0' }}>
              <div style={{ fontSize: '10px', color: '#fff', fontStyle: 'italic', lineHeight: '1.3', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                "If you complete Authentication first, Deployment can be finished today."
              </div>
            </div>

            <a href="#ai" style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '10px', color: '#8b5cf6', textDecoration: 'none', fontWeight: '700' }}>
              Open AI Copilot <ArrowRight size={10} />
            </a>
          </div>
        </div>

        {/* ── ROW 2 ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', minHeight: 0 }}>
          {/* CARD 1: SPRINT PROGRESS */}
          <div className="card" style={{ background: '#0f1322', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '12px 14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifySelf: 'start', justifyContent: 'space-between', width: '100%' }}>
              <span style={{ fontSize: '11px', fontWeight: '700', color: '#fff' }}>Sprint 4</span>
              <span style={{ fontSize: '9px', color: '#8c98ad' }}>3 days left</span>
            </div>

            <div>
              <div style={{ display: 'flex', justifySelf: 'space-between', justifyContent: 'space-between', fontSize: '10px', marginBottom: '4px' }}>
                <span style={{ color: '#8c98ad' }}>Progress</span>
                <span style={{ color: '#fff', fontWeight: '700' }}>82%</span>
              </div>
              <div style={{ height: '4px', background: 'rgba(255,255,255,0.03)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ width: '82%', height: '100%', background: '#8b5cf6' }} />
              </div>
            </div>

            <a href="#tasks" style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '10px', color: '#8b5cf6', textDecoration: 'none', fontWeight: '700' }}>
              View Sprint Board <ArrowRight size={10} />
            </a>
          </div>

          {/* CARD 2: ACTIVE PROJECTS */}
          <div className="card" style={{ background: '#0f1322', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '12px 14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifySelf: 'start', justifyContent: 'space-between', width: '100%' }}>
              <span style={{ fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8c98ad' }}>Active Projects</span>
              <a href="#projects" style={{ fontSize: '9.5px', color: '#8b5cf6', textDecoration: 'none' }}>View all</a>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1, justifyContent: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <img src="/logo-icon.svg" alt="" style={{ width: 14, height: 14 }} />
                <span style={{ fontSize: '11px', color: '#fff', fontWeight: '700' }}>DevFlow (72%)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '14px', height: '14px', background: '#f59e0b', borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', fontWeight: 'bold' }}>S</div>
                <span style={{ fontSize: '11px', color: '#fff', fontWeight: '700' }}>Swadify (45%)</span>
              </div>
            </div>
          </div>

          {/* CARD 3: OPEN ISSUES */}
          <div className="card" style={{ background: '#0f1322', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '12px 14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifySelf: 'start', justifyContent: 'space-between', width: '100%' }}>
              <span style={{ fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8c98ad' }}>Open Issues</span>
              <a href="#issues" style={{ fontSize: '9.5px', color: '#8b5cf6', textDecoration: 'none' }}>View all</a>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, minHeight: 0, overflow: 'hidden', justifyContent: 'center' }}>
              <div style={{ fontSize: '10.5px', color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>• Authentication Error on Login</div>
              <div style={{ fontSize: '10.5px', color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>• Render Deployment Failing</div>
            </div>
          </div>
        </div>

        {/* ── ROW 3 ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', minHeight: 0 }}>
          {/* CARD 1: GITHUB ACTIVITY */}
          <div className="card" style={{ background: '#0f1322', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '12px 14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifySelf: 'start', justifyContent: 'space-between', width: '100%' }}>
              <span style={{ fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8c98ad' }}>GitHub Activity</span>
              <span style={{ fontSize: '9.5px', color: '#8b5cf6' }}>This Week</span>
            </div>

            <div style={{ display: 'flex', justifySelf: 'space-between', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', fontWeight: '800', color: '#fff' }}>23 Commits</span>
              <span style={{ fontSize: '9.5px', color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '1px 4px', borderRadius: '3px' }}>+12%</span>
            </div>

            {/* Simple heatmap strip */}
            <div style={{ display: 'flex', gap: '2px', marginTop: '4px' }}>
              {[3,0,5,8,2,6,1,7,4,0,8,3,9,2,6,4,0,9].map((v, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: '8px',
                    borderRadius: '1px',
                    background: v > 6 ? '#10b981' : v > 3 ? '#047857' : v > 0 ? '#065f46' : 'rgba(255,255,255,0.02)'
                  }}
                />
              ))}
            </div>
          </div>

          {/* CARD 2: CODING TIME */}
          <div className="card" style={{ background: '#0f1322', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '12px 14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifySelf: 'start', justifyContent: 'space-between', width: '100%' }}>
              <span style={{ fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8c98ad' }}>Coding Time</span>
              <span style={{ fontSize: '9.5px', color: '#8b5cf6' }}>This Week</span>
            </div>

            <div style={{ display: 'flex', justifySelf: 'space-between', justifyContent: 'space-between', alignItems: 'center', flex: 1 }}>
              <span style={{ fontSize: '14px', fontWeight: '900', color: '#fff' }}>30h 45m</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '8.5px', color: '#8c98ad' }}>
                <span>• React: 14h</span>
                <span>• Node: 9h</span>
              </div>
            </div>
          </div>

          {/* CARD 3: UPCOMING EVENTS */}
          <div className="card" style={{ background: '#0f1322', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '12px 14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifySelf: 'start', justifyContent: 'space-between', width: '100%' }}>
              <span style={{ fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8c98ad' }}>Upcoming Events</span>
              <span style={{ fontSize: '9.5px', color: '#8b5cf6' }}>This Week</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, minHeight: 0, overflow: 'hidden', justifyContent: 'center' }}>
              <div style={{ fontSize: '10.5px', color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>• 17 JUL: Team Standup</div>
              <div style={{ fontSize: '10.5px', color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>• 17 JUL: Deploy Backend</div>
            </div>
          </div>
        </div>

        {/* ── ROW 4 (NEW LAST ROW FROM PHOTO) ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', minHeight: 0 }}>
          {/* CARD 1: DEPLOYMENTS */}
          <div className="card" style={{ background: '#0f1322', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '12px 14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Layers size={13} style={{ color: '#10b981' }} />
              <span style={{ fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8c98ad' }}>Deployments</span>
            </div>

            <div style={{ display: 'flex', justifySelf: 'space-between', justifyContent: 'space-between', alignItems: 'center', flex: 1 }}>
              <div>
                <div style={{ fontSize: '11px', fontWeight: '700', color: '#fff' }}>DevFlow Backend</div>
                <div style={{ fontSize: '8.5px', color: '#10b981', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#10b981' }} /> Live
                </div>
              </div>
              <span style={{ fontSize: '9px', color: '#8c98ad' }}>2h ago</span>
            </div>

            <a href="#deployments" style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '10px', color: '#8b5cf6', textDecoration: 'none', fontWeight: '700' }}>
              View all <ArrowRight size={10} />
            </a>
          </div>

          {/* CARD 2: RECENT COMMITS */}
          <div className="card" style={{ background: '#0f1322', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '12px 14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <GithubIcon size={13} style={{ color: '#fff' }} />
              <span style={{ fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8c98ad' }}>Recent Commits</span>
            </div>

            <div style={{ display: 'flex', justifySelf: 'space-between', justifyContent: 'space-between', alignItems: 'center', flex: 1 }}>
              <div>
                <div style={{ fontSize: '11px', fontWeight: '700', color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '120px' }}>Fix: OAuth callback</div>
                <div style={{ fontSize: '8.5px', color: '#8b5cf6', fontFamily: 'monospace', marginTop: '2px' }}>a7f4d2e</div>
              </div>
              <span style={{ fontSize: '9px', color: '#8c98ad' }}>27m ago</span>
            </div>

            <a href="#github" style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '10px', color: '#8b5cf6', textDecoration: 'none', fontWeight: '700' }}>
              View all <ArrowRight size={10} />
            </a>
          </div>

          {/* CARD 3: NOTIFICATIONS */}
          <div className="card" style={{ background: '#0f1322', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '12px 14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Bell size={13} style={{ color: '#f59e0b' }} />
              <span style={{ fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8c98ad' }}>Notifications</span>
            </div>

            <div style={{ display: 'flex', justifySelf: 'space-between', justifyContent: 'space-between', alignItems: 'center', flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={11} style={{ color: '#10b981' }} />
                <span style={{ fontSize: '10.5px', color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '120px' }}>PR #14 has been merged</span>
              </div>
              <span style={{ fontSize: '9px', color: '#8c98ad' }}>1h ago</span>
            </div>

            <a href="#notifications" style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '10px', color: '#8b5cf6', textDecoration: 'none', fontWeight: '700' }}>
              View all <ArrowRight size={10} />
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
