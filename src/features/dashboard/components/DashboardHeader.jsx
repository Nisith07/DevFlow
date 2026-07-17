import React, { useState, useEffect, useRef } from 'react'
import { Search, Plus, Bell } from 'lucide-react'
import { useAuth } from '@/features/auth/hooks/useAuth'
import api from '@/shared/lib/axios'

export default function DashboardHeader({ onNewTask }) {
  const { user } = useAuth()
  const cleanName = user?.name ? user.name.replace(/:+$/, '') : 'Developer'
  const firstName = cleanName.split(' ')[0]

  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState({ tasks: [], projects: [] })
  const [isSearching, setIsSearching] = useState(false)
  const [showSearchDropdown, setShowSearchDropdown] = useState(false)
  const searchRef = useRef(null)

  const [notifications, setNotifications] = useState([])
  const [showNotifications, setShowNotifications] = useState(false)
  const notifRef = useRef(null)

  // Fetch notifications on mount
  useEffect(() => {
    api.get('/notifications').then(res => {
      setNotifications(res.data?.data || [])
    }).catch(console.error)
  }, [])

  const unreadCount = notifications.filter(n => !n.isRead).length

  // Debounced Search
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
      } catch (e) {
        console.error(e)
      } finally {
        setIsSearching(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Click outside handlers
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearchDropdown(false)
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const markAllRead = async () => {
    try {
      await api.post('/notifications/read-all')
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '16px',
      flexShrink: 0
    }}>
      <div>
        <h1 style={{
          fontSize: '22px',
          fontWeight: '800',
          letterSpacing: '-0.02em',
          margin: '0 0 2px',
          color: 'var(--color-app-text)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          Good afternoon, {firstName}! <span style={{ animation: 'wave 2s infinite', display: 'inline-block', transformOrigin: '70% 70%' }}>👋</span>
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--color-app-muted)', margin: 0 }}>
          Let's ship something amazing today.
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Search Box */}
        <div ref={searchRef} style={{ position: 'relative' }}>
          <div style={{
            background: 'var(--color-app-surface-2)',
            border: '1px solid var(--color-app-border-bright)',
            borderRadius: '8px',
            padding: '6px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            width: '240px',
            height: '36px',
            boxSizing: 'border-box'
          }}>
            <Search size={14} style={{ color: 'var(--color-app-faint)' }} />
            <input
              type="text"
              placeholder="Search anything..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => { if (searchQuery.trim()) setShowSearchDropdown(true) }}
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--color-app-text)',
                fontSize: '13px',
                width: '100%'
              }}
            />
            <span style={{
              fontSize: '11px',
              color: 'var(--color-app-faint)',
              background: 'var(--color-app-border)',
              padding: '2px 6px',
              borderRadius: '4px',
              fontFamily: 'var(--font-mono)',
              fontWeight: 500
            }}>⌘K</span>
          </div>

          {/* Search Dropdown */}
          {showSearchDropdown && (
            <div style={{
              position: 'absolute',
              top: '44px',
              right: 0,
              width: '320px',
              background: 'var(--color-app-surface)',
              border: '1px solid var(--color-app-border)',
              borderRadius: '8px',
              boxShadow: 'var(--shadow-card)',
              zIndex: 50,
              padding: '8px',
              maxHeight: '400px',
              overflowY: 'auto'
            }}>
              {isSearching ? (
                <div style={{ padding: '12px', textAlign: 'center', color: 'var(--color-app-faint)', fontSize: '13px' }}>Searching...</div>
              ) : (searchResults.tasks.length === 0 && searchResults.projects.length === 0) ? (
                <div style={{ padding: '12px', textAlign: 'center', color: 'var(--color-app-faint)', fontSize: '13px' }}>No results found.</div>
              ) : (
                <>
                  {searchResults.projects.length > 0 && (
                    <div style={{ marginBottom: '8px' }}>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-app-faint)', padding: '4px 8px', textTransform: 'uppercase' }}>Projects</div>
                      {searchResults.projects.map(p => (
                        <div key={p._id} style={{ padding: '8px', borderRadius: '6px', fontSize: '13px', color: 'var(--color-app-text)', cursor: 'pointer' }} className="hover:bg-var(--color-app-surface-2)">
                          {p.name}
                        </div>
                      ))}
                    </div>
                  )}
                  {searchResults.tasks.length > 0 && (
                    <div>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-app-faint)', padding: '4px 8px', textTransform: 'uppercase' }}>Tasks</div>
                      {searchResults.tasks.map(t => (
                        <div key={t._id} style={{ padding: '8px', borderRadius: '6px', fontSize: '13px', color: 'var(--color-app-text)', cursor: 'pointer' }} className="hover:bg-var(--color-app-surface-2)">
                          {t.title}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Plus Button */}
        <button 
          onClick={() => onNewTask('todo')}
          style={{
            background: 'rgba(139, 92, 246, 0.15)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            color: '#A78BFA',
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(139, 92, 246, 0.25)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(139, 92, 246, 0.15)'}
        >
          <Plus size={18} />
        </button>

        {/* Notifications Button */}
        <div ref={notifRef} style={{ position: 'relative' }}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            style={{
              background: 'var(--color-app-surface-2)',
              border: '1px solid var(--color-app-border-bright)',
              color: 'var(--color-app-muted)',
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              cursor: 'pointer',
              transition: 'background 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-app-surface-hover)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'var(--color-app-surface-2)'}
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                width: '6px',
                height: '6px',
                background: '#EF4444',
                borderRadius: '50%',
                border: '1.5px solid var(--color-app-bg)'
              }} />
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div style={{
              position: 'absolute',
              top: '44px',
              right: 0,
              width: '300px',
              background: 'var(--color-app-surface)',
              border: '1px solid var(--color-app-border)',
              borderRadius: '8px',
              boxShadow: 'var(--shadow-card)',
              zIndex: 50,
              padding: '12px',
              maxHeight: '400px',
              overflowY: 'auto'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-app-text)' }}>Notifications</span>
                {unreadCount > 0 && (
                  <button onClick={markAllRead} style={{ background: 'none', border: 'none', fontSize: '11px', color: '#8B5CF6', cursor: 'pointer' }}>Mark all read</button>
                )}
              </div>
              {notifications.length === 0 ? (
                <div style={{ padding: '20px 0', textAlign: 'center', color: 'var(--color-app-faint)', fontSize: '13px' }}>
                  No new notifications
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {notifications.map(n => (
                    <div key={n._id} style={{ padding: '8px', borderRadius: '6px', background: n.isRead ? 'transparent' : 'var(--color-app-surface-2)', border: '1px solid var(--color-app-border)', fontSize: '12px', color: 'var(--color-app-text)' }}>
                      <div style={{ fontWeight: 600, marginBottom: '2px' }}>{n.title}</div>
                      <div style={{ color: 'var(--color-app-muted)', fontSize: '11px' }}>{n.message}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Profile Picture */}
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          overflow: 'hidden',
          border: '1.5px solid var(--color-app-border-bright)',
          flexShrink: 0
        }}>
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{
              width: '100%',
              height: '100%',
              background: 'var(--color-app-surface-2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: 'bold',
              color: 'var(--color-app-text)'
            }}>
              {firstName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
