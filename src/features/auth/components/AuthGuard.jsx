import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/useAuth'
import LoadingSpinner from '@/shared/components/LoadingSpinner'

/**
 * Wraps protected routes. If the user is not authenticated, redirects to
 * the landing page and preserves the intended destination in location state
 * so the login modal can redirect back after successful auth.
 */
export default function AuthGuard({ children }) {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <LoadingSpinner fullScreen />
  }

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location, openLogin: true }} replace />
  }

  return children
}
