import { useInfiniteQuery } from '@tanstack/react-query'
import api from '@/shared/lib/axios'

const PAGE_SIZE = 20

/**
 * Infinite-scroll hook for the activity timeline.
 * Each page fetches 20 events from /api/v1/activity?page=N&limit=20.
 */
export function useActivity() {
  return useInfiniteQuery({
    queryKey: ['activity'],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await api.get('/activity', {
        params: { page: pageParam, limit: PAGE_SIZE },
      })
      return data
    },
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.meta
      return page < totalPages ? page + 1 : undefined
    },
    initialPageParam: 1,
  })
}
