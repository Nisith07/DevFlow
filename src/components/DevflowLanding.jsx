import { useEffect, useRef, useState } from 'react'
import {
  ArrowRight,
  Bell,
  Check,
  Clock,
  GitCommit,
  Menu,
  Sparkles,
} from 'lucide-react'

export default function DevflowLanding({ onGetStarted }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    const elements = containerRef.current?.querySelectorAll('.lp-reveal') ?? []
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15 },
    )

    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="lp-root" ref={containerRef}>
      <header className="lp-nav">
        <div className="lp-wrap lp-nav-inner">
          <button className="lp-brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <span className="lp-brand-mark">D</span>
            Dev<span className="lp-brand-sub">flow</span>
          </button>
          <nav className={`lp-links ${menuOpen ? 'open' : ''}`}>
            <a href="#how-it-works" onClick={() => setMenuOpen(false)}>How it works</a>
            <a href="#features" onClick={() => setMenuOpen(false)}>Features</a>
            <a href="#" onClick={(event) => event.preventDefault()}>Pricing</a>
            <a href="#" onClick={(event) => event.preventDefault()}>Docs</a>
          </nav>
          <div className="lp-nav-actions">
            <a href="#" className="lp-btn lp-btn-ghost lp-btn-sm" onClick={(event) => event.preventDefault()}>Log in</a>
            <button className="lp-btn lp-btn-primary lp-btn-sm" onClick={onGetStarted}>Get Started</button>
            <button className="lp-nav-toggle" aria-label="Toggle menu" onClick={() => setMenuOpen((open) => !open)}>
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      <section className="lp-hero">
        <div className="lp-wrap lp-hero-grid">
          <div className="lp-reveal in">
            <span className="lp-eyebrow">$ status --daily</span>
            <h1 className="lp-headline">
              Your day, <span className="lp-accent-word">structured</span> before you open your editor.
            </h1>
            <p className="lp-sub">
              Devflow reads your commits, flags what needs attention, and hands you a clear list for today — so the first ten minutes of your morning aren&apos;t spent figuring out where you left off.
            </p>
            <div className="lp-hero-ctas">
              <button className="lp-btn lp-btn-primary" onClick={onGetStarted}>
                Get Started Free <ArrowRight size={16} />
              </button>
              <a href="#how-it-works" className="lp-btn lp-btn-ghost">See how it works</a>
            </div>
          </div>

          <div className="lp-hero-preview lp-reveal" onClick={onGetStarted} role="button" tabIndex={0}>
            <div className="lp-preview-chrome">
              <span className="lp-dot" />
              <span className="lp-dot" />
              <span className="lp-dot" />
            </div>
            <div className="lp-preview-body">
              <div className="lp-preview-prompt">
                <span className="sigil">$</span>good morning, <span className="who">nisith</span>
              </div>
              <div className="lp-preview-row"><span className="chk">✓</span> Fixed login API</div>
              <div className="lp-preview-row"><span className="chk">✓</span> Completed authentication</div>
              <div className="lp-preview-row pending"><span className="chk">○</span> Finish payment API</div>
              <div className="lp-preview-row pending"><span className="chk">○</span> Review PR #14</div>
              <div className="lp-preview-tag">⚠ AI found 3 possible fixes for Mongo timeout</div>
            </div>
            <div className="lp-preview-hint">click to open the dashboard →</div>
          </div>
        </div>
      </section>

      <section className="lp-section" id="how-it-works">
        <div className="lp-wrap">
          <div className="lp-section-head lp-reveal">
            <div className="lp-section-eyebrow">How it works</div>
            <h2 className="lp-section-title">Three steps, every morning</h2>
            <p className="lp-section-desc">No new workflow to learn — Devflow sits on top of the repos and tools you already use.</p>
          </div>
          <div className="lp-steps">
            <div className="lp-step lp-reveal">
              <div className="lp-step-connector" />
              <div className="lp-step-num">01</div>
              <h3>Connect your repos</h3>
              <p>Link GitHub or GitLab once. Devflow watches commits, PRs, and CI runs in the background.</p>
            </div>
            <div className="lp-step lp-reveal">
              <div className="lp-step-connector" />
              <div className="lp-step-num">02</div>
              <h3>Get your daily brief</h3>
              <p>Each morning, see what shipped yesterday, what&apos;s flagged, and what&apos;s next — in one screen.</p>
            </div>
            <div className="lp-step lp-reveal">
              <div className="lp-step-num">03</div>
              <h3>Work, tracked automatically</h3>
              <p>Devflow times your focus sessions and nudges you before you lose the thread.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="lp-section" id="features">
        <div className="lp-wrap">
          <div className="lp-section-head lp-reveal">
            <div className="lp-section-eyebrow">Everything included</div>
            <h2 className="lp-section-title">Built around one screen, not ten tabs</h2>
            <p className="lp-section-desc">Every part of Devflow feeds the same daily view — nothing you have to go dig for.</p>
          </div>

          <div className="lp-feature-row lp-reveal">
            <div className="lp-feature-copy">
              <div className="lp-feature-icon"><GitCommit size={18} /></div>
              <h3>Daily standup, written for you</h3>
              <p>Devflow reads your commit history overnight and drafts yesterday&apos;s summary automatically — no more typing out what you did before the meeting.</p>
              <ul className="lp-feature-list">
                <li><Check size={15} /> Auto-generated from real commits, not guesses</li>
                <li><Check size={15} /> Editable before you share it with your team</li>
              </ul>
            </div>
            <div className="lp-feature-visual">
              <div className="lp-fv-row"><span className="lp-fv-dot" style={{ background: 'var(--lp-accent)' }} /><span className="lp-fv-label">Fixed login API</span><span className="lp-fv-meta lp-mono">2 commits</span></div>
              <div className="lp-fv-row"><span className="lp-fv-dot" style={{ background: 'var(--lp-accent)' }} /><span className="lp-fv-label">Completed authentication</span><span className="lp-fv-meta lp-mono">4 commits</span></div>
              <div className="lp-fv-row"><span className="lp-fv-dot" style={{ background: 'var(--lp-line)' }} /><span className="lp-fv-label" style={{ color: 'var(--lp-faint)' }}>Payment API — in progress</span><span className="lp-fv-meta lp-mono">draft</span></div>
            </div>
          </div>

          <div className="lp-feature-row reverse lp-reveal">
            <div className="lp-feature-copy">
              <div className="lp-feature-icon"><Sparkles size={18} /></div>
              <h3>AI suggestions before code review does</h3>
              <p>Devflow scans your diffs for duplicate logic, missing tests, and stale docs — the small things that usually surface late in review.</p>
              <ul className="lp-feature-list">
                <li><Check size={15} /> Flags duplicate code across files</li>
                <li><Check size={15} /> Points out untested changes before you push</li>
              </ul>
            </div>
            <div className="lp-feature-visual">
              <div className="lp-fv-row"><span className="lp-fv-dot" style={{ background: 'var(--lp-accent)' }} /><span className="lp-fv-label">Duplicate logic in auth module</span></div>
              <div className="lp-fv-row"><span className="lp-fv-dot" style={{ background: 'var(--lp-accent)' }} /><span className="lp-fv-label">Missing tests for payment handler</span></div>
              <div className="lp-fv-row"><span className="lp-fv-dot" style={{ background: 'var(--lp-accent)' }} /><span className="lp-fv-label">README out of date</span></div>
            </div>
          </div>

          <div className="lp-feature-row lp-reveal">
            <div className="lp-feature-copy">
              <div className="lp-feature-icon"><Clock size={18} /></div>
              <h3>Time tracking that runs itself</h3>
              <p>Start a focus session with one click. Devflow logs the hours against the task automatically, so your week adds up without a spreadsheet.</p>
              <ul className="lp-feature-list">
                <li><Check size={15} /> One click to start, pause, or reset</li>
                <li><Check size={15} /> Weekly view of hours per project</li>
              </ul>
            </div>
            <div className="lp-feature-visual">
              <div className="lp-fv-bars">
                <div className="lp-fv-bar" style={{ height: '38%' }} />
                <div className="lp-fv-bar" style={{ height: '64%' }} />
                <div className="lp-fv-bar" style={{ height: '44%' }} />
                <div className="lp-fv-bar" style={{ height: '80%' }} />
                <div className="lp-fv-bar hi" style={{ height: '52%' }} />
              </div>
            </div>
          </div>

          <div className="lp-feature-row reverse lp-reveal">
            <div className="lp-feature-copy">
              <div className="lp-feature-icon"><Bell size={18} /></div>
              <h3>Notifications that know when to speak up</h3>
              <p>A build failure, an idle task, a review waiting two days — Devflow only interrupts you for things that actually need a decision.</p>
              <ul className="lp-feature-list">
                <li><Check size={15} /> Quiet hours you control, per project</li>
                <li><Check size={15} /> Delivered in-app, email, or Slack</li>
              </ul>
            </div>
            <div className="lp-feature-visual">
              <div className="lp-fv-row"><span className="lp-fv-dot" style={{ background: 'var(--lp-accent)' }} /><span className="lp-fv-label">Mongo timeout — 3 fixes found</span><span className="lp-fv-meta lp-mono">now</span></div>
              <div className="lp-fv-row"><span className="lp-fv-dot" style={{ background: 'var(--lp-line)' }} /><span className="lp-fv-label" style={{ color: 'var(--lp-faint)' }}>PR #14 waiting 2 days</span><span className="lp-fv-meta lp-mono">idle</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="lp-section" style={{ paddingTop: 0 }}>
        <div className="lp-wrap">
          <div className="lp-cta-band lp-reveal">
            <h2>Start tomorrow morning with a plan.</h2>
            <p>Free for solo developers. No credit card required.</p>
            <button className="lp-btn lp-btn-primary" onClick={onGetStarted}>
              Get Started Free <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      <footer className="lp-footer">
        <div className="lp-wrap">
          <div className="lp-footer-grid">
            <div className="lp-footer-brand">
              <div className="lp-brand">
                <span className="lp-brand-mark">D</span>
                Dev<span className="lp-brand-sub">flow</span>
              </div>
              <p>The daily brief for developers who&apos;d rather ship than status-report.</p>
            </div>
            <div className="lp-footer-col">
              <h4>Product</h4>
              <ul>
                <li><a href="#features">Features</a></li>
                <li><a href="#" onClick={(event) => event.preventDefault()}>Pricing</a></li>
                <li><a href="#" onClick={(event) => event.preventDefault()}>Changelog</a></li>
              </ul>
            </div>
            <div className="lp-footer-col">
              <h4>Resources</h4>
              <ul>
                <li><a href="#" onClick={(event) => event.preventDefault()}>Docs</a></li>
                <li><a href="#" onClick={(event) => event.preventDefault()}>GitHub</a></li>
                <li><a href="#" onClick={(event) => event.preventDefault()}>Blog</a></li>
              </ul>
            </div>
            <div className="lp-footer-col">
              <h4>Legal</h4>
              <ul>
                <li><a href="#" onClick={(event) => event.preventDefault()}>Terms</a></li>
                <li><a href="#" onClick={(event) => event.preventDefault()}>Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="lp-footer-bottom">
            <span>© 2026 Devflow. All rights reserved.</span>
            <span className="lp-mono">built by nisith</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
