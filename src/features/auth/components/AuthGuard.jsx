import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/useAuth'
import LoadingSpinner from '@/shared/components/LoadingSpinner'

/**
 * Wraps protected routes. If the user is not authenticated, redirects to
 * the landing page and preserves the intended destination in location state
 * so the login modal can redirect back after successful auth.
 *
 * If the user is authenticated but hasn't completed onboarding
 * (onboardingCompleted === false — only brand-new accounts), they are
 * redirected to /onboarding. Existing users where the field is undefined
 * are treated as completed and pass through untouched.
 */
export default function AuthGuard({ children }) {
  const { user, isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <LoadingSpinner fullScreen />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Only redirect when the flag is explicitly false (new signups).
  // undefined (existing DB users) passes through so we never break them.
  if (user?.onboardingCompleted === false && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />
  }

  return children
}
