/**
 * Task priority levels — single source of truth used by both UI and API.
 */
export const PRIORITIES = {
  urgent: { label: 'Urgent', color: 'var(--color-priority-urgent)', bg: '#3D1515' },
  high:   { label: 'High',   color: 'var(--color-priority-high)',   bg: '#3D2010' },
  medium: { label: 'Medium', color: 'var(--color-priority-medium)', bg: '#3D3010' },
  low:    { label: 'Low',    color: 'var(--color-priority-low)',    bg: '#103D18' },
  none:   { label: 'None',   color: 'var(--color-priority-none)',   bg: '#1B1F26' },
}

export const PRIORITY_ORDER = ['urgent', 'high', 'medium', 'low', 'none']
