import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Search, Bell, LayoutDashboard, Moon, Sun,
  CheckCircle2, Rocket, GitPullRequest, Sparkles,
  AlertCircle, Plus, Briefcase, CheckSquare, Code,
  FileText, LogOut, Settings, ExternalLink, Globe, User, ShieldCheck
} from 'lucide-react'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { getTheme, toggleTheme as doToggleTheme } from '@/shared/lib/theme'
import api from '@/shared/lib/axios'

const GithubIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
)

const LinkedinIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
  </svg>
)

const InstagramIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
)

// Glowing Ambient Header Glow
function GlowingHeaderArtwork() {
  return (
    <div style={{
      position: 'absolute',
      top: -20,
      left: 280,
      width: 300,
      height: 120,
      pointerEvents: 'none',
      zIndex: 0,
      overflow: 'hidden',
    }}>
      <div style={{
        width: '100%',
        height: '100%',
        background: 'radial-gradient(ellipse at center, rgba(255, 122, 26, 0.18) 0%, rgba(255, 122, 26, 0.04) 60%, transparent 75%)',
        filter: 'blur(20px)',
      }} />
    </div>
  )
}

export default function DashboardHeader({ onOpenPalette }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const cleanName = user?.name ? user.name.replace(/:+$/, '') : 'Nisith'
  const firstName = cleanName.split(' ')[0]
  const [theme, setTheme] = useState(getTheme())

  const [notifications, setNotifications]         = useState([
    { id: 1, title: 'PR #42 Merged', text: 'Authentication Module ready for production', time: '10m ago', icon: GitPullRequest, color: '#10B981', isRead: false },
    { id: 2, title: 'Deployment Live', text: 'Staging environment deployed on Render', time: '1h ago', icon: Rocket, color: '#3B82F6', isRead: false },
    { id: 3, title: 'Daily Briefing Ready', text: 'Your morning AI briefing generated', time: '3h ago', icon: Sparkles, color: '#FF7A1A', isRead: true },
  ])
  const [showNotifications, setShowNotifications] = useState(false)
  const notifRef = useRef(null)

  const [showProfile, setShowProfile]             = useState(false)
  const profileRef = useRef(null)

  const [showCreateMenu, setShowCreateMenu]       = useState(false)
  const createMenuRef = useRef(null)

  useEffect(() => {
    api.get('/notifications').then(res => {
      if (res.data?.data && res.data.data.length > 0) {
        setNotifications(res.data.data)
      }
    }).catch(() => {})
  }, [])

  const unreadCount = notifications.filter(n => !n.isRead).length

  useEffect(() => {
    const handle = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target))     setShowNotifications(false)
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false)
      if (createMenuRef.current && !createMenuRef.current.contains(e.target)) setShowCreateMenu(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  const handleToggleTheme = () => {
    doToggleTheme()
    setTheme(getTheme())
  }

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
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

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  const floatingDropdownStyle = {
    position: 'absolute',
    top: '46px',
    right: 0,
    background: 'var(--card-bg)',
    border: '1px solid var(--card-border)',
    borderRadius: '16px',
    boxShadow: '0 20px 50px rgba(0,0,0,0.5), 0 0 0 1px var(--card-border)',
    backdropFilter: 'blur(24px)',
    zIndex: 9999,
    overflow: 'hidden',
    animation: 'dropIn 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
  }

  return (
    <header style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      marginBottom: '14px', flexShrink: 0, position: 'relative', width: '100%',
    }}>
      <style>{`
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      {/* Soft Glow */}
      <GlowingHeaderArtwork />

      {/* Greeting (Left) */}
      <div style={{ zIndex: 2 }}>
        <h1 style={{
          fontSize: '20px', fontWeight: '800', letterSpacing: '-0.02em',
          margin: '0 0 2px', color: 'var(--color-app-text)',
          display: 'flex', alignItems: 'center', gap: '6px',
        }}>
          {greeting}, {firstName}!{' '}
          <span style={{ animation: 'wave 2s infinite', display: 'inline-block', transformOrigin: '70% 70%' }}>👋</span>
        </h1>
        <p style={{ fontSize: '12px', color: 'var(--color-app-muted)', margin: 0, fontWeight: '500' }}>
          Your workspace is ready. Let's build something <span style={{ color: '#FF7A1A', fontWeight: '700' }}>amazing</span> today.
        </p>
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', zIndex: 2 }}>

        {/* Search → opens Command Palette */}
        <button
          onClick={triggerPalette}
          title="Search (Ctrl+K)"
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'var(--card-bg)',
            border: '1px solid var(--card-border)',
            borderRadius: '10px', padding: '5px 12px',
            width: '210px', height: '34px', cursor: 'pointer',
            color: 'var(--color-app-muted)', fontSize: '12px', boxSizing: 'border-box',
            boxShadow: 'var(--shadow-neu-sm-val)',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent-color)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--card-border)'}
        >
          <Search size={13} color="var(--color-app-muted)" />
          <span style={{ flex: 1, textAlign: 'left', fontWeight: '500' }}>Search anything...</span>
          <kbd style={{
            fontSize: '9.5px', background: 'var(--card-bg-inset)',
            border: '1px solid var(--card-border)', borderRadius: '4px',
            padding: '1px 4px', fontFamily: 'var(--font-mono)', flexShrink: 0, color: 'var(--color-app-muted)'
          }}>⌘K</kbd>
        </button>

        {/* Plus / Quick Create Button */}
        <div ref={createMenuRef} style={{ position: 'relative' }}>
          <button
            onClick={() => { setShowCreateMenu(o => !o); setShowNotifications(false); setShowProfile(false) }}
            title="Quick Add Menu"
            style={{
              background: 'var(--card-bg)',
              border: `1px solid ${showCreateMenu ? 'var(--accent-color)' : 'var(--card-border)'}`,
              color: showCreateMenu ? 'var(--accent-color)' : '#FF7A1A',
              width: '34px', height: '34px',
              borderRadius: '10px', display: 'flex', alignItems: 'center',
              justifyContent: 'center', cursor: 'pointer',
              boxShadow: showCreateMenu ? '0 0 16px rgba(255,122,26,0.3)' : 'var(--shadow-neu-sm-val)',
              transition: 'all 0.15s ease',
            }}
          >
            <Plus size={16} />
          </button>

          {showCreateMenu && (
            <div style={{ ...floatingDropdownStyle, width: '210px', padding: '6px' }}>
              <div style={{ padding: '6px 10px 6px', borderBottom: '1px solid var(--card-border)', fontSize: '9.5px', fontWeight: '800', color: 'var(--color-app-faint)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Quick Create
              </div>
              {[
                { label: 'New Task',        sub: 'Add task',        route: '/tasks',       icon: CheckSquare, color: '#10B981' },
                { label: 'New Project',     sub: 'Create workspace',route: '/projects',    icon: Briefcase,   color: '#A78BFA' },
                { label: 'Generate AI Code',sub: 'AI Copilot assistant',route: '/ai',      icon: Sparkles,    color: '#EC4899' },
                { label: 'Deploy Project',  sub: 'Trigger deployment',route: '/deployments',icon: Rocket,     color: '#3B82F6' },
                { label: 'New Note',        sub: 'Developer docs',   route: '/notes',       icon: FileText,    color: '#F59E0B' },
                { label: 'New Snippet',     sub: 'Save code block', route: '/snippets',    icon: Code,        color: '#6366F1' },
                { label: 'Log Issue',       sub: 'Report bug',      route: '/issues',      icon: AlertCircle, color: '#EF4444' },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.label}
                    onClick={() => { setShowCreateMenu(false); navigate(item.route) }}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                      padding: '8px 10px', background: 'transparent', border: 'none',
                      borderRadius: '8px', cursor: 'pointer', textAlign: 'left',
                      transition: 'background 0.15s ease',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,122,26,0.1)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{
                      width: '24px', height: '24px', borderRadius: '6px',
                      background: `${item.color}18`, display: 'flex', alignItems: 'center',
                      justifyContent: 'center', color: item.color, flexShrink: 0,
                    }}>
                      <Icon size={13} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-app-text)', lineHeight: 1.2 }}>{item.label}</div>
                      <div style={{ fontSize: '9.5px', color: 'var(--color-app-muted)', marginTop: '1px' }}>{item.sub}</div>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Notification Bell */}
        <div ref={notifRef} style={{ position: 'relative' }}>
          <button
            onClick={() => { setShowNotifications(o => !o); setShowProfile(false); setShowCreateMenu(false) }}
            title="Notifications"
            style={{
              background: 'var(--card-bg)',
              border: `1px solid ${showNotifications ? 'var(--accent-color)' : 'var(--card-border)'}`,
              color: showNotifications ? 'var(--accent-color)' : 'var(--color-app-muted)',
              width: '34px', height: '34px',
              borderRadius: '10px', display: 'flex', alignItems: 'center',
              justifyContent: 'center', position: 'relative', cursor: 'pointer',
              boxShadow: 'var(--shadow-neu-sm-val)',
              transition: 'all 0.15s ease',
            }}
          >
            <Bell size={15} />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute', top: '-2px', right: '-2px',
                width: '9px', height: '9px', background: '#FF7A1A',
                borderRadius: '50%', border: '2px solid var(--card-bg)',
                boxShadow: '0 0 8px rgba(255,122,26,0.8)',
              }} />
            )}
          </button>

          {showNotifications && (
            <div style={{ ...floatingDropdownStyle, width: '280px', padding: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', paddingBottom: '6px', borderBottom: '1px solid var(--card-border)' }}>
                <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--color-app-text)' }}>Notifications</div>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    style={{ background: 'none', border: 'none', color: '#FF7A1A', fontSize: '10px', fontWeight: '700', cursor: 'pointer' }}
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '260px', overflowY: 'auto' }}>
                {notifications.map((n) => {
                  const Icon = n.icon
                  return (
                    <div
                      key={n.id}
                      style={{
                        display: 'flex', alignItems: 'flex-start', gap: '10px',
                        padding: '8px', borderRadius: '10px',
                        background: n.isRead ? 'transparent' : 'var(--card-bg-inset)',
                        border: '1px solid var(--card-border)',
                      }}
                    >
                      <div style={{
                        width: '26px', height: '26px', borderRadius: '7px',
                        background: `${n.color}20`, display: 'flex', alignItems: 'center',
                        justifyContent: 'center', color: n.color, flexShrink: 0, marginTop: '2px'
                      }}>
                        <Icon size={13} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '11.5px', fontWeight: '700', color: 'var(--color-app-text)', display: 'flex', justifyContent: 'space-between' }}>
                          <span>{n.title}</span>
                          <span style={{ fontSize: '9px', color: 'var(--color-app-muted)', fontWeight: '400' }}>{n.time}</span>
                        </div>
                        <div style={{ fontSize: '10px', color: 'var(--color-app-muted)', marginTop: '2px', lineHeight: 1.3 }}>{n.text}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar & Social Menu Dropdown */}
        <div ref={profileRef} style={{ position: 'relative' }}>
          <button
            onClick={() => { setShowProfile(o => !o); setShowNotifications(false); setShowCreateMenu(false) }}
            title="Profile & Social Links"
            style={{
              width: '34px', height: '34px', borderRadius: '50%',
              overflow: 'hidden', border: `2px solid ${showProfile ? 'var(--accent-color)' : '#FF7A1A'}`,
              cursor: 'pointer', flexShrink: 0, background: 'transparent', padding: 0,
              boxShadow: '0 4px 12px rgba(255,122,26,0.3)',
              transition: 'all 0.15s ease',
            }}
          >
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt={cleanName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{
                width: '100%', height: '100%',
                background: 'linear-gradient(135deg, #FF7A1A 0%, #E66A0D 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '13px', fontWeight: '800', color: '#fff',
              }}>
                {firstName.charAt(0).toUpperCase()}
              </div>
            )}
          </button>

          {showProfile && (
            <div style={{ ...floatingDropdownStyle, width: '240px', padding: '10px' }}>
              {/* User Info Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: '10px', borderBottom: '1px solid var(--card-border)' }}>
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt={cleanName} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #FF7A1A 0%, #E66A0D 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '800', color: '#FFF' }}>
                    {firstName.charAt(0).toUpperCase()}
                  </div>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--color-app-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{cleanName}</span>
                    <span style={{ fontSize: '8.5px', fontWeight: '800', color: '#FF7A1A', background: 'rgba(255, 122, 26, 0.15)', padding: '1px 5px', borderRadius: '4px', flexShrink: 0 }}>PRO</span>
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--color-app-muted)', marginTop: '2px' }}>Full Stack Developer</div>
                </div>
              </div>

              {/* Social Media Links Section */}
              <div style={{ padding: '8px 0 4px', borderBottom: '1px solid var(--card-border)' }}>
                <div style={{ fontSize: '9px', fontWeight: '800', color: 'var(--color-app-faint)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '2px 8px 4px' }}>
                  Social & Connect
                </div>
                {[
                  { label: 'GitHub Profile',   href: 'https://github.com/Nisith07',  icon: GithubIcon,   color: 'var(--color-app-text)' },
                  { label: 'LinkedIn',         href: 'https://linkedin.com',         icon: LinkedinIcon, color: '#0A66C2' },
                  { label: 'Instagram',        href: 'https://instagram.com',        icon: InstagramIcon,color: '#E4405F' },
                  { label: 'Developer Portfolio', route: '/portfolio',              icon: Globe,        color: '#10B981' },
                ].map((social) => {
                  const Icon = social.icon
                  return social.href ? (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setShowProfile(false)}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '7px 8px', borderRadius: '8px', color: 'var(--color-app-text)',
                        textDecoration: 'none', fontSize: '11.5px', fontWeight: '600',
                        transition: 'background 0.15s ease',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255, 122, 26, 0.1)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '22px', height: '22px', borderRadius: '6px', background: `${social.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: social.color }}>
                          <Icon size={12} />
                        </div>
                        <span>{social.label}</span>
                      </div>
                      <ExternalLink size={11} color="var(--color-app-muted)" />
                    </a>
                  ) : (
                    <button
                      key={social.label}
                      onClick={() => { setShowProfile(false); navigate(social.route) }}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '7px 8px', borderRadius: '8px', color: 'var(--color-app-text)',
                        background: 'transparent', border: 'none', fontSize: '11.5px', fontWeight: '600',
                        cursor: 'pointer', textAlign: 'left', transition: 'background 0.15s ease',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255, 122, 26, 0.1)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '22px', height: '22px', borderRadius: '6px', background: `${social.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: social.color }}>
                          <Icon size={12} />
                        </div>
                        <span>{social.label}</span>
                      </div>
                    </button>
                  )
                })}
              </div>

              {/* Preferences & System */}
              <div style={{ paddingTop: '4px' }}>
                <button
                  onClick={() => { setShowProfile(false); navigate('/settings') }}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '7px 8px', borderRadius: '8px', color: 'var(--color-app-text)',
                    background: 'transparent', border: 'none', fontSize: '11.5px', fontWeight: '600',
                    cursor: 'pointer', textAlign: 'left', transition: 'background 0.15s ease',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255, 122, 26, 0.1)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <Settings size={13} color="var(--color-app-muted)" />
                  <span>Account Settings</span>
                </button>

                <button
                  onClick={handleToggleTheme}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '7px 8px', borderRadius: '8px', color: 'var(--color-app-text)',
                    background: 'transparent', border: 'none', fontSize: '11.5px', fontWeight: '600',
                    cursor: 'pointer', textAlign: 'left', transition: 'background 0.15s ease',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255, 122, 26, 0.1)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {theme === 'dark' ? <Moon size={13} color="#A78BFA" /> : <Sun size={13} color="#FF7A1A" />}
                    <span>Theme ({theme === 'dark' ? 'Dark' : 'Light'})</span>
                  </div>
                </button>

                <button
                  onClick={handleLogout}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '7px 8px', borderRadius: '8px', color: '#EF4444',
                    background: 'transparent', border: 'none', fontSize: '11.5px', fontWeight: '700',
                    cursor: 'pointer', textAlign: 'left', marginTop: '2px',
                    transition: 'background 0.15s ease',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#EF444415'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <LogOut size={13} color="#EF4444" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  )
}
