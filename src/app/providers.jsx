import { useEffect } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import queryClient from '@/shared/lib/queryClient'
import useAuthStore from '@/features/auth/store/authStore'

export default function Providers({ children }) {
  const initAuth = useAuthStore((state) => state.initAuth)

  useEffect(() => {
    initAuth()
  }, [initAuth])

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
