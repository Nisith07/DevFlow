import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

const FAQ_ITEMS = [
  {
    question: "How does the GitHub integration work?",
    answer: "DevFlow uses secure read-only GitHub OAuth access to parse your commit hashes, pull request names, and branch merges locally. It extracts the commit messages and changesets to build standup drafts without ever reading your actual codebase files."
  },
  {
    question: "Is my commit data shared or stored on external servers?",
    answer: "No. Your security is our highest priority. All code summaries, local logs, and calendar items are processed on-the-fly and stored locally in your browser. We never save or train models on your proprietary repository commits."
  },
  {
    question: "Can I use DevFlow with multiple calendars or workspaces?",
    answer: "Yes, the Pro and Team plans support linking multiple calendars (Google Workspace, Outlook) and connecting to multiple distinct repository spaces so your entire schedule remains synced."
  },
  {
    question: "Do you offer custom SLA or self-hosted options?",
    answer: "We support self-hosted deployments and custom SLAs for enterprise clients with more than 50 seats. Please reach out to our team via the sales tier option."
  }
]

export default function Faq() {
  const [openIdx, setOpenIdx] = useState(null)

  const toggle = (idx) => {
    setOpenIdx(openIdx === idx ? null : idx)
  }

  return (
    <section className="lp-section" id="faq" style={{ background: '#FAF9F6' }}>
      <div className="lp-wrap">
        
        <div className="lp-section-head lp-center">
          <div className="lp-label">FAQ</div>
          <h2 className="lp-h2">Frequently Asked <em>Questions</em></h2>
          <p className="lp-section-sub">
            Everything you need to know about security, git access levels, and workspace capabilities.
          </p>
        </div>

        <div className="lp-faq-container">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIdx === idx
            return (
              <div className="lp-faq-item" key={idx}>
                <button 
                  className="lp-faq-trigger" 
                  onClick={() => toggle(idx)}
                >
                  <span>{item.question}</span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <ChevronDown size={18} style={{ color: 'rgba(29, 29, 31, 0.4)' }} />
                  </motion.div>
                </button>
                
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      <div className="lp-faq-content">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
