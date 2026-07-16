import { useNavigate } from 'react-router-dom'
import {
  FolderKanban,
  Briefcase,
  Layers,
  Coffee,
  Sparkles,
  ArrowRight,
  Code2,
  Bug,
  Zap,
} from 'lucide-react'

const STAT_CARDS = [
  {
    id: 'projects',
    label: 'Projects',
    value: '12',
    sub: '2 in progress',
    icon: FolderKanban,
    colorClass: 'violet',
  },
  {
    id: 'experience',
    label: 'Experience',
    value: '1+',
    sub: 'Years',
    icon: Briefcase,
    colorClass: 'green',
  },
  {
    id: 'technologies',
    label: 'Technologies',
    value: '20+',
    sub: 'Technologies',
    icon: Layers,
    colorClass: 'blue',
  },
  {
    id: 'coffee',
    label: 'Coffee Used',
    value: '∞',
    sub: 'Cups',
    icon: Coffee,
    colorClass: 'amber',
  },
]

const AI_QUICK_ACTIONS = [
  { id: 'explain', label: 'Explain Code', icon: Code2 },
  { id: 'generate', label: 'Generate Code', icon: Sparkles },
  { id: 'bugs', label: 'Find Bugs', icon: Bug },
  { id: 'optimize', label: 'Optimize Code', icon: Zap },
]

export default function StatsCards() {
  const navigate = useNavigate()

  return (
    <div className="stats-grid">
      {/* Regular stat cards */}
      {STAT_CARDS.map(({ id, label, value, sub, icon: Icon, colorClass }) => (
        <div key={id} className="stat-card" id={`stat-${id}`}>
          <div className="stat-card-header">
            <span className="stat-card-label">{label}</span>
            <div className={`stat-icon-container ${colorClass}`}>
              <Icon size={16} />
            </div>
          </div>
          <div className="stat-card-value">{value}</div>
          <div className="stat-card-sub">{sub}</div>
        </div>
      ))}

      {/* AI Copilot card — special */}
      <div className="stat-card ai-card" id="stat-ai-copilot">
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
          <div className="stat-icon-container violet" style={{ flexShrink: 0 }}>
            <Sparkles size={16} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="ai-card-title">AI Copilot</span>
              <span className="ai-widget-beta">Beta</span>
            </div>
            <p className="ai-card-sub">
              Your intelligent coding assistant. Ask anything. Code better. Ship faster.
            </p>
          </div>
        </div>

        <button
          className="ai-card-ask-btn"
          onClick={() => navigate('/ai')}
          id="ai-ask-anything-btn"
          aria-label="Ask AI Copilot"
        >
          <span>Ask Copilot anything...</span>
          <ArrowRight size={14} />
        </button>

        <div style={{ fontSize: 11, color: 'var(--color-app-faint)', marginBottom: 6, fontWeight: 500 }}>
          Quick Actions
        </div>
        <div className="ai-quick-actions">
          {AI_QUICK_ACTIONS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className="ai-quick-btn"
              onClick={() => navigate('/ai')}
              id={`ai-action-${id}`}
              aria-label={label}
            >
              <Icon size={11} />
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
