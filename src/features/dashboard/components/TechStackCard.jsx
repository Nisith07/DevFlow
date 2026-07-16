import { Layers, ArrowRight } from 'lucide-react'

// Technology entries — icon is an emoji/text glyph for zero-dependency rendering
// In production, swap these with actual SVG icon components (e.g. react-icons/si)
const TECH_STACK = [
  { id: 'react',      label: 'React',       icon: '⚛️',  color: '#61DAFB', tooltip: 'React 18' },
  { id: 'javascript', label: 'JavaScript',  icon: 'JS',  color: '#F7DF1E', tooltip: 'ES2024' },
  { id: 'nodejs',     label: 'Node.js',     icon: '⬡',   color: '#339933', tooltip: 'Node.js 20' },
  { id: 'express',    label: 'Express',     icon: 'ex',  color: '#ffffff', tooltip: 'Express.js' },
  { id: 'mongodb',    label: 'MongoDB',     icon: '🍃',  color: '#47A248', tooltip: 'MongoDB' },
  { id: 'java',       label: 'Java',        icon: '☕',  color: '#f89820', tooltip: 'Java 17' },
  { id: 'spring',     label: 'Spring Boot', icon: '🌱',  color: '#6DB33F', tooltip: 'Spring Boot 3' },
  { id: 'sql',        label: 'SQL',         icon: '🗄️',  color: '#336791', tooltip: 'PostgreSQL / MySQL' },
  { id: 'html',       label: 'HTML5',       icon: '📄',  color: '#E34F26', tooltip: 'HTML5' },
  { id: 'css',        label: 'CSS3',        icon: '🎨',  color: '#1572B6', tooltip: 'CSS3 / SCSS' },
  { id: 'git',        label: 'Git',         icon: '🔀',  color: '#F05032', tooltip: 'Git & Version Control' },
  { id: 'github',     label: 'GitHub',      icon: '🐙',  color: '#ffffff', tooltip: 'GitHub' },
]

export default function TechStackCard() {
  return (
    <div className="card" id="tech-stack-card">
      <div className="card-head">
        <h2 className="card-title">
          <Layers size={13} className="card-title-icon" />
          Tech Stack
          <span style={{ color: 'var(--color-app-faint)', fontWeight: 400 }}>
            Technologies I work with
          </span>
        </h2>
        <button
          className="card-link-btn"
          id="view-all-technologies-btn"
          aria-label="View all technologies"
        >
          View All
          <ArrowRight size={12} />
        </button>
      </div>

      <div className="tech-grid">
        {TECH_STACK.map(({ id, label, icon, color, tooltip }) => (
          <div
            key={id}
            className="tech-item"
            id={`tech-${id}`}
            role="button"
            tabIndex={0}
            aria-label={tooltip}
          >
            <div
              className="tech-icon-wrap"
              style={{ color, fontSize: typeof icon === 'string' && icon.length <= 2 ? 14 : 20 }}
            >
              {icon}
            </div>
            <span className="tech-label">{label}</span>
            <div className="tech-tooltip">{tooltip}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
