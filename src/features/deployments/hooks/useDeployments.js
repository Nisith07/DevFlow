import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/shared/lib/axios'

const QK = 'deployments'

export function useDeployments() {
  return useQuery({
    queryKey: [QK],
    queryFn: async () => {
      const { data } = await api.get('/deployments')
      return data.data
    },
    staleTime: 30_000,
  })
}

export function useDeployment(id) {
  return useQuery({
    queryKey: [QK, id],
    queryFn: async () => {
      const { data } = await api.get(`/deployments/${id}`)
      return data.data
    },
    enabled: !!id,
  })
}

export function useCreateDeployment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.post('/deployments', payload)
      return data.data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [QK] }),
  })
}

export function useUpdateDeployment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...updates }) => {
      const { data } = await api.patch(`/deployments/${id}`, updates)
      return data.data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [QK] }),
  })
}

export function useRollbackDeployment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await api.post(`/deployments/${id}/rollback`)
      return data.data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [QK] }),
  })
}

export function useDeleteDeployment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id) => api.delete(`/deployments/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: [QK] }),
  })
}
