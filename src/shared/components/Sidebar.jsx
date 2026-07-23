import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Briefcase,
  CheckSquare,
  AlertCircle,
  Sparkles,
  Calendar,
  Layers,
  FileText,
  Folder,
  BookOpen,
  Code,
  BarChart2,
  Activity,
  Settings,
  Link2,
  LogOut,
  Moon,
  Sun,
  ChevronDown,
  Search,
  Grid,
  Zap,
  Check,
  Star
} from 'lucide-react'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { getInitials } from '@/shared/lib/utils'
import { useState, useEffect, useRef } from 'react'
import { getTheme, toggleTheme } from '@/shared/lib/theme'
import FocusTimer from './FocusTimer'

const GithubIcon = ({ size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
)

// Complete list of Workspaces categorized
const WORKSPACE_CATEGORIES = [
  {
    category: 'Development',
    items: [
      { name: 'Projects', route: '/projects', icon: Briefcase, badge: 'Active' },
      { name: 'Tasks', route: '/tasks', icon: CheckSquare },
      { name: 'GitHub', route: '/github', icon: GithubIcon },
      { name: 'Deployments', route: '/deployments', icon: Layers },
      { name: 'Issues', route: '/issues', icon: AlertCircle },
    ]
  },
  {
    category: 'AI & Automation',
    items: [
      { name: 'AI Copilot', route: '/ai', icon: Sparkles, badge: '24/7' },
      { name: 'Planner', route: '/planner', icon: Calendar },
    ]
  },
  {
    category: 'Workspace Tools',
    items: [
      { name: 'Notes', route: '/notes', icon: BookOpen },
      { name: 'Portfolio', route: '/portfolio', icon: Folder },
      { name: 'Resume Builder', route: '/resume', icon: FileText },
      { name: 'Snippets', route: '/snippets', icon: Code },
    ]
  },
  {
    category: 'System & Analytics',
    items: [
      { name: 'Analytics', route: '/analytics', icon: BarChart2 },
      { name: 'Activity', route: '/activity', icon: Activity },
      { name: 'Integrations', route: '/integrations', icon: Link2 },
      { name: 'Settings', route: '/settings', icon: Settings },
    ]
  }
]

// Flat list of all workspaces
const ALL_WORKSPACES = [
  { name: 'Dashboard', route: '/dashboard', icon: LayoutDashboard },
  ...WORKSPACE_CATEGORIES.flatMap(c => c.items)
]

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const cleanName = (user?.name || 'Nisith').replace(/:+$/, '')
  const [theme, setTheme] = useState(getTheme())
  
  const [workspaceOpen, setWorkspaceOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showFocusTimer, setShowFocusTimer] = useState(false)
  const dropdownRef = useRef(null)

  // Find currently active workspace item
  const currentWorkspace = ALL_WORKSPACES.find(w => w.route === location.pathname) || ALL_WORKSPACES[0]

  useEffect(() => {
    // Update document title dynamically when workspace changes
    document.title = `${currentWorkspace.name} — DevFlow`
  }, [currentWorkspace])

  useEffect(() => {
    const handleThemeChange = () => {
      setTheme(getTheme())
    }
    window.addEventListener('themechange', handleThemeChange)
    return () => window.removeEventListener('themechange', handleThemeChange)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setWorkspaceOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate('/', { replace: true })
    onClose?.()
  }

  const handleSelectWorkspace = (route, name) => {
    setWorkspaceOpen(false)
    setSearchQuery('')
    navigate(route)
    onClose?.()
  }

  // Filter workspaces by search query
  const filteredCategories = WORKSPACE_CATEGORIES.map(cat => ({
    ...cat,
    items: cat.items.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
  })).filter(cat => cat.items.length > 0)

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`} aria-label="App sidebar" style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: 'var(--sidebar-bg)', borderRight: '1px solid var(--sidebar-border)' }}>

      {/* Developer Identity Card (At Very Top - Uplifted to match header top line) */}
      <div style={{ flexShrink: 0, padding: '6px 14px 10px' }}>
        <div style={{
          background: 'var(--card-bg-inset)',
          border: '1px solid var(--card-border)',
          borderRadius: '14px',
          padding: '8px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          boxShadow: 'var(--shadow-neu-sm-val)',
        }}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt={cleanName} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #FF7A1A 0%, #E66A0D 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '800', color: '#FFF' }}>
                {getInitials(cleanName)}
              </div>
            )}
            <span style={{ position: 'absolute', bottom: '0px', right: '0px', width: '7px', height: '7px', background: '#22C55E', borderRadius: '50%', border: '2px solid var(--sidebar-bg)' }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-app-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{cleanName}</span>
              <span style={{ fontSize: '8px', fontWeight: '800', color: '#FF7A1A', background: 'rgba(255, 122, 26, 0.15)', padding: '1px 5px', borderRadius: '4px', flexShrink: 0 }}>PRO</span>
            </div>
            <div style={{ fontSize: '10px', color: 'var(--color-app-muted)', marginTop: '1px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Full Stack Developer</div>
          </div>
          
          <button
            onClick={handleLogout}
            title="Logout"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--color-app-muted)',
              borderRadius: '6px',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            <LogOut size={13} />
          </button>
        </div>
      </div>

      {/* Dev Workspace Dropdown Selector (Top of Navigation) */}
      <div ref={dropdownRef} style={{ flexShrink: 0, padding: '0 14px 10px', position: 'relative' }}>
        <button
          onClick={() => setWorkspaceOpen(o => !o)}
          style={{
            width: '100%',
            background: workspaceOpen ? 'rgba(255, 122, 26, 0.12)' : 'var(--card-bg)',
            border: workspaceOpen ? '1px solid var(--accent-color)' : '1px solid var(--card-border)',
            borderRadius: '14px',
            padding: '9px 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            boxShadow: workspaceOpen ? '0 0 16px rgba(255, 122, 26, 0.2)' : 'var(--shadow-neu-sm-val)',
            transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
            <div style={{ width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(255, 122, 26, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF7A1A', flexShrink: 0 }}>
              <Grid size={13} />
            </div>
            <div style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', textAlign: 'left' }}>
              <span style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--color-app-text)', display: 'block', lineHeight: 1.2 }}>
                {location.pathname === '/dashboard' ? 'Dev Workspace' : currentWorkspace.name}
              </span>
            </div>
          </div>
          <ChevronDown size={14} style={{ color: 'var(--color-app-muted)', transform: workspaceOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
        </button>

        {/* Workspace Overlay Dropdown Modal */}
        {workspaceOpen && (
          <div style={{
            position: 'absolute',
            top: '48px',
            left: '14px',
            right: '14px',
            boxSizing: 'border-box',
            background: 'var(--card-bg)',
            border: '1px solid var(--accent-color)',
            borderRadius: '20px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.6), 0 0 30px rgba(255,122,26,0.15)',
            zIndex: 999,
            overflow: 'hidden',
            backdropFilter: 'blur(16px)',
            animation: 'dropdownFadeIn 0.2s cubic-bezier(0.16,1,0.3,1)',
          }}>
            <style>{`
              @keyframes dropdownFadeIn {
                from { opacity: 0; transform: translateY(-8px) scale(0.96); }
                to   { opacity: 1; transform: translateY(0) scale(1); }
              }
            `}</style>

            {/* Search Input inside Dropdown */}
            <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--card-border)' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'var(--card-bg-inset)',
                border: '1px solid var(--card-border)',
                borderRadius: '10px',
                padding: '6px 10px',
              }}>
                <Search size={13} color="var(--color-app-muted)" />
                <input
                  type="text"
                  placeholder="Search workspace..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  autoFocus
                  style={{
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: 'var(--color-app-text)',
                    fontSize: '12px',
                    width: '100%',
                  }}
                />
              </div>
            </div>

            {/* Workspaces Scrollable List */}
            <div style={{ maxHeight: '340px', overflowY: 'auto', padding: '8px' }}>

              {/* Dashboard quick item */}
              {!searchQuery && (
                <div style={{ marginBottom: '8px' }}>
                  <div
                    onClick={() => handleSelectWorkspace('/dashboard', 'Dashboard')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      borderRadius: '10px',
                      background: location.pathname === '/dashboard' ? 'var(--accent-color)' : 'transparent',
                      color: location.pathname === '/dashboard' ? '#FFFFFF' : 'var(--color-app-text)',
                      cursor: 'pointer',
                      fontSize: '12.5px',
                      fontWeight: '700',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <LayoutDashboard size={14} />
                      <span>Dashboard</span>
                    </div>
                    {location.pathname === '/dashboard' && <Check size={14} />}
                  </div>
                </div>
              )}

              {filteredCategories.map((cat) => (
                <div key={cat.category} style={{ marginBottom: '12px' }}>
                  <div style={{ fontSize: '9px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-app-muted)', padding: '4px 10px 4px' }}>
                    {cat.category}
                  </div>
                  {cat.items.map((item) => {
                    const Icon = item.icon
                    const isActive = location.pathname === item.route
                    return (
                      <div
                        key={item.name}
                        onClick={() => handleSelectWorkspace(item.route, item.name)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '7px 10px',
                          borderRadius: '10px',
                          background: isActive ? 'var(--accent-color)' : 'transparent',
                          color: isActive ? '#FFFFFF' : 'var(--color-app-text)',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: isActive ? '700' : '500',
                          transition: 'background 0.15s ease',
                        }}
                        onMouseEnter={e => {
                          if (!isActive) e.currentTarget.style.background = 'rgba(255, 122, 26, 0.1)'
                        }}
                        onMouseLeave={e => {
                          if (!isActive) e.currentTarget.style.background = 'transparent'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                          <Icon size={14} color={isActive ? '#FFFFFF' : 'var(--color-app-muted)'} />
                          <span>{item.name}</span>
                        </div>
                        {isActive && <Check size={13} />}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Navigation Items */}
      <div className="sidebar-top-container" style={{ flex: 1, overflowY: 'auto', padding: '0 14px 10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        
        {/* Permanent Item 1: 🏠 Dashboard */}
        <NavLink
          to="/dashboard"
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          style={{
            padding: '9px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '13px',
            fontWeight: '700',
            borderRadius: '12px',
            color: location.pathname === '/dashboard' ? '#FFFFFF' : 'var(--color-app-text)',
            background: location.pathname === '/dashboard' ? 'var(--accent-color)' : 'transparent',
            boxShadow: location.pathname === '/dashboard' ? '0 4px 14px rgba(255,122,26,0.3)' : 'none',
          }}
          onClick={onClose}
        >
          <LayoutDashboard size={16} />
          <span>Dashboard</span>
        </NavLink>

        {/* Selected Workspace Nav Link (shown cleanly if active) */}
        {location.pathname !== '/dashboard' && (
          <NavLink
            to={currentWorkspace.route}
            className="sidebar-link active"
            style={{
              padding: '9px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '13px',
              fontWeight: '700',
              borderRadius: '12px',
              color: '#FFFFFF',
              background: 'var(--accent-color)',
              boxShadow: '0 4px 14px rgba(255,122,26,0.3)',
            }}
            onClick={onClose}
          >
            {(() => {
              const Icon = currentWorkspace.icon
              return <Icon size={16} />
            })()}
            <span>{currentWorkspace.name}</span>
          </NavLink>
        )}

        {/* Quick Nav Section: Core Modules */}
        <div style={{ marginTop: '12px' }}>
          <div style={{ fontSize: '9px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--color-app-faint)', letterSpacing: '0.08em', padding: '0 10px', marginBottom: '6px' }}>
            Workspaces
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {[
              { name: 'Projects', route: '/projects', icon: Briefcase },
              { name: 'Tasks', route: '/tasks', icon: CheckSquare },
              { name: 'GitHub', route: '/github', icon: GithubIcon },
              { name: 'AI Copilot', route: '/ai', icon: Sparkles },
              { name: 'Planner', route: '/planner', icon: Calendar },
              { name: 'Deployments', route: '/deployments', icon: Layers },
              { name: 'Analytics', route: '/analytics', icon: BarChart2 },
            ].map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.route
              return (
                <NavLink
                  key={item.name}
                  to={item.route}
                  className={`sidebar-link ${isActive ? 'active' : ''}`}
                  style={{
                    padding: '7px 10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '9px',
                    fontSize: '12.5px',
                    fontWeight: isActive ? '700' : '500',
                    borderRadius: '10px',
                    color: isActive ? 'var(--accent-color)' : 'var(--color-app-muted)',
                    background: isActive ? 'rgba(255,122,26,0.1)' : 'transparent',
                  }}
                  onClick={onClose}
                >
                  <Icon size={15} color={isActive ? 'var(--accent-color)' : 'var(--color-app-muted)'} />
                  <span>{item.name}</span>
                </NavLink>
              )
            })}
          </div>
        </div>

      </div>

      {/* Focus Mode & Theme Controls (Pinned to Bottom) */}
      <div style={{ flexShrink: 0, marginTop: 'auto', borderTop: '1px solid var(--sidebar-border)', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '10px', position: 'relative' }}>
        
        {/* Focus Timer Popup (Strictly Inside Sidebar) */}
        {showFocusTimer && (
          <div style={{
            marginBottom: '4px',
            animation: 'fadeInUp 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          }}>
            <FocusTimer onClose={() => setShowFocusTimer(false)} />
          </div>
        )}

        {/* Focus Mode Card */}
        <div
          onClick={() => setShowFocusTimer(f => !f)}
          style={{
            background: showFocusTimer ? 'var(--accent-color)15' : 'var(--card-bg-inset)',
            border: `1px solid ${showFocusTimer ? 'var(--accent-color)40' : 'var(--card-border)'}`,
            borderRadius: '14px',
            padding: '10px 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(255, 122, 26, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF7A1A' }}>
              <Zap size={12} />
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--color-app-text)' }}>Focus Mode</div>
              <div style={{ fontSize: '9.5px', color: 'var(--color-app-muted)' }}>Stay in deep work</div>
            </div>
          </div>
          <div
            style={{
              width: '32px',
              height: '18px',
              borderRadius: '9px',
              background: showFocusTimer ? 'var(--accent-color)' : 'rgba(255,255,255,0.1)',
              position: 'relative',
              transition: 'background 0.2s',
            }}
          >
            <div style={{
              width: '14px',
              height: '14px',
              borderRadius: '50%',
              background: '#FFFFFF',
              position: 'absolute',
              top: '2px',
              left: showFocusTimer ? '16px' : '2px',
              transition: 'left 0.2s',
              boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
            }} />
          </div>
        </div>

        {/* Theme Segmented Switch */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--card-bg-inset)',
          border: '1px solid var(--card-border)',
          borderRadius: '12px',
          padding: '4px 6px',
        }}>
          <span style={{ fontSize: '11px', fontWeight: '600', color: 'var(--color-app-muted)', paddingLeft: '6px' }}>Theme</span>
          <div style={{ display: 'flex', gap: '4px' }}>
            <button
              onClick={() => { if (theme !== 'light') toggleTheme() }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 8px',
                borderRadius: '8px',
                fontSize: '11px',
                fontWeight: '600',
                border: 'none',
                background: theme === 'light' ? 'var(--card-bg)' : 'transparent',
                color: theme === 'light' ? 'var(--accent-color)' : 'var(--color-app-muted)',
                boxShadow: theme === 'light' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                cursor: 'pointer',
              }}
            >
              <Sun size={12} />
            </button>
            <button
              onClick={() => { if (theme !== 'dark') toggleTheme() }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 8px',
                borderRadius: '8px',
                fontSize: '11px',
                fontWeight: '600',
                border: 'none',
                background: theme === 'dark' ? 'var(--card-bg)' : 'transparent',
                color: theme === 'dark' ? 'var(--accent-color)' : 'var(--color-app-muted)',
                boxShadow: theme === 'dark' ? '0 2px 6px rgba(0,0,0,0.2)' : 'none',
                cursor: 'pointer',
              }}
            >
              <Moon size={12} />
            </button>
          </div>
        </div>

        {/* Settings button */}
        <NavLink
          to="/settings"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 8px',
            fontSize: '12px',
            fontWeight: '600',
            color: 'var(--color-app-muted)',
            textDecoration: 'none',
            borderRadius: '8px',
          }}
          onClick={onClose}
        >
          <Settings size={14} />
          <span>Settings</span>
        </NavLink>

      </div>
    </aside>
  )
}
