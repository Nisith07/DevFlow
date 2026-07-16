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
  const cleanName = (user?.name || 'Nisith Bhowmik').replace(/:+$/, '')
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

      {/* Brand - permanently pinned to the top */}
      <div className="sidebar-brand" style={{ flexShrink: 0 }}>
        <div className="sidebar-brand-mark" aria-hidden="true">
          <Zap size={15} />
        </div>
        <span className="sidebar-brand-text">
          Dev<span>Flow</span>
        </span>
      </div>

      {/* Top Container - Navigation and AI Quick Links */}
      <div className="sidebar-top-container" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', scrollbarWidth: 'none' }}>
        
        {/* Navigation */}
        <nav className="sidebar-nav" aria-label="Main navigation" style={{ flexShrink: 0, marginTop: '8px' }}>
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

        {/* AI Assistant Section */}
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

      {/* Footer Controls & Consolidated Developer Profile (pinned to bottom) */}
      <div className="sidebar-footer" style={{ flexShrink: 0, marginTop: 'auto', borderTop: '1px solid var(--color-app-border)', padding: '10px 14px 14px' }}>
        
        {/* Theme toggle */}
        <button
          className="sidebar-theme-toggle"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          style={{ marginBottom: '6px' }}
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
        <button className="sidebar-footer-btn" aria-label="Settings" style={{ marginBottom: '10px' }}>
          <Settings size={14} />
          Settings
        </button>

        {/* Consolidated Profile Card */}
        {user && (
          <div
            className="sidebar-profile-card neu-inset"
            style={{
              padding: '10px 12px',
              borderRadius: '10px',
              background: 'var(--color-app-surface-2)',
              border: '1px solid var(--color-app-border)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              boxShadow: 'var(--shadow-neu-sm-val)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ position: 'relative', width: '36px', height: '36px', flexShrink: 0 }}>
                <div style={{ width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-app-surface)', border: '1px solid var(--color-app-border-bright)', fontSize: '13px', fontWeight: 'bold' }}>
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={cleanName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    getInitials(cleanName)
                  )}
                </div>
                <span className="sidebar-status-dot" style={{ bottom: '-1px', right: '-1px', width: '10px', height: '10px', borderWidth: '1.5px' }} aria-label="Online" />
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--color-app-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: '1.2' }}>{cleanName}</div>
                <div style={{ fontSize: '10.5px', color: 'var(--color-violet-bright)', fontWeight: 500, marginTop: '1px' }}>Full Stack Developer</div>
              </div>
              <button
                onClick={handleLogout}
                title="Sign out"
                aria-label="Sign out"
                className="neu-btn"
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '6px',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  background: 'var(--color-app-surface)',
                  flexShrink: 0
                }}
              >
                <LogOut size={12} style={{ color: 'var(--color-app-faint)' }} />
              </button>
            </div>

            {/* Quick Metadata Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '10.5px', color: 'var(--color-app-muted)', borderTop: '1px solid var(--color-app-border)', paddingTop: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={10} style={{ color: 'var(--color-app-faint)' }} />
                <span>Kolkata, India</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Mail size={10} style={{ color: 'var(--color-app-faint)' }} />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={user.email}>
                  {user.email}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
