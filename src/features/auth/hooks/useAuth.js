import useAuthStore from '@/features/auth/store/authStore'

/**
 * Convenience hook exposing auth state and actions.
 * Keeps components decoupled from the store implementation.
 */
export function useAuth() {
  const user    = useAuthStore((state) => state.user)
  const loading = useAuthStore((state) => state.loading)
  const login   = useAuthStore((state) => state.login)
  const logout  = useAuthStore((state) => state.logout)
  const updateUserSettings = useAuthStore((state) => state.updateUserSettings)

  return {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
    updateUserSettings,
  }
}
