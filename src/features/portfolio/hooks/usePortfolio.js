import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/shared/lib/axios'

export function usePortfolioData() {
  return useQuery({
    queryKey: ['portfolio-data'],
    queryFn: async () => {
      const { data } = await api.get('/portfolio')
      return data.data
    }
  })
}

export function useSavePortfolioData() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (updatedData) => {
      const { data } = await api.post('/portfolio', updatedData)
      return data.data
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['portfolio-data'], data)
    }
  })
}

export function useAddPortfolioMessage() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ name, email, message }) => {
      const { data } = await api.post('/portfolio/messages', { name, email, message })
      return data.data
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['portfolio-data'], data)
    }
  })
}

export function useDeployPortfolio() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post('/portfolio/deploy')
      return data.data
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['portfolio-data'], data)
    }
  })
}
