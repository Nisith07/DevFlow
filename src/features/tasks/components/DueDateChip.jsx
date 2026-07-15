import { Calendar } from 'lucide-react'
import { formatDate } from '@/shared/lib/utils'

/**
 * @param {{ dueDate: string | Date | null | undefined }} props
 */
export default function DueDateChip({ dueDate }) {
  if (!dueDate) return null

  const date     = new Date(dueDate)
  const now      = new Date()
  const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const diff     = Math.floor((date - midnight) / (1000 * 60 * 60 * 24))

  let color  = 'var(--color-app-faint)'
  let label  = formatDate(dueDate, { month: 'short', day: 'numeric' })

  if (diff < 0)      { color = 'var(--color-danger)';  label = 'Overdue' }
  else if (diff === 0) { color = 'var(--color-amber)';   label = 'Due today' }
  else if (diff === 1) { color = 'var(--color-amber)';   label = 'Due tomorrow' }

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        fontSize: 11,
        color,
        fontWeight: diff <= 1 ? 600 : 400,
        whiteSpace: 'nowrap',
      }}
    >
      <Calendar size={11} aria-hidden="true" />
      {label}
    </span>
  )
}
