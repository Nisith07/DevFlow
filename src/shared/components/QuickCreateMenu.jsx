import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Plus, X, Briefcase, CheckSquare, BookOpen, Code,
  AlertCircle, Sparkles, Rocket
} from 'lucide-react'

const ITEMS = [
  { label: 'New Project',      icon: Briefcase,   color: '#f59e0b', route: '/projects' },
  { label: 'New Task',         icon: CheckSquare,  color: '#10b981', route: '/tasks' },
  { label: 'New Note',         icon: BookOpen,     color: '#fbbf24', route: '/notes' },
  { label: 'New Snippet',      icon: Code,         color: '#34d399', route: '/snippets' },
  { label: 'New Issue',        icon: AlertCircle,  color: '#ef4444', route: '/issues' },
  { label: 'AI Conversation',  icon: Sparkles,     color: '#f43f5e', route: '/ai' },
  { label: 'Log Deployment',   icon: Rocket,       color: '#2dd4bf', route: '/deployments' },
]

export default function QuickCreateMenu() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const containerRef = useRef(null)

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  // Close on Esc
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const handleSelect = (route) => {
    setOpen(false)
    navigate(route)
  }

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed', bottom: '28px', right: '28px',
        zIndex: 500, display: 'flex', flexDirection: 'column-reverse', alignItems: 'flex-end', gap: '10px',
      }}
    >
      {/* Stacked menu items */}
      {ITEMS.map((item, i) => {
        const Icon = item.icon
        const delay = open ? `${i * 35}ms` : `${(ITEMS.length - 1 - i) * 20}ms`
        return (
          <div
            key={item.label}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              opacity: open ? 1 : 0,
              transform: open ? 'translateY(0) scale(1)' : 'translateY(12px) scale(0.9)',
              transition: `opacity 0.2s ${delay}, transform 0.2s ${delay}`,
              pointerEvents: open ? 'auto' : 'none',
            }}
          >
            {/* Label tooltip */}
            <div style={{
              background: 'var(--color-app-surface)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '8px', padding: '5px 10px',
              fontSize: '12px', fontWeight: '700',
              color: 'var(--color-app-text)',
              boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
              whiteSpace: 'nowrap',
            }}>
              {item.label}
            </div>

            {/* Icon button */}
            <button
              onClick={() => handleSelect(item.route)}
              title={item.label}
              style={{
                width: '40px', height: '40px', borderRadius: '12px',
                background: `${item.color}15`, border: `1px solid ${item.color}40`,
                color: item.color, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
                transition: 'transform 0.15s, box-shadow 0.15s',
                flexShrink: 0,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'scale(1.1)'
                e.currentTarget.style.boxShadow = `0 6px 20px ${item.color}40`
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'scale(1)'
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.25)'
              }}
            >
              <Icon size={16} />
            </button>
          </div>
        )
      })}

      {/* Main FAB */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label={open ? 'Close quick create menu' : 'Quick create'}
        style={{
          width: '52px', height: '52px', borderRadius: '16px',
          background: open
            ? 'rgba(239,68,68,0.15)'
            : 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
          border: open ? '1px solid rgba(239,68,68,0.3)' : '1px solid rgba(139,92,246,0.4)',
          color: open ? '#ef4444' : '#fff',
          cursor: 'pointer', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: open
            ? '0 4px 16px rgba(239,68,68,0.2)'
            : '0 8px 28px rgba(109,40,217,0.45)',
          transition: 'all 0.2s cubic-bezier(0.34,1.56,0.64,1)',
          transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
        }}
        onMouseEnter={e => { if (!open) e.currentTarget.style.transform = 'rotate(0deg) scale(1.08)' }}
        onMouseLeave={e => { e.currentTarget.style.transform = open ? 'rotate(45deg)' : 'rotate(0deg) scale(1)' }}
      >
        {open ? <X size={20} /> : <Plus size={22} />}
      </button>
    </div>
  )
}
