import { useState, useEffect } from 'react'
import { Bell } from 'lucide-react'
import { useAuth } from '@/features/auth/hooks/useAuth'
import StreakBadge from './components/StreakBadge'
import DailySummary from './components/DailySummary'
import FocusTimer from './components/FocusTimer'
import QuickAdd from './components/QuickAdd'
import { useDashboard, useCreateTodayTask, useUpdateTaskStatus } from './hooks/useDashboard'
import LoadingSpinner from '@/shared/components/LoadingSpinner'

export default function DashboardPage() {
  const { user } = useAuth()
  const { data: dashboardData, isLoading, error } = useDashboard()
  const createTodayTask = useCreateTodayTask()
  const updateTaskStatus = useUpdateTaskStatus()

  const [suggestions, setSuggestions] = useState([
    { id: 1, text: 'Your auth module has duplicate code across login.js and signup.js' },
    { id: 2, text: 'You forgot to write tests for the payment handler' },
    { id: 3, text: 'README needs an update — install steps are out of date' },
  ])

  const [toast, setToast] = useState(null)

  useEffect(() => {
    if (!toast) return undefined
    const timeoutId = window.setTimeout(() => setToast(null), 3200)
    return () => window.clearTimeout(timeoutId)
  }, [toast])

  const toggleToday = (id, isDone) => {
    updateTaskStatus.mutate({ id, status: isDone ? 'todo' : 'done' })
  }

  const dismissSuggestion = (id) => {
    setSuggestions((list) => list.filter((item) => item.id !== id))
  }

  const sendTestNotification = () => {
    setToast({
      title: 'Devflow',
      body: "Reminder: you've been coding for 45 min. Take a short break.",
    })
  }

  const handleAddTodayTask = (text) => {
    createTodayTask.mutate(text)
  }

  const dateString = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  })

  if (isLoading) {
    return <LoadingSpinner size={40} />
  }

  const today = dashboardData?.todayTasks || []
  const completedYesterday = dashboardData?.yesterdayCompleted || []
  const streak = dashboardData?.streak || 0


  return (
    <div className="view-enter" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Welcome Greeting */}
      <div>
        <p className="df-prompt">
          <span className="sigil">$</span> good morning,{' '}
          <span className="name">{user?.name || 'developer'}</span>
          <span className="df-cursor cursor-blink" />
        </p>
        <p className="df-subline">
          <span>{dateString}</span>
          <span>·</span>
          <StreakBadge streak={streak} />
          <span>·</span>
          <span>3 repos active</span>
        </p>
      </div>

      {/* Focus Timer */}
      <FocusTimer />

      {/* Quick Add Form */}
      <div className="card">
        <h4 className="card-title" style={{ marginBottom: 8 }}>Quick Planner</h4>
        <QuickAdd onAdd={handleAddTodayTask} />
      </div>

      {/* Daily Summary Grid */}
      <DailySummary
        today={today}
        completedYesterday={completedYesterday}
        suggestions={suggestions}
        toggleToday={toggleToday}
        dismissSuggestion={dismissSuggestion}
      />

      {/* Notification Toast Trigger */}
      <div className="df-notif-row" style={{ marginTop: 12 }}>
        <span className="df-mono">
          <Bell size={13} style={{ verticalAlign: -2, marginRight: 6 }} /> Notifications on
        </span>
        <button className="app-btn" onClick={sendTestNotification}>
          Send test notification
        </button>
      </div>

      {/* Notification Toast Alert */}
      {toast && (
        <div className="toast toast-enter">
          <Bell size={16} color="var(--color-amber)" />
          <div>
            <div className="toast-title">{toast.title}</div>
            <div>{toast.body}</div>
          </div>
        </div>
      )}
    </div>
  )
}
