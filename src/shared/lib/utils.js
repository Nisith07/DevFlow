import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge Tailwind class names safely (shadcn/ui pattern).
 * @param  {...any} inputs
 * @returns {string}
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

/**
 * Format a Date (or ISO string) as a human-friendly date.
 * @param {Date|string} date
 * @param {Intl.DateTimeFormatOptions} [opts]
 * @returns {string}
 */
export function formatDate(date, opts = { year: 'numeric', month: 'short', day: 'numeric' }) {
  if (!date) return ''
  return new Intl.DateTimeFormat(undefined, opts).format(new Date(date))
}

/**
 * Return the user's local date at midnight as a UTC-normalised Date.
 * Used for planner day comparisons.
 * @param {Date|string} [date=new Date()]
 * @returns {Date}
 */
export function toMidnightUTC(date = new Date()) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

/**
 * Get initials from a name string (up to 2 chars).
 * @param {string} name
 * @returns {string}
 */
export function getInitials(name = '') {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

/**
 * Relative time label (e.g. "2 hours ago", "just now").
 * @param {Date|string} date
 * @returns {string}
 */
export function relativeTime(date) {
  const now = Date.now()
  const ms  = now - new Date(date).getTime()
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours   = Math.floor(minutes / 60)
  const days    = Math.floor(hours / 24)

  if (seconds < 60)  return 'just now'
  if (minutes < 60)  return `${minutes}m ago`
  if (hours   < 24)  return `${hours}h ago`
  if (days    < 7)   return `${days}d ago`
  return formatDate(date, { month: 'short', day: 'numeric' })
}

/**
 * Pad a number to 2 digits.
 * @param {number} n
 * @returns {string}
 */
export function pad(n) {
  return n.toString().padStart(2, '0')
}

/**
 * Format seconds as HH:MM:SS
 * @param {number} totalSeconds
 * @returns {string}
 */
export function formatTimer(totalSeconds) {
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  return `${pad(h)}:${pad(m)}:${pad(s)}`
}
