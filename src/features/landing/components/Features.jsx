import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  Layers, CheckSquare, Sparkles, GitMerge,
  BarChart2, Clock, Users
} from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const FEATURES = [
  {
    icon: Layers,
    title: 'Project Management',
    desc: 'Organise work into structured projects. Set milestones, track lifecycle stages, and see your entire portfolio at a glance.',
  },
  {
    icon: CheckSquare,
    title: 'Task Boards',
    desc: 'Kanban-style task management with priorities, subtasks, and drag-and-drop. No ceremony, just flow.',
  },
  {
    icon: Sparkles,
    title: 'AI Copilot',
    desc: 'Ask your workspace anything. The AI reads your tasks, commits, and notes to surface insights and handle busy-work for you.',
  },
  {
    icon: GitMerge,
    title: 'GitHub Integration',
    desc: 'Commit history auto-populates your daily standup. Pull requests, branches, and activity — all surfaced in context.',
  },
  {
    icon: Clock,
    title: 'Daily Planner',
    desc: 'Time-block your day in minutes. Focus timers link directly to tasks so your hours are always accounted for.',
  },
  {
    icon: BarChart2,
    title: 'Analytics',
    desc: 'See how time is actually spent. Weekly completion rates, streak tracking, and project velocity at a glance.',
  },
]

export default function Features() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Section heading reveal
      gsap.from('.lp-features-head', {
        scrollTrigger: {
          trigger: '.lp-features-head',
          start: 'top 85%',
        },
        opacity: 0,
        y: 36,
        duration: 0.8,
        ease: 'power3.out',
      })

      // Feature items stagger
      gsap.from('.lp-feature-item', {
        scrollTrigger: {
          trigger: '.lp-features-grid',
          start: 'top 80%',
        },
        opacity: 0,
        y: 28,
        duration: 0.65,
        stagger: 0.07,
        ease: 'power3.out',
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section className="lp-section" id="features" ref={sectionRef}>
      <div className="lp-wrap">

        <div className="lp-section-head lp-features-head">
          <div className="lp-label">
            <span className="lp-label-line" />
            Capabilities
          </div>
          <h2 className="lp-h2">
            Everything you need.<br />
            <em>Nothing you don't.</em>
          </h2>
          <p className="lp-section-sub">
            One workspace that replaces five tabs. DevFlow is built around
            the way developers actually work — not enterprise ticket systems.
          </p>
        </div>

        <div className="lp-features-grid">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div className="lp-feature-item" key={title}>
              <div className="lp-feature-icon">
                <Icon size={18} />
              </div>
              <h3 className="lp-feature-title">{title}</h3>
              <p className="lp-feature-desc">{desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
