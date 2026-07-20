import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/shared/lib/axios'

export function useIntegrationsData() {
  return useQuery({
    queryKey: ['integrations-data'],
    queryFn: async () => {
      const { data } = await api.get('/integrations')
      return data.data
    }
  })
}

export function useSaveIntegrationSettings() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (updatedData) => {
      const { data } = await api.post('/integrations', updatedData)
      return data.data
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['integrations-data'], data)
    }
  })
}
