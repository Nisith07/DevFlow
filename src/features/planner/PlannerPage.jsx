import { useState } from 'react'
import { ChevronLeft, ChevronRight, Trash2, Calendar, Check, Circle } from 'lucide-react'
import PageHeader from '@/shared/components/PageHeader'
import { usePlanner } from './hooks/usePlanner'
import PlannerSidebar from './components/PlannerSidebar'
import LoadingSpinner from '@/shared/components/LoadingSpinner'
import EmptyState from '@/shared/components/EmptyState'

export default function PlannerPage() {
  const [currentDate, setCurrentDate] = useState(new Date())

  // Format date to local YYYY-MM-DD
  const dateStr = currentDate.toLocaleDateString('en-CA')

  const {
    entries,
    isLoading,
    createEntry,
    updateEntry,
    deleteEntry,
  } = usePlanner(dateStr)

  const handlePrevDay = () => {
    setCurrentDate((d) => {
      const copy = new Date(d)
      copy.setDate(copy.getDate() - 1)
      return copy
    })
  }

  const handleNextDay = () => {
    setCurrentDate((d) => {
      const copy = new Date(d)
      copy.setDate(copy.getDate() - 1 + 2) // add 1 day
      return copy
    })
  }

  const handleScheduleTask = async (task) => {
    const startTime = window.prompt('Enter start time (e.g., 09:00):', '09:00')
    if (startTime === null) return
    const endTime = window.prompt('Enter end time (e.g., 10:00):', '10:00')
    if (endTime === null) return

    try {
      await createEntry({
        task: task.id,
        title: task.title,
        startTime,
        endTime,
      })
    } catch (err) {
      alert(err.message || 'Failed to schedule task.')
    }
  }

  const handleCreateFreeform = async (blockData) => {
    try {
      await createEntry(blockData)
    } catch (err) {
      alert(err.message || 'Failed to create block.')
    }
  }

  const handleToggleDone = async (entry) => {
    try {
      await updateEntry({
        id: entry.id,
        done: !entry.done,
      })
    } catch (err) {
      alert(err.message || 'Failed to update entry.')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this time block?')) return
    try {
      await deleteEntry(id)
    } catch (err) {
      alert(err.message || 'Failed to delete entry.')
    }
  }

  const formattedDateHeader = currentDate.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div className="view-enter" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <PageHeader
        title="Daily Planner"
        subtitle="Time-block your day to build focus and maintain consistency."
      />

      {/* Date Navigator */}
      <div
        className="card"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 20px',
        }}
      >
        <button className="app-btn" onClick={handlePrevDay} style={{ padding: '6px 12px' }}>
          <ChevronLeft size={16} />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, color: 'var(--color-app-text)' }}>
          <Calendar size={16} style={{ color: 'var(--color-amber)' }} />
          <span>{formattedDateHeader}</span>
        </div>
        <button className="app-btn" onClick={handleNextDay} style={{ padding: '6px 12px' }}>
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Main Grid Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        {/* Left Column: Time Blocks list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card" style={{ flex: 1, minHeight: 400 }}>
            <h3 className="card-title" style={{ marginBottom: 16 }}>
              Today's Schedule
            </h3>

            {isLoading ? (
              <LoadingSpinner size={40} />
            ) : entries.length === 0 ? (
              <EmptyState
                icon={<Calendar size={48} />}
                title="Your Schedule is Empty"
                description="Time-block your daily tasks or add a freeform block from the sidebar."
              />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {entries.map((entry) => (
                  <div
                    key={entry.id}
                    className={`df-row ${entry.done ? 'df-done' : ''}`}
                    style={{
                      padding: '12px 14px',
                      background: 'var(--color-app-surface)',
                      border: '1px solid var(--color-app-border)',
                      borderRadius: 8,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 12,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
                      <button
                        className={`df-check-btn ${entry.done ? 'checked' : ''}`}
                        onClick={() => handleToggleDone(entry)}
                        aria-label={entry.done ? 'Mark incomplete' : 'Mark complete'}
                      >
                        {entry.done ? <Check size={18} /> : <Circle size={18} />}
                      </button>
                      <div style={{ minWidth: 0 }}>
                        <p
                          style={{
                            fontSize: 14,
                            fontWeight: 600,
                            margin: 0,
                            color: entry.done ? 'var(--color-app-faint)' : 'var(--color-app-text)',
                            textDecoration: entry.done ? 'line-through' : 'none',
                          }}
                        >
                          {entry.task ? entry.task.title : entry.title}
                        </p>
                        <span
                          style={{
                            fontSize: 11,
                            fontFamily: 'var(--font-mono)',
                            color: 'var(--color-app-faint)',
                            marginTop: 3,
                            display: 'block',
                          }}
                        >
                          {entry.startTime} – {entry.endTime}
                        </span>
                      </div>
                    </div>

                    <button
                      className="df-sugg-dismiss"
                      onClick={() => handleDelete(entry.id)}
                      title="Remove block"
                      style={{ padding: 4, color: 'var(--color-danger)' }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <PlannerSidebar
            onScheduleTask={handleScheduleTask}
            onCreateFreeform={handleCreateFreeform}
          />
        </div>
      </div>
    </div>
  )
}
