import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GitPullRequest, Sparkles, BarChart3, ArrowRight, CheckCircle2 } from 'lucide-react'

export default function Integrations() {
  const [activeTab, setActiveTab] = useState('github')

  const tabs = [
    {
      id: 'github',
      label: 'GitHub Integration',
      icon: GitPullRequest,
      title: 'Automatic Standups from Git Commits',
      description: 'DevFlow parses your commit history directly, filtering out noise, refactoring branches, and draft summaries. Focus on building while DevFlow handles your updates.',
      visual: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, background: '#FFFFFF', padding: 24, borderRadius: 20, border: '1px solid rgba(29, 29, 31, 0.06)', boxShadow: 'var(--lp-shadow-md)' }}>
          <div style={{ borderBottom: '1px solid rgba(29, 29, 31, 0.05)', paddingBottom: 12, marginBottom: 4 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(29, 29, 31, 0.4)', textTransform: 'uppercase' }}>Recent Commits</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { ref: 'a39f02', desc: 'fix(auth): solved jwt expiry token crash', time: '10m ago' },
              { ref: 'c12d45', desc: 'feat(planner): implemented calendar sync integration', time: '1h ago' }
            ].map((c) => (
              <div key={c.ref} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12 }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', background: 'var(--lp-gray)', padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>{c.ref}</span>
                  <span style={{ fontWeight: 500 }}>{c.desc}</span>
                </div>
                <span style={{ color: 'rgba(29, 29, 31, 0.4)' }}>{c.time}</span>
              </div>
            ))}
          </div>
          
          <div style={{ height: 1, background: 'rgba(29, 29, 31, 0.05)', margin: '4px 0' }} />
          
          <div>
            <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--lp-orange)', textTransform: 'uppercase' }}>Standup Draft Compiled</span>
            <p style={{ margin: '6px 0 0 0', fontSize: 12, color: 'rgba(29, 29, 31, 0.65)', lineHeight: 1.4 }}>
              "Fixed validation crashes on JWT middleware and connected the external calendar syncing module."
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'ai',
      label: 'AI Copilot',
      icon: Sparkles,
      title: 'Context-Aware AI Workspace Agent',
      description: 'Ask anything, draft releases, or automate standups. DevFlow reads your locally stored task cards, notes, and repository stats to supply suggestions when you need them.',
      visual: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, background: '#FFFFFF', padding: 24, borderRadius: 20, border: '1px solid rgba(29, 29, 31, 0.06)', boxShadow: 'var(--lp-shadow-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid rgba(29, 29, 31, 0.05)', paddingBottom: 12 }}>
            <Sparkles size={16} color="var(--lp-orange)" />
            <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(29, 29, 31, 0.4)', textTransform: 'uppercase' }}>AI Workspace Analysis</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ background: 'rgba(230, 126, 34, 0.05)', padding: 12, borderRadius: 10, border: '1px solid rgba(230, 126, 34, 0.1)', fontSize: 12, lineHeight: 1.4 }}>
              <span style={{ fontWeight: 700, color: 'var(--lp-orange)' }}>Recommendation:</span> You spend 40% of focus hours debugging auth layers. Let me setup test suites to save time.
            </div>
            <div style={{ background: 'rgba(29, 29, 31, 0.02)', padding: 12, borderRadius: 10, border: '1px solid rgba(29, 29, 31, 0.04)', fontSize: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Generate Standup draft</span>
              <ArrowRight size={13} style={{ color: 'rgba(29,29,31,0.4)' }} />
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'analytics',
      label: 'Flow Analytics',
      icon: BarChart3,
      title: 'Actionable Performance Insights',
      description: 'Track week-by-week milestones, standup frequency, and coding sprint velocity. Understand exactly what factors maximize your flow state and focus blocks.',
      visual: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, background: '#FFFFFF', padding: 24, borderRadius: 20, border: '1px solid rgba(29, 29, 31, 0.06)', boxShadow: 'var(--lp-shadow-md)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(29, 29, 31, 0.05)', paddingBottom: 12 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(29, 29, 31, 0.4)', textTransform: 'uppercase' }}>Weekly Focus Efficiency</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#10B981' }}>+4.2h recovered</span>
          </div>
          
          <div style={{ display: 'flex', height: 100, alignItems: 'flex-end', gap: 10, padding: '10px 0 4px 0' }}>
            {[
              { day: 'Mon', val: 50 },
              { day: 'Tue', val: 70 },
              { day: 'Wed', val: 90 },
              { day: 'Thu', val: 65 },
              { day: 'Fri', val: 80 }
            ].map((d) => (
              <div key={d.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{ width: '100%', height: `${d.val}px`, background: 'rgba(230, 126, 34, 0.2)', borderRadius: 4, transition: 'all 0.5s' }} />
                <span style={{ fontSize: 10, color: 'rgba(29, 29, 31, 0.4)', fontFamily: 'var(--font-mono)' }}>{d.day}</span>
              </div>
            ))}
          </div>
        </div>
      )
    }
  ]

  const active = tabs.find((t) => t.id === activeTab)

  return (
    <section className="lp-section" id="integrations">
      <div className="lp-wrap">
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
          
          {/* Left Block: Info & Selector Tabs */}
          <div>
            <div className="lp-label">Core Modules</div>
            <h2 className="lp-h2" style={{ marginBottom: 24 }}>Everything you need to <em>reclaim</em> your flow</h2>
            <p className="lp-section-sub" style={{ marginBottom: 36 }}>
              DevFlow combines your code repos, automated standups, and developer focus charts into a unified workspace.
            </p>

            {/* Tab Selectors */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {tabs.map((tab) => {
                const TabIcon = tab.icon
                const isSelected = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 16,
                      background: isSelected ? '#FFFFFF' : 'transparent',
                      border: '1px solid',
                      borderColor: isSelected ? 'var(--lp-border)' : 'transparent',
                      borderRadius: 14,
                      padding: '16px 20px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      width: '100%',
                      boxShadow: isSelected ? 'var(--lp-shadow-sm)' : 'none',
                      transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                  >
                    <div style={{ 
                      background: isSelected ? 'rgba(230,126,34,0.1)' : 'var(--lp-gray)', 
                      color: isSelected ? 'var(--lp-orange)' : 'rgba(29,29,31,0.4)',
                      width: 38,
                      height: 38,
                      borderRadius: 10,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.3s'
                    }}>
                      <TabIcon size={18} />
                    </div>
                    <span style={{ fontSize: 15, fontWeight: 700, color: isSelected ? 'var(--lp-charcoal)' : 'rgba(29,29,31,0.6)' }}>
                      {tab.label}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Right Block: Animated Tab Visuals */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                style={{ width: '100%', maxWidth: '420px' }}
              >
                <div style={{ marginBottom: 20 }}>
                  <h3 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 10px 0' }}>{active.title}</h3>
                  <p style={{ fontSize: 14.5, color: 'rgba(29,29,31,0.6)', margin: 0, lineHeight: 1.5 }}>{active.description}</p>
                </div>
                {active.visual}
              </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  )
}
