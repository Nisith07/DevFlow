import { useNavigate } from 'react-router-dom'
import {
  Sparkles,
  Code2,
  Bug,
  Zap,
  Send,
  ArrowRight,
} from 'lucide-react'

const ACTIONS = [
  { id: 'explain',   icon: Code2,       label: 'Explain Code' },
  { id: 'generate',  icon: Sparkles,    label: 'Generate Code' },
  { id: 'bugs',      icon: Bug,         label: 'Find Bugs' },
  { id: 'optimize',  icon: Zap,         label: 'Optimize Code' },
]

export default function AICopilotWidget() {
  const navigate = useNavigate()

  const handleOpen = () => navigate('/ai')

  return (
    <div className="ai-widget-card" id="ai-copilot-widget">
      {/* Header */}
      <div className="ai-widget-header">
        <div className="ai-widget-icon" aria-hidden="true">
          <Sparkles size={18} />
        </div>
        <div>
          <h2 className="ai-widget-title">AI Copilot</h2>
          <p className="ai-widget-sub">Your intelligent coding assistant.</p>
        </div>
        <span className="ai-widget-beta">Beta</span>
      </div>

      {/* Ask prompt row */}
      <button
        className="ai-input-row"
        onClick={handleOpen}
        aria-label="Open AI Copilot chat"
        id="ai-open-chat-btn"
      >
        <Sparkles size={14} style={{ color: 'var(--color-violet-bright)', flexShrink: 0 }} />
        <span className="ai-input-placeholder">Ask Copilot anything...</span>
        <Send size={14} className="ai-input-send-icon" />
      </button>

      {/* Action buttons */}
      <div className="ai-actions-grid">
        {ACTIONS.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            className="ai-action-btn"
            onClick={handleOpen}
            id={`ai-widget-${id}`}
            aria-label={label}
          >
            <Icon size={13} />
            {label}
          </button>
        ))}
      </div>

      {/* Open full page link */}
      <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid rgba(124,58,237,0.15)' }}>
        <button
          onClick={handleOpen}
          className="card-link-btn"
          id="ai-open-full-btn"
          aria-label="Open full AI Copilot page"
          style={{ width: '100%', justifyContent: 'center' }}
        >
          Open Full Copilot
          <ArrowRight size={13} />
        </button>
      </div>
    </div>
  )
}
