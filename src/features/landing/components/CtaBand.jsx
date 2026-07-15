import { ArrowRight } from 'lucide-react'

export default function CtaBand({ onLoginClick }) {
  return (
    <section className="lp-section" id="blog" style={{ paddingTop: 0 }}>
      <div className="lp-wrap">
        <div className="lp-cta-band reveal">
          <h2>Start tomorrow morning with a plan.</h2>
          <p>Free for solo developers. No credit card required.</p>
          <button className="lp-btn lp-btn-primary" onClick={onLoginClick}>
            Get Started Free <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  )
}
