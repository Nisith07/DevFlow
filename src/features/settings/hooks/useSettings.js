import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/shared/lib/axios'
import { useAuth } from '@/features/auth/hooks/useAuth'

export function useSaveSettings() {
  const { updateUserSettings } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (updates) => {
      const { data } = await api.patch('/auth/settings', updates)
      return data.user || data.data
    },
    onSuccess: (updatedUser) => {
      if (updatedUser) {
        updateUserSettings(updatedUser)
      }
      queryClient.invalidateQueries({ queryKey: ['auth'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['me'] })
    }
  })
}
