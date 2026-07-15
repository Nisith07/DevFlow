import { useRef, useCallback } from 'react'
import {
  CheckCircle2, PlusCircle, Trash2, FolderPlus,
  FileText, Activity, RefreshCcw, LoaderCircle
} from 'lucide-react'
import PageHeader from '@/shared/components/PageHeader'
import { useActivity } from './hooks/useActivity'
import { relativeTime } from '@/shared/lib/utils'
import LoadingSpinner from '@/shared/components/LoadingSpinner'
import EmptyState from '@/shared/components/EmptyState'

const ACTION_CONFIG = {
  task_created:       { icon: PlusCircle,    color: 'var(--color-teal)',             label: 'Created task' },
  task_completed:     { icon: CheckCircle2,  color: 'var(--color-priority-low)',     label: 'Completed task' },
  task_updated:       { icon: RefreshCcw,    color: 'var(--color-amber)',            label: 'Updated task' },
  task_deleted:       { icon: Trash2,        color: 'var(--color-danger)',           label: 'Deleted task' },
  project_created:    { icon: FolderPlus,    color: 'var(--color-teal)',             label: 'Created project' },
  project_updated:    { icon: RefreshCcw,    color: 'var(--color-amber)',            label: 'Updated project' },
  project_deleted:    { icon: Trash2,        color: 'var(--color-danger)',           label: 'Deleted project' },
  note_created:       { icon: FileText,      color: 'var(--color-priority-medium)', label: 'Created note' },
  note_updated:       { icon: FileText,      color: 'var(--color-amber)',            label: 'Updated note' },
  note_deleted:       { icon: Trash2,        color: 'var(--color-danger)',           label: 'Deleted note' },
  planner_created:    { icon: PlusCircle,    color: 'var(--color-teal)',             label: 'Planned' },
  planner_completed:  { icon: CheckCircle2,  color: 'var(--color-priority-low)',     label: 'Completed block' },
}

const DEFAULT_CONFIG = { icon: Activity, color: 'var(--color-app-muted)', label: 'Activity' }

function getDateGroup(isoString) {
  const date = new Date(isoString)
  const now = new Date()
  const diff = Math.floor((now - date) / 86400000)
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Yesterday'
  return date.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })
}

export default function ActivityPage() {
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error,
  } = useActivity()

  // Infinite scroll sentinel
  const observerRef = useRef(null)
  const sentinelRef = useCallback(
    (node) => {
      if (observerRef.current) observerRef.current.disconnect()
      if (!node || !hasNextPage) return
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !isFetchingNextPage) {
          fetchNextPage()
        }
      }, { rootMargin: '200px' })
      observerRef.current.observe(node)
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage]
  )

  // Flatten pages into a flat list of events
  const events = data?.pages.flatMap((page) => page.data) ?? []

  // Group by date label
  const grouped = []
  let currentGroup = null
  for (const event of events) {
    const label = getDateGroup(event.createdAt)
    if (!currentGroup || currentGroup.label !== label) {
      currentGroup = { label, events: [event] }
      grouped.push(currentGroup)
    } else {
      currentGroup.events.push(event)
    }
  }

  if (isLoading) return <LoadingSpinner size={48} />

  if (error) {
    return (
      <div className="view-enter">
        <PageHeader title="Activity" subtitle="Your development timeline." />
        <div className="card" style={{ textAlign: 'center', padding: '32px 24px' }}>
          <p style={{ color: 'var(--color-danger)', fontSize: 14 }}>
            Failed to load activity. Please refresh.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="view-enter" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <PageHeader
        title="Activity"
        subtitle="A chronological log of your work across tasks, projects, and notes."
      />

      {events.length === 0 ? (
        <EmptyState
          icon={<Activity size={48} />}
          title="No Activity Yet"
          description="Create a task or project to start building your timeline."
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {grouped.map((group) => (
            <div key={group.label}>
              {/* Date group heading */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  margin: '8px 0',
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: 'var(--color-app-faint)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {group.label}
                </span>
                <div style={{ flex: 1, height: 1, background: 'var(--color-app-border)' }} />
              </div>

              {/* Events in this group */}
              <div
                style={{
                  borderLeft: '2px solid var(--color-app-border)',
                  marginLeft: 8,
                  paddingLeft: 20,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                }}
              >
                {group.events.map((event, idx) => {
                  const cfg = ACTION_CONFIG[event.action] ?? DEFAULT_CONFIG
                  const Icon = cfg.icon
                  const isLast = idx === group.events.length - 1

                  return (
                    <div
                      key={event.id}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 14,
                        padding: '10px 0',
                        borderBottom: isLast ? 'none' : '1px solid var(--color-app-border)',
                        position: 'relative',
                      }}
                    >
                      {/* Timeline dot */}
                      <div
                        aria-hidden="true"
                        style={{
                          position: 'absolute',
                          left: -27,
                          top: 14,
                          width: 10,
                          height: 10,
                          borderRadius: '50%',
                          background: cfg.color,
                          border: '2px solid var(--color-app-bg)',
                          flexShrink: 0,
                        }}
                      />

                      {/* Icon */}
                      <Icon
                        size={16}
                        style={{ color: cfg.color, flexShrink: 0, marginTop: 2 }}
                        aria-hidden="true"
                      />

                      {/* Content */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p
                          style={{
                            margin: 0,
                            fontSize: 13,
                            color: 'var(--color-app-text)',
                            lineHeight: 1.4,
                          }}
                        >
                          {event.summary}
                        </p>
                        <span
                          style={{
                            fontSize: 11,
                            color: 'var(--color-app-faint)',
                            marginTop: 3,
                            display: 'block',
                          }}
                        >
                          {relativeTime(event.createdAt)}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}

          {/* Infinite scroll sentinel */}
          <div ref={sentinelRef} style={{ height: 1 }} />

          {isFetchingNextPage && (
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <LoaderCircle size={20} className="auth-spinner" style={{ color: 'var(--color-app-faint)' }} />
            </div>
          )}

          {!hasNextPage && events.length > 0 && (
            <p
              style={{
                textAlign: 'center',
                fontSize: 12,
                color: 'var(--color-app-faint)',
                padding: '16px 0',
              }}
            >
              You've reached the beginning of your timeline.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
