import { ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Hero({ onLoginClick }) {
  const navigate = useNavigate()

  return (
    <section className="lp-hero" id="home">
      <div className="lp-wrap lp-hero-stage">
        {/* Copy */}
        <div className="lp-hero-copy reveal in">
          <span className="lp-eyebrow">Built for people who ship</span>
          <h1 className="lp-headline">
            Keep your <span className="lp-accent-word">flow</span> in one place.
          </h1>
          <p className="lp-sub">
            DevFlow turns tasks, projects, and focus time into a calm daily
            workspace — built for developers who&apos;d rather ship than status-report.
          </p>
          <div className="lp-hero-ctas">
            <button className="lp-btn lp-btn-primary" onClick={onLoginClick}>
              Start your workspace <ArrowRight size={16} />
            </button>
            <a href="#how-it-works" className="lp-btn lp-btn-ghost">
              How it works
            </a>
          </div>
        </div>

        {/* App preview */}
        <div
          className="lp-workspace reveal"
          onClick={onLoginClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && onLoginClick()}
          aria-label="Open DevFlow workspace"
          style={{ position: 'relative' }}
        >
          <div className="lp-workspace-nav">
            <div className="lp-workspace-brand"><span>⌘</span> DevFlow</div>
            <div className="lp-workspace-tabs">
              <b>Overview</b><span>Tasks</span><span>Activity</span>
            </div>
            <div className="lp-workspace-avatar">N</div>
          </div>

          <div className="lp-workspace-content">
            <div className="lp-workspace-welcome">
              <span>Monday, 14 July</span>
              <h2>Good morning, Nisith <span>✦</span></h2>
              <p>Here&apos;s what deserves your attention today.</p>
            </div>

            <div className="lp-workspace-grid">
              <div className="lp-work-card lp-tasks-card">
                <div className="lp-card-label">TODAY&apos;S FOCUS <span>3 tasks</span></div>
                <div className="lp-task-row"><i>✓</i> Finish payment API <b>In progress</b></div>
                <div className="lp-task-row"><i>○</i> Review PR #14 <b>Review</b></div>
                <div className="lp-task-row"><i>○</i> Add auth tests <b>Next</b></div>
              </div>

              <div className="lp-work-card lp-progress-card">
                <div className="lp-card-label">WEEKLY FLOW <span>82%</span></div>
                <div className="lp-progress-ring"><strong>18h</strong><small>focused</small></div>
                <div className="lp-mini-bars">
                  <i /><i /><i /><i className="active" /><i />
                </div>
              </div>

              <div className="lp-work-card lp-activity-card">
                <div className="lp-card-label">RECENT ACTIVITY</div>
                <p><span className="lp-activity-dot green" />Auth flow merged <em>12m</em></p>
                <p><span className="lp-activity-dot purple" />New CI run passed <em>35m</em></p>
              </div>
            </div>
          </div>

          {/* Floating badges */}
          <div className="lp-floating lp-float-left">
            <span>✓</span>
            <div><b>PR merged</b><small>auth/session</small></div>
          </div>
          <div className="lp-floating lp-float-right">
            <span>⚡</span>
            <div><b>Deep work</b><small>1h 42m today</small></div>
          </div>
        </div>
      </div>
    </section>
  )
}
