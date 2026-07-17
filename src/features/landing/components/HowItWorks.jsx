import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const STEPS = [
  {
    num: '01',
    title: 'Create your workspace',
    desc: 'Sign up in seconds. Create your first project, add a task list, and connect your GitHub account. No onboarding wizard needed.',
  },
  {
    num: '02',
    title: 'Plan your day',
    desc: 'Each morning, open the Daily Planner. Drag tasks into time blocks and set your focus for the session. The AI writes your standup automatically.',
  },
  {
    num: '03',
    title: 'Ship and stay in flow',
    desc: 'DevFlow tracks completions, surfaces blockers, and shows your streak — so you know exactly what you accomplished and what needs attention next.',
  },
]

export default function HowItWorks() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.lp-hiw-head', {
        scrollTrigger: { trigger: '.lp-hiw-head', start: 'top 85%' },
        opacity: 0, y: 32, duration: 0.8, ease: 'power3.out',
      })
      gsap.from('.lp-step', {
        scrollTrigger: { trigger: '.lp-steps', start: 'top 80%' },
        opacity: 0, y: 24, duration: 0.7, stagger: 0.12, ease: 'power3.out',
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section className="lp-section" id="how-it-works" ref={sectionRef}>
      <div className="lp-wrap">

        <div className="lp-section-head lp-hiw-head">
          <div className="lp-label">
            <span className="lp-label-line" />
            Workflow
          </div>
          <h2 className="lp-h2">
            Three steps,<br />
            <em>every morning.</em>
          </h2>
          <p className="lp-section-sub">
            No new process to learn. DevFlow fits into the way you already work —
            built around developers, not managers.
          </p>
        </div>

        <div className="lp-steps">
          {STEPS.map(({ num, title, desc }) => (
            <div className="lp-step" key={num}>
              <div className="lp-step-num">{num}</div>
              <h3 className="lp-step-title">{title}</h3>
              <p className="lp-step-desc">{desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
