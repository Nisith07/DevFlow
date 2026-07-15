import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import api from '@/shared/lib/axios'

/**
 * Global authentication store.
 *
 * Persists `user` to sessionStorage so a page refresh doesn't flash
 * the landing page before /me resolves, while never storing tokens
 * (the JWT lives in an httpOnly cookie managed by the server).
 */
const useAuthStore = create(
  persist(
    (set, get) => ({
      /** @type {{ id: string, name: string, email: string, avatarUrl: string, providers: string[] } | null} */
      user: null,
      token: null,

      /** true while the initial /me check is in flight */
      loading: true,

      /** non-null means we should show the login modal */
      authError: null,

      // ── Setters ─────────────────────────────────────────────────────
      setUser: (user) => set({ user, loading: false, authError: null }),
      setLoading: (loading) => set({ loading }),
      setAuthError: (authError) => set({ authError }),

      // ── Actions ──────────────────────────────────────────────────────

      /**
       * Verify the httpOnly cookie with the server on app start.
       * Called once in the root provider.
       */
      initAuth: async () => {
        // 1. Check for token in URL query params (from Google OAuth redirect)
        if (typeof window !== 'undefined') {
          const params = new URLSearchParams(window.location.search)
          const tokenFromUrl = params.get('token')
          if (tokenFromUrl) {
            set({ token: tokenFromUrl })
            // Clean up the URL search params so the token isn't visible in address bar
            params.delete('token')
            params.delete('auth')
            const newSearch = params.toString()
            const newUrl = window.location.pathname + (newSearch ? `?${newSearch}` : '')
            window.history.replaceState({}, '', newUrl)
          }
        }

        const isGoogleSuccess = typeof window !== 'undefined' && window.location?.search?.includes('auth=success')
        // If we have a cached user and token, skip the loading flash, unless we just completed Google OAuth
        if (get().user && get().token && !isGoogleSuccess) {
          set({ loading: false })
          return
        }
        try {
          const { data } = await api.get('/auth/me')
          set({ user: data.user, loading: false })
        } catch {
          set({ user: null, token: null, loading: false })
        }
      },

      /** Called after successful login / signup / Google OAuth */
      login: (user, token) => set({ user, token, loading: false, authError: null }),

      /** Clears local state AND invalidates the server cookie */
      logout: async () => {
        try {
          await api.post('/auth/logout')
        } catch {
          // ignore — clear local state regardless
        }
        set({ user: null, token: null, loading: false })
      },
    }),
    {
      name: 'devflow-auth',
      storage: createJSONStorage(() => sessionStorage),
      // Only persist the user and token object, never loading/error states
      partialize: (state) => ({ user: state.user, token: state.token }),
    },
  ),
)

export default useAuthStore
