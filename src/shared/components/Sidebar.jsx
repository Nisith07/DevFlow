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

      {/* Brand logo - permanently fixed at the top */}
      <div className="sidebar-brand" style={{ flexShrink: 0, borderBottom: 'none', padding: '16px 20px 8px' }}>
        <div className="sidebar-brand-mark" aria-hidden="true">
          <Zap size={14} />
        </div>
        <span className="sidebar-brand-text">
          Dev<span>Flow</span>
        </span>
      </div>

      {/* Top Container - Developer Profile, Navigation, and AI Copilot */}
      <div className="sidebar-top-container" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', scrollbarWidth: 'none' }}>
        
        {/* Developer Identity (Top Profile Block) */}
        <div className="sidebar-identity" style={{ flexShrink: 0, padding: '8px 16px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', borderBottom: '1px solid var(--color-app-border)' }}>
          <div className="sidebar-avatar-wrap" style={{ width: '48px', height: '48px', margin: '0 auto 6px' }}>
            <div className="sidebar-avatar" style={{ width: '48px', height: '48px', borderWidth: '1.5px', fontSize: '16px' }}>
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt={cleanName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span>{getInitials(cleanName)}</span>
              )}
            </div>
            <span className="sidebar-status-dot" style={{ bottom: '0px', right: '0px', width: '10px', height: '10px', borderWidth: '1.5px' }} aria-label="Online" />
          </div>

          <div className="sidebar-dev-name" style={{ fontSize: '14.5px', fontWeight: 'bold', margin: '0 0 1px' }}>
            {cleanName}
          </div>
          <div className="sidebar-dev-role" style={{ fontSize: '11px', color: 'var(--color-violet-bright)', fontWeight: 500, margin: '0 0 6px' }}>
            Full Stack Developer
          </div>

          <div className="sidebar-dev-meta" style={{ display: 'flex', flexDirection: 'column', gap: '3px', alignItems: 'center' }}>
            <div className="sidebar-dev-meta-row" style={{ fontSize: '10.5px', gap: '4px' }}>
              <MapPin size={10} style={{ color: 'var(--color-app-faint)' }} />
              <span>Kolkata, India</span>
            </div>
            <div className="sidebar-dev-meta-row" style={{ fontSize: '10.5px', gap: '4px' }}>
              <Mail size={10} style={{ color: 'var(--color-app-faint)' }} />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 140 }} title={user?.email}>
                {user?.email || 'nisith.bhowmik@gmail.com'}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav" aria-label="Main navigation" style={{ flexShrink: 0, marginTop: '6px', padding: '0 10px' }}>
          <span className="sidebar-nav-label" style={{ paddingLeft: '10px', fontSize: '10.5px', marginBottom: '4px' }}>Navigation</span>
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
              onClick={onClose}
              style={{ padding: '8px 12px', fontSize: '13px', gap: '10px', borderRadius: '8px' }}
            >
              <Icon size={14} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* AI Assistant Section (Compact Box) */}
        <div style={{ padding: '6px 10px 12px', flexShrink: 0 }}>
          <span className="sidebar-nav-label" style={{ paddingLeft: '10px', fontSize: '10.5px', display: 'block', marginBottom: '4px' }}>
            AI Assistant
          </span>
          <button
            className="sidebar-ai-section neu-inset"
            onClick={handleAI}
            aria-label="Open AI Copilot"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              width: '100%',
              margin: 0,
              padding: '8px 10px',
              borderRadius: '8px',
              border: '1px solid var(--color-app-border)',
              cursor: 'pointer',
              textAlign: 'left',
              boxShadow: 'var(--shadow-neu-sm-val)',
              background: 'var(--color-app-surface-2)'
            }}
          >
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '6px',
              background: 'var(--accent-glow)',
              color: 'var(--color-violet-bright)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Sparkles size={12} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '11.5px', fontWeight: 'bold', color: 'var(--color-app-text)', lineHeight: '1.2' }}>AI Copilot</div>
              <div style={{ fontSize: '10px', color: 'var(--color-app-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '1px' }}>Ask helper anything</div>
            </div>
            <ArrowRight size={11} style={{ color: 'var(--color-violet-bright)', flexShrink: 0 }} />
          </button>
        </div>
      </div>

      {/* Footer Controls (pinned to bottom) */}
      <div className="sidebar-footer" style={{ flexShrink: 0, marginTop: 'auto', borderTop: '1px solid var(--color-app-border)', padding: '10px 14px 14px' }}>
        
        {/* Theme toggle */}
        <button
          className="sidebar-theme-toggle"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          style={{ marginBottom: '6px', height: '32px', padding: '6px 12px', border: '1px solid var(--color-app-border)', borderRadius: '8px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-app-muted)', fontSize: 12, fontWeight: 500 }}>
            {theme === 'dark' ? <Moon size={12} /> : <Sun size={12} />}
            Dark Mode
          </div>
          <div className={`toggle-track ${theme === 'dark' ? 'on' : 'off'}`} style={{ width: '32px', height: '16px', borderRadius: '8px' }}>
            <div className="toggle-thumb" style={{ width: '12px', height: '12px' }} />
          </div>
        </button>

        {/* Settings and Logout (Side by Side) */}
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            className="sidebar-footer-btn neu-btn"
            aria-label="Settings"
            style={{
              flex: 1,
              padding: '6px 8px',
              fontSize: '11.5px',
              height: '32px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              border: '1px solid var(--color-app-border)',
              background: 'var(--color-app-surface)'
            }}
          >
            <Settings size={12} />
            <span>Settings</span>
          </button>
          <button
            onClick={handleLogout}
            className="sidebar-footer-btn logout neu-btn"
            title="Sign out"
            aria-label="Sign out"
            style={{
              flex: 1,
              padding: '6px 8px',
              fontSize: '11.5px',
              height: '32px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              border: '1px solid var(--color-app-border)',
              background: 'var(--color-app-surface)',
              color: 'var(--color-danger)'
            }}
          >
            <LogOut size={12} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  )
}
