import React from 'react'
import { Plus, Code, Server, Moon } from 'lucide-react'

const GithubIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
)

const CodeBracketsIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
)

export default function QuickActions({ onNewProject, onNewTask, onGenerateCode, onAPI, onGithub, onFocusMode }) {
  const actions = [
    { 
      label: 'New Project', 
      sub: 'Create new project', 
      icon: Plus, 
      color: 'rgba(139, 92, 246, 0.12)', 
      border: 'rgba(139, 92, 246, 0.25)', 
      text: '#A78BFA',
      onClick: onNewProject
    },
    { 
      label: 'New Task', 
      sub: 'Add a task', 
      icon: Plus, 
      color: 'rgba(16, 185, 129, 0.12)', 
      border: 'rgba(16, 185, 129, 0.25)', 
      text: '#34D399',
      onClick: onNewTask
    },
    { 
      label: 'Generate Code', 
      sub: 'AI Code Generation', 
      icon: CodeBracketsIcon, 
      color: 'rgba(236, 72, 153, 0.12)', 
      border: 'rgba(236, 72, 153, 0.25)', 
      text: '#F472B6',
      onClick: onGenerateCode
    },
    { 
      label: 'API', 
      sub: 'Create API', 
      icon: Server, 
      color: 'rgba(20, 184, 166, 0.12)', 
      border: 'rgba(20, 184, 166, 0.25)', 
      text: '#2DD4BF',
      onClick: onAPI
    },
    { 
      label: 'Open GitHub', 
      sub: 'View Repos', 
      icon: GithubIcon, 
      color: 'var(--color-app-surface-2)', 
      border: 'var(--color-app-border-bright)', 
      text: 'var(--color-app-text)',
      onClick: onGithub
    },
    { 
      label: 'Focus Mode', 
      sub: 'Start Session', 
      icon: Moon, 
      color: 'rgba(59, 130, 246, 0.12)', 
      border: 'rgba(59, 130, 246, 0.25)', 
      text: '#60A5FA',
      onClick: onFocusMode
    },
  ]

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(6, 1fr)',
      gap: '12px',
      marginBottom: '16px',
      flexShrink: 0
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
            transition: 'transform 0.2s ease, border-color 0.2s ease',
            boxShadow: 'var(--shadow-neu-sm)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)'
            e.currentTarget.style.borderColor = 'var(--color-app-border-bright)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.borderColor = 'var(--color-app-border)'
          }}
        >
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '6px',
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
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-app-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{act.label}</div>
            <div style={{ fontSize: '11px', color: 'var(--color-app-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{act.sub}</div>
          </div>
        </button>
      ))}
    </div>
  )
}
