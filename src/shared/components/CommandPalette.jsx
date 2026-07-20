import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search, LayoutDashboard, Briefcase, CheckSquare, AlertCircle,
  Sparkles, Calendar, Layers, BookOpen, Code, BarChart2, Activity,
  Settings, Link2, Plus, FileText, Folder, X, ArrowRight, Loader2,
  GitBranch, Rocket, MessageSquare, Moon
} from 'lucide-react'
import api from '@/shared/lib/axios'

const GithubIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
)

// ── Static command groups ──────────────────────────────────────────────────────
const NAVIGATE_CMDS = [
  { id: 'nav-dashboard',    label: 'Dashboard',         sub: 'Overview & stats',               icon: LayoutDashboard, color: '#a78bfa', route: '/dashboard' },
  { id: 'nav-projects',     label: 'Projects',           sub: 'View all projects',              icon: Briefcase,       color: '#f59e0b', route: '/projects' },
  { id: 'nav-tasks',        label: 'Tasks',              sub: 'Kanban & task list',             icon: CheckSquare,     color: '#10b981', route: '/tasks' },
  { id: 'nav-issues',       label: 'Issues',             sub: 'Bugs & feature requests',        icon: AlertCircle,     color: '#ef4444', route: '/issues' },
  { id: 'nav-ai',           label: 'AI Copilot',         sub: 'Generate code & docs',           icon: Sparkles,        color: '#f43f5e', route: '/ai' },
  { id: 'nav-planner',      label: 'Planner',            sub: 'Calendar & sprints',             icon: Calendar,        color: '#60a5fa', route: '/planner' },
  { id: 'nav-deployments',  label: 'Deployments',        sub: 'Release center',                 icon: Layers,          color: '#2dd4bf', route: '/deployments' },
  { id: 'nav-github',       label: 'GitHub',             sub: 'Repositories & commits',         icon: GithubIcon,      color: '#d1d5db', route: '/github' },
  { id: 'nav-analytics',    label: 'Analytics',          sub: 'Charts & metrics',               icon: BarChart2,       color: '#8b5cf6', route: '/analytics' },
  { id: 'nav-activity',     label: 'Activity',           sub: 'Event feed',                     icon: Activity,        color: '#06b6d4', route: '/activity' },
  { id: 'nav-notes',        label: 'Notes',              sub: 'Developer notes',                icon: BookOpen,        color: '#fbbf24', route: '/notes' },
  { id: 'nav-snippets',     label: 'Snippets',           sub: 'Code snippets library',          icon: Code,            color: '#34d399', route: '/snippets' },
  { id: 'nav-resume',       label: 'Resume Builder',     sub: 'Build your resume',              icon: FileText,        color: '#f472b6', route: '/resume' },
  { id: 'nav-portfolio',    label: 'Portfolio',          sub: 'Showcase your work',             icon: Folder,          color: '#a78bfa', route: '/portfolio' },
  { id: 'nav-settings',     label: 'Settings',           sub: 'Profile & preferences',          icon: Settings,        color: '#9ca3af', route: '/settings' },
  { id: 'nav-integrations', label: 'Integrations',       sub: 'Connected services',             icon: Link2,           color: '#60a5fa', route: '/integrations' },
]

const CREATE_CMDS = [
  { id: 'create-project',   label: 'New Project',        sub: 'Create a project',               icon: Briefcase,       color: '#f59e0b', route: '/projects', action: 'create' },
  { id: 'create-task',      label: 'New Task',           sub: 'Add a task',                     icon: CheckSquare,     color: '#10b981', route: '/tasks',    action: 'create' },
  { id: 'create-note',      label: 'New Note',           sub: 'Write a note',                   icon: BookOpen,        color: '#fbbf24', route: '/notes',    action: 'create' },
  { id: 'create-snippet',   label: 'New Snippet',        sub: 'Save a code snippet',            icon: Code,            color: '#34d399', route: '/snippets', action: 'create' },
  { id: 'create-issue',     label: 'New Issue',          sub: 'Log a bug or feature request',   icon: AlertCircle,     color: '#ef4444', route: '/issues',   action: 'create' },
  { id: 'create-ai',        label: 'AI Conversation',    sub: 'Start AI session',               icon: Sparkles,        color: '#f43f5e', route: '/ai',       action: 'create' },
  { id: 'create-deploy',    label: 'Log Deployment',     sub: 'Record a deployment',            icon: Rocket,          color: '#2dd4bf', route: '/deployments', action: 'create' },
]

// Complete set of DevFlow features and functions for searching
const DEVFLOW_FEATURES = [
  { id: 'feat-kanban', label: 'Kanban Board / Task Board', sub: 'Interactive columns for todo, in-progress, and done tasks', icon: CheckSquare, color: '#10b981', route: '/tasks', keywords: ['kanban', 'tasks', 'board', 'status', 'workflow', 'todo', 'progress', 'done', 'cards'] },
  { id: 'feat-sprint', label: 'Sprints & Planner', sub: 'Plan sprints, set milestones, track timelines & calendar events', icon: Calendar, color: '#60a5fa', route: '/planner', keywords: ['sprint', 'planner', 'milestone', 'calendar', 'time', 'date', 'timeline', 'sprints', 'meeting'] },
  { id: 'feat-ai-chat', label: 'AI Copilot / Chat Assistant', sub: 'Generate code, summarize documents, debug, or chat with AI', icon: Sparkles, color: '#f43f5e', route: '/ai', keywords: ['ai', 'copilot', 'chat', 'assistant', 'generate', 'code', 'help', 'readme', 'bug', 'bot', 'gemini'] },
  { id: 'feat-oauth', label: 'GitHub Integration & OAuth App', sub: 'Configure secure GitHub OAuth connection or delete tokens', icon: GithubIcon, color: '#d1d5db', route: '/settings', keywords: ['github', 'oauth', 'token', 'connect', 'repositories', 'integrate', 'git'] },
  { id: 'feat-theme', label: 'Dark Mode / Focus Mode', sub: 'Toggle between dark and light appearance themes', icon: Moon, color: '#a78bfa', route: '/settings', keywords: ['theme', 'dark', 'light', 'focus', 'appearance', 'mode', 'color', 'toggle'] },
  { id: 'feat-health', label: 'Workspace Health Score', sub: 'View overview of overdue tasks, deployment status, and database health', icon: BarChart2, color: '#10b981', route: '/dashboard', keywords: ['health', 'score', 'workspace', 'database', 'overdue', 'blocker', 'tests', 'status'] },
  { id: 'feat-activity', label: 'Developer Activity Feed', sub: 'Unified log of commits, note creations, tasks and deployment events', icon: Activity, color: '#06b6d4', route: '/activity', keywords: ['activity', 'feed', 'history', 'event', 'log', 'developer', 'stream', 'timeline'] },
  { id: 'feat-deploy-logs', label: 'Deployment Logs & Center', sub: 'Inspect Vercel/Render build output, view failed steps, and rollback versions', icon: Layers, color: '#2dd4bf', route: '/deployments', keywords: ['deploy', 'deployment', 'logs', 'center', 'build', 'failed', 'rollback', 'render', 'vercel', 'host'] },
  { id: 'feat-integrations', label: 'Developer Integrations', sub: 'Manage integrations with Slack, Notion, Jira, Vercel, Render, Atlas', icon: Link2, color: '#60a5fa', route: '/settings', keywords: ['integration', 'integrations', 'services', 'slack', 'notion', 'jira', 'vercel', 'render', 'mongodb', 'atlas'] },
  { id: 'feat-resume', label: 'Resume Builder / CV Builder', sub: 'Create a professional developer portfolio resume and export as PDF', icon: FileText, color: '#f472b6', route: '/resume', keywords: ['resume', 'cv', 'builder', 'portfolio', 'pdf', 'export', 'job', 'hire'] },
  { id: 'feat-portfolio', label: 'Portfolio Page Designer', sub: 'Showcase projects, public social links, skills, and code repository', icon: Folder, color: '#a78bfa', route: '/portfolio', keywords: ['portfolio', 'showcase', 'skills', 'public', 'website', 'designer', 'personal'] },
  { id: 'feat-notes', label: 'Architecture & Auth Notes', sub: 'Take notes on database schemas, logic, or system components', icon: BookOpen, color: '#fbbf24', route: '/notes', keywords: ['note', 'notes', 'docs', 'architecture', 'schema', 'auth', 'database', 'memo'] },
  { id: 'feat-snippets', label: 'Code Snippets Library', sub: 'Store, copy, and organize useful helper functions and code blocks', icon: Code, color: '#34d399', route: '/snippets', keywords: ['snippet', 'snippets', 'code', 'library', 'helper', 'block', 'paste'] },
]

// Enhanced substring search matcher
function matches(cmd, query) {
  const q = query.toLowerCase().trim()
  if (!q) return true
  const label = (cmd.label || '').toLowerCase()
  const sub = (cmd.sub || '').toLowerCase()
  const keywords = (cmd.keywords || []).join(' ').toLowerCase()
  return label.includes(q) || sub.includes(q) || keywords.includes(q)
}

function CommandItem({ cmd, isActive, onClick }) {
  const Icon = cmd.icon
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        padding: '9px 14px', borderRadius: '9px', cursor: 'pointer',
        background: isActive ? 'rgba(139,92,246,0.1)' : 'transparent',
        border: isActive ? '1px solid rgba(139,92,246,0.2)' : '1px solid transparent',
        transition: 'all 0.1s ease',
      }}
    >
      <div style={{
        width: '30px', height: '30px', borderRadius: '8px', flexShrink: 0,
        background: `${cmd.color}18`, border: `1px solid ${cmd.color}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: cmd.color,
      }}>
        <Icon size={14} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-app-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {cmd.label}
        </div>
        <div style={{ fontSize: '11px', color: 'var(--color-app-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {cmd.sub}
        </div>
      </div>
      {isActive && <ArrowRight size={12} style={{ color: '#a78bfa', flexShrink: 0 }} />}
    </div>
  )
}

function SectionLabel({ children }) {
  return (
    <div style={{
      fontSize: '10px', fontWeight: '800', textTransform: 'uppercase',
      letterSpacing: '0.08em', color: 'var(--color-app-faint)',
      padding: '8px 14px 4px',
    }}>
      {children}
    </div>
  )
}

export default function CommandPalette({ isOpen, onClose }) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [activeIdx, setActiveIdx] = useState(0)
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const inputRef = useRef(null)
  const listRef = useRef(null)

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setActiveIdx(0)
      setSearchResults([])
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  // Live backend search
  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setSearchResults([])
      return
    }
    const timer = setTimeout(async () => {
      setIsSearching(true)
      try {
        const res = await api.get(`/search?q=${encodeURIComponent(query)}`)
        const d = res.data?.data || {}
        const results = [
          ...(d.projects || []).map(p => ({
            id: `sr-proj-${p._id}`, label: p.name, sub: 'Project',
            icon: Briefcase, color: '#f59e0b', route: '/projects',
          })),
          ...(d.tasks || []).map(t => ({
            id: `sr-task-${t._id}`, label: t.title, sub: 'Task',
            icon: CheckSquare, color: '#10b981', route: '/tasks',
          })),
        ]
        setSearchResults(results)
      } catch { /* silent */ }
      finally { setIsSearching(false) }
    }, 250)
    return () => clearTimeout(timer)
  }, [query])

  // Build visible list
  const allCmds = query.trim()
    ? [
        ...searchResults,
        ...[...NAVIGATE_CMDS, ...CREATE_CMDS, ...DEVFLOW_FEATURES].filter(c =>
          matches(c, query)
        ),
      ]
    : null

  const sections = query.trim()
    ? [{ label: 'Results', items: allCmds }]
    : [
        { label: 'Navigate', items: NAVIGATE_CMDS },
        { label: 'Create', items: CREATE_CMDS },
        { label: 'Features & Tools', items: DEVFLOW_FEATURES },
      ]

  // Flat list for keyboard nav
  const flatItems = sections.flatMap(s => s.items)

  const executeCmd = useCallback((cmd) => {
    if (!cmd) return
    onClose()
    navigate(cmd.route)
  }, [navigate, onClose])

  const handleKey = useCallback((e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIdx(i => Math.min(i + 1, flatItems.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIdx(i => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      executeCmd(flatItems[activeIdx])
    } else if (e.key === 'Escape') {
      onClose()
    }
  }, [flatItems, activeIdx, executeCmd, onClose])

  // Scroll active item into view
  useEffect(() => {
    const el = listRef.current?.children[activeIdx]
    el?.scrollIntoView({ block: 'nearest' })
  }, [activeIdx])

  // Reset active index when query changes
  useEffect(() => { setActiveIdx(0) }, [query])

  if (!isOpen) return null

  let globalIdx = 0

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        paddingTop: '12vh',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%', maxWidth: '600px', margin: '0 16px',
          background: 'var(--card-bg)',
          border: '1px solid var(--card-border)',
          borderTop: '1px solid var(--card-border-top)',
          borderLeft: '1px solid var(--card-border-left)',
          borderRadius: '18px',
          boxShadow: 'var(--shadow-dropdown-val)',
          overflow: 'hidden',
          animation: 'palette-in 0.15s cubic-bezier(0.16,1,0.3,1)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Search input */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          padding: '14px 18px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          {isSearching
            ? <Loader2 size={18} style={{ color: '#a78bfa', flexShrink: 0 }} className="auth-spinner" />
            : <Search size={18} style={{ color: 'var(--color-app-muted)', flexShrink: 0 }} />
          }
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Search pages, create items, or run actions…"
            style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none',
              fontSize: '15px', color: 'var(--color-app-text)',
              fontWeight: '500',
            }}
          />
          <kbd style={{
            fontSize: '10px', color: 'var(--color-app-faint)',
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '5px', padding: '2px 7px', flexShrink: 0, fontFamily: 'monospace',
          }}>
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div
          ref={listRef}
          style={{ maxHeight: '460px', overflowY: 'auto', padding: '8px' }}
        >
          {query.trim() && allCmds.length === 0 && !isSearching ? (
            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--color-app-muted)', fontSize: '13px' }}>
              No results for &ldquo;{query}&rdquo;
            </div>
          ) : (
            sections.map(section => (
              section.items.length > 0 && (
                <div key={section.label}>
                  <SectionLabel>{section.label}</SectionLabel>
                  {section.items.map(cmd => {
                    const myIdx = globalIdx++
                    return (
                      <CommandItem
                        key={cmd.id}
                        cmd={cmd}
                        isActive={myIdx === activeIdx}
                        onClick={() => executeCmd(cmd)}
                      />
                    )
                  })}
                </div>
              )
            ))
          )}
        </div>

        {/* Footer hint */}
        <div style={{
          padding: '8px 18px',
          borderTop: '1px solid rgba(255,255,255,0.04)',
          display: 'flex', gap: '16px', fontSize: '11px', color: 'var(--color-app-faint)',
        }}>
          <span><kbd style={{ fontFamily: 'monospace' }}>↑↓</kbd> navigate</span>
          <span><kbd style={{ fontFamily: 'monospace' }}>↵</kbd> open</span>
          <span><kbd style={{ fontFamily: 'monospace' }}>ESC</kbd> close</span>
          <span><kbd style={{ fontFamily: 'monospace' }}>Ctrl K</kbd> toggle</span>
        </div>
      </div>

      <style>{`
        @keyframes palette-in {
          from { opacity: 0; transform: scale(0.97) translateY(-8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  )
}
