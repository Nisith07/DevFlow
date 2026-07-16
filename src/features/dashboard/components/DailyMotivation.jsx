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
        flexShrink: 0,
      }}
    >
      <Quote size={12} style={{ color: 'var(--color-violet-bright)', flexShrink: 0 }} />
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
        "{QUOTE.text}"
      </span>
      <span style={{ flexShrink: 0, fontStyle: 'italic' }}>
        — {QUOTE.author}
      </span>
    </div>
  )
}
