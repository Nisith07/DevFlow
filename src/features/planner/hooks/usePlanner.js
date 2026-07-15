import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/shared/lib/axios'

export function usePlanner(dateStr) {
  const queryClient = useQueryClient()

  const plannerQuery = useQuery({
    queryKey: ['planner', dateStr],
    queryFn: async () => {
      if (!dateStr) return []
      const { data } = await api.get('/planner', { params: { date: dateStr } })
      return data.data
    },
    enabled: !!dateStr,
  })

  const createEntryMutation = useMutation({
    mutationFn: async (newEntry) => {
      const { data } = await api.post('/planner', { ...newEntry, date: dateStr })
      return data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['planner', dateStr] })
    },
  })

  const updateEntryMutation = useMutation({
    mutationFn: async ({ id, ...updates }) => {
      const { data } = await api.patch(`/planner/${id}`, updates)
      return data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['planner', dateStr] })
    },
  })

  const deleteEntryMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/planner/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['planner', dateStr] })
    },
  })

  const reorderEntriesMutation = useMutation({
    mutationFn: async (orders) => {
      const { data } = await api.put('/planner/reorder', { orders })
      return data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['planner', dateStr] })
    },
  })

  return {
    entries: plannerQuery.data || [],
    isLoading: plannerQuery.isLoading,
    error: plannerQuery.error,
    createEntry: createEntryMutation.mutateAsync,
    isCreating: createEntryMutation.isPending,
    updateEntry: updateEntryMutation.mutateAsync,
    isUpdating: updateEntryMutation.isPending,
    deleteEntry: deleteEntryMutation.mutateAsync,
    isDeleting: deleteEntryMutation.isPending,
    reorderEntries: reorderEntriesMutation.mutateAsync,
  }
}
