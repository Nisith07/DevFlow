import { useState, useEffect } from 'react'
import { Search, Bell, User, Sun, Moon, Command } from 'lucide-react'
import { useAuth } from '@/features/auth/hooks/useAuth'
import StatsCards from './components/StatsCards'
import AboutMeCard from './components/AboutMeCard'
import TechStackCard from './components/TechStackCard'
import RecentProjectsCard from './components/RecentProjectsCard'
import GitHubOverview from './components/GitHubOverview'
import TopRepositories from './components/TopRepositories'
import AICopilotWidget from './components/AICopilotWidget'
import DailyMotivation from './components/DailyMotivation'
import FloatingSocials from '@/shared/components/FloatingSocials'
import { getTheme, toggleTheme } from '@/shared/lib/theme'

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [toast, setToast] = useState(null)
  const [theme, setTheme] = useState(getTheme())

  const cleanName = user?.name ? user.name.replace(/:+$/, '') : 'Nisith'
  const firstName = cleanName.split(' ')[0]


  useEffect(() => {
    const handleThemeChange = () => {
      setTheme(getTheme())
    }
    window.addEventListener('themechange', handleThemeChange)
    return () => window.removeEventListener('themechange', handleThemeChange)
  }, [])

  // Auto-dismiss toast
  useEffect(() => {
    if (!toast) return undefined
    const id = window.setTimeout(() => setToast(null), 3200)
    return () => window.clearTimeout(id)
  }, [toast])

  return (
    <div className="dashboard-viewport-fit view-enter">

      {/* ── Dashboard Header ──────────────────────────────────────── */}
      <header className="dash-header" style={{ marginBottom: 0, paddingBottom: 0 }}>
        <div className="dash-greeting-block">
          <h1 className="dash-greeting" style={{ fontSize: '18px', margin: 0 }}>
            {getGreeting()},{' '}
            <span className="greeting-name">{firstName}!</span>
            <span className="greeting-emoji">👋</span>
          </h1>
          <p className="dash-greeting-sub" style={{ fontSize: '11px', margin: 0 }}>Let's build something amazing today.</p>
        </div>

        <div className="dash-header-actions" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Search */}
          <div
            className="dash-search-box neu-inset"
            role="search"
            id="dashboard-search"
            tabIndex={0}
            aria-label="Global search"
            style={{
              padding: '4px 10px',
              height: '32px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              boxShadow: 'var(--neu-shadow-inset-sm)',
              border: 'none'
            }}
          >
            <Search size={12} style={{ color: 'var(--color-app-muted)' }} />
            <span style={{ fontSize: '11px', color: 'var(--color-app-muted)', marginLeft: '6px', marginRight: '16px' }}>Search...</span>
            <div className="dash-search-shortcut" aria-label="Keyboard shortcut Ctrl K" style={{ padding: '2px 4px', fontSize: '9px' }}>
              <Command size={8} />
              K
            </div>
          </div>

          {/* Social Media Bubble Links */}
          <FloatingSocials />

          {/* Theme Switch Toggle */}
          <div
            className="theme-switch-track"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            style={{ flexShrink: 0 }}
          >
            <div className="theme-switch-thumb" />
          </div>

          {/* Notifications */}
          <button
            className="dash-icon-btn neu-btn"
            aria-label="Notifications"
            id="dashboard-notifications"
            onClick={() =>
              setToast({
                title: 'DevFlow',
                body: "Reminder: you've been coding for 45 min. Take a short break.",
              })
            }
            style={{ width: '32px', height: '32px', border: 'none', background: 'none' }}
          >
            <Bell size={14} style={{ color: 'var(--color-app-text)' }} />
            <span className="dash-notif-dot" aria-hidden="true" style={{ width: '6px', height: '6px', top: '6px', right: '6px' }} />
          </button>

          {/* User menu */}
          <button
            className="dash-icon-btn neu-btn"
            aria-label="User menu"
            id="dashboard-user-menu"
            style={{ borderRadius: '50%', overflow: 'hidden', padding: 0, width: '32px', height: '32px', border: 'none' }}
          >
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <User size={14} style={{ color: 'var(--color-app-text)' }} />
            )}
          </button>
        </div>
      </header>

      {/* ── Stats Row ─────────────────────────────────────────────── */}
      <StatsCards />

      {/* ── Main content grid (Proportional viewport alignment) ─────── */}
      <div className="dashboard-main-grid">
        
        {/* ── Central Content Area (Left side) ── */}
        <div className="dash-column">
          <AboutMeCard />
          <TechStackCard />
          <RecentProjectsCard />
        </div>

        {/* ── Right-Side Content Area (Right side) ── */}
        <div className="dash-column">
          <AICopilotWidget />
          <GitHubOverview />
          <TopRepositories />
        </div>
      </div>

      {/* ── Compact Bottom strip ───────────────────────────────────── */}
      <DailyMotivation />

      {/* ── Notification Toast ────────────────────────────────────── */}
      {toast && (
        <div className="toast toast-enter" role="alert" aria-live="polite" style={{ zIndex: 100 }}>
          <Bell size={16} style={{ color: 'var(--color-violet-bright)' }} />
          <div>
            <div className="toast-title">{toast.title}</div>
            <div style={{ fontSize: 11, color: 'var(--color-app-muted)' }}>{toast.body}</div>
          </div>
        </div>
      )}
    </div>
  )
}
