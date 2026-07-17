import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function About() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.lp-about-copy', {
        scrollTrigger: { trigger: '.lp-about-copy', start: 'top 80%' },
        opacity: 0, x: -40, duration: 0.9, ease: 'power3.out',
      })
      gsap.from('.lp-about-visual', {
        scrollTrigger: { trigger: '.lp-about-visual', start: 'top 80%' },
        opacity: 0, x: 40, duration: 0.9, ease: 'power3.out',
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section className="lp-section" id="about" ref={sectionRef}>
      <div className="lp-wrap">
        <div className="lp-about-grid">

          {/* Left: copy */}
          <div className="lp-about-copy">
            <div className="lp-label">
              <span className="lp-label-line" />
              About DevFlow
            </div>
            <h2 className="lp-h2">
              Built by developers,<br />
              <em>for developers.</em>
            </h2>
            <p className="lp-section-sub" style={{ marginBottom: 20 }}>
              We built DevFlow because the tools developers use every day
              weren't designed for developers. Jira is for managers.
              Notion is too general. Slack is a distraction machine.
            </p>
            <p className="lp-section-sub">
              DevFlow is different. It reads your commit history.
              It drafts your standup. It links tasks to the code you actually
              wrote. It's a workspace that understands what you do.
            </p>
          </div>

          {/* Right: stats visual */}
          <div className="lp-about-visual">
            <div className="lp-about-stat-grid">
              {[
                { num: '42+', label: 'commits tracked daily' },
                { num: '3×',  label: 'faster standups' },
                { num: '0',   label: 'context switches needed' },
                { num: '∞',   label: 'focus hours recovered' },
              ].map(({ num, label }) => (
                <div className="lp-about-stat" key={label}>
                  <div className="lp-about-stat-num">{num}</div>
                  <div className="lp-about-stat-label">{label}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
