import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/shared/lib/axios'

export function useAIConversations() {
  return useQuery({
    queryKey: ['ai-conversations'],
    queryFn: async () => {
      const { data } = await api.get('/ai')
      return data.data
    },
  })
}

export function useAIConversation(id) {
  return useQuery({
    queryKey: ['ai-conversation', id],
    queryFn: async () => {
      if (!id) return null
      const { data } = await api.get(`/ai/${id}`)
      return data.data
    },
    enabled: !!id,
  })
}

export function useCreateAIConversation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (title) => {
      const { data } = await api.post('/ai', { title })
      return data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-conversations'] })
    },
  })
}

export function useDeleteAIConversation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id) => {
      await api.delete(`/ai/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-conversations'] })
    },
  })
}

export function useSendAIMessage() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ conversationId, text }) => {
      const { data } = await api.post(`/ai/${conversationId}/messages`, { text })
      return data.data
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['ai-conversation', variables.conversationId] })
      queryClient.invalidateQueries({ queryKey: ['ai-conversations'] })
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['planner'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['activity'] })
    },
  })
}

export function useAICopilotHistory(filters = {}) {
  const params = {}
  if (filters.capability) params.capability = filters.capability
  if (filters.favorite !== undefined) params.favorite = filters.favorite

  return useQuery({
    queryKey: ['ai-copilot-history', params],
    queryFn: async () => {
      const { data } = await api.get('/ai/copilot/history', { params })
      return data.data
    },
  })
}

export function useRunCopilotTool() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ capability, prompt }) => {
      const { data } = await api.post('/ai/copilot/run', { capability, prompt })
      return data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-copilot-history'] })
      queryClient.invalidateQueries({ queryKey: ['activity'] })
    },
  })
}

export function useUpdateCopilotHistory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, isFavorite }) => {
      const { data } = await api.patch(`/ai/copilot/history/${id}`, { isFavorite })
      return data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-copilot-history'] })
    },
  })
}

export function useDeleteCopilotHistory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id) => {
      await api.delete(`/ai/copilot/history/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-copilot-history'] })
    },
  })
}
