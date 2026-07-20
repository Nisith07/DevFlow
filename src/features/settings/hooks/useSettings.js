import { useMutation } from '@tanstack/react-query'
import api from '@/shared/lib/axios'
import { useAuth } from '@/features/auth/hooks/useAuth'

export function useSaveSettings() {
  const { updateUserSettings } = useAuth()

  return useMutation({
    mutationFn: async (updates) => {
      const { data } = await api.patch('/auth/settings', updates)
      return data.user
    },
    onSuccess: (updatedUser) => {
      updateUserSettings(updatedUser)
    }
  })
}
