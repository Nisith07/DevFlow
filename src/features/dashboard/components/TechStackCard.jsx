import { Layers } from 'lucide-react'

const TECH_STACK = [
  { id: 'react',      label: 'React',       icon: '⚛️',  color: '#61DAFB' },
  { id: 'javascript', label: 'JS',          icon: '⚡',  color: '#F7DF1E' },
  { id: 'nodejs',     label: 'Node',        icon: '⬡',   color: '#339933' },
  { id: 'mongodb',    label: 'MongoDB',     icon: '🍃',  color: '#47A248' },
  { id: 'java',       label: 'Java',        icon: '☕',  color: '#f89820' },
  { id: 'spring',     label: 'Spring',      icon: '🌱',  color: '#6DB33F' },
  { id: 'sql',        label: 'SQL',         icon: '🗄️',  color: '#336791' },
  { id: 'git',        label: 'Git',         icon: '🔀',  color: '#F05032' },
]

export default function TechStackCard() {
  return (
    <div className="card" id="tech-stack-card" style={{ flex: '0.9', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
      <div className="card-head">
        <h2 className="card-title">
          <Layers size={14} className="card-title-icon" />
          Tech Stack
        </h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', flex: 1, minHeight: 0, overflow: 'hidden', alignContent: 'center' }}>
        {TECH_STACK.map(({ id, label, icon, color }) => (
          <div
            key={id}
            className="tech-item neu-inset"
            id={`tech-${id}`}
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              padding: '6px 4px',
              borderRadius: '6px',
              cursor: 'default',
              boxShadow: 'var(--neu-shadow-inset-sm)'
            }}
          >
            <span style={{ color, fontSize: '13px', display: 'flex', alignItems: 'center' }}>{icon}</span>
            <span className="tech-label" style={{ fontSize: '10.5px', color: 'var(--color-app-text)', fontWeight: 600 }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
