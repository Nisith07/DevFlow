const EXPERIENCE_LEVELS = [
  { id: 'beginner',     emoji: '🌱', label: 'Beginner',      sub: '< 1 year' },
  { id: 'intermediate', emoji: '🔥', label: 'Intermediate',  sub: '1–3 years' },
  { id: 'senior',       emoji: '⚡', label: 'Senior',        sub: '3–8 years' },
  { id: 'lead',         emoji: '🏆', label: 'Lead / Staff',  sub: '8+ years' },
]

const TONES = [
  { id: 'friendly',     emoji: '😊', label: 'Friendly' },
  { id: 'professional', emoji: '💼', label: 'Professional' },
  { id: 'short',        emoji: '⚡', label: 'Short & Sharp' },
  { id: 'detailed',     emoji: '📖', label: 'In-Depth' },
]

export default function Step5AIQuick({ data, onChange }) {
  const ai = data.aiPreferences || {}
  const set = (key, val) => onChange({ aiPreferences: { ...ai, [key]: val } })

  return (
    <div className="ob-step-content">
      <div className="ob-step-eyebrow">Step 5 of 5 ⭐</div>
      <h2 className="ob-step-title">Your AI Vibe</h2>
      <p className="ob-step-sub">Two quick picks — then DevFlow is 100% yours.</p>

      {/* ── Experience ── */}
      <div className="ob-section-label">Experience level</div>
      <div className="ob-exp-grid">
        {EXPERIENCE_LEVELS.map((exp) => (
          <button
            key={exp.id}
            type="button"
            className={`ob-exp-card ${ai.experience === exp.id ? 'ob-exp-card--active' : ''}`}
            onClick={() => set('experience', exp.id)}
          >
            <span className="ob-exp-emoji">{exp.emoji}</span>
            <span className="ob-exp-label">{exp.label}</span>
            <span className="ob-exp-sub">{exp.sub}</span>
          </button>
        ))}
      </div>

      {/* ── AI Tone ── */}
      <div className="ob-section-label ob-section-label--mt">How should the AI talk to you?</div>
      <div className="ob-tone-grid">
        {TONES.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`ob-tone-card ${ai.tone === t.id ? 'ob-tone-card--active' : ''}`}
            onClick={() => set('tone', t.id)}
          >
            <span className="ob-tone-emoji">{t.emoji}</span>
            <span className="ob-tone-label">{t.label}</span>
          </button>
        ))}
      </div>

      <div className="ob-ai-final-note">
        🧠 DevFlow's AI will adapt over time as it learns your patterns
      </div>
    </div>
  )
}
