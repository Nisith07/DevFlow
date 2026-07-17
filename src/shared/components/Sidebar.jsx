import { NavLink, useNavigate } from 'react-router-dom'
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
  Sun
} from 'lucide-react'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { getInitials } from '@/shared/lib/utils'
import { useState, useEffect } from 'react'
import { getTheme, toggleTheme } from '@/shared/lib/theme'

const GithubIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
)

export default function Sidebar({ isOpen, onClose }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const cleanName = (user?.name || 'Nisith').replace(/:+$/, '')
  const [theme, setTheme] = useState(getTheme())

  useEffect(() => {
    const handleThemeChange = () => {
      setTheme(getTheme())
    }
    window.addEventListener('themechange', handleThemeChange)
    return () => window.removeEventListener('themechange', handleThemeChange)
  }, [])

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`} aria-label="App sidebar" style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>

      {/* Brand logo - permanently fixed at the top */}
      <div className="sidebar-brand" style={{ flexShrink: 0, borderBottom: 'none', padding: '24px 20px 8px' }}>
        <img src="/logo-icon.svg" alt="" style={{ width: 22, height: 22 }} />
        <span className="sidebar-brand-text">
          Dev<span>Flow</span>
        </span>
      </div>

      {/* Developer Identity (Top Profile Block) */}
      <div className="sidebar-identity" style={{ flexShrink: 0, padding: '16px 20px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ position: 'relative' }}>
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt={cleanName} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-app-surface-2)', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 'bold' }}>
              {getInitials(cleanName)}
            </div>
          )}
          <span style={{ position: 'absolute', bottom: '0px', right: '0px', width: '8px', height: '8px', background: '#10b981', borderRadius: '50%', border: '2px solid var(--color-app-bg)' }} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '13.5px', fontWeight: '700', color: '#fff' }}>{cleanName}</span>
            <span style={{ fontSize: '9px', fontWeight: '700', color: '#a78bfa', background: 'rgba(167, 139, 250, 0.15)', padding: '1px 5px', borderRadius: '4px' }}>PRO</span>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-app-muted)', marginTop: '2px' }}>Full Stack Developer</div>
        </div>
      </div>

      {/* Scrollable Nav Area */}
      <div className="sidebar-top-container" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', padding: '0 12px 20px' }}>
        
        {/* MAIN */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--color-app-faint)', letterSpacing: '0.05em', padding: '0 8px', marginBottom: '8px' }}>Main</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <NavLink to="/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} style={{ padding: '8px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', borderRadius: '6px' }} onClick={onClose}>
              <LayoutDashboard size={14} />
              <span>Dashboard</span>
            </NavLink>
            <NavLink to="/projects" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} style={{ padding: '8px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', borderRadius: '6px' }} onClick={onClose}>
              <Briefcase size={14} />
              <span>Projects</span>
            </NavLink>
            <NavLink to="/tasks" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} style={{ padding: '8px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', borderRadius: '6px' }} onClick={onClose}>
              <CheckSquare size={14} />
              <span>Tasks</span>
            </NavLink>
            <NavLink to="/issues" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} style={{ padding: '8px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', borderRadius: '6px' }} onClick={onClose}>
              <AlertCircle size={14} />
              <span>Issues</span>
            </NavLink>
            <NavLink to="/ai" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} style={{ padding: '8px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', borderRadius: '6px' }} onClick={onClose}>
              <Sparkles size={14} />
              <span>AI Copilot</span>
            </NavLink>
            <NavLink to="/planner" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} style={{ padding: '8px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', borderRadius: '6px' }} onClick={onClose}>
              <Calendar size={14} />
              <span>Planner</span>
            </NavLink>
            <NavLink to="/deployments" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} style={{ padding: '8px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', borderRadius: '6px' }} onClick={onClose}>
              <Layers size={14} />
              <span>Deployments</span>
            </NavLink>
            <NavLink to="/github" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} style={{ padding: '8px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', borderRadius: '6px' }} onClick={onClose}>
              <GithubIcon />
              <span>GitHub</span>
            </NavLink>
          </div>
        </div>

        {/* TOOLS */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--color-app-faint)', letterSpacing: '0.05em', padding: '0 8px', marginBottom: '8px' }}>Tools</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <NavLink to="/resume" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} style={{ padding: '8px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', borderRadius: '6px' }} onClick={onClose}>
              <FileText size={14} />
              <span>Resume Builder</span>
            </NavLink>
            <NavLink to="/portfolio" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} style={{ padding: '8px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', borderRadius: '6px' }} onClick={onClose}>
              <Folder size={14} />
              <span>Portfolio</span>
            </NavLink>
            <NavLink to="/notes" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} style={{ padding: '8px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', borderRadius: '6px' }} onClick={onClose}>
              <BookOpen size={14} />
              <span>Notes</span>
            </NavLink>
            <NavLink to="/snippets" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} style={{ padding: '8px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', borderRadius: '6px' }} onClick={onClose}>
              <Code size={14} />
              <span>Snippets</span>
            </NavLink>
          </div>
        </div>

        {/* ANALYTICS */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--color-app-faint)', letterSpacing: '0.05em', padding: '0 8px', marginBottom: '8px' }}>Analytics</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <NavLink to="/analytics" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} style={{ padding: '8px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', borderRadius: '6px' }} onClick={onClose}>
              <BarChart2 size={14} />
              <span>Analytics</span>
            </NavLink>
            <NavLink to="/activity" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} style={{ padding: '8px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', borderRadius: '6px' }} onClick={onClose}>
              <Activity size={14} />
              <span>Activity</span>
            </NavLink>
          </div>
        </div>

        {/* SETTINGS */}
        <div>
          <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--color-app-faint)', letterSpacing: '0.05em', padding: '0 8px', marginBottom: '8px' }}>Settings</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <NavLink to="/settings" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} style={{ padding: '8px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', borderRadius: '6px' }} onClick={onClose}>
              <Settings size={14} />
              <span>Settings</span>
            </NavLink>
            <NavLink to="/integrations" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} style={{ padding: '8px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', borderRadius: '6px' }} onClick={onClose}>
              <Link2 size={14} />
              <span>Integrations</span>
            </NavLink>
          </div>
        </div>

      </div>

      {/* Focus Mode Control (pinned to bottom) */}
      <div className="sidebar-footer" style={{ flexShrink: 0, marginTop: 'auto', borderTop: '1px solid var(--color-app-border)', padding: '12px 14px' }}>
        <button
          className="sidebar-theme-toggle"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          style={{ height: '36px', padding: '6px 12px', border: '1px solid var(--color-app-border)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', background: 'transparent' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-app-muted)', fontSize: 12, fontWeight: 500 }}>
            {theme === 'dark' ? <Moon size={12} /> : <Sun size={12} />}
            Focus Mode
          </div>
          <div className={`toggle-track ${theme === 'dark' ? 'on' : 'off'}`} style={{ width: '32px', height: '16px', borderRadius: '8px', background: theme === 'dark' ? 'var(--color-violet)' : '#4a5568' }}>
            <div className="toggle-thumb" style={{ width: '12px', height: '12px' }} />
          </div>
        </button>
      </div>
    </aside>
  )
}
