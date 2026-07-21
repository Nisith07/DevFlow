import { motion } from 'framer-motion'
import { CheckSquare, Sparkles, Terminal, GitCommit, Play, Plus } from 'lucide-react'

export default function DashboardPreview() {
  return (
    <section className="lp-section" id="dashboard-preview" style={{ background: '#FAF9F6' }}>
      <div className="lp-wrap">
        
        <div className="lp-section-head lp-center">
          <div className="lp-label">Dashboard</div>
          <h2 className="lp-h2">The command center of your <em>daily workflow</em></h2>
          <p className="lp-section-sub">
            Get a live snapshot of your tasks, commit velocity, and focus metrics in one cohesive, beautiful dashboard.
          </p>
        </div>

        {/* Outer Premium Wrapper for the full screen dashboard mock */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{
            background: '#FFFFFF',
            border: '1px solid var(--lp-border)',
            borderRadius: '24px',
            padding: '32px',
            boxShadow: 'var(--lp-shadow-xl)',
            overflow: 'hidden'
          }}
        >
          {/* Dashboard Frame Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(29, 29, 31, 0.05)', paddingBottom: 16, marginBottom: 24 }}>
            <div style={{ display: 'flex', gap: 6 }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#FF5F56' }} />
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#FFBD2E' }} />
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#27C93F' }} />
            </div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(29, 29, 31, 0.5)' }}>Nisith's Workspace / Today</div>
            <span style={{ width: 20 }} />
          </div>

          {/* Grid Content */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
            
            {/* Left Block: Today's Tasks */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Active Focus List</h4>
                <button style={{ background: 'none', border: 'none', color: 'var(--lp-orange)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 600 }}>
                  <Plus size={14} /> Add task
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { title: 'refactor: Rewrite authentication guards', time: '1.5h', status: 'In Flow' },
                  { title: 'feat: Add analytics visualizer widget', time: '2.0h', status: 'To Do' },
                  { title: 'docs: Update dev setup guide', time: '0.5h', status: 'Completed' }
                ].map((item, idx) => (
                  <div 
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'rgba(29, 29, 31, 0.02)',
                      border: '1px solid rgba(29, 29, 31, 0.04)',
                      padding: '16px 20px',
                      borderRadius: 14,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <CheckSquare size={16} color={item.status === 'Completed' ? 'var(--lp-orange)' : 'rgba(29, 29, 31, 0.3)'} />
                      <span style={{ fontSize: 14, fontWeight: 600, color: item.status === 'Completed' ? 'rgba(29, 29, 31, 0.4)' : 'var(--lp-charcoal)' }}>
                        {item.title}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontSize: 12, color: 'rgba(29, 29, 31, 0.4)', fontFamily: 'var(--font-mono)' }}>{item.time}</span>
                      <span style={{ 
                        fontSize: 11, 
                        fontWeight: 700, 
                        background: item.status === 'In Flow' ? 'rgba(230,126,34,0.1)' : 'rgba(29,29,31,0.05)', 
                        color: item.status === 'In Flow' ? 'var(--lp-orange)' : 'rgba(29,29,31,0.6)',
                        padding: '4px 10px',
                        borderRadius: 20
                      }}>{item.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Block: Commit Log & Focus hours */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              
              {/* Focus Stats widget */}
              <div style={{ background: 'rgba(230, 126, 34, 0.03)', border: '1px solid rgba(230, 126, 34, 0.1)', borderRadius: 16, padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: 'var(--lp-orange)' }}>Focus session</span>
                  <span style={{ background: '#FFFFFF', padding: '2px 8px', borderRadius: 8, fontSize: 10, fontWeight: 700, color: 'var(--lp-orange)' }}>LIVE</span>
                </div>
                <div style={{ fontSize: 24, fontWeight: 800, margin: '8px 0', display: 'flex', alignItems: 'baseline', gap: 4 }}>
                  03:14:45 <span style={{ fontSize: 13, fontWeight: 500, color: 'rgba(29, 29, 31, 0.5)' }}>elapsed</span>
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                  <button style={{ flex: 1, background: 'var(--lp-orange)', border: 'none', borderRadius: 8, color: '#FFFFFF', padding: '8px', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    <Play size={12} fill="#FFF" /> Resume Focus
                  </button>
                </div>
              </div>

              {/* Connected repositories list */}
              <div style={{ background: 'rgba(29, 29, 31, 0.02)', border: '1px solid rgba(29, 29, 31, 0.04)', borderRadius: 16, padding: 18 }}>
                <h5 style={{ fontSize: 12, fontWeight: 700, margin: '0 0 10px 0', textTransform: 'uppercase', color: 'rgba(29, 29, 31, 0.4)' }}>Linked repositories</h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {['devflow-app', 'devflow-api'].map((repo) => (
                    <div key={repo} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600 }}>
                      <Terminal size={14} style={{ color: 'rgba(29, 29, 31, 0.5)' }} /> {repo}
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </motion.div>
        
      </div>
    </section>
  )
}
