import { useState } from 'react'

const TIME_SLOTS = [
  { id: 'morning',   emoji: '🌅', label: 'Morning',   sub: '6am–12pm' },
  { id: 'afternoon', emoji: '☀️', label: 'Afternoon', sub: '12pm–6pm' },
  { id: 'evening',   emoji: '🌆', label: 'Evening',   sub: '6pm–10pm' },
  { id: 'night',     emoji: '🌙', label: 'Night Owl', sub: '10pm–4am' },
]

const GOALS = [
  { id: 'focus',       emoji: '🎯', label: 'Stay focused' },
  { id: 'tasks',       emoji: '✅', label: 'Manage tasks' },
  { id: 'ai',          emoji: '🤖', label: 'AI coding help' },
  { id: 'deploy',      emoji: '🚀', label: 'Track deployments' },
  { id: 'sprint',      emoji: '🏃', label: 'Sprint planning' },
  { id: 'learn',       emoji: '📚', label: 'Learn & grow' },
  { id: 'sideproject', emoji: '💡', label: 'Side projects' },
  { id: 'interview',   emoji: '🎤', label: 'Interview prep' },
  { id: 'opensource',  emoji: '🌐', label: 'Open Source' },
  { id: 'team',        emoji: '👥', label: 'Team collab' },
]

const MAX_GOALS = 5

export default function Step4GoalsSchedule({ data, onChange }) {
  const selected  = data.goals || []
  const schedule  = data.schedule || {}
  const briefing  = schedule.morningBriefing ?? true

  const setSchedule = (key, val) =>
    onChange({ schedule: { ...schedule, [key]: val } })

  const toggleGoal = (id) => {
    if (selected.includes(id)) {
      onChange({ goals: selected.filter((g) => g !== id) })
    } else if (selected.length < MAX_GOALS) {
      onChange({ goals: [...selected, id] })
    }
  }

  return (
    <div className="ob-step-content">
      <div className="ob-step-eyebrow">Step 4 of 5</div>
      <h2 className="ob-step-title">Goals & Schedule</h2>
      <p className="ob-step-sub">Pick up to 5 goals, then tell us when you code.</p>

      {/* ── Goals ── */}
      <div className="ob-goals-grid ob-goals-grid--compact">
        {GOALS.map((g) => {
          const isSelected = selected.includes(g.id)
          const isDisabled = !isSelected && selected.length >= MAX_GOALS
          return (
            <button
              key={g.id}
              type="button"
              className={`ob-goal-card ${isSelected ? 'ob-goal-card--active' : ''} ${isDisabled ? 'ob-goal-card--disabled' : ''}`}
              onClick={() => toggleGoal(g.id)}
              disabled={isDisabled}
            >
              <span className="ob-goal-emoji">{g.emoji}</span>
              <span className="ob-goal-label">{g.label}</span>
              {isSelected && <span className="ob-goal-check">✓</span>}
            </button>
          )
        })}
      </div>

      <div className="ob-goals-meta">{selected.length}/{MAX_GOALS} selected</div>

      {/* ── When do you code ── */}
      <div className="ob-section-divider" />
      <div className="ob-section-label">When do you usually code?</div>

      <div className="ob-time-grid">
        {TIME_SLOTS.map((slot) => (
          <button
            key={slot.id}
            type="button"
            className={`ob-time-card ${schedule.preferredTime === slot.id ? 'ob-time-card--active' : ''}`}
            onClick={() => setSchedule('preferredTime', slot.id)}
          >
            <span className="ob-time-emoji">{slot.emoji}</span>
            <span className="ob-time-label">{slot.label}</span>
            <span className="ob-time-sub">{slot.sub}</span>
          </button>
        ))}
      </div>

      {/* ── Morning Briefing toggle ── */}
      <div className="ob-toggle-row">
        <div>
          <div className="ob-toggle-title">☀️ Daily Morning Briefing</div>
          <div className="ob-toggle-sub">AI summary of tasks, goals & GitHub activity every morning</div>
        </div>
        <button
          type="button"
          className={`ob-toggle ${briefing ? 'ob-toggle--on' : ''}`}
          onClick={() => setSchedule('morningBriefing', !briefing)}
          aria-label="Toggle morning briefing"
        >
          <span className="ob-toggle-knob" />
        </button>
      </div>
    </div>
  )
}
