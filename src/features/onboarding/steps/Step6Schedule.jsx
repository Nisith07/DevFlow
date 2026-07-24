const TIME_SLOTS = [
  { id: 'morning',   emoji: '🌅', label: 'Morning',    sub: '6am – 12pm' },
  { id: 'afternoon', emoji: '☀️', label: 'Afternoon',  sub: '12pm – 6pm' },
  { id: 'evening',   emoji: '🌆', label: 'Evening',    sub: '6pm – 10pm' },
  { id: 'night',     emoji: '🌙', label: 'Night Owl',  sub: '10pm – 4am' },
]

export default function Step6Schedule({ data, onChange }) {
  const schedule = data.schedule || {}
  const set = (key, val) => onChange({ schedule: { ...schedule, [key]: val } })

  const hours = schedule.hoursPerDay ?? 4
  const briefing = schedule.morningBriefing ?? true

  return (
    <div className="ob-step-content">
      <div className="ob-step-eyebrow">Step 6 of 9</div>
      <h2 className="ob-step-title">Work Schedule</h2>
      <p className="ob-step-sub">When do you usually code? DevFlow will align your briefings and reminders.</p>

      <div className="ob-time-grid">
        {TIME_SLOTS.map((slot) => (
          <button
            key={slot.id}
            type="button"
            className={`ob-time-card ${schedule.preferredTime === slot.id ? 'ob-time-card--active' : ''}`}
            onClick={() => set('preferredTime', slot.id)}
          >
            <span className="ob-time-emoji">{slot.emoji}</span>
            <span className="ob-time-label">{slot.label}</span>
            <span className="ob-time-sub">{slot.sub}</span>
          </button>
        ))}
      </div>

      <div className="ob-field ob-field--mt">
        <span className="ob-field-label">Average coding hours / day</span>
        <div className="ob-slider-wrap">
          <span className="ob-slider-min">1h</span>
          <input
            className="ob-slider"
            type="range"
            min={1}
            max={12}
            value={hours}
            onChange={(e) => set('hoursPerDay', Number(e.target.value))}
          />
          <span className="ob-slider-val">{hours}h</span>
        </div>
      </div>

      <div className="ob-toggle-row">
        <div>
          <div className="ob-toggle-title">Enable Daily Morning Briefing</div>
          <div className="ob-toggle-sub">AI summary of your tasks, goals and GitHub activity every morning</div>
        </div>
        <button
          type="button"
          className={`ob-toggle ${briefing ? 'ob-toggle--on' : ''}`}
          onClick={() => set('morningBriefing', !briefing)}
          aria-label="Toggle morning briefing"
        >
          <span className="ob-toggle-knob" />
        </button>
      </div>
    </div>
  )
}
