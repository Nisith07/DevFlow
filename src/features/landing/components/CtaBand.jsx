import { ArrowRight, Eye } from 'lucide-react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

export default function CtaBand({ onLoginClick }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section className="lp-cta-section" ref={ref}>
      <div className="lp-wrap">
        <motion.div
          className="lp-cta-inner"
          initial={{ opacity: 0, y: 32, scale: 0.97 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="lp-cta-glow" />

          {/* Rocket icon */}
          <motion.div
            className="lp-cta-rocket"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            🚀
          </motion.div>

          {/* Copy */}
          <div className="lp-cta-copy">
            <h2 className="lp-cta-title">
              Start your day with clarity.<br />
              End your day with progress.
            </h2>
            <p className="lp-cta-sub">
              Join thousands of developers shipping faster with automated morning standups. Free for individuals, no card required.
            </p>
          </div>

          {/* Actions */}
          <div className="lp-cta-actions">
            <motion.button
              className="lp-btn lp-btn-primary"
              onClick={onLoginClick}
              style={{ padding: '13px 28px', fontSize: 14.5 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              Start Free <ArrowRight size={15} />
            </motion.button>
            <motion.a
              href="#how-it-works"
              className="lp-btn lp-btn-secondary"
              onClick={e => { e.preventDefault(); document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' }) }}
              style={{ padding: '13px 24px', fontSize: 14.5 }}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              <Eye size={15} />
              See How It Works
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
