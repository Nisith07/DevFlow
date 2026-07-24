import { useNavigate } from 'react-router-dom'

const ROLE_LABELS = {
  fullstack: 'Full Stack Developer',
  frontend: 'Frontend Developer',
  backend: 'Backend Developer',
  mobile: 'Mobile Developer',
  devops: 'DevOps Engineer',
  aiml: 'AI/ML Engineer',
  student: 'Student',
  designer: 'UI/UX Designer',
  gamedev: 'Game Developer',
  other: 'Developer',
}

export default function OnboardingComplete({ data }) {
  const navigate = useNavigate()

  const role = ROLE_LABELS[data.role] || 'Developer'
  const stack = (data.techStack || []).slice(0, 4)
  const githubConnected = (data.connectedTools || []).includes('github')
  const briefing = data.schedule?.morningBriefing ?? true

  return (
    <div className="ob-complete-overlay">
      <div className="ob-complete-card">
        {/* Rocket */}
        <div className="ob-complete-rocket">🚀</div>

        <h1 className="ob-complete-title">Your workspace is ready</h1>
        <p className="ob-complete-sub">DevFlow has been personalized just for you.</p>

        {/* Summary pills */}
        <div className="ob-complete-summary">
          <div className="ob-summary-row">
            <div className="ob-summary-item">
              <span className="ob-summary-label">Developer Role</span>
              <span className="ob-summary-value">💻 {role}</span>
            </div>
          </div>

          {stack.length > 0 && (
            <div className="ob-summary-row">
              <div className="ob-summary-item">
                <span className="ob-summary-label">Tech Stack</span>
                <div className="ob-summary-chips">
                  {stack.map((s) => (
                    <span key={s} className="ob-chip ob-chip--active ob-chip--sm">{s}</span>
                  ))}
                  {(data.techStack || []).length > 4 && (
                    <span className="ob-chip ob-chip--sm">+{(data.techStack || []).length - 4} more</span>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="ob-summary-row ob-summary-row--2">
            <div className="ob-summary-status ob-summary-status--ok">
              {githubConnected ? '✅ GitHub Connected' : '⬜ GitHub Pending'}
            </div>
            <div className="ob-summary-status ob-summary-status--ok">
              {briefing ? '✅ Morning Briefing On' : '⬜ Morning Briefing Off'}
            </div>
            <div className="ob-summary-status ob-summary-status--ok">
              🧠 AI Memory Ready
            </div>
          </div>
        </div>

        <button
          className="ob-enter-btn"
          onClick={() => navigate('/dashboard', { replace: true })}
        >
          Enter DevFlow →
        </button>
      </div>
    </div>
  )
}
