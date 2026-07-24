const GOALS = [
  { id: 'focus',       emoji: '🎯', label: 'Stay focused' },
  { id: 'tasks',       emoji: '✅', label: 'Manage tasks' },
  { id: 'ai',          emoji: '🤖', label: 'AI coding help' },
  { id: 'deploy',      emoji: '🚀', label: 'Track deployments' },
  { id: 'sprint',      emoji: '🏃', label: 'Sprint planning' },
  { id: 'learn',       emoji: '📚', label: 'Learn programming' },
  { id: 'sideproject', emoji: '💡', label: 'Build side projects' },
  { id: 'interview',   emoji: '🎤', label: 'Prepare for interviews' },
  { id: 'opensource',  emoji: '🌐', label: 'Open Source' },
  { id: 'team',        emoji: '👥', label: 'Team collaboration' },
]

export default function Step5Goals({ data, onChange }) {
  const selected = data.goals || []
  const MAX = 5

  const toggle = (id) => {
    if (selected.includes(id)) {
      onChange({ goals: selected.filter((g) => g !== id) })
    } else if (selected.length < MAX) {
      onChange({ goals: [...selected, id] })
    }
  }

  return (
    <div className="ob-step-content">
      <div className="ob-step-eyebrow">Step 5 of 9</div>
      <h2 className="ob-step-title">Your Goals</h2>
      <p className="ob-step-sub">
        What do you want DevFlow to help with? Choose up to 5 — this shapes your dashboard.
      </p>

      <div className="ob-goals-grid">
        {GOALS.map((g) => {
          const isSelected = selected.includes(g.id)
          const isDisabled = !isSelected && selected.length >= MAX
          return (
            <button
              key={g.id}
              type="button"
              className={`ob-goal-card ${isSelected ? 'ob-goal-card--active' : ''} ${isDisabled ? 'ob-goal-card--disabled' : ''}`}
              onClick={() => toggle(g.id)}
              disabled={isDisabled}
            >
              <span className="ob-goal-emoji">{g.emoji}</span>
              <span className="ob-goal-label">{g.label}</span>
              {isSelected && <span className="ob-goal-check">✓</span>}
            </button>
          )
        })}
      </div>

      <div className="ob-goal-counter">
        {selected.length} / {MAX} selected
      </div>
    </div>
  )
}
