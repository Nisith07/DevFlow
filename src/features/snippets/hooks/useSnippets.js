import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/shared/lib/axios'

export function useSnippets(filters = {}) {
  const queryClient = useQueryClient()

  const params = {}
  if (filters.category) params.category = filters.category
  if (filters.language) params.language = filters.language
  if (filters.search)   params.search   = filters.search
  if (filters.favorite !== undefined) params.favorite = filters.favorite

  const snippetsQuery = useQuery({
    queryKey: ['snippets', params],
    queryFn: async () => {
      const { data } = await api.get('/snippets', { params })
      return data.data
    }
  })

  const createSnippetMutation = useMutation({
    mutationFn: async (newSnippet) => {
      const { data } = await api.post('/snippets', newSnippet)
      return data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['snippets'] })
    }
  })

  const updateSnippetMutation = useMutation({
    mutationFn: async ({ id, ...updates }) => {
      const { data } = await api.patch(`/snippets/${id}`, updates)
      return data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['snippets'] })
    }
  })

  const deleteSnippetMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/snippets/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['snippets'] })
    }
  })

  const toggleFavoriteMutation = useMutation({
    mutationFn: async (id) => {
      const { data } = await api.post(`/snippets/${id}/favorite`)
      return data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['snippets'] })
    }
  })

  return {
    snippets:       snippetsQuery.data ?? [],
    isLoading:      snippetsQuery.isLoading,
    error:          snippetsQuery.error,
    createSnippet:  createSnippetMutation.mutateAsync,
    isCreating:     createSnippetMutation.isPending,
    updateSnippet:  updateSnippetMutation.mutateAsync,
    isUpdating:     updateSnippetMutation.isPending,
    deleteSnippet:  deleteSnippetMutation.mutateAsync,
    isDeleting:     deleteSnippetMutation.isPending,
    toggleFavorite: toggleFavoriteMutation.mutateAsync,
  }
}
