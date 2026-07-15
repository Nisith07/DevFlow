import { QueryClient } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,      // 5 minutes before background refetch
      gcTime:    1000 * 60 * 10,     // 10 minutes before cache garbage collection
      retry: (failureCount, error) => {
        // Don't retry on 401/403 — user needs to authenticate
        if (error?.response?.status === 401) return false
        if (error?.response?.status === 403) return false
        return failureCount < 2
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
})

export default queryClient
