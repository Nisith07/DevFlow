import { useQuery } from '@tanstack/react-query'
import api from '@/shared/lib/axios'

export function useAnalytics() {
  return useQuery({
    queryKey: ['analytics', 'summary'],
    queryFn: async () => {
      const { data } = await api.get('/analytics/summary')
      return data.data
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
