import { PRIORITIES } from '@/shared/constants/priorities'
import { AlertCircle } from 'lucide-react'

/**
 * @param {{ priority: string, showLabel?: boolean }} props
 */
export default function PriorityBadge({ priority, showLabel = false }) {
  const info = PRIORITIES[priority] ?? PRIORITIES.none
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        fontSize: 11,
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        color: info.color,
        background: info.bg,
        padding: '3px 8px',
        borderRadius: 12,
        whiteSpace: 'nowrap',
      }}
    >
      <AlertCircle size={11} aria-hidden="true" />
      {showLabel && info.label}
    </span>
  )
}
