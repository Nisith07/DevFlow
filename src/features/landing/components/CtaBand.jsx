import { ArrowRight, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

export default function CtaBand({ onLoginClick }) {
  return (
    <section className="lp-section">
      <div className="lp-wrap">
        <motion.div
          className="lp-cta-band"
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="lp-cta-glow" />

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(230, 126, 34, 0.08)', padding: '6px 14px', borderRadius: 100, marginBottom: 20, color: 'var(--lp-orange)', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', position: 'relative', zIndex: 5 }}>
            <Sparkles size={13} /> Try DevFlow Today
          </div>

          <h2 className="lp-cta-title">
            Ready to start your day<br />with absolute clarity?
          </h2>

          <p className="lp-cta-sub">
            Join thousands of developers shipping faster with automated morning standups. Free for individuals, no card required.
          </p>

          <motion.button
            className="lp-btn lp-btn-primary"
            onClick={onLoginClick}
            style={{ padding: '14px 32px', fontSize: '15px', position: 'relative', zIndex: 5 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            Get Started Free <ArrowRight size={16} />
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
