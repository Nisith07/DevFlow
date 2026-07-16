import { useState, useEffect, useCallback } from 'react'
import { Search, Bell, User, Sun, Command } from 'lucide-react'
import { useAuth } from '@/features/auth/hooks/useAuth'
import StatsCards from './components/StatsCards'
import AboutMeCard from './components/AboutMeCard'
import TechStackCard from './components/TechStackCard'
import RecentProjectsCard from './components/RecentProjectsCard'
import GitHubOverview from './components/GitHubOverview'
import TopRepositories from './components/TopRepositories'
import AICopilotWidget from './components/AICopilotWidget'
import DailyMotivation from './components/DailyMotivation'
import LoadingSpinner from '@/shared/components/LoadingSpinner'

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [toast, setToast] = useState(null)

  const firstName = user?.name?.split(' ')[0] || 'Nisith'

  // Auto-dismiss toast
  useEffect(() => {
    if (!toast) return undefined
    const id = window.setTimeout(() => setToast(null), 3200)
    return () => window.clearTimeout(id)
  }, [toast])

  return (
    <div className="view-enter" style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

      {/* ── Dashboard Header ──────────────────────────────────────── */}
      <header className="dash-header">
        <div className="dash-greeting-block">
          <h1 className="dash-greeting">
            {getGreeting()},{' '}
            <span className="greeting-name">{firstName}!</span>
            <span className="greeting-emoji">👋</span>
          </h1>
          <p className="dash-greeting-sub">Let's build something amazing today.</p>
        </div>

        <div className="dash-header-actions">
          {/* Search */}
          <div
            className="dash-search-box"
            role="search"
            id="dashboard-search"
            tabIndex={0}
            aria-label="Global search"
          >
            <Search size={14} />
            <span>Search anything...</span>
            <div className="dash-search-shortcut" aria-label="Keyboard shortcut Ctrl K">
              <Command size={9} />
              K
            </div>
          </div>

          {/* Theme */}
          <button
            className="dash-icon-btn"
            aria-label="Toggle theme"
            id="dashboard-theme-toggle"
          >
            <Sun size={15} />
          </button>

          {/* Notifications */}
          <button
            className="dash-icon-btn"
            aria-label="Notifications"
            id="dashboard-notifications"
            onClick={() =>
              setToast({
                title: 'DevFlow',
                body: "Reminder: you've been coding for 45 min. Take a short break.",
              })
            }
          >
            <Bell size={15} />
            <span className="dash-notif-dot" aria-hidden="true" />
          </button>

          {/* User menu */}
          <button
            className="dash-icon-btn"
            aria-label="User menu"
            id="dashboard-user-menu"
            style={{ borderRadius: '50%', overflow: 'hidden', padding: 0 }}
          >
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <User size={15} />
            )}
          </button>
        </div>
      </header>

      {/* ── Stats Row ─────────────────────────────────────────────── */}
      <StatsCards />

      {/* ── Main content grid ─────────────────────────────────────── */}
      <div className="dash-grid-2" style={{ marginTop: 18 }}>

        {/* ── Left column ─────────────────────────────────────────── */}
        <div className="dash-col-left">
          <AboutMeCard />
          <TechStackCard />
          <DailyMotivation />
        </div>

        {/* ── Right column ────────────────────────────────────────── */}
        <div className="dash-col-right">
          <GitHubOverview />
          <TopRepositories />
        </div>
      </div>

      {/* ── Bottom grid: Recent Projects + AI Copilot ─────────────── */}
      <div className="dash-grid-2" style={{ marginTop: 18, marginBottom: 32 }}>
        <RecentProjectsCard />
        <AICopilotWidget />
      </div>

      {/* ── Notification Toast ────────────────────────────────────── */}
      {toast && (
        <div className="toast toast-enter" role="alert" aria-live="polite">
          <Bell size={16} style={{ color: 'var(--color-violet-bright)' }} />
          <div>
            <div className="toast-title">{toast.title}</div>
            <div style={{ fontSize: 12, color: 'var(--color-app-muted)' }}>{toast.body}</div>
          </div>
        </div>
      )}
    </div>
  )
}
