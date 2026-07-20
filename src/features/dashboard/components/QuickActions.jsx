import { useNavigate } from 'react-router-dom'
import { Plus, Code, Server, Moon, Rocket } from 'lucide-react'
import { toggleTheme } from '@/shared/lib/theme'

const GithubIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
)

const CodeBracketsIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
)

export default function QuickActions() {
  const navigate = useNavigate()

  const actions = [
    {
      label: 'New Project',
      sub: 'Create new project',
      icon: Plus,
      color: 'rgba(139, 92, 246, 0.12)',
      border: 'rgba(139, 92, 246, 0.25)',
      text: '#A78BFA',
      onClick: () => navigate('/projects'),
    },
    {
      label: 'New Task',
      sub: 'Add a task',
      icon: Plus,
      color: 'rgba(16, 185, 129, 0.12)',
      border: 'rgba(16, 185, 129, 0.25)',
      text: '#34D399',
      onClick: () => navigate('/tasks'),
    },
    {
      label: 'Generate Code',
      sub: 'AI Code Generation',
      icon: CodeBracketsIcon,
      color: 'rgba(236, 72, 153, 0.12)',
      border: 'rgba(236, 72, 153, 0.25)',
      text: '#F472B6',
      onClick: () => navigate('/ai'),
    },
    {
      label: 'Deployments',
      sub: 'View releases',
      icon: Rocket,
      color: 'rgba(20, 184, 166, 0.12)',
      border: 'rgba(20, 184, 166, 0.25)',
      text: '#2DD4BF',
      onClick: () => navigate('/deployments'),
    },
    {
      label: 'Open GitHub',
      sub: 'View Repos',
      icon: GithubIcon,
      color: 'var(--color-app-surface-2)',
      border: 'var(--color-app-border-bright)',
      text: 'var(--color-app-text)',
      onClick: () => navigate('/github'),
    },
    {
      label: 'Focus Mode',
      sub: 'Start Session',
      icon: Moon,
      color: 'rgba(59, 130, 246, 0.12)',
      border: 'rgba(59, 130, 246, 0.25)',
      text: '#60A5FA',
      onClick: toggleTheme,
    },
  ]

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(6, 1fr)',
      gap: '12px',
      marginBottom: '16px',
      flexShrink: 0,
    }}>
      {actions.map((act, i) => (
        <button
          key={i}
          onClick={act.onClick}
          style={{
            background: 'var(--color-app-surface)',
            border: '1px solid var(--color-app-border)',
            borderRadius: '10px',
            padding: '10px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
            textAlign: 'left',
            boxSizing: 'border-box',
            transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
            boxShadow: 'var(--shadow-neu-sm)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.borderColor = 'var(--color-app-border-bright)'
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.2)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.borderColor = 'var(--color-app-border)'
            e.currentTarget.style.boxShadow = 'var(--shadow-neu-sm)'
          }}
        >
          <div style={{
            width: '28px', height: '28px', borderRadius: '6px',
            background: act.color, border: `1px solid ${act.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: act.text, flexShrink: 0,
          }}>
            <act.icon size={14} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-app-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {act.label}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--color-app-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {act.sub}
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}
