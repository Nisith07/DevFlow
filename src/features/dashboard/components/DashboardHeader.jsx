import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search, Bell, LayoutDashboard, Moon, Sun,
  CheckCircle2, Rocket, GitPullRequest, Sparkles,
  AlertCircle, Plus
} from 'lucide-react'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { getTheme, toggleTheme as doToggleTheme } from '@/shared/lib/theme'
import api from '@/shared/lib/axios'

const GithubIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
)

// ── Glowing 3D Header Ambient Glow (Positioned cleanly behind greeting, NEVER overlapping metrics or search) ──
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

  const [notifications, setNotifications]         = useState([])
  const [showNotifications, setShowNotifications] = useState(false)
  const notifRef = useRef(null)

  const [showProfile, setShowProfile]             = useState(false)
  const profileRef = useRef(null)

  const [showCreateMenu, setShowCreateMenu]       = useState(false)
  const createMenuRef = useRef(null)

  useEffect(() => {
    api.get('/notifications').then(res => {
      setNotifications(res.data?.data || [])
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

  const triggerPalette = () => {
    if (typeof window.__openCommandPalette === 'function') {
      window.__openCommandPalette()
    } else if (onOpenPalette) {
      onOpenPalette()
    }
  }

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  const dropdownStyle = {
    position: 'absolute', top: '42px', right: 0,
    background: 'var(--card-bg)',
    border: '1px solid var(--accent-color)',
    borderRadius: '14px',
    boxShadow: 'var(--shadow-dropdown-val)',
    zIndex: 200,
    overflow: 'hidden',
    animation: 'dropIn 0.15s cubic-bezier(0.16,1,0.3,1)',
  }

  return (
    <header style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      marginBottom: '14px', flexShrink: 0, position: 'relative', width: '100%',
    }}>
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
              border: '1px solid var(--accent-color)',
              color: '#FF7A1A',
              width: '34px', height: '34px',
              borderRadius: '10px', display: 'flex', alignItems: 'center',
              justifyContent: 'center', cursor: 'pointer',
              boxShadow: '0 0 12px rgba(255,122,26,0.18)',
              transition: 'all 0.15s ease',
            }}
          >
            <Plus size={16} />
          </button>

          {showCreateMenu && (
            <div style={{ ...dropdownStyle, width: '170px' }}>
              <div style={{ padding: '6px 10px', borderBottom: '1px solid var(--card-border)', fontSize: '9.5px', fontWeight: '800', color: 'var(--color-app-faint)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
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
                    padding: '7px 10px', background: 'transparent', border: 'none',
                    color: 'var(--color-app-text)', fontSize: '11.5px', fontWeight: '600',
                    cursor: 'pointer', textAlign: 'left', transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,122,26,0.1)'}
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
              background: 'var(--card-bg)',
              border: '1px solid var(--card-border)',
              color: 'var(--color-app-muted)', width: '34px', height: '34px',
              borderRadius: '10px', display: 'flex', alignItems: 'center',
              justifyContent: 'center', position: 'relative', cursor: 'pointer',
              boxShadow: 'var(--shadow-neu-sm-val)',
            }}
          >
            <Bell size={15} />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute', top: '-2px', right: '-2px',
                width: '9px', height: '9px', background: '#FF7A1A',
                borderRadius: '50%', border: '2px solid var(--app-bg)',
                boxShadow: '0 0 6px rgba(255,122,26,0.8)',
              }} />
            )}
          </button>
        </div>

        {/* Profile Avatar */}
        <div ref={profileRef} style={{ position: 'relative' }}>
          <button
            onClick={() => { setShowProfile(o => !o); setShowNotifications(false) }}
            style={{
              width: '34px', height: '34px', borderRadius: '50%',
              overflow: 'hidden', border: '2px solid #FF7A1A',
              cursor: 'pointer', flexShrink: 0, background: 'transparent', padding: 0,
            }}
          >
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
        </div>

      </div>
    </header>
  )
}
