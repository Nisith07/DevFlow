const ROLES = [
  { id: 'fullstack',  emoji: '💻', label: 'Full Stack Developer' },
  { id: 'frontend',  emoji: '⚛️',  label: 'Frontend Developer' },
  { id: 'backend',   emoji: '⚙️',  label: 'Backend Developer' },
  { id: 'mobile',    emoji: '📱',  label: 'Mobile Developer' },
  { id: 'devops',    emoji: '☁️',  label: 'DevOps Engineer' },
  { id: 'aiml',      emoji: '🤖',  label: 'AI/ML Engineer' },
  { id: 'student',   emoji: '🎓',  label: 'Student' },
  { id: 'designer',  emoji: '🎨',  label: 'UI/UX Designer' },
  { id: 'gamedev',   emoji: '🎮',  label: 'Game Developer' },
  { id: 'other',     emoji: '✨',  label: 'Other' },
]

export default function Step1Role({ data, onChange }) {
  return (
    <div className="ob-step-content">
      <div className="ob-step-eyebrow">Step 1 of 5</div>
      <h2 className="ob-step-title">Who are you?</h2>
      <p className="ob-step-sub">What best describes you? This helps DevFlow tailor your workspace.</p>

      <div className="ob-role-grid">
        {ROLES.map((r) => (
          <button
            key={r.id}
            type="button"
            className={`ob-role-card ${data.role === r.id ? 'ob-role-card--active' : ''}`}
            onClick={() => onChange({ role: r.id })}
          >
            <span className="ob-role-emoji">{r.emoji}</span>
            <span className="ob-role-label">{r.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
