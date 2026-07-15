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
        // If we have a cached user, skip the loading flash
        if (get().user) {
          set({ loading: false })
          return
        }
        try {
          const { data } = await api.get('/auth/me')
          set({ user: data.user, loading: false })
        } catch {
          set({ user: null, loading: false })
        }
      },

      /** Called after successful login / signup / Google OAuth */
      login: (user) => set({ user, loading: false, authError: null }),

      /** Clears local state AND invalidates the server cookie */
      logout: async () => {
        try {
          await api.post('/auth/logout')
        } catch {
          // ignore — clear local state regardless
        }
        set({ user: null, loading: false })
      },
    }),
    {
      name: 'devflow-auth',
      storage: createJSONStorage(() => sessionStorage),
      // Only persist the user object, never loading/error states
      partialize: (state) => ({ user: state.user }),
    },
  ),
)

export default useAuthStore
