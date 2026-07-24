import { useMutation } from '@tanstack/react-query'
import api from '@/shared/lib/axios'
import useAuthStore from '@/features/auth/store/authStore'

/**
 * Submits all onboarding data to the backend, marks the user as onboarded,
 * and updates the Zustand auth store so AuthGuard stops redirecting.
 */
export function useOnboarding() {
  const setUser = useAuthStore((s) => s.setUser)

  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.patch('/auth/onboarding', payload)
      return data
    },
    onSuccess: (data) => {
      if (data?.user) {
        setUser(data.user)
      }
    },
  })
}
