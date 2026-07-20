import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search, Bell, Settings, LogOut, LayoutDashboard,
  Moon, Sun, CheckCircle2, Rocket, GitPullRequest,
  Sparkles, AlertCircle, Plus
} from 'lucide-react'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { getInitials } from '@/shared/lib/utils'
import { getTheme, toggleTheme as doToggleTheme } from '@/shared/lib/theme'
import api from '@/shared/lib/axios'

const GithubIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
)

// Map notification type → icon + color + route
function getNotifMeta(n) {
  const t = n.type || ''
  if (t.includes('deployment') || t.includes('deploy'))
    return { Icon: Rocket,         color: '#2dd4bf', route: '/deployments' }
  if (t.includes('github') || t.includes('pr') || t.includes('commit'))
    return { Icon: GitPullRequest,  color: '#d1d5db', route: '/github' }
  if (t.includes('task'))
    return { Icon: CheckCircle2,    color: '#10b981', route: '/tasks' }
  if (t.includes('issue'))
    return { Icon: AlertCircle,     color: '#ef4444', route: '/issues' }
  if (t.includes('ai'))
    return { Icon: Sparkles,        color: '#f43f5e', route: '/ai' }
  return   { Icon: Bell,            color: '#a78bfa', route: '/dashboard' }
}

function timeAgo(date) {
  const s = Math.floor((Date.now() - new Date(date)) / 1000)
  if (s < 60)   return 'just now'
  if (s < 3600) return `${Math.floor(s / 60)}m ago`
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`
  return `${Math.floor(s / 86400)}d ago`
}

export default function DashboardHeader({ onOpenPalette }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const cleanName = user?.name ? user.name.replace(/:+$/, '') : 'Developer'
  const firstName = cleanName.split(' ')[0]
  const [theme, setTheme] = useState(() => {
    try { return getTheme() } catch { return 'dark' }
  })

  const [searchQuery, setSearchQuery]             = useState('')
  const [searchResults, setSearchResults]         = useState({ tasks: [], projects: [] })
  const [isSearching, setIsSearching]             = useState(false)
  const [showSearchDropdown, setShowSearchDropdown] = useState(false)
  const searchRef = useRef(null)

  const [notifications, setNotifications]         = useState([])
  const [showNotifications, setShowNotifications] = useState(false)
  const notifRef = useRef(null)

  const [showProfile, setShowProfile]             = useState(false)
  const profileRef = useRef(null)

  const [showCreateMenu, setShowCreateMenu]       = useState(false)
  const createMenuRef = useRef(null)

  // Fetch notifications
  useEffect(() => {
    api.get('/notifications').then(res => {
      setNotifications(res.data?.data || [])
    }).catch(() => {})
  }, [])

  const unreadCount = notifications.filter(n => !n.isRead).length

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults({ tasks: [], projects: [] })
      setShowSearchDropdown(false)
      return
    }
    const timer = setTimeout(async () => {
      setIsSearching(true)
      try {
        const res = await api.get(`/search?q=${encodeURIComponent(searchQuery)}`)
        setSearchResults(res.data?.data || { tasks: [], projects: [] })
        setShowSearchDropdown(true)
      } catch { /* silent */ }
      finally { setIsSearching(false) }
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Click-outside handler (all panels)
  useEffect(() => {
    const handle = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target))   setShowSearchDropdown(false)
      if (notifRef.current && !notifRef.current.contains(e.target))     setShowNotifications(false)
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false)
      if (createMenuRef.current && !createMenuRef.current.contains(e.target)) setShowCreateMenu(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  const markAllRead = async () => {
    try {
      await api.post('/notifications/read-all')
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
    } catch { /* silent */ }
  }

  const markOneRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}`, { isRead: true })
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n))
    } catch { /* silent */ }
  }

  const handleNotifClick = (n) => {
    markOneRead(n._id)
    setShowNotifications(false)
    const { route } = getNotifMeta(n)
    navigate(route)
  }

  const triggerPalette = () => {
    if (typeof window.__openCommandPalette === 'function') {
      window.__openCommandPalette()
    } else if (onOpenPalette) {
      onOpenPalette()
    }
  }

  const handleLogout = async () => {
    setShowProfile(false)
    await logout()
    navigate('/', { replace: true })
  }

  const handleToggleTheme = () => {
    try { doToggleTheme() } catch { /* silent */ }
    setTheme(t => t === 'dark' ? 'light' : 'dark')
  }

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  const dropdownStyle = {
    position: 'absolute', top: '44px', right: 0,
    background: '#0F1220',
    border: '1px solid #1E2540',
    borderTop: '1px solid #2C3560',
    borderLeft: '1px solid #252D55',
    borderRadius: '14px',
    boxShadow: '0 1px 0 rgba(255,255,255,0.04) inset, 0 24px 64px rgba(0,0,0,0.75), 0 8px 24px rgba(0,0,0,0.5), 0 0 0 1px rgba(139,92,246,0.06)',
    zIndex: 200,
    overflow: 'hidden',
    animation: 'dropIn 0.15s cubic-bezier(0.16,1,0.3,1)',
  }

  return (
    <>
      <style>{`
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-6px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      <header style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: '16px', flexShrink: 0,
      }}>
        {/* Greeting */}
        <div>
          <h1 style={{
            fontSize: '22px', fontWeight: '800', letterSpacing: '-0.02em',
            margin: '0 0 2px', color: 'var(--color-app-text)',
            display: 'flex', alignItems: 'center', gap: '8px',
          }}>
            {greeting}, {firstName}!{' '}
            <span style={{ animation: 'wave 2s infinite', display: 'inline-block', transformOrigin: '70% 70%' }}>👋</span>
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--color-app-muted)', margin: 0 }}>
            Let's ship something amazing today.
          </p>
        </div>

        {/* Right controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>

          {/* Search → opens Command Palette */}
          <button
            onClick={triggerPalette}
            title="Search (Ctrl+K)"
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: 'var(--color-app-surface-2)',
              border: '1px solid var(--color-app-border-bright)',
              borderRadius: '8px', padding: '6px 12px',
              width: '220px', height: '36px', cursor: 'pointer',
              color: 'var(--color-app-faint)', fontSize: '13px', boxSizing: 'border-box',
            }}
          >
            <Search size={14} />
            <span style={{ flex: 1, textAlign: 'left' }}>Search anything…</span>
            <kbd style={{
              fontSize: '10px', background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px',
              padding: '1px 5px', fontFamily: 'monospace', flexShrink: 0,
            }}>⌘K</kbd>
          </button>

          {/* Plus / Quick Create Button */}
          <div ref={createMenuRef} style={{ position: 'relative' }}>
            <button
              onClick={() => { setShowCreateMenu(o => !o); setShowNotifications(false); setShowProfile(false) }}
              title="Quick Add Menu"
              style={{
                background: 'rgba(139, 92, 246, 0.15)',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                color: '#A78BFA',
                width: '36px', height: '36px',
                borderRadius: '8px', display: 'flex', alignItems: 'center',
                justifyContent: 'center', cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(139, 92, 246, 0.25)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(139, 92, 246, 0.15)'}
            >
              <Plus size={18} />
            </button>

            {showCreateMenu && (
              <div style={{ ...dropdownStyle, width: '180px' }}>
                <div style={{ padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: '10px', fontWeight: '800', color: 'var(--color-app-faint)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Quick Add
                </div>
                {[
                  { label: 'New Project',      route: '/projects' },
                  { label: 'New Task',         route: '/tasks' },
                  { label: 'New Note',         route: '/notes' },
                  { label: 'New Snippet',      route: '/snippets' },
                  { label: 'New Issue',        route: '/issues' },
                  { label: 'AI Conversation',  route: '/ai' },
                  { label: 'Log Deployment',   route: '/deployments' },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => { setShowCreateMenu(false); navigate(item.route) }}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center',
                      padding: '8px 12px', background: 'transparent', border: 'none',
                      color: 'var(--color-app-text)', fontSize: '12px', fontWeight: '600',
                      cursor: 'pointer', textAlign: 'left', transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notification bell */}
          <div ref={notifRef} style={{ position: 'relative' }}>
            <button
              onClick={() => { setShowNotifications(o => !o); setShowProfile(false) }}
              style={{
                background: 'var(--color-app-surface-2)',
                border: '1px solid var(--color-app-border-bright)',
                color: 'var(--color-app-muted)', width: '36px', height: '36px',
                borderRadius: '8px', display: 'flex', alignItems: 'center',
                justifyContent: 'center', position: 'relative', cursor: 'pointer',
              }}
            >
              <Bell size={16} />
              {unreadCount > 0 && (
                <span style={{
                  position: 'absolute', top: '-4px', right: '-4px',
                  minWidth: '16px', height: '16px', background: '#ef4444',
                  borderRadius: '8px', border: '2px solid var(--color-app-bg)',
                  fontSize: '9px', fontWeight: '800', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: '0 3px',
                }}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div style={{ ...dropdownStyle, width: '340px' }}>
                {/* Header */}
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)',
                }}>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-app-text)' }}>
                    Notifications {unreadCount > 0 && <span style={{ fontSize: '11px', color: '#ef4444' }}>({unreadCount})</span>}
                  </span>
                  {unreadCount > 0 && (
                    <button onClick={markAllRead} style={{
                      background: 'none', border: 'none', fontSize: '11px',
                      color: '#8b5cf6', cursor: 'pointer', fontWeight: '600',
                    }}>
                      Mark all read
                    </button>
                  )}
                </div>

                {/* Items */}
                <div style={{ maxHeight: '360px', overflowY: 'auto' }}>
                  {notifications.length === 0 ? (
                    <div style={{ padding: '32px 16px', textAlign: 'center' }}>
                      <Bell size={28} style={{ color: 'var(--color-app-faint)', marginBottom: '10px', opacity: 0.4 }} />
                      <div style={{ fontSize: '13px', color: 'var(--color-app-muted)' }}>All caught up!</div>
                      <div style={{ fontSize: '11px', color: 'var(--color-app-faint)', marginTop: '4px' }}>No new notifications</div>
                    </div>
                  ) : (
                    notifications.map(n => {
                      const { Icon, color, route } = getNotifMeta(n)
                      return (
                        <div
                          key={n._id}
                          onClick={() => handleNotifClick(n)}
                          style={{
                            display: 'flex', alignItems: 'flex-start', gap: '10px',
                            padding: '10px 16px', cursor: 'pointer',
                            background: !n.isRead ? 'rgba(139,92,246,0.04)' : 'transparent',
                            borderBottom: '1px solid rgba(255,255,255,0.03)',
                            transition: 'background 0.15s',
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                          onMouseLeave={e => e.currentTarget.style.background = !n.isRead ? 'rgba(139,92,246,0.04)' : 'transparent'}
                        >
                          <div style={{
                            width: '28px', height: '28px', borderRadius: '8px', flexShrink: 0,
                            background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color, marginTop: '1px',
                          }}>
                            <Icon size={12} />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-app-text)', marginBottom: '2px' }}>
                              {n.title}
                            </div>
                            <div style={{ fontSize: '11px', color: 'var(--color-app-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {n.message}
                            </div>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', flexShrink: 0 }}>
                            <span style={{ fontSize: '10px', color: 'var(--color-app-faint)' }}>{timeAgo(n.createdAt)}</span>
                            {!n.isRead && (
                              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#8b5cf6' }} />
                            )}
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profile avatar */}
          <div ref={profileRef} style={{ position: 'relative' }}>
            <button
              onClick={() => { setShowProfile(o => !o); setShowNotifications(false) }}
              title="Profile menu"
              style={{
                width: '36px', height: '36px', borderRadius: '50%',
                overflow: 'hidden', border: showProfile
                  ? '2px solid #8b5cf6'
                  : '2px solid var(--color-app-border-bright)',
                cursor: 'pointer', flexShrink: 0, background: 'transparent', padding: 0,
                transition: 'border-color 0.2s',
              }}
            >
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{
                  width: '100%', height: '100%',
                  background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '13px', fontWeight: '800', color: '#fff',
                }}>
                  {firstName.charAt(0).toUpperCase()}
                </div>
              )}
            </button>

            {showProfile && (
              <div style={{ ...dropdownStyle, width: '230px', right: 0 }}>
                {/* Identity block */}
                <div style={{
                  padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)',
                  display: 'flex', alignItems: 'center', gap: '10px',
                }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
                    overflow: 'hidden', border: '2px solid rgba(139,92,246,0.3)',
                  }}>
                    {user?.avatarUrl ? (
                      <img src={user.avatarUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{
                        width: '100%', height: '100%',
                        background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '14px', fontWeight: '800', color: '#fff',
                      }}>
                        {firstName.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--color-app-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {cleanName}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--color-app-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {user?.email || 'Full Stack Developer'}
                    </div>
                  </div>
                </div>

                {/* Menu items */}
                {[
                  { label: 'My Dashboard',    icon: LayoutDashboard, route: '/dashboard' },
                  { label: 'GitHub Workspace',icon: GithubIcon,      route: '/github' },
                  { label: 'Account Settings',icon: Settings,        route: '/settings' },
                ].map(({ label, icon: Icon, route }) => (
                  <button
                    key={label}
                    onClick={() => { setShowProfile(false); navigate(route) }}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                      padding: '9px 16px', background: 'transparent', border: 'none',
                      color: 'var(--color-app-text)', fontSize: '13px', fontWeight: '600',
                      cursor: 'pointer', textAlign: 'left', transition: 'background 0.1s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <Icon size={14} style={{ color: 'var(--color-app-muted)' }} />
                    {label}
                  </button>
                ))}

                {/* Theme toggle */}
                <button
                  onClick={handleToggleTheme}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', justifySelf: 'space-between', justifyContent: 'space-between',
                    padding: '9px 16px', background: 'transparent', border: 'none',
                    color: 'var(--color-app-text)', fontSize: '13px', fontWeight: '600',
                    cursor: 'pointer', transition: 'background 0.1s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {theme === 'dark' ? <Moon size={14} style={{ color: 'var(--color-app-muted)' }} /> : <Sun size={14} style={{ color: '#f59e0b' }} />}
                    {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                  </span>
                  <span style={{
                    width: '28px', height: '14px', borderRadius: '7px',
                    background: theme === 'dark' ? '#7c3aed' : '#4a5568',
                    position: 'relative', flexShrink: 0,
                  }}>
                    <span style={{
                      position: 'absolute', top: '2px',
                      left: theme === 'dark' ? '16px' : '2px',
                      width: '10px', height: '10px', borderRadius: '50%',
                      background: '#fff', transition: 'left 0.2s',
                    }} />
                  </span>
                </button>

                {/* Social Media Links Section */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '8px 16px 4px' }}>
                  <div style={{ fontSize: '9px', fontWeight: '800', color: 'var(--color-app-faint)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>Social Profiles</div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <a href="https://github.com/Nisith07" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '26px', height: '26px', borderRadius: '6px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', color: 'var(--color-app-text)' }} title="GitHub">
                      <GithubIcon size={14} />
                    </a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '26px', height: '26px', borderRadius: '6px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', color: '#0077b5' }} title="LinkedIn">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22.23 0H1.77C.8 0 0 .77 0 1.72v20.56C0 23.23.8 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.2 0 22.23 0zM7.12 20.45H3.56V9h3.56v11.45zM5.34 7.55c-1.14 0-2.06-.92-2.06-2.06 0-1.14.92-2.06 2.06-2.06 1.14 0 2.06.92 2.06 2.06 0 1.14-.92 2.06-2.06 2.06zm15.11 12.9H16.9v-5.61c0-1.34-.03-3.05-1.86-3.05-1.86 0-2.14 1.45-2.14 2.95v5.71H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29z"/>
                      </svg>
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '26px', height: '26px', borderRadius: '6px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', color: '#e1306c' }} title="Instagram">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                      </svg>
                    </a>
                  </div>
                </div>

                {/* Divider + Logout */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', margin: '4px 0' }} />
                <button
                  onClick={handleLogout}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '9px 16px 13px', background: 'transparent', border: 'none',
                    color: '#ef4444', fontSize: '13px', fontWeight: '600',
                    cursor: 'pointer', textAlign: 'left', transition: 'background 0.1s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.06)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <LogOut size={14} />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  )
}



