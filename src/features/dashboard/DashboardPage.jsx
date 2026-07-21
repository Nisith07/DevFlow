import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Sparkles, AlertCircle, CheckSquare,
  Layers, CheckCircle2, Code, GitCommit,
  Activity, BarChart2, Calendar, Briefcase,
  GitPullRequest, Globe, Rocket, Plus, Zap, Focus
} from 'lucide-react'
import DashboardHeader from './components/DashboardHeader'
import { useAuth } from '@/features/auth/hooks/useAuth'

const GithubIcon = ({ size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
)

// SVG Brain Illustration
function BrainGraphic() {
  return (
    <svg width="48" height="48" viewBox="0 0 68 68" fill="none" xmlns="http://www.w3.org/2000/svg">
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
function CircularGauge({ value, label, size = 56, strokeWidth = 5, color = '#FF7A1A' }) {
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
          style={{ transition: 'stroke-dashoffset 0.8s ease', filter: `drop-shadow(0 0 5px ${color}80)` }}
        />
      </svg>
      <div style={{ position: 'absolute', textAlign: 'center' }}>
        <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--color-app-text)', lineHeight: 1 }}>{value}%</div>
        {label && <div style={{ fontSize: '7.5px', color: 'var(--color-app-muted)', marginTop: '2px', fontWeight: '600' }}>{label}</div>}
      </div>
    </div>
  )
}

// Smooth Sparkline Graph — all points kept away from edges so nothing clips
function SparklineGraph() {
  // viewBox is 210 × 52; curve lives inside a 6px inset on all sides
  // so the 4px dot at the end (cx=204) is fully visible
  const LINE = 'M4,40 C30,30 50,18 80,26 S120,14 150,20 S185,16 204,18'
  return (
    <div style={{ width: '100%', overflow: 'hidden', borderRadius: '6px' }}>
      <svg
        width="100%"
        height="44"
        viewBox="0 0 210 52"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="sparkGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FF7A1A" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#FF7A1A" stopOpacity="0.0" />
          </linearGradient>
        </defs>
        {/* Fill area under the line */}
        <path
          d={`${LINE} L204,48 L4,48 Z`}
          fill="url(#sparkGradient)"
        />
        {/* The sparkline itself */}
        <path
          d={LINE}
          stroke="#FF7A1A"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Endpoint dot — fully inside viewBox */}
        <circle cx="204" cy="18" r="4" fill="#FFFFFF" stroke="#FF7A1A" strokeWidth="2" />
      </svg>
    </div>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

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

  // Card container style — compact & elegant
  const cardStyle = {
    background: 'var(--card-bg)',
    border: '1px solid var(--card-border)',
    borderRadius: '16px',
    padding: '12px 14px',
    boxShadow: 'var(--shadow-card-val)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    position: 'relative',
    overflow: 'hidden',
    boxSizing: 'border-box',
  }

  return (
    <div style={{
      width: '100%',
      fontFamily: "'Inter', sans-serif",
      boxSizing: 'border-box',
    }}>
      {/* ── HEADER BAR ── */}
      <DashboardHeader />

      {/* ── TOP STATS ROW (4 METRIC PILLS) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '14px' }}>
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
              borderRadius: '14px',
              padding: '10px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: 'var(--shadow-card-val)',
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '10px',
                background: `${stat.color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: stat.color,
                flexShrink: 0,
              }}>
                {stat.isFire ? <span style={{ fontSize: '15px' }}>🔥</span> : <Icon size={16} />}
              </div>
              <div>
                <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--color-app-text)', lineHeight: 1 }}>{stat.value}</div>
                <div style={{ fontSize: '10.5px', color: 'var(--color-app-muted)', marginTop: '2px', fontWeight: '500' }}>{stat.label}</div>
              </div>
            </div>
          )
        })}
      </div>

      {/* ── QUICK ACTIONS ROW (6 PILL BUTTONS) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '10px', marginBottom: '16px' }}>
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
                borderRadius: '14px',
                padding: '10px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-card-val)',
                transition: 'transform 0.15s ease, border-color 0.15s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.borderColor = 'var(--accent-color)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.borderColor = 'var(--card-border)'
              }}
            >
              <div style={{
                width: '30px',
                height: '30px',
                borderRadius: '8px',
                background: 'var(--card-bg-inset)',
                border: '1px solid var(--card-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: act.color,
                flexShrink: 0,
              }}>
                <Icon size={15} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '11.5px', fontWeight: '700', color: 'var(--color-app-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{act.title}</div>
                <div style={{ fontSize: '9px', color: 'var(--color-app-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '1px' }}>{act.sub}</div>
              </div>
            </div>
          )
        })}
      </div>

      {/* ── MAIN GRID ROW 1 (3 CARDS) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1.2fr 1fr', gap: '14px', marginBottom: '14px' }}>
        
        {/* Card 1: Today's Focus */}
        <div style={cardStyle}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
              <Zap size={14} color="#FF7A1A" />
              <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-app-text)' }}>Today's Focus</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <CircularGauge value={taskPercent} label="Completed" size={62} strokeWidth={5} color="#FF7A1A" />
              
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {tasks.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => toggleTask(t.id)}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '11px' }}
                  >
                    <div style={{
                      width: '13px', height: '13px', borderRadius: '4px',
                      background: t.done ? '#FF7A1A' : 'transparent',
                      border: t.done ? 'none' : '1.5px solid var(--color-app-muted)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
                      flexShrink: 0,
                    }}>
                      {t.done && <CheckCircle2 size={11} />}
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

          <div style={{ marginTop: '12px', paddingTop: '8px', borderTop: '1px solid var(--card-border)' }}>
            <Link to="/tasks" style={{ fontSize: '10.5px', fontWeight: '700', color: '#FF7A1A', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '3px' }}>
              View all tasks →
            </Link>
          </div>
        </div>

        {/* Card 2: Continue Working */}
        <div style={cardStyle}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Code size={14} color="#FF7A1A" />
                <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-app-text)' }}>Continue Working</span>
              </div>
              <GithubIcon size={14} />
            </div>

            <div style={{
              background: 'var(--card-bg-inset)',
              border: '1px solid var(--card-border)',
              borderRadius: '12px',
              padding: '10px 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '10px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'linear-gradient(135deg, #7C3AED, #A78BFA)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                  <Briefcase size={15} />
                </div>
                <div>
                  <div style={{ fontSize: '12.5px', fontWeight: '800', color: 'var(--color-app-text)' }}>DevFlow Platform</div>
                  <div style={{ fontSize: '9.5px', color: 'var(--color-app-muted)' }}>Current Project</div>
                </div>
              </div>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#22C55E' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div style={{ background: 'var(--card-bg-inset)', borderRadius: '8px', padding: '7px 9px', border: '1px solid var(--card-border)' }}>
                <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--color-app-text)' }}>main</div>
                <div style={{ fontSize: '8.5px', color: 'var(--color-app-muted)', marginTop: '1px' }}>Current Branch</div>
              </div>
              <div style={{ background: 'var(--card-bg-inset)', borderRadius: '8px', padding: '7px 9px', border: '1px solid var(--card-border)' }}>
                <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--color-app-text)', fontFamily: 'var(--font-mono)' }}>a1b2c3d</div>
                <div style={{ fontSize: '8.5px', color: 'var(--color-app-muted)', marginTop: '1px' }}>Last Commit</div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '12px', paddingTop: '8px', borderTop: '1px solid var(--card-border)' }}>
            <Link to="/projects" style={{ fontSize: '10.5px', fontWeight: '700', color: '#FF7A1A', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '3px' }}>
              Open Project →
            </Link>
          </div>
        </div>

        {/* Card 3: AI Daily Brief */}
        <div style={cardStyle}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '9.5px', fontWeight: '800', background: '#FF7A1A', color: '#fff', padding: '1px 5px', borderRadius: '4px' }}>AI</span>
                <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-app-text)' }}>AI Daily Brief ✨</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
              <p style={{ fontSize: '11px', color: 'var(--color-app-muted)', lineHeight: 1.5, margin: 0, flex: 1 }}>
                Good progress today! You've completed 75% of your focused tasks. The authentication module is ready for testing.
              </p>
              <div style={{ flexShrink: 0 }}>
                <BrainGraphic />
              </div>
            </div>
          </div>

          <div style={{ marginTop: '12px', paddingTop: '8px', borderTop: '1px solid var(--card-border)' }}>
            <Link to="/ai" style={{ fontSize: '10.5px', fontWeight: '700', color: '#FF7A1A', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '3px' }}>
              Open AI Copilot →
            </Link>
          </div>
        </div>

      </div>

      {/* ── MAIN GRID ROW 2 (4 CARDS) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.1fr 1.1fr', gap: '14px', marginBottom: '14px' }}>
        
        {/* Card 1: Sprint Progress */}
        <div style={cardStyle}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-app-text)' }}>Sprint Progress</span>
              <span style={{ fontSize: '9px', color: 'var(--color-app-muted)' }}>4 days remaining</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
              <CircularGauge value={62} label="Sprint 12" size={52} strokeWidth={4.5} color="#FF7A1A" />
              <div>
                <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--color-app-text)' }}>Sprint 12</div>
                <div style={{ fontSize: '9.5px', color: 'var(--color-app-muted)', marginTop: '2px' }}>31 / 50 tasks completed</div>
              </div>
            </div>

            <div style={{ width: '100%', height: '5px', background: 'var(--card-bg-inset)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: '62%', height: '100%', background: '#FF7A1A', borderRadius: '3px' }} />
            </div>
          </div>

          <div style={{ marginTop: '10px', paddingTop: '6px', borderTop: '1px solid var(--card-border)' }}>
            <Link to="/planner" style={{ fontSize: '10.5px', fontWeight: '700', color: '#FF7A1A', textDecoration: 'none' }}>View sprint →</Link>
          </div>
        </div>

        {/* Card 2: Active Projects */}
        <div style={cardStyle}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-app-text)' }}>Active Projects</span>
              <Link to="/projects" style={{ fontSize: '9.5px', color: '#FF7A1A', fontWeight: '700', textDecoration: 'none' }}>View all →</Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
              {[
                { name: 'DevFlow Platform', icon: Briefcase, color: '#7C3AED', members: '+2' },
                { name: 'AI Copilot', icon: Sparkles, color: '#EC4899', members: '+2' },
                { name: 'Landing Page', icon: Globe, color: '#10B981', members: '+1' },
              ].map((p) => {
                const Icon = p.icon
                return (
                  <div key={p.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '18px', height: '18px', borderRadius: '5px', background: p.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                        <Icon size={11} />
                      </div>
                      <span style={{ fontWeight: '600', color: 'var(--color-app-text)' }}>{p.name}</span>
                    </div>
                    <span style={{ fontSize: '8.5px', color: 'var(--color-app-muted)', background: 'var(--card-bg-inset)', padding: '1px 5px', borderRadius: '4px', fontWeight: '600' }}>{p.members}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Card 3: GitHub Activity */}
        <div style={cardStyle}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <GithubIcon size={13} />
                <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-app-text)' }}>GitHub Activity</span>
              </div>
              <span style={{ fontSize: '9px', color: 'var(--color-app-muted)' }}>This Week ▼</span>
            </div>

            <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--color-app-text)', marginBottom: '6px' }}>
              128 <span style={{ fontSize: '9.5px', fontWeight: '500', color: 'var(--color-app-muted)' }}>Total Commits</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '32px' }}>
              {[35, 60, 42, 85, 95, 40, 70].map((h, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', height: '100%', justifyContent: 'flex-end' }}>
                  <div style={{ width: '100%', height: `${h}%`, background: i === 4 ? '#FF7A1A' : 'rgba(255, 122, 26, 0.25)', borderRadius: '2px 2px 0 0' }} />
                  <span style={{ fontSize: '7px', color: 'var(--color-app-muted)', fontFamily: 'var(--font-mono)' }}>{['M','T','W','T','F','S','S'][i]}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '10px', paddingTop: '6px', borderTop: '1px solid var(--card-border)' }}>
            <Link to="/github" style={{ fontSize: '10.5px', fontWeight: '700', color: '#FF7A1A', textDecoration: 'none' }}>View GitHub →</Link>
          </div>
        </div>

        {/* Card 4: Coding Time */}
        <div style={cardStyle}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <BarChart2 size={13} color="#FF7A1A" />
                <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-app-text)' }}>Coding Time</span>
              </div>
              <span style={{ fontSize: '9px', color: 'var(--color-app-muted)' }}>This Week ▼</span>
            </div>

            <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--color-app-text)', marginBottom: '4px' }}>
              32h 45m <span style={{ fontSize: '9.5px', fontWeight: '500', color: 'var(--color-app-muted)' }}>Total Time</span>
            </div>

            <div style={{ marginTop: '2px', overflow: 'hidden', borderRadius: '8px' }}>
              <SparklineGraph />
            </div>
          </div>

          <div style={{ marginTop: '10px', paddingTop: '6px', borderTop: '1px solid var(--card-border)' }}>
            <Link to="/analytics" style={{ fontSize: '10.5px', fontWeight: '700', color: '#FF7A1A', textDecoration: 'none' }}>View Analytics →</Link>
          </div>
        </div>

      </div>

      {/* ── MAIN GRID ROW 3 (4 CARDS) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.1fr 1fr', gap: '14px' }}>
        
        {/* Card 1: Upcoming Events */}
        <div style={cardStyle}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '10px' }}>
              <Calendar size={13} color="#FF7A1A" />
              <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-app-text)' }}>Upcoming Events</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
              {[
                { title: 'Team Standup', time: 'Today, 10:00 AM', color: '#3B82F6' },
                { title: 'Deploy to Production', time: 'Tomorrow, 2:00 PM', color: '#FF7A1A' },
                { title: 'UI/UX Review', time: 'Fri, 11:00 AM', color: '#A78BFA' },
              ].map((evt) => (
                <div key={evt.title} style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '10.5px' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: evt.color, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontWeight: '600', color: 'var(--color-app-text)' }}>{evt.title}</div>
                    <div style={{ fontSize: '8.5px', color: 'var(--color-app-muted)' }}>{evt.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '10px', paddingTop: '6px', borderTop: '1px solid var(--card-border)' }}>
            <Link to="/planner" style={{ fontSize: '10.5px', fontWeight: '700', color: '#FF7A1A', textDecoration: 'none' }}>View Calendar →</Link>
          </div>
        </div>

        {/* Card 2: Deployments */}
        <div style={cardStyle}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '10px' }}>
              <Rocket size={13} color="#FF7A1A" />
              <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-app-text)' }}>Deployments</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
              {[
                { env: 'Production', status: 'Live', badge: '• Healthy', color: '#22C55E' },
                { env: 'Staging', status: '2h ago', badge: '• Healthy', color: '#22C55E' },
                { env: 'Preview', status: '5h ago', badge: '• Building', color: '#FF7A1A' },
              ].map((d) => (
                <div key={d.env} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '10.5px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <GithubIcon size={11} />
                    <span style={{ fontWeight: '600', color: 'var(--color-app-text)' }}>{d.env}</span>
                    <span style={{ fontSize: '8.5px', color: 'var(--color-app-muted)' }}>{d.status}</span>
                  </div>
                  <span style={{ fontSize: '8.5px', fontWeight: '700', color: d.color, background: `${d.color}15`, padding: '1px 5px', borderRadius: '4px' }}>{d.badge}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '10px', paddingTop: '6px', borderTop: '1px solid var(--card-border)' }}>
            <Link to="/deployments" style={{ fontSize: '10.5px', fontWeight: '700', color: '#FF7A1A', textDecoration: 'none' }}>View All →</Link>
          </div>
        </div>

        {/* Card 3: Developer Feed */}
        <div style={cardStyle}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '10px' }}>
              <Activity size={13} color="#FF7A1A" />
              <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-app-text)' }}>Developer Feed</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', fontSize: '10px' }}>
              {[
                { act: 'Nisith pushed 3 commits', time: '2m ago' },
                { act: 'PR #42 opened', time: '15m ago' },
                { act: 'AI Copilot suggested changes', time: '1h ago' },
                { act: 'Code review completed', time: '2h ago' },
              ].map((feed, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--color-app-text)', fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{feed.act}</span>
                  <span style={{ color: 'var(--color-app-muted)', fontSize: '8px', fontFamily: 'var(--font-mono)', flexShrink: 0 }}>{feed.time}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '10px', paddingTop: '6px', borderTop: '1px solid var(--card-border)' }}>
            <Link to="/activity" style={{ fontSize: '10.5px', fontWeight: '700', color: '#FF7A1A', textDecoration: 'none' }}>View All Activity →</Link>
          </div>
        </div>

        {/* Card 4: Workspace Health */}
        <div style={cardStyle}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '8px' }}>
              <AlertCircle size={13} color="#FF7A1A" />
              <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-app-text)' }}>Workspace Health</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CircularGauge value={86} label="Healthy" size={52} strokeWidth={4.5} color="#22C55E" />
              
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '9.5px' }}>
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

          <div style={{ marginTop: '10px', paddingTop: '6px', borderTop: '1px solid var(--card-border)' }}>
            <Link to="/analytics" style={{ fontSize: '10.5px', fontWeight: '700', color: '#FF7A1A', textDecoration: 'none' }}>View Full Report →</Link>
          </div>
        </div>

      </div>
    </div>
  )
}
