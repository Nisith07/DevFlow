import { Outlet } from 'react-router-dom'
import Sidebar from '@/shared/components/Sidebar'

export default function AppLayout() {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-content">
        <main className="app-main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
