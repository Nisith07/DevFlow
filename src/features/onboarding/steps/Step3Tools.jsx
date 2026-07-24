const TOOLS = [
  { id: 'github',  emoji: '🐙', label: 'GitHub',       available: true },
  { id: 'gitlab',  emoji: '🦊', label: 'GitLab',       available: false },
  { id: 'jira',    emoji: '📋', label: 'Jira',         available: false },
  { id: 'notion',  emoji: '📓', label: 'Notion',       available: false },
  { id: 'slack',   emoji: '💬', label: 'Slack',        available: false },
  { id: 'discord', emoji: '🎮', label: 'Discord',      available: false },
  { id: 'vercel',  emoji: '▲',  label: 'Vercel',       available: false },
  { id: 'render',  emoji: '🌊', label: 'Render',       available: false },
  { id: 'mongodb', emoji: '🍃', label: 'MongoDB Atlas', available: false },
]

export default function Step3Tools({ data, onChange }) {
  const selected = data.connectedTools || ['github']

  const toggle = (toolId, available) => {
    if (!available) return
    const next = selected.includes(toolId)
      ? selected.filter((s) => s !== toolId)
      : [...selected, toolId]
    onChange({ connectedTools: next })
  }

  return (
    <div className="ob-step-content">
      <div className="ob-step-eyebrow">Step 3 of 9</div>
      <h2 className="ob-step-title">Connect Your Tools</h2>
      <p className="ob-step-sub">Link your developer tools to DevFlow. More integrations coming soon.</p>

      <div className="ob-tools-grid">
        {TOOLS.map((tool) => {
          const isSelected = selected.includes(tool.id)
          return (
            <button
              key={tool.id}
              type="button"
              className={`ob-tool-card ${isSelected ? 'ob-tool-card--active' : ''} ${!tool.available ? 'ob-tool-card--soon' : ''}`}
              onClick={() => toggle(tool.id, tool.available)}
              disabled={!tool.available}
            >
              <div className="ob-tool-check">{isSelected ? '✅' : '⬜'}</div>
              <span className="ob-tool-emoji">{tool.emoji}</span>
              <span className="ob-tool-label">{tool.label}</span>
              {!tool.available && (
                <span className="ob-tool-soon-badge">Soon</span>
              )}
            </button>
          )
        })}
      </div>

      <p className="ob-step-hint">
        GitHub is connected during workspace setup. Other tools can be connected later via Integrations.
      </p>
    </div>
  )
}
