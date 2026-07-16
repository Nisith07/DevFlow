import { Layers } from 'lucide-react'

const TECH_STACK = [
  { id: 'react',      label: 'React',       icon: '⚛️',  color: '#61DAFB' },
  { id: 'javascript', label: 'JS',          icon: 'JS',  color: '#F7DF1E' },
  { id: 'nodejs',     label: 'Node',        icon: '⬡',   color: '#339933' },
  { id: 'mongodb',    label: 'MongoDB',     icon: '🍃',  color: '#47A248' },
  { id: 'java',       label: 'Java',        icon: '☕',  color: '#f89820' },
  { id: 'spring',     label: 'Spring',      icon: '🌱',  color: '#6DB33F' },
  { id: 'sql',        label: 'SQL',         icon: '🗄️',  color: '#336791' },
  { id: 'git',        label: 'Git',         icon: '🔀',  color: '#F05032' },
]

export default function TechStackCard() {
  return (
    <div className="card" id="tech-stack-card" style={{ flex: '1', minHeight: 0, display: 'flex', flexDirection: 'column', padding: '10px 12px !important' }}>
      <div className="card-head" style={{ marginBottom: '6px' }}>
        <h2 className="card-title" style={{ fontSize: '13px' }}>
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
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '6px 4px',
              borderRadius: '6px',
              cursor: 'default',
              boxShadow: 'var(--neu-shadow-inset-sm)'
            }}
          >
            <div
              style={{
                color,
                fontSize: '14px',
                fontWeight: 'bold',
                lineHeight: '1.2',
                marginBottom: '2px'
              }}
            >
              {icon}
            </div>
            <span className="tech-label" style={{ fontSize: '10px', color: 'var(--color-app-text)', fontWeight: 500 }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
