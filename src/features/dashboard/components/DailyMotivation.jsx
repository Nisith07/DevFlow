import { Quote } from 'lucide-react'

const QUOTE = {
  text: 'Code is like humor. When you have to explain it, it\'s bad.',
  author: 'Cory House',
}

export default function DailyMotivation() {
  return (
    <div
      className="card"
      id="daily-motivation-card"
      role="complementary"
      aria-label="Daily motivation quote"
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: '8px',
        padding: '6px 12px !important',
        height: '32px',
        flexShrink: 0,
        boxShadow: 'var(--shadow-card-val)'
      }}
    >
      <Quote size={12} style={{ color: 'var(--color-violet-bright)', flexShrink: 0 }} />
      <span style={{ fontSize: '11px', color: 'var(--color-app-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
        "{QUOTE.text}"
      </span>
      <span style={{ fontSize: '10.5px', color: 'var(--color-app-faint)', fontStyle: 'italic', flexShrink: 0 }}>
        — {QUOTE.author}
      </span>
    </div>
  )
}
