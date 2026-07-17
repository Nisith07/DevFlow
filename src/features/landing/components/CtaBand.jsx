import { ArrowRight } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function CtaBand({ onLoginClick }) {
  const ref = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(ref.current.children, {
        scrollTrigger: { trigger: ref.current, start: 'top 82%' },
        opacity: 0,
        y: 28,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out',
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <section className="lp-section" style={{ paddingBottom: 0 }}>
      <div className="lp-wrap">
        <div className="lp-cta-band" ref={ref}>
          <h2 className="lp-cta-title">
            Start tomorrow morning<br />with a plan.
          </h2>
          <p className="lp-cta-sub">
            Free for solo developers. No credit card required.
          </p>
          <button
            className="lp-btn lp-btn-primary"
            data-cursor="cta"
            onClick={onLoginClick}
            style={{ padding: '12px 28px', fontSize: '15px' }}
          >
            Get Started Free <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  )
}
