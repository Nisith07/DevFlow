import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

const REVIEWS = [
  {
    quote: "DevFlow completely automated my team's morning standup routines. I recovered at least 4 focus hours per week without changing anything about how I code.",
    name: 'Alex Rivera',
    role: 'Senior Staff Engineer, Vercel',
    initials: 'AR',
  },
  {
    quote: "The GitHub integration is flawless. It notes exactly what files and features I touched to draft clean daily updates. Finally a tool that respects my time.",
    name: 'Sarah Chen',
    role: 'Tech Lead, Notion',
    initials: 'SC',
  },
  {
    quote: "Minimalist, beautiful, and extremely fast. Finally a developer workflow tool designed by people who actually write code, not by product managers.",
    name: 'Marcus Webb',
    role: 'Founding Engineer, Linear',
    initials: 'MW',
  },
]

export default function Testimonials() {
  return (
    <section className="lp-section" id="testimonials">
      <div className="lp-wrap">

        <div className="lp-section-head lp-center">
          <div className="lp-label">Testimonials</div>
          <h2 className="lp-h2">Loved by <em>world-class</em> engineers</h2>
          <p className="lp-section-sub">
            See how top-performing developers optimize their focus and daily standups using DevFlow.
          </p>
        </div>

        <div className="lp-testimonials-grid">
          {REVIEWS.map((review, idx) => (
            <motion.div
              key={idx}
              className="lp-testimonial-card"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: idx * 0.14, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Stars */}
              <div className="lp-testimonial-stars">
                {[...Array(5)].map((_, i) => <Star key={i} size={13} fill="currentColor" />)}
              </div>

              <p className="lp-testimonial-quote">"{review.quote}"</p>

              <div className="lp-testimonial-author">
                <div className="lp-testimonial-avatar">{review.initials}</div>
                <div>
                  <div className="lp-testimonial-name">{review.name}</div>
                  <div className="lp-testimonial-role">{review.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
