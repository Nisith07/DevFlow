import { Bell, Check, Clock, GitCommit, Sparkles } from 'lucide-react'

const FEATURES = [
  {
    icon: GitCommit,
    title: 'Daily standup, written for you',
    desc: "DevFlow reads your commit history overnight and drafts yesterday's summary automatically — no more typing out what you did before the meeting.",
    bullets: [
      'Auto-generated from real commits, not guesses',
      'Editable before you share it with your team',
    ],
    visual: (
      <div className="lp-feature-visual">
        <div className="lp-fv-row">
          <span className="lp-fv-dot" style={{ background: 'var(--color-lp-accent)' }} />
          <span className="lp-fv-label">Fixed login API</span>
          <span className="lp-fv-meta lp-mono">2 commits</span>
        </div>
        <div className="lp-fv-row">
          <span className="lp-fv-dot" style={{ background: 'var(--color-lp-accent)' }} />
          <span className="lp-fv-label">Completed authentication</span>
          <span className="lp-fv-meta lp-mono">4 commits</span>
        </div>
        <div className="lp-fv-row">
          <span className="lp-fv-dot" style={{ background: 'var(--color-lp-line)' }} />
          <span className="lp-fv-label" style={{ color: 'var(--color-lp-faint)' }}>Payment API — in progress</span>
          <span className="lp-fv-meta lp-mono">draft</span>
        </div>
      </div>
    ),
    reverse: false,
  },
  {
    icon: Sparkles,
    title: 'AI suggestions before code review does',
    desc: 'DevFlow scans your diffs for duplicate logic, missing tests, and stale docs — the small things that usually surface late in review.',
    bullets: [
      'Flags duplicate code across files',
      'Points out untested changes before you push',
    ],
    visual: (
      <div className="lp-feature-visual">
        <div className="lp-fv-row">
          <span className="lp-fv-dot" style={{ background: 'var(--color-lp-accent)' }} />
          <span className="lp-fv-label">Duplicate logic in auth module</span>
        </div>
        <div className="lp-fv-row">
          <span className="lp-fv-dot" style={{ background: 'var(--color-lp-accent)' }} />
          <span className="lp-fv-label">Missing tests for payment handler</span>
        </div>
        <div className="lp-fv-row">
          <span className="lp-fv-dot" style={{ background: 'var(--color-lp-accent)' }} />
          <span className="lp-fv-label">README out of date</span>
        </div>
      </div>
    ),
    reverse: true,
  },
  {
    icon: Clock,
    title: 'Time tracking that runs itself',
    desc: 'Start a focus session with one click. DevFlow logs the hours against the task automatically, so your week adds up without a spreadsheet.',
    bullets: [
      'One click to start, pause, or reset',
      'Weekly view of hours per project',
    ],
    visual: (
      <div className="lp-feature-visual">
        <div className="lp-fv-bars">
          {[38, 64, 44, 80, 52].map((h, i) => (
            <div
              key={i}
              className={`lp-fv-bar ${i === 4 ? 'hi' : ''}`}
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>
    ),
    reverse: false,
  },
  {
    icon: Bell,
    title: 'Notifications that know when to speak up',
    desc: 'A build failure, an idle task, a review waiting two days — DevFlow only interrupts you for things that actually need a decision.',
    bullets: [
      'Quiet hours you control, per project',
      'Delivered in-app, email, or Slack',
    ],
    visual: (
      <div className="lp-feature-visual">
        <div className="lp-fv-row">
          <span className="lp-fv-dot" style={{ background: 'var(--color-lp-accent)' }} />
          <span className="lp-fv-label">Mongo timeout — 3 fixes found</span>
          <span className="lp-fv-meta lp-mono">now</span>
        </div>
        <div className="lp-fv-row">
          <span className="lp-fv-dot" style={{ background: 'var(--color-lp-line)' }} />
          <span className="lp-fv-label" style={{ color: 'var(--color-lp-faint)' }}>PR #14 waiting 2 days</span>
          <span className="lp-fv-meta lp-mono">idle</span>
        </div>
      </div>
    ),
    reverse: true,
  },
]

export default function Features() {
  return (
    <section className="lp-section" id="features">
      <div className="lp-wrap">
        <div className="lp-section-head reveal">
          <div className="lp-section-eyebrow">Everything included</div>
          <h2 className="lp-section-title">Built around one screen, not ten tabs</h2>
          <p className="lp-section-desc">
            Every part of DevFlow feeds the same daily view — nothing you have to go dig for.
          </p>
        </div>

        <div className="lp-feature-rows">
          {FEATURES.map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className={`lp-feature-row reveal ${feature.reverse ? 'reverse' : ''}`}
              >
                <div className="lp-feature-copy">
                  <div className="lp-feature-icon">
                    <Icon size={18} />
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.desc}</p>
                  <ul className="lp-feature-list">
                    {feature.bullets.map((b) => (
                      <li key={b}>
                        <Check size={15} />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
                {feature.visual}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
