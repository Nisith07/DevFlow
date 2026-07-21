import { useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { ArrowRight, Sparkles, Bot } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

/* ─── Cute SVG Robot Mascot ─── */
function RobotMascot() {
  return (
    <svg
      width="180"
      height="200"
      viewBox="0 0 180 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Body */}
      <rect x="30" y="90" width="120" height="90" rx="24" fill="#fff" stroke="rgba(29,29,31,0.08)" strokeWidth="1.5" />
      {/* Body sheen */}
      <rect x="38" y="98" width="36" height="6" rx="3" fill="rgba(230,126,34,0.12)" />
      {/* Head */}
      <rect x="40" y="18" width="100" height="80" rx="22" fill="#fff" stroke="rgba(29,29,31,0.08)" strokeWidth="1.5" />
      {/* Antenna base */}
      <rect x="86" y="4" width="8" height="20" rx="4" fill="rgba(230,126,34,0.3)" />
      {/* Antenna tip */}
      <circle cx="90" cy="4" r="5" fill="var(--lp-orange)" />
      <circle cx="90" cy="4" r="3" fill="rgba(255,255,255,0.6)" />
      {/* Eyes */}
      <rect x="54" y="36" width="26" height="22" rx="8" fill="rgba(230,126,34,0.1)" />
      <circle cx="67" cy="47" r="7" fill="var(--lp-orange)" />
      <circle cx="67" cy="47" r="4" fill="#1D1D1F" />
      <circle cx="69" cy="45" r="1.5" fill="#fff" />
      <rect x="100" y="36" width="26" height="22" rx="8" fill="rgba(230,126,34,0.1)" />
      <circle cx="113" cy="47" r="7" fill="var(--lp-orange)" />
      <circle cx="113" cy="47" r="4" fill="#1D1D1F" />
      <circle cx="115" cy="45" r="1.5" fill="#fff" />
      {/* Smile */}
      <path d="M72 72 Q90 82 108 72" stroke="rgba(29,29,31,0.25)" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* Cheek blush */}
      <ellipse cx="56" cy="67" rx="8" ry="5" fill="rgba(230,126,34,0.15)" />
      <ellipse cx="124" cy="67" rx="8" ry="5" fill="rgba(230,126,34,0.15)" />
      {/* Neck */}
      <rect x="78" y="96" width="24" height="8" rx="4" fill="rgba(29,29,31,0.06)" />
      {/* Body details */}
      <rect x="50" y="116" width="80" height="40" rx="12" fill="rgba(230,126,34,0.06)" stroke="rgba(230,126,34,0.12)" strokeWidth="1" />
      {/* Chest screen */}
      <rect x="58" y="124" width="64" height="24" rx="7" fill="rgba(230,126,34,0.08)" />
      <rect x="64" y="130" width="20" height="3" rx="1.5" fill="rgba(230,126,34,0.4)" />
      <rect x="64" y="136" width="32" height="3" rx="1.5" fill="rgba(230,126,34,0.25)" />
      <rect x="64" y="142" width="14" height="3" rx="1.5" fill="rgba(230,126,34,0.2)" />
      {/* Arms */}
      <rect x="2" y="100" width="30" height="14" rx="7" fill="#fff" stroke="rgba(29,29,31,0.08)" strokeWidth="1.5" />
      <rect x="148" y="100" width="30" height="14" rx="7" fill="#fff" stroke="rgba(29,29,31,0.08)" strokeWidth="1.5" />
      {/* Hands */}
      <circle cx="8" cy="107" r="7" fill="rgba(230,126,34,0.15)" stroke="rgba(230,126,34,0.2)" strokeWidth="1" />
      <circle cx="172" cy="107" r="7" fill="rgba(230,126,34,0.15)" stroke="rgba(230,126,34,0.2)" strokeWidth="1" />
      {/* Legs */}
      <rect x="55" y="176" width="26" height="20" rx="8" fill="#fff" stroke="rgba(29,29,31,0.08)" strokeWidth="1.5" />
      <rect x="99" y="176" width="26" height="20" rx="8" fill="#fff" stroke="rgba(29,29,31,0.08)" strokeWidth="1.5" />
      {/* Feet */}
      <rect x="50" y="192" width="34" height="8" rx="4" fill="rgba(230,126,34,0.2)" />
      <rect x="96" y="192" width="34" height="8" rx="4" fill="rgba(230,126,34,0.2)" />
    </svg>
  )
}

/* ─── AI Copilot Chat UI ─── */
function CopilotPanel() {
  const messages = [
    { type: 'ai', text: 'Found 3 improvements for your code.' },
    { type: 'ai', text: 'Optimize AI response time by caching prompt results.' },
    { type: 'user', text: 'Refactor authentication page' },
    { type: 'ai', text: 'Add more boundary checks' },
  ]

  const suggestions = [
    'Audit AI Suggestions',
    'Generate daily standup',
    'Review PR recommendations',
  ]

  return (
    <div className="lp-ai-chat">
      <div className="lp-ai-chat-header">
        <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg,#E67E22,#F0A050)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Sparkles size={14} color="#fff" />
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--lp-charcoal)' }}>DevFlow Copilot</div>
          <div style={{ fontSize: 10, color: 'rgba(29,29,31,0.4)' }}>AI-powered workspace assistant</div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 600, color: '#22c55e' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'block' }} />
          Online
        </div>
      </div>

      <div className="lp-ai-chat-body">
        {messages.map((m, i) => (
          <motion.div
            key={i}
            className={`lp-ai-msg ${m.type}`}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 + i * 0.12, duration: 0.4 }}
          >
            {m.text}
          </motion.div>
        ))}
      </div>

      <div className="lp-ai-suggestions">
        {suggestions.map((s, i) => (
          <motion.div
            key={s}
            className="lp-ai-suggestion-item"
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 + i * 0.1, duration: 0.4 }}
          >
            <span>{s}</span>
            <ArrowRight size={13} color="rgba(29,29,31,0.3)" />
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default function Integrations() {
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true, margin: '-80px' })
  const navigate = useNavigate()

  return (
    <section className="lp-ai-section" id="ai-copilot" ref={containerRef} style={{ background: 'var(--lp-gray)' }}>
      <div className="lp-wrap">
        <div className="lp-ai-grid">

          {/* Left: copy + chat UI */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="lp-label">
              <Bot size={12} />
              AI Copilot
            </div>
            <h2 className="lp-h2" style={{ marginBottom: 16 }}>
              Your AI pair that<br />
              <em>works 24/7</em>
            </h2>
            <p className="lp-section-sub" style={{ marginBottom: 36 }}>
              DevFlow Copilot understands your codebase, suggests improvements, and keeps you moving forward — around the clock.
            </p>

            <CopilotPanel />

            <motion.button
              onClick={() => navigate('/ai')}
              className="lp-btn lp-btn-primary"
              style={{ marginTop: 24, display: 'inline-flex', padding: '12px 24px', fontSize: 14 }}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              Explore AI Copilot <ArrowRight size={14} />
            </motion.button>
          </motion.div>

          {/* Right: Robot mascot */}
          <motion.div
            className="lp-robot-wrap"
            initial={{ opacity: 0, x: 32 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Orbit ring */}
            <div className="lp-robot-orbit">
              <div className="lp-robot-orbit-dot" />
            </div>
            {/* Second orbit */}
            <div className="lp-robot-orbit" style={{ width: 320, height: 320, animationDuration: '22s', animationDirection: 'reverse', borderColor: 'rgba(230,126,34,0.1)' }}>
              <div className="lp-robot-orbit-dot" style={{ width: 6, height: 6, background: 'rgba(230,126,34,0.5)', boxShadow: 'none', top: -3 }} />
            </div>

            {/* Sparkle particles */}
            {[
              { top: '15%', left: '20%', delay: 0 },
              { top: '70%', left: '15%', delay: 0.8 },
              { top: '25%', right: '18%', delay: 1.6 },
              { top: '65%', right: '22%', delay: 0.4 },
            ].map((pos, i) => (
              <motion.div
                key={i}
                style={{ position: 'absolute', ...pos }}
                animate={{ scale: [0.6, 1, 0.6], opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2.5 + i * 0.4, repeat: Infinity, delay: pos.delay }}
              >
                <Sparkles size={14} color="rgba(230,126,34,0.6)" />
              </motion.div>
            ))}

            {/* Robot */}
            <div className="lp-robot">
              <RobotMascot />
            </div>
            {/* Soft glow */}
            <div className="lp-robot-glow" />
          </motion.div>

        </div>
      </div>
    </section>
  )
}
