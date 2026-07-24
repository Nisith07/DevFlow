const EXPERIENCE_LEVELS = [
  { id: 'beginner',     label: 'Beginner',      sub: '< 1 year' },
  { id: 'intermediate', label: 'Intermediate',  sub: '1–3 years' },
  { id: 'senior',       label: 'Senior',        sub: '3–8 years' },
  { id: 'lead',         label: 'Lead / Staff',  sub: '8+ years' },
]

const TONES = [
  { id: 'professional', label: 'Professional' },
  { id: 'friendly',     label: 'Friendly' },
  { id: 'short',        label: 'Short Answers' },
  { id: 'detailed',     label: 'Detailed Explanations' },
]

const HELP_STYLES = [
  { id: 'debug',        emoji: '🐛', label: 'Debug code' },
  { id: 'generate',     emoji: '✨', label: 'Generate code' },
  { id: 'review',       emoji: '👁️', label: 'Review code' },
  { id: 'explain',      emoji: '📖', label: 'Explain concepts' },
  { id: 'architecture', emoji: '🏗️', label: 'Architecture advice' },
]

export default function Step8AI({ data, onChange }) {
  const ai = data.aiPreferences || {}
  const set = (key, val) => onChange({ aiPreferences: { ...ai, [key]: val } })

  const helpStyle = ai.helpStyle || []

  const toggleHelp = (id) => {
    const next = helpStyle.includes(id)
      ? helpStyle.filter((h) => h !== id)
      : [...helpStyle, id]
    set('helpStyle', next)
  }

  return (
    <div className="ob-step-content">
      <div className="ob-step-eyebrow">Step 8 of 9 ⭐</div>
      <h2 className="ob-step-title">AI Personalization</h2>
      <p className="ob-step-sub">Help the AI understand you — this is where DevFlow becomes truly yours.</p>

      {/* Experience */}
      <div className="ob-section-label">What's your experience level?</div>
      <div className="ob-exp-grid">
        {EXPERIENCE_LEVELS.map((exp) => (
          <button
            key={exp.id}
            type="button"
            className={`ob-exp-card ${ai.experience === exp.id ? 'ob-exp-card--active' : ''}`}
            onClick={() => set('experience', exp.id)}
          >
            <span className="ob-exp-label">{exp.label}</span>
            <span className="ob-exp-sub">{exp.sub}</span>
          </button>
        ))}
      </div>

      {/* Tone */}
      <div className="ob-section-label ob-section-label--mt">Preferred AI tone</div>
      <div className="ob-chip-row">
        {TONES.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`ob-chip ${ai.tone === t.id ? 'ob-chip--active' : ''}`}
            onClick={() => set('tone', t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Help style */}
      <div className="ob-section-label ob-section-label--mt">How should AI help you? (pick all that apply)</div>
      <div className="ob-help-grid">
        {HELP_STYLES.map((h) => (
          <button
            key={h.id}
            type="button"
            className={`ob-help-card ${helpStyle.includes(h.id) ? 'ob-help-card--active' : ''}`}
            onClick={() => toggleHelp(h.id)}
          >
            <span className="ob-help-emoji">{h.emoji}</span>
            <span className="ob-help-label">{h.label}</span>
            {helpStyle.includes(h.id) && <span className="ob-help-check">✓</span>}
          </button>
        ))}
      </div>
    </div>
  )
}
