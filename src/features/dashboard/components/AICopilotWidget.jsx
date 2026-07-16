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
    <div className="card" id="ai-copilot-widget" style={{ flex: '1', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div className="card-head">
        <h2 className="card-title">
          <Sparkles size={14} className="card-title-icon" />
          AI Copilot
          <span style={{ fontSize: '9px', padding: '2px 6px', background: 'var(--accent-dim)', color: 'var(--color-violet-bright)', borderRadius: '4px', marginLeft: '6px', fontWeight: 600 }}>Beta</span>
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
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left'
        }}
      >
        <Sparkles size={12} style={{ color: 'var(--color-violet-bright)', flexShrink: 0 }} />
        <span>Ask Copilot anything...</span>
        <Send size={11} style={{ color: 'var(--color-app-faint)', transform: 'rotate(45deg)', marginLeft: 'auto' }} />
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
              fontWeight: 500
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
