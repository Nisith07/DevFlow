import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '@/shared/components/Sidebar'
import CommandPalette from '@/shared/components/CommandPalette'
import { FocusProvider } from '@/shared/components/FocusContext'
import { Menu, X } from 'lucide-react'

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)

  // Expose palette opener globally so DashboardHeader can call it
  useEffect(() => {
    window.__openCommandPalette = () => setPaletteOpen(true)
    return () => { delete window.__openCommandPalette }
  }, [])

  // Global Ctrl+K listener
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setPaletteOpen(o => !o)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <FocusProvider>
      <div className="app-shell">
        {/* Mobile backdrop */}
        {sidebarOpen && (
          <div
            className="sidebar-backdrop open"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Mobile toggle */}
        <button
          className="sidebar-mobile-toggle"
          onClick={() => setSidebarOpen(o => !o)}
          aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          aria-expanded={sidebarOpen}
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main content */}
        <div className="app-content">
          <main className="app-main">
            <Outlet />
          </main>
        </div>

        {/* Command Palette — global overlay, no FAB (moved to header) */}
        <CommandPalette
          isOpen={paletteOpen}
          onClose={() => setPaletteOpen(false)}
        />
      </div>
    </FocusProvider>
  )
}
