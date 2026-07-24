const DURATIONS = [
  { value: 25,  label: '25 min',  sub: 'Classic' },
  { value: 40,  label: '40 min',  sub: 'Extended' },
  { value: 50,  label: '50 min',  sub: 'Deep work' },
  { value: 90,  label: '90 min',  sub: 'Flow state' },
]

export default function Step7Focus({ data, onChange }) {
  const focus = data.focusSettings || {}
  const set = (key, val) => onChange({ focusSettings: { ...focus, [key]: val } })

  const duration = focus.pomodoroDuration ?? 25
  const autoStart = focus.autoStartNext ?? false

  return (
    <div className="ob-step-content">
      <div className="ob-step-eyebrow">Step 7 of 9</div>
      <h2 className="ob-step-title">Focus Mode</h2>
      <p className="ob-step-sub">Set your default Pomodoro session length for deep work sessions.</p>

      <div className="ob-duration-grid">
        {DURATIONS.map((d) => (
          <button
            key={d.value}
            type="button"
            className={`ob-duration-card ${duration === d.value ? 'ob-duration-card--active' : ''}`}
            onClick={() => set('pomodoroDuration', d.value)}
          >
            <span className="ob-duration-value">{d.label}</span>
            <span className="ob-duration-sub">{d.sub}</span>
          </button>
        ))}
      </div>

      <div className="ob-toggle-row ob-field--mt">
        <div>
          <div className="ob-toggle-title">Auto-start next session</div>
          <div className="ob-toggle-sub">Automatically begin the next Pomodoro after a short break</div>
        </div>
        <button
          type="button"
          className={`ob-toggle ${autoStart ? 'ob-toggle--on' : ''}`}
          onClick={() => set('autoStartNext', !autoStart)}
          aria-label="Toggle auto-start"
        >
          <span className="ob-toggle-knob" />
        </button>
      </div>
    </div>
  )
}
