import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight, Sparkles, AlertCircle, CheckSquare,
  Layers, CheckCircle2, Code, Bell, GitCommit,
  Activity, BarChart2, Calendar, Briefcase,
  PlusCircle, FolderPlus, RefreshCcw, Trash2,
  GitPullRequest, Globe, Rocket, Plus, Zap, Focus
} from 'lucide-react'
import DashboardHeader from './components/DashboardHeader'
import { useAuth } from '@/features/auth/hooks/useAuth'

const GithubIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
)

// SVG Brain Illustration for AI Daily Brief card
function BrainGraphic() {
  return (
    <svg width="68" height="68" viewBox="0 0 68 68" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="34" cy="34" r="30" fill="rgba(255, 122, 26, 0.08)" />
      <path d="M34 14C24 14 18 21 18 31C18 36 20 40 23 44C21 48 21 52 26 56C31 60 34 60 34 60C34 60 37 60 42 56C47 52 47 48 45 44C48 40 50 36 50 31C50 21 44 14 34 14Z" stroke="#FF7A1A" strokeWidth="1.5" strokeDasharray="3 3" />
      <circle cx="34" cy="34" r="16" stroke="#FF7A1A" strokeWidth="1.5" />
      <path d="M25 34H43M34 25V43" stroke="#FF7A1A" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="28" cy="28" r="2.5" fill="#FF7A1A" />
      <circle cx="40" cy="28" r="2.5" fill="#FF7A1A" />
      <circle cx="40" cy="40" r="2.5" fill="#FF7A1A" />
      <circle cx="28" cy="40" r="2.5" fill="#FF7A1A" />
    </svg>
  )
}

// Circular Gauge Component
function CircularGauge({ value, label, size = 72, strokeWidth = 6, color = '#FF7A1A' }) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (value / 100) * circumference

  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="var(--card-bg-inset)" strokeWidth={strokeWidth} fill="none" />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
          style={{ transition: 'stroke-dashoffset 0.8s ease', filter: `drop-shadow(0 0 6px ${color}80)` }}
        />
      </svg>
      <div style={{ position: 'absolute', textAlign: 'center' }}>
        <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--color-app-text)', lineHeight: 1 }}>{value}%</div>
        {label && <div style={{ fontSize: '8px', color: 'var(--color-app-muted)', marginTop: '2px', fontWeight: '600' }}>{label}</div>}
      </div>
    </div>
  )
}

// Smooth Sparkline Graph for Coding Time
function SparklineGraph() {
  return (
    <svg width="100%" height="48" viewBox="0 0 200 48" fill="none" preserveAspectRatio="none">
      <defs>
        <linearGradient id="sparkGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FF7A1A" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#FF7A1A" stopOpacity="0.0" />
        </linearGradient>
      </defs>
      <path d="M0,40 Q30,12 60,32 T120,10 T160,26 T200,14 L200,48 L0,48 Z" fill="url(#sparkGradient)" />
      <path d="M0,40 Q30,12 60,32 T120,10 T160,26 T200,14" stroke="#FF7A1A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <circle cx="200" cy="14" r="4" fill="#FFFFFF" stroke="#FF7A1A" strokeWidth="2" />
    </svg>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const cleanName = (user?.name || 'Nisith').replace(/:+$/, '')

  // Tasks state
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Finish authentication flow', done: true },
    { id: 2, title: 'Fix responsive issues', done: true },
    { id: 3, title: 'Update dashboard UI', done: true },
    { id: 4, title: 'Review pull request #42', done: false },
  ])

  const toggleTask = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }

  const completedTasks = tasks.filter(t => t.done).length
  const taskPercent = Math.round((completedTasks / tasks.length) * 100)

  // Card container style matching second photo
  const cardStyle = {
    background: 'var(--card-bg)',
    border: '1px solid var(--card-border)',
    borderRadius: '18px',
    padding: '18px 20px',
    boxShadow: 'var(--shadow-card-val)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
  }

  return (
    <div style={{
      background: 'var(--app-bg)',
      color: 'var(--color-app-text)',
      minHeight: '100vh',
      padding: '20px 28px 40px',
      fontFamily: "'Inter', sans-serif",
      boxSizing: 'border-box',
    }}>
      {/* ── HEADER BAR ── */}
      <DashboardHeader />

      {/* ── TOP STATS ROW (4 METRIC PILLS) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '22px' }}>
        {[
          { label: 'Active Projects', value: '3', icon: Briefcase, color: '#A78BFA' },
          { label: 'Open Tasks', value: '12', icon: CheckSquare, color: '#10B981' },
          { label: 'PRs Waiting', value: '2', icon: GitPullRequest, color: '#A78BFA' },
          { label: 'Day Streak', value: '7', icon: Zap, color: '#FF7A1A', isFire: true },
        ].map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} style={{
              background: 'var(--card-bg)',
              border: '1px solid var(--card-border)',
              borderRadius: '18px',
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              boxShadow: 'var(--shadow-card-val)',
            }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                background: `${stat.color}18`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: stat.color,
                flexShrink: 0,
              }}>
                {stat.isFire ? <span style={{ fontSize: '18px' }}>🔥</span> : <Icon size={18} />}
              </div>
              <div>
                <div style={{ fontSize: '20px', fontWeight: '800', color: 'var(--color-app-text)', lineHeight: 1 }}>{stat.value}</div>
                <div style={{ fontSize: '11.5px', color: 'var(--color-app-muted)', marginTop: '4px', fontWeight: '500' }}>{stat.label}</div>
              </div>
            </div>
          )
        })}
      </div>

      {/* ── QUICK ACTIONS ROW (6 PILL BUTTONS) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '14px', marginBottom: '26px' }}>
        {[
          { title: 'New Project', sub: 'Create new project', route: '/projects', icon: Plus, color: '#FF7A1A' },
          { title: 'New Task', sub: 'Add a new task', route: '/tasks', icon: CheckSquare, color: '#10B981' },
          { title: 'Generate Code', sub: 'AI Code Generation', route: '/ai', icon: Code, color: '#EC4899' },
          { title: 'Deploy', sub: 'Deploy to production', route: '/deployments', icon: Rocket, color: '#3B82F6' },
          { title: 'Open GitHub', sub: 'View Repositories', route: '/github', icon: GithubIcon, color: '#F4F4F6' },
          { title: 'Focus Mode', sub: 'Start a session', route: '/planner', icon: Focus, color: '#A78BFA' },
        ].map((act) => {
          const Icon = act.icon
          return (
            <div
              key={act.title}
              onClick={() => navigate(act.route)}
              style={{
                background: 'var(--card-bg)',
                border: '1px solid var(--card-border)',
                borderRadius: '18px',
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-card-val)',
                transition: 'transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.borderColor = 'var(--accent-color)'
                e.currentTarget.style.boxShadow = 'var(--shadow-card-hover-val)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.borderColor = 'var(--card-border)'
                e.currentTarget.style.boxShadow = 'var(--shadow-card-val)'
              }}
            >
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '11px',
                background: 'var(--card-bg-inset)',
                border: '1px solid var(--card-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: act.color,
                flexShrink: 0,
              }}>
                <Icon size={17} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--color-app-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{act.title}</div>
                <div style={{ fontSize: '10px', color: 'var(--color-app-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '1px' }}>{act.sub}</div>
              </div>
            </div>
          )
        })}
      </div>

      {/* ── MAIN GRID ROW 1 (3 CARDS) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1.2fr 1fr', gap: '18px', marginBottom: '22px' }}>
        
        {/* Card 1: Today's Focus */}
        <div style={cardStyle}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
              <Zap size={15} color="#FF7A1A" />
              <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-app-text)' }}>Today's Focus</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
              <CircularGauge value={taskPercent} label="Completed" size={78} strokeWidth={6} color="#FF7A1A" />
              
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {tasks.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => toggleTask(t.id)}
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '12px' }}
                  >
                    <div style={{
                      width: '16px', height: '16px', borderRadius: '5px',
                      background: t.done ? '#FF7A1A' : 'transparent',
                      border: t.done ? 'none' : '1.5px solid var(--color-app-muted)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
                      flexShrink: 0,
                    }}>
                      {t.done && <CheckCircle2 size={13} />}
                    </div>
                    <span style={{
                      color: t.done ? 'var(--color-app-muted)' : 'var(--color-app-text)',
                      textDecoration: t.done ? 'line-through' : 'none',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      fontWeight: t.done ? '500' : '600',
                    }}>
                      {t.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--card-border)' }}>
            <Link to="/tasks" style={{ fontSize: '11.5px', fontWeight: '700', color: '#FF7A1A', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
              View all tasks →
            </Link>
          </div>
        </div>

        {/* Card 2: Continue Working */}
        <div style={cardStyle}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Code size={15} color="#FF7A1A" />
                <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-app-text)' }}>Continue Working</span>
              </div>
              <GithubIcon size={15} />
            </div>

            <div style={{
              background: 'var(--card-bg-inset)',
              border: '1px solid var(--card-border)',
              borderRadius: '16px',
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '14px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'linear-gradient(135deg, #7C3AED, #A78BFA)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                  <Briefcase size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--color-app-text)' }}>DevFlow Platform</div>
                  <div style={{ fontSize: '10.5px', color: 'var(--color-app-muted)' }}>Current Project</div>
                </div>
              </div>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22C55E', boxShadow: '0 0 8px #22C55E' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ background: 'var(--card-bg-inset)', borderRadius: '12px', padding: '10px 12px', border: '1px solid var(--card-border)' }}>
                <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-app-text)' }}>main</div>
                <div style={{ fontSize: '9.5px', color: 'var(--color-app-muted)', marginTop: '2px' }}>Current Branch</div>
              </div>
              <div style={{ background: 'var(--card-bg-inset)', borderRadius: '12px', padding: '10px 12px', border: '1px solid var(--card-border)' }}>
                <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-app-text)', fontFamily: 'var(--font-mono)' }}>a1b2c3d</div>
                <div style={{ fontSize: '9.5px', color: 'var(--color-app-muted)', marginTop: '2px' }}>Last Commit</div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--card-border)' }}>
            <Link to="/projects" style={{ fontSize: '11.5px', fontWeight: '700', color: '#FF7A1A', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
              Open Project →
            </Link>
          </div>
        </div>

        {/* Card 3: AI Daily Brief */}
        <div style={cardStyle}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '10.5px', fontWeight: '800', background: '#FF7A1A', color: '#fff', padding: '2px 7px', borderRadius: '5px' }}>AI</span>
                <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-app-text)' }}>AI Daily Brief ✨</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
              <p style={{ fontSize: '12px', color: 'var(--color-app-muted)', lineHeight: 1.55, margin: 0, flex: 1 }}>
                Good progress today! You've completed 75% of your focused tasks. The authentication module is ready for testing.
              </p>
              <div style={{ flexShrink: 0 }}>
                <BrainGraphic />
              </div>
            </div>
          </div>

          <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--card-border)' }}>
            <Link to="/ai" style={{ fontSize: '11.5px', fontWeight: '700', color: '#FF7A1A', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
              Open AI Copilot →
            </Link>
          </div>
        </div>

      </div>

      {/* ── MAIN GRID ROW 2 (4 CARDS) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.1fr 1.1fr', gap: '18px', marginBottom: '22px' }}>
        
        {/* Card 1: Sprint Progress */}
        <div style={cardStyle}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-app-text)' }}>Sprint Progress</span>
              <span style={{ fontSize: '10px', color: 'var(--color-app-muted)' }}>4 days remaining</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '14px' }}>
              <CircularGauge value={62} label="Sprint 12" size={64} strokeWidth={5} color="#FF7A1A" />
              <div>
                <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--color-app-text)' }}>Sprint 12</div>
                <div style={{ fontSize: '10.5px', color: 'var(--color-app-muted)', marginTop: '2px' }}>31 / 50 tasks completed</div>
              </div>
            </div>

            <div style={{ width: '100%', height: '6px', background: 'var(--card-bg-inset)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: '62%', height: '100%', background: '#FF7A1A', borderRadius: '3px', boxShadow: '0 0 8px rgba(255,122,26,0.6)' }} />
            </div>
          </div>

          <div style={{ marginTop: '16px', paddingTop: '10px', borderTop: '1px solid var(--card-border)' }}>
            <Link to="/planner" style={{ fontSize: '11.5px', fontWeight: '700', color: '#FF7A1A', textDecoration: 'none' }}>View sprint →</Link>
          </div>
        </div>

        {/* Card 2: Active Projects */}
        <div style={cardStyle}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-app-text)' }}>Active Projects</span>
              <Link to="/projects" style={{ fontSize: '10.5px', color: '#FF7A1A', fontWeight: '700', textDecoration: 'none' }}>View all →</Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { name: 'DevFlow Platform', icon: Briefcase, color: '#7C3AED', members: '+2' },
                { name: 'AI Copilot', icon: Sparkles, color: '#EC4899', members: '+2' },
                { name: 'Landing Page', icon: Globe, color: '#10B981', members: '+1' },
              ].map((p) => {
                const Icon = p.icon
                return (
                  <div key={p.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '22px', height: '22px', borderRadius: '6px', background: p.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                        <Icon size={13} />
                      </div>
                      <span style={{ fontWeight: '600', color: 'var(--color-app-text)' }}>{p.name}</span>
                    </div>
                    <span style={{ fontSize: '10px', color: 'var(--color-app-muted)', background: 'var(--card-bg-inset)', padding: '2px 6px', borderRadius: '4px', fontWeight: '600' }}>{p.members}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Card 3: GitHub Activity */}
        <div style={cardStyle}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <GithubIcon size={15} />
                <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-app-text)' }}>GitHub Activity</span>
              </div>
              <span style={{ fontSize: '10px', color: 'var(--color-app-muted)' }}>This Week ▼</span>
            </div>

            <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--color-app-text)', marginBottom: '10px' }}>
              128 <span style={{ fontSize: '11px', fontWeight: '500', color: 'var(--color-app-muted)' }}>Total Commits</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '5px', height: '42px' }}>
              {[35, 60, 42, 85, 95, 40, 70].map((h, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', height: '100%', justifyContent: 'flex-end' }}>
                  <div style={{ width: '100%', height: `${h}%`, background: i === 4 ? '#FF7A1A' : 'rgba(255, 122, 26, 0.25)', borderRadius: '3px 3px 0 0', boxShadow: i === 4 ? '0 0 8px rgba(255,122,26,0.6)' : 'none' }} />
                  <span style={{ fontSize: '8px', color: 'var(--color-app-muted)', fontFamily: 'var(--font-mono)' }}>{['M','T','W','T','F','S','S'][i]}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '12px', paddingTop: '8px', borderTop: '1px solid var(--card-border)' }}>
            <Link to="/github" style={{ fontSize: '11.5px', fontWeight: '700', color: '#FF7A1A', textDecoration: 'none' }}>View GitHub →</Link>
          </div>
        </div>

        {/* Card 4: Coding Time */}
        <div style={cardStyle}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <BarChart2 size={15} color="#FF7A1A" />
                <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-app-text)' }}>Coding Time</span>
              </div>
              <span style={{ fontSize: '10px', color: 'var(--color-app-muted)' }}>This Week ▼</span>
            </div>

            <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--color-app-text)', marginBottom: '6px' }}>
              32h 45m <span style={{ fontSize: '11px', fontWeight: '500', color: 'var(--color-app-muted)' }}>Total Time</span>
            </div>

            <SparklineGraph />
          </div>

          <div style={{ marginTop: '12px', paddingTop: '8px', borderTop: '1px solid var(--card-border)' }}>
            <Link to="/analytics" style={{ fontSize: '11.5px', fontWeight: '700', color: '#FF7A1A', textDecoration: 'none' }}>View Analytics →</Link>
          </div>
        </div>

      </div>

      {/* ── MAIN GRID ROW 3 (4 CARDS) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.1fr 1fr', gap: '18px' }}>
        
        {/* Card 1: Upcoming Events */}
        <div style={cardStyle}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '14px' }}>
              <Calendar size={15} color="#FF7A1A" />
              <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-app-text)' }}>Upcoming Events</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { title: 'Team Standup', time: 'Today, 10:00 AM', color: '#3B82F6' },
                { title: 'Deploy to Production', time: 'Tomorrow, 2:00 PM', color: '#FF7A1A' },
                { title: 'UI/UX Review', time: 'Fri, 11:00 AM', color: '#A78BFA' },
              ].map((evt) => (
                <div key={evt.title} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '11.5px' }}>
                  <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: evt.color, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontWeight: '600', color: 'var(--color-app-text)' }}>{evt.title}</div>
                    <div style={{ fontSize: '9.5px', color: 'var(--color-app-muted)' }}>{evt.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '14px', paddingTop: '8px', borderTop: '1px solid var(--card-border)' }}>
            <Link to="/planner" style={{ fontSize: '11.5px', fontWeight: '700', color: '#FF7A1A', textDecoration: 'none' }}>View Calendar →</Link>
          </div>
        </div>

        {/* Card 2: Deployments */}
        <div style={cardStyle}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '14px' }}>
              <Rocket size={15} color="#FF7A1A" />
              <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-app-text)' }}>Deployments</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { env: 'Production', status: 'Live', badge: '• Healthy', color: '#22C55E' },
                { env: 'Staging', status: '2h ago', badge: '• Healthy', color: '#22C55E' },
                { env: 'Preview', status: '5h ago', badge: '• Building', color: '#FF7A1A' },
              ].map((d) => (
                <div key={d.env} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11.5px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                    <GithubIcon size={13} />
                    <span style={{ fontWeight: '600', color: 'var(--color-app-text)' }}>{d.env}</span>
                    <span style={{ fontSize: '9.5px', color: 'var(--color-app-muted)' }}>{d.status}</span>
                  </div>
                  <span style={{ fontSize: '9.5px', fontWeight: '700', color: d.color, background: `${d.color}15`, padding: '2px 7px', borderRadius: '4px' }}>{d.badge}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '14px', paddingTop: '8px', borderTop: '1px solid var(--card-border)' }}>
            <Link to="/deployments" style={{ fontSize: '11.5px', fontWeight: '700', color: '#FF7A1A', textDecoration: 'none' }}>View All →</Link>
          </div>
        </div>

        {/* Card 3: Developer Feed */}
        <div style={cardStyle}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '14px' }}>
              <Activity size={15} color="#FF7A1A" />
              <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-app-text)' }}>Developer Feed</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '9px', fontSize: '11px' }}>
              {[
                { act: 'Nisith pushed 3 commits', time: '2m ago' },
                { act: 'PR #42 opened', time: '15m ago' },
                { act: 'AI Copilot suggested changes', time: '1h ago' },
                { act: 'Code review completed', time: '2h ago' },
              ].map((feed, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--color-app-text)', fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{feed.act}</span>
                  <span style={{ color: 'var(--color-app-muted)', fontSize: '9px', fontFamily: 'var(--font-mono)', flexShrink: 0 }}>{feed.time}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '14px', paddingTop: '8px', borderTop: '1px solid var(--card-border)' }}>
            <Link to="/activity" style={{ fontSize: '11.5px', fontWeight: '700', color: '#FF7A1A', textDecoration: 'none' }}>View All Activity →</Link>
          </div>
        </div>

        {/* Card 4: Workspace Health */}
        <div style={cardStyle}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
              <AlertCircle size={15} color="#FF7A1A" />
              <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-app-text)' }}>Workspace Health</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <CircularGauge value={86} label="Healthy" size={62} strokeWidth={5} color="#22C55E" />
              
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '10.5px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-app-muted)' }}>Build Status</span>
                  <span style={{ color: '#22C55E', fontWeight: '700' }}>Healthy</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-app-muted)' }}>Deployments</span>
                  <span style={{ color: '#22C55E', fontWeight: '700' }}>Healthy</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-app-muted)' }}>Open Issues</span>
                  <span style={{ color: '#FF7A1A', fontWeight: '700' }}>3</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-app-muted)' }}>Performance</span>
                  <span style={{ color: '#22C55E', fontWeight: '700' }}>Good</span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '12px', paddingTop: '8px', borderTop: '1px solid var(--card-border)' }}>
            <Link to="/analytics" style={{ fontSize: '11.5px', fontWeight: '700', color: '#FF7A1A', textDecoration: 'none' }}>View Full Report →</Link>
          </div>
        </div>

      </div>
    </div>
  )
}
