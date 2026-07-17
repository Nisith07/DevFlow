import { useState, useEffect } from 'react'
import {
  Search,
  Plus,
  Bell,
  Command,
  ArrowRight,
  Sparkles,
  GitCommit,
  Clock,
  CheckCircle2,
  AlertCircle,
  Code,
  Server,
  Layers,
  CheckSquare,
  Flame,
  Calendar
} from 'lucide-react'
import { useAuth } from '@/features/auth/hooks/useAuth'

const GithubIcon = ({ size = 14 }) => (
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
      minHeight: '100vh',
      padding: '24px 32px 40px',
      overflowY: 'auto',
      fontFamily: "'Inter', sans-serif"
    }}>

      {/* ── HEADER ────────────────────────────────────────────────── */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '28px'
      }}>
        <div>
          <h1 style={{
            fontSize: '26px',
            fontWeight: '900',
            letterSpacing: '-0.03em',
            margin: '0 0 4px',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            Good afternoon, {firstName}! <span style={{ animation: 'wave 2s infinite' }}>👋</span>
          </h1>
          <p style={{ fontSize: '13.5px', color: '#8c98ad', margin: 0 }}>
            Let's ship something amazing today.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Search Box */}
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '9px',
            padding: '8px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            width: '260px'
          }}>
            <Search size={14} style={{ color: '#4a5568' }} />
            <input
              type="text"
              placeholder="Search anything..."
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#fff',
                fontSize: '12.5px',
                width: '100%'
              }}
            />
            <span style={{
              fontSize: '10px',
              color: '#4a5568',
              background: 'rgba(255,255,255,0.04)',
              padding: '2px 5px',
              borderRadius: '4px',
              fontFamily: 'monospace'
            }}>⌘K</span>
          </div>

          {/* Plus Button */}
          <button style={{
            background: 'rgba(139,92,246,0.12)',
            border: '1px solid rgba(139,92,246,0.25)',
            color: '#a78bfa',
            width: '36px',
            height: '36px',
            borderRadius: '9px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}>
            <Plus size={16} />
          </button>

          {/* Notifications Button */}
          <button style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
            color: '#8c98ad',
            width: '36px',
            height: '36px',
            borderRadius: '9px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            cursor: 'pointer'
          }}>
            <Bell size={16} />
            <span style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              width: '12px',
              height: '12px',
              background: '#ef4444',
              borderRadius: '50%',
              border: '2px solid #03050c',
              fontSize: '8px',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold'
            }}>3</span>
          </button>

          {/* Profile Picture */}
          <div style={{
            width: '36px',
            height: '36px',
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
                fontSize: '13px',
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
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '12px',
        marginBottom: '28px'
      }}>
        {[
          { label: 'New Project', sub: 'Create new project', icon: Plus, color: 'rgba(139,92,246,0.15)', border: 'rgba(139,92,246,0.25)', text: '#a78bfa' },
          { label: 'New Task', sub: 'Add a task', icon: Plus, color: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.25)', text: '#34d399' },
          { label: 'Generate Code', sub: 'AI Code Generation', icon: Code, color: 'rgba(6,182,212,0.15)', border: 'rgba(6,182,212,0.25)', text: '#22d3ee' },
          { label: 'API', sub: 'Create API', icon: Server, color: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.25)', text: '#34d399' },
          { label: 'Open GitHub', sub: 'View Repos', icon: GithubIcon, color: 'rgba(255,255,255,0.03)', border: 'rgba(255,255,255,0.08)', text: '#fff' },
          { label: 'Focus Mode', sub: 'Start Session', icon: Clock, color: 'rgba(59,130,246,0.15)', border: 'rgba(59,130,246,0.25)', text: '#60a5fa' },
        ].map((act, i) => (
          <button
            key={i}
            style={{
              background: 'rgba(13,17,28,0.7)',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '12px',
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'transform 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: act.color,
              border: `1px solid ${act.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: act.text,
              flexShrink: 0
            }}>
              <act.icon size={14} />
            </div>
            <div>
              <div style={{ fontSize: '12.5px', fontWeight: '700', color: '#fff' }}>{act.label}</div>
              <div style={{ fontSize: '10px', color: '#8c98ad', marginTop: '2px' }}>{act.sub}</div>
            </div>
          </button>
        ))}
      </div>

      {/* ── DASHBOARD GRID ───────────────────────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '20px'
      }}>

        {/* ── ROW 1 ── */}
        {/* CARD 1: TODAY'S FOCUS */}
        <div className="card" style={{ background: '#0f1322', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', height: '330px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <CheckSquare size={14} style={{ color: '#8b5cf6' }} />
            <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8c98ad' }}>Today's Focus</span>
          </div>

          <div style={{ display: 'flex', flex: 1, gap: '20px', alignItems: 'center' }}>
            {/* Circular representation */}
            <div style={{ position: 'relative', width: '90px', height: '90px', flexShrink: 0 }}>
              <svg width="90" height="90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="3" />
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#8b5cf6" strokeWidth="3" strokeDasharray={`${(completedCount / totalTasks) * 100} ${100 - (completedCount / totalTasks) * 100}`} strokeDashoffset="25" />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '18px', fontWeight: '900', color: '#fff' }}>{totalTasks}</span>
                <span style={{ fontSize: '9px', color: '#8c98ad' }}>Tasks</span>
              </div>
            </div>

            {/* List side */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11.5px' }}>
                <span style={{ color: '#8c98ad' }}>High Priority</span>
                <span style={{ color: '#ef4444', fontWeight: 'bold' }}>2</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {tasks.map(t => (
                  <label key={t.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={t.completed}
                      onChange={() => toggleTask(t.id)}
                      style={{
                        accentColor: '#8b5cf6',
                        width: '13px',
                        height: '13px',
                        cursor: 'pointer'
                      }}
                    />
                    <span style={{
                      fontSize: '11px',
                      textDecoration: t.completed ? 'line-through' : 'none',
                      color: t.completed ? '#4a5568' : '#e8ecf1',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      maxWidth: '150px'
                    }}>{t.title}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <a href="#tasks" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11.5px', color: '#8b5cf6', textDecoration: 'none', fontWeight: '700', marginTop: 'auto' }}>
            View all tasks <ArrowRight size={12} />
          </a>
        </div>

        {/* CARD 2: CONTINUE WORKING */}
        <div className="card" style={{ background: '#0f1322', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', height: '330px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
            <Code size={14} style={{ color: '#06b6d4' }} />
            <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8c98ad' }}>Continue Working</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.04)', marginBottom: '16px' }}>
            <img src="/logo-icon.svg" alt="" style={{ width: 28, height: 28 }} />
            <div>
              <div style={{ fontSize: '13.5px', fontWeight: '700', color: '#fff' }}>DevFlow</div>
              <div style={{ fontSize: '10px', color: '#8c98ad', marginTop: '2px' }}>All-in-one Developer Workspace</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px' }}>
              <span style={{ color: '#8c98ad' }}>Last opened</span>
              <span style={{ color: '#fff', fontWeight: '600' }}>21 minutes ago</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px' }}>
              <span style={{ color: '#8c98ad' }}>Current Branch</span>
              <span style={{ color: '#fff', fontWeight: '600', fontFamily: 'monospace' }}>feature/auth</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px' }}>
              <span style={{ color: '#8c98ad' }}>Last Commit</span>
              <span style={{ color: '#fff', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '120px' }}>Fix: OAuth callback</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px' }}>
              <span style={{ color: '#8c98ad' }}>Commit Hash</span>
              <span style={{ color: '#8b5cf6', fontWeight: '600', fontFamily: 'monospace' }}>a7f4d2e</span>
            </div>
          </div>

          <a href="#projects" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11.5px', color: '#8b5cf6', textDecoration: 'none', fontWeight: '700', marginTop: 'auto' }}>
            Resume Work <ArrowRight size={12} />
          </a>
        </div>

        {/* CARD 3: AI DAILY BRIEF */}
        <div className="card" style={{ background: '#0f1322', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', height: '330px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={14} style={{ color: '#ef4444' }} />
              <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8c98ad' }}>AI Daily Brief</span>
            </div>
            <span style={{ fontSize: '9px', fontWeight: '700', color: '#a78bfa', background: 'rgba(167, 139, 250, 0.15)', padding: '1px 5px', borderRadius: '4px' }}>BETA</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, fontSize: '11.5px' }}>
            <div>
              <div style={{ color: '#8c98ad', fontWeight: '700', textTransform: 'uppercase', fontSize: '9.5px', marginBottom: '6px' }}>Yesterday</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', color: '#a7f3d0' }}>
                <div>✓ Fixed MongoDB connection</div>
                <div>✓ Added Dashboard UI</div>
              </div>
            </div>
            <div>
              <div style={{ color: '#8c98ad', fontWeight: '700', textTransform: 'uppercase', fontSize: '9.5px', marginBottom: '6px' }}>AI Insight</div>
              <p style={{ color: '#fff', margin: 0, fontStyle: 'italic', lineHeight: '1.4' }}>
                "If you complete Authentication first, Deployment can be finished today."
              </p>
            </div>
          </div>

          <a href="#ai" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11.5px', color: '#8b5cf6', textDecoration: 'none', fontWeight: '700', marginTop: 'auto' }}>
            Open AI Copilot <ArrowRight size={12} />
          </a>
        </div>

        {/* ── ROW 2 ── */}
        {/* CARD 1: SPRINT PROGRESS */}
        <div className="card" style={{ background: '#0f1322', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', height: '240px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifySelf: 'start', justifyContent: 'space-between', marginBottom: '20px', width: '100%' }}>
            <span style={{ fontSize: '13px', fontWeight: '700', color: '#fff' }}>Sprint 4</span>
            <span style={{ fontSize: '10.5px', color: '#8c98ad' }}>3 days left</span>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', marginBottom: '6px' }}>
              <span style={{ color: '#8c98ad' }}>Progress</span>
              <span style={{ color: '#fff', fontWeight: '700' }}>82%</span>
            </div>
            <div style={{ height: '6px', background: 'rgba(255,255,255,0.03)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: '82%', height: '100%', background: '#8b5cf6' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', flex: 1 }}>
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '14px', fontWeight: '900', color: '#fff' }}>12/15</div>
              <div style={{ fontSize: '9px', color: '#8c98ad', marginTop: '2px' }}>Completed</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '14px', fontWeight: '900', color: '#fff' }}>3</div>
              <div style={{ fontSize: '9px', color: '#8c98ad', marginTop: '2px' }}>In Progress</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '14px', fontWeight: '900', color: '#fff' }}>2</div>
              <div style={{ fontSize: '9px', color: '#8c98ad', marginTop: '2px' }}>Review</div>
            </div>
          </div>

          <a href="#tasks" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11.5px', color: '#8b5cf6', textDecoration: 'none', fontWeight: '700', marginTop: 'auto' }}>
            View Sprint Board <ArrowRight size={12} />
          </a>
        </div>

        {/* CARD 2: ACTIVE PROJECTS */}
        <div className="card" style={{ background: '#0f1322', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', height: '240px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifySelf: 'start', justifyContent: 'space-between', marginBottom: '16px', width: '100%' }}>
            <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8c98ad' }}>Active Projects</span>
            <a href="#projects" style={{ fontSize: '10.5px', color: '#8b5cf6', textDecoration: 'none' }}>View all</a>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
            {/* Project 1 */}
            <div style={{ display: 'flex', alignItems: 'center', justifySelf: 'space-between', width: '100%', gap: '12px' }}>
              <img src="/logo-icon.svg" alt="" style={{ width: 22, height: 22 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifySelf: 'space-between', width: '100%', fontSize: '12.5px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>
                  <span>DevFlow</span>
                  <span>72%</span>
                </div>
                <div style={{ height: '4px', background: 'rgba(255,255,255,0.03)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: '72%', height: '100%', background: '#8b5cf6' }} />
                </div>
              </div>
            </div>
            {/* Project 2 */}
            <div style={{ display: 'flex', alignItems: 'center', justifySelf: 'space-between', width: '100%', gap: '12px' }}>
              <div style={{ width: '22px', height: '22px', background: '#f59e0b', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 'bold', color: '#fff' }}>S</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifySelf: 'space-between', width: '100%', fontSize: '12.5px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>
                  <span>Swadify</span>
                  <span>45%</span>
                </div>
                <div style={{ height: '4px', background: 'rgba(255,255,255,0.03)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: '45%', height: '100%', background: '#f59e0b' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CARD 3: OPEN ISSUES */}
        <div className="card" style={{ background: '#0f1322', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', height: '240px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifySelf: 'start', justifyContent: 'space-between', marginBottom: '16px', width: '100%' }}>
            <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8c98ad' }}>Open Issues</span>
            <a href="#issues" style={{ fontSize: '10.5px', color: '#8b5cf6', textDecoration: 'none' }}>View all</a>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
            {[
              { title: 'Authentication Error on Login', priority: 'High', color: '#ef4444' },
              { title: 'Render Deployment Failing', priority: 'Critical', color: '#ef4444' },
              { title: 'Navbar Overflow on Mobile', priority: 'Low', color: '#8c98ad' },
            ].map((issue, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.01)', padding: '8px 10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.03)' }}>
                <AlertCircle size={12} style={{ color: issue.color }} />
                <span style={{ fontSize: '11.5px', color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{issue.title}</span>
                <span style={{ fontSize: '9px', padding: '1px 5px', borderRadius: '4px', background: 'rgba(255,255,255,0.03)', color: '#8c98ad' }}>#{10 + idx}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── ROW 3 ── */}
        {/* CARD 1: GITHUB ACTIVITY */}
        <div className="card" style={{ background: '#0f1322', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', height: '260px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifySelf: 'start', justifyContent: 'space-between', marginBottom: '16px', width: '100%' }}>
            <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8c98ad' }}>GitHub Activity</span>
            <span style={{ fontSize: '10.5px', color: '#8b5cf6' }}>This Week</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '14px' }}>
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '8px' }}>
              <div style={{ fontSize: '10px', color: '#8c98ad' }}>Commits</div>
              <div style={{ fontSize: '15px', fontWeight: '800', color: '#fff', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                23 <span style={{ fontSize: '9.5px', color: '#10b981' }}>+12%</span>
              </div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '8px' }}>
              <div style={{ fontSize: '10px', color: '#8c98ad' }}>PRs</div>
              <div style={{ fontSize: '15px', fontWeight: '800', color: '#fff', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                5 <span style={{ fontSize: '9.5px', color: '#10b981' }}>+25%</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifySelf: 'space-between', width: '100%', marginBottom: '10px' }}>
            <span style={{ fontSize: '11px', color: '#8c98ad', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Flame size={12} style={{ color: '#f59e0b' }} /> Streak: 17 days
            </span>
          </div>

          {/* Simple contribution heatmap strip */}
          <div style={{ display: 'flex', gap: '3px', marginTop: 'auto' }}>
            {[3,0,5,8,2,6,1,7,4,0,8,3,9,2,6,4,0,9].map((v, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: '14px',
                  borderRadius: '2px',
                  background: v > 6 ? '#10b981' : v > 3 ? '#047857' : v > 0 ? '#065f46' : 'rgba(255,255,255,0.02)'
                }}
              />
            ))}
          </div>
        </div>

        {/* CARD 2: CODING TIME */}
        <div className="card" style={{ background: '#0f1322', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', height: '260px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifySelf: 'start', justifyContent: 'space-between', marginBottom: '16px', width: '100%' }}>
            <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8c98ad' }}>Coding Time</span>
            <span style={{ fontSize: '10.5px', color: '#8b5cf6' }}>This Week</span>
          </div>

          <div style={{ display: 'flex', flex: 1, gap: '16px', alignItems: 'center' }}>
            {/* Donut representations */}
            <div style={{ position: 'relative', width: '80px', height: '80px', flexShrink: 0 }}>
              <svg width="80" height="80" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="3" />
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#8b5cf6" strokeWidth="3" strokeDasharray="40 60" strokeDashoffset="25" />
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#06b6d4" strokeWidth="3" strokeDasharray="30 70" strokeDashoffset="85" />
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#10b981" strokeWidth="3" strokeDasharray="20 80" strokeDashoffset="115" />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: '900', color: '#fff' }}>30h</span>
                <span style={{ fontSize: '8px', color: '#8c98ad' }}>Total</span>
              </div>
            </div>

            {/* Legend */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifySelf: 'space-between', width: '100%' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#8b5cf6' }} /> React
                </span>
                <span style={{ color: '#fff', fontWeight: '700' }}>14h 20m</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifySelf: 'space-between', width: '100%' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#06b6d4' }} /> Node.js
                </span>
                <span style={{ color: '#fff', fontWeight: '700' }}>9h 10m</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifySelf: 'space-between', width: '100%' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} /> JavaScript
                </span>
                <span style={{ color: '#fff', fontWeight: '700' }}>4h 30m</span>
              </div>
            </div>
          </div>
        </div>

        {/* CARD 3: UPCOMING EVENTS */}
        <div className="card" style={{ background: '#0f1322', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', height: '260px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifySelf: 'start', justifyContent: 'space-between', marginBottom: '16px', width: '100%' }}>
            <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8c98ad' }}>Upcoming Events</span>
            <span style={{ fontSize: '10.5px', color: '#8b5cf6' }}>This Week</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
            {[
              { date: '17 JUL', title: 'Team Standup', time: '10:00 AM' },
              { date: '17 JUL', title: 'Deploy to Production', time: '02:00 PM' },
              { date: '18 JUL', title: 'Resume Module Review', time: '05:00 PM' },
            ].map((event, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', justifySelf: 'space-between', width: '100%', gap: '10px', background: 'rgba(255,255,255,0.01)', padding: '6px 10px', borderRadius: '8px' }}>
                <div style={{ fontSize: '9px', fontWeight: '800', color: '#8b5cf6', background: 'rgba(139,92,246,0.1)', padding: '4px 6px', borderRadius: '4px', textAlign: 'center', width: '42px', flexShrink: 0 }}>
                  {event.date}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '11.5px', fontWeight: '700', color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{event.title}</div>
                </div>
                <div style={{ fontSize: '9.5px', color: '#8c98ad', flexShrink: 0 }}>
                  {event.time}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* CSS keyframe animations injection for wave emoji */}
      <style>{`
        @keyframes wave {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(15deg); }
        }
      `}</style>

    </div>
  )
}
