import { useNavigate } from 'react-router-dom'
import {
  Sparkles,
  Code2,
  Bug,
  Zap,
  Send,
} from 'lucide-react'

const ACTIONS = [
  { id: 'explain',   icon: Code2,       label: 'Explain' },
  { id: 'generate',  icon: Sparkles,    label: 'Generate' },
  { id: 'bugs',      icon: Bug,         label: 'Bugs' },
  { id: 'optimize',  icon: Zap,         label: 'Optimize' },
]

export default function AICopilotWidget() {
  const navigate = useNavigate()

  const handleOpen = () => navigate('/ai')

  return (
    <div className="card" id="ai-copilot-widget" style={{ flex: '1', minHeight: 0, display: 'flex', flexDirection: 'column', padding: '10px 12px !important' }}>
      {/* Header */}
      <div className="card-head" style={{ marginBottom: '6px' }}>
        <h2 className="card-title" style={{ fontSize: '13px' }}>
          <Sparkles size={14} className="card-title-icon" />
          AI Copilot
          <span style={{ fontSize: '9px', padding: '2px 4px', background: 'var(--color-violet-dim)', color: 'var(--color-violet-bright)', borderRadius: '4px', marginLeft: '6px' }}>Beta</span>
        </h2>
      </div>

      {/* Ask prompt row */}
      <button
        className="neu-inset"
        onClick={handleOpen}
        aria-label="Open AI Copilot chat"
        id="ai-open-chat-btn"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          width: '100%',
          padding: '6px 10px',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          textAlign: 'left',
          marginBottom: '8px',
          boxShadow: 'var(--neu-shadow-inset-sm)'
        }}
      >
        <Sparkles size={12} style={{ color: 'var(--color-violet-bright)', flexShrink: 0 }} />
        <span style={{ flex: 1, fontSize: '11px', color: 'var(--color-app-muted)' }}>Ask Copilot anything...</span>
        <Send size={11} style={{ color: 'var(--color-app-faint)', transform: 'rotate(45deg)' }} />
      </button>

      {/* Action buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px', flex: 1, minHeight: 0 }}>
        {ACTIONS.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            className="neu-btn"
            onClick={handleOpen}
            id={`ai-widget-${id}`}
            aria-label={label}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '6px 4px',
              fontSize: '10px',
              fontWeight: 500,
              borderRadius: '6px'
            }}
          >
            <Icon size={11} style={{ color: 'var(--color-violet-bright)', flexShrink: 0 }} />
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
