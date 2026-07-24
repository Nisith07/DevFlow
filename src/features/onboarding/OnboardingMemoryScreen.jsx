import { useEffect, useState } from 'react'

const STEPS = [
  { icon: '💾', text: 'Saving tech stack' },
  { icon: '🐙', text: 'Reading GitHub repository' },
  { icon: '👤', text: 'Creating developer profile' },
  { icon: '📖', text: 'Learning project context' },
  { icon: '🧠', text: 'Building second brain' },
]

export default function OnboardingMemoryScreen({ onDone }) {
  const [current, setCurrent] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (current < STEPS.length) {
      const t = setTimeout(() => setCurrent((c) => c + 1), 700)
      return () => clearTimeout(t)
    } else {
      const t = setTimeout(() => setDone(true), 400)
      return () => clearTimeout(t)
    }
  }, [current])

  return (
    <div className="ob-memory-overlay">
      <div className="ob-memory-card">
        {/* Pulsing brain */}
        <div className="ob-memory-brain">
          <span className="ob-memory-brain-emoji">🧠</span>
          <div className="ob-memory-brain-ring ob-memory-brain-ring--1" />
          <div className="ob-memory-brain-ring ob-memory-brain-ring--2" />
          <div className="ob-memory-brain-ring ob-memory-brain-ring--3" />
        </div>

        {!done ? (
          <>
            <h2 className="ob-memory-title">Creating Your AI Project Memory...</h2>
            <div className="ob-memory-steps">
              {STEPS.map((s, i) => (
                <div
                  key={i}
                  className={`ob-memory-step ${i < current ? 'ob-memory-step--done' : i === current ? 'ob-memory-step--active' : 'ob-memory-step--pending'}`}
                >
                  <span className="ob-memory-step-icon">
                    {i < current ? '✓' : s.icon}
                  </span>
                  <span className="ob-memory-step-text">{s.text}</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="ob-memory-success">
            <div className="ob-memory-success-title">✅ AI Memory Created Successfully</div>
            <p className="ob-memory-success-sub">From now on DevFlow will remember:</p>
            <div className="ob-memory-remember-list">
              {['Your projects', 'Tech stack', 'Coding preferences', 'AI conversations', 'GitHub activity', 'Sprint history', 'Important decisions'].map((item) => (
                <div key={item} className="ob-memory-remember-item">
                  <span className="ob-memory-bullet">•</span> {item}
                </div>
              ))}
            </div>
            <button className="ob-memory-cta" onClick={onDone}>
              Continue to Your Workspace →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
