import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

const RELEASES = [
  {
    version: 'v2.8.0',
    date: 'July 2026',
    title: 'Ultra-Glossy UI & Streamlined 5-Step Onboarding',
    tag: 'Latest Release',
    items: [
      'Redesigned onboarding flow — reduced from 9 steps to 5 fast personalized steps.',
      'Floating glassmorphism navigation dock with Apple/Framer specular reflections.',
      'Self-contained dark-mode theme variables for standalone route compatibility.',
      'Interactive adaptive custom cursor with dark-container auto-inversion.'
    ]
  },
  {
    version: 'v2.7.0',
    date: 'June 2026',
    title: 'Team Hub Beta & Live Standup Rooms',
    tag: 'Feature Update',
    items: [
      'Jira-style pod workload monitoring and member task progress tracking.',
      'Real-time team channel chat and live video standup room controls.',
      'Built-in architecture whiteboard canvas with PNG export capabilities.'
    ]
  },
  {
    version: 'v2.5.0',
    date: 'May 2026',
    title: 'AI Pair Copilot & Automated Commit Parsing',
    tag: 'AI Release',
    items: [
      'Automatic local commit hash parsing to draft morning standups instantly.',
      'Personalized AI tone customization (Friendly, Sharp, In-Depth).',
      'Pomodoro focus mode timer with auto-synced daily streak analytics.'
    ]
  }
]

export default function Changelog() {
  return (
    <section className="lp-section" id="changelog" style={{ background: '#FCFAF7' }}>
      <div className="lp-wrap">
        
        <div className="lp-section-head lp-center">
          <div className="lp-label" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={12} color="#E67E22" /> CHANGELOG & UPDATES
          </div>
          <h2 className="lp-h2">What's <em>New</em> in DevFlow</h2>
          <p className="lp-section-sub">
            Continuous improvements, features, and performance enhancements shipped to DevFlow.
          </p>
        </div>

        <div style={{ maxWidth: '820px', margin: '40px auto 0', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {RELEASES.map((rel, idx) => (
            <motion.div
              key={rel.version}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              style={{
                background: '#FFFFFF',
                border: '1px solid rgba(29, 29, 31, 0.08)',
                borderRadius: '20px',
                padding: '28px 32px',
                boxShadow: '0 8px 30px rgba(29, 29, 31, 0.04)',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '800', fontFamily: 'var(--font-mono)', color: '#E67E22', background: 'rgba(230,126,34,0.1)', padding: '3px 10px', borderRadius: '8px' }}>
                    {rel.version}
                  </span>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: 'rgba(29,29,31,0.5)' }}>{rel.date}</span>
                </div>
                <span style={{ fontSize: '11px', fontWeight: '700', color: '#10B981', background: 'rgba(16,185,129,0.1)', padding: '3px 10px', borderRadius: '12px' }}>
                  {rel.tag}
                </span>
              </div>

              <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1D1D1F', margin: '0 0 14px', letterSpacing: '-0.3px' }}>
                {rel.title}
              </h3>

              <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {rel.items.map((item, i) => (
                  <li key={i} style={{ fontSize: '13.5px', color: 'rgba(29,29,31,0.7)', lineHeight: 1.5 }}>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
