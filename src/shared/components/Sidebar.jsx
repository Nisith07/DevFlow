import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  FolderKanban,
  ListTodo,
  CalendarDays,
  FileText,
  Activity,
  BarChart3,
  LogOut,
  Zap,
  Sparkles,
} from 'lucide-react'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { getInitials } from '@/shared/lib/utils'

const NAV_ITEMS = [
  { to: '/dashboard',  label: 'Dashboard',  icon: LayoutDashboard },
  { to: '/projects',   label: 'Projects',   icon: FolderKanban    },
  { to: '/tasks',      label: 'Tasks',      icon: ListTodo        },
  { to: '/planner',    label: 'Planner',    icon: CalendarDays    },
  { to: '/notes',      label: 'Notes',      icon: FileText        },
  { to: '/activity',   label: 'Activity',   icon: Activity        },
  { to: '/analytics',  label: 'Analytics',  icon: BarChart3       },
  { to: '/ai',         label: 'AI Copilot', icon: Sparkles        },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/', { replace: true })
  }

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="sidebar-brand-mark">
          <Zap size={14} />
        </div>
        Dev<span style={{ color: 'var(--color-amber)' }}>Flow</span>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav" aria-label="Main navigation">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User footer */}
      <div className="sidebar-footer">
        {user && (
          <div className="sidebar-user" onClick={handleLogout} title="Sign out" role="button" tabIndex={0}>
            <div className="sidebar-avatar">
              {user.avatarUrl
                ? <img src={user.avatarUrl} alt={user.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                : getInitials(user.name)
              }
            </div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{user.name}</div>
              <div className="sidebar-user-email">{user.email}</div>
            </div>
            <LogOut size={14} style={{ color: 'var(--color-app-faint)', flexShrink: 0 }} />
          </div>
        )}
      </div>
    </aside>
  )
}
