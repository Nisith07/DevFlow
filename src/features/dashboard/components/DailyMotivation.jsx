import { Quote } from 'lucide-react'

const QUOTE = {
  text: 'Code is like humor. When you have to explain it, it\'s bad.',
  author: 'Cory House',
}

export default function DailyMotivation() {
  return (
    <div className="motivation-card" id="daily-motivation-card" role="complementary" aria-label="Daily motivation quote">
      <Quote size={20} className="motivation-quote-icon" aria-hidden="true" />
      <div className="motivation-text">
        <p className="motivation-quote">"{QUOTE.text}"</p>
        <span className="motivation-author">— {QUOTE.author}</span>
      </div>
    </div>
  )
}
