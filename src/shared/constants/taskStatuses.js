/**
 * Task status definitions — single source of truth for status labels and styling.
 */
export const TASK_STATUSES = {
  todo:        { label: 'To Do',      color: '#565D6B', bg: '#1B1F26' },
  in_progress: { label: 'In Progress', color: '#4FB8A8', bg: '#1D3A35' },
  in_review:   { label: 'In Review',  color: '#A78BFA', bg: '#2A1F3D' },
  done:        { label: 'Done',       color: '#4CAF50', bg: '#1A3320' },
  cancelled:   { label: 'Cancelled',  color: '#E2574C', bg: '#3D2220' },
}

export const STATUS_ORDER = ['todo', 'in_progress', 'in_review', 'done', 'cancelled']

/**
 * Project status definitions.
 */
export const PROJECT_STATUSES = {
  active:    { label: 'Active',    color: '#4FB8A8' },
  paused:    { label: 'Paused',    color: '#E8A33D' },
  completed: { label: 'Completed', color: '#4CAF50' },
  archived:  { label: 'Archived',  color: '#565D6B' },
}
