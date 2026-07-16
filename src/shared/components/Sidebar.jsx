import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  User,
  Briefcase,
  FileText,
  Globe2,
  Sparkles,
  MapPin,
  Mail,
  LogOut,
  Settings,
  Moon,
  Sun,
  Zap,
  ArrowRight,
} from 'lucide-react'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { getInitials } from '@/shared/lib/utils'
import { useState, useEffect } from 'react'
import { getTheme, toggleTheme } from '@/shared/lib/theme'

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/projects',  label: 'Portfolio',  icon: Briefcase },
  { to: '/tasks',     label: 'Profile',    icon: User },
  { to: '/analytics', label: 'Resume',     icon: FileText },
  { to: '/activity',  label: 'GitHub',     icon: Globe2 },
]

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [theme, setTheme] = useState(getTheme())

  useEffect(() => {
    const handleThemeChange = () => {
      setTheme(getTheme())
    }
    window.addEventListener('themechange', handleThemeChange)
    return () => window.removeEventListener('themechange', handleThemeChange)
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate('/', { replace: true })
    onClose?.()
  }

  const handleAI = () => {
    navigate('/ai')
    onClose?.()
  }


  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`} aria-label="App sidebar" style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>

      {/* Top Container (scrollable if viewport height is too small, scrollbars hidden) */}
      <div className="sidebar-top-container" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', scrollbarWidth: 'none' }}>
        {/* Brand */}
        <div className="sidebar-brand" style={{ flexShrink: 0 }}>
          <div className="sidebar-brand-mark" aria-hidden="true">
            <Zap size={15} />
          </div>
          <span className="sidebar-brand-text">
            Dev<span>Flow</span>
          </span>
        </div>

        {/* Developer Identity */}
        <div className="sidebar-identity" style={{ flexShrink: 0 }}>
          <div className="sidebar-avatar-wrap">
            <div className="sidebar-avatar">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt={user?.name || 'Nisith Bhowmik'} />
              ) : (
                <span>{user?.name ? getInitials(user.name) : 'NB'}</span>
              )}
            </div>
            <span className="sidebar-status-dot" aria-label="Online" />
          </div>

          <div className="sidebar-dev-name">
            {user?.name || 'Nisith Bhowmik'}
          </div>
          <div className="sidebar-dev-role">Full Stack Developer</div>

          <div className="sidebar-dev-meta">
            <div className="sidebar-dev-meta-row">
              <MapPin size={11} />
              <span>Kolkata, India</span>
            </div>
            <div className="sidebar-dev-meta-row">
              <Mail size={11} />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 160 }}>
                {user?.email || 'nisith.bhowmik@gmail.com'}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav" aria-label="Main navigation" style={{ flexShrink: 0 }}>
          <span className="sidebar-nav-label">Navigation</span>
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
              onClick={onClose}
            >
              <Icon size={15} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* AI Copilot section */}
        <div style={{ padding: '0 0 8px', flexShrink: 0 }}>
          <span className="sidebar-nav-label" style={{ padding: '4px 16px 6px', display: 'block' }}>
            AI Assistant
          </span>
          <button className="sidebar-ai-section" onClick={handleAI} aria-label="Open AI Copilot">
            <div className="sidebar-ai-header">
              <div className="sidebar-ai-icon">
                <Sparkles size={14} />
              </div>
              <span className="sidebar-ai-title">AI Copilot</span>
              <span className="sidebar-ai-badge">NEW</span>
            </div>
            <p className="sidebar-ai-sub">
              Your intelligent coding assistant. Ask anything.
            </p>
            <button className="sidebar-ai-btn" onClick={handleAI} tabIndex={-1}>
              <Sparkles size={12} />
              Open Copilot
              <ArrowRight size={12} style={{ marginLeft: 'auto' }} />
            </button>
          </button>
        </div>
      </div>

      {/* Footer Controls (pinned to bottom) */}
      <div className="sidebar-footer" style={{ flexShrink: 0, marginTop: 'auto' }}>
        {/* Theme toggle */}
        <button
          className="sidebar-theme-toggle"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-app-muted)', fontSize: 13, fontWeight: 500 }}>
            {theme === 'dark' ? <Moon size={14} /> : <Sun size={14} />}
            Dark Mode
          </div>
          <div className={`toggle-track ${theme === 'dark' ? 'on' : 'off'}`}>
            <div className="toggle-thumb" />
          </div>
        </button>

        {/* Settings */}
        <button className="sidebar-footer-btn" aria-label="Settings">
          <Settings size={14} />
          Settings
        </button>

        {/* User / Logout */}
        {user && (
          <button
            className="sidebar-user"
            onClick={handleLogout}
            title="Sign out"
            aria-label="Sign out"
          >
            <div className="sidebar-user-avatar">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} />
              ) : (
                getInitials(user.name)
              )}
            </div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{user.name}</div>
              <div className="sidebar-user-email">{user.email}</div>
            </div>
            <LogOut size={13} style={{ color: 'var(--color-app-faint)', flexShrink: 0 }} />
          </button>
        )}
      </div>
    </aside>
  )
}
