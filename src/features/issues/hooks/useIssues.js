import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/shared/lib/axios'

/**
 * @param {{ status?: string, type?: string, project?: string, search?: string }} filters
 */
export function useIssues(filters = {}) {
  const queryClient = useQueryClient()

  const params = {}
  if (filters.status) params.status = filters.status
  if (filters.type) params.type = filters.type
  if (filters.project) params.project = filters.project
  if (filters.search) params.search = filters.search

  const issuesQuery = useQuery({
    queryKey: ['issues', params],
    queryFn: async () => {
      const { data } = await api.get('/issues', { params })
      return data.data
    },
  })

  const createIssueMutation = useMutation({
    mutationFn: async (newIssue) => {
      const { data } = await api.post('/issues', newIssue)
      return data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issues'] })
    },
  })

  const updateIssueMutation = useMutation({
    mutationFn: async ({ id, ...updates }) => {
      const { data } = await api.patch(`/issues/${id}`, updates)
      return data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issues'] })
    },
  })

  const deleteIssueMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/issues/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issues'] })
    },
  })

  const addCommentMutation = useMutation({
    mutationFn: async ({ issueId, content }) => {
      const { data } = await api.post(`/issues/${issueId}/comments`, { content })
      return data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issues'] })
    },
  })

  const deleteCommentMutation = useMutation({
    mutationFn: async ({ issueId, commentId }) => {
      const { data } = await api.delete(`/issues/${issueId}/comments/${commentId}`)
      return data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issues'] })
    },
  })

  return {
    issues: issuesQuery.data ?? [],
    isLoading: issuesQuery.isLoading,
    error: issuesQuery.error,
    createIssue: createIssueMutation.mutateAsync,
    isCreating: createIssueMutation.isPending,
    updateIssue: updateIssueMutation.mutateAsync,
    isUpdating: updateIssueMutation.isPending,
    deleteIssue: deleteIssueMutation.mutateAsync,
    isDeleting: deleteIssueMutation.isPending,
    addComment: addCommentMutation.mutateAsync,
    deleteComment: deleteCommentMutation.mutateAsync
  }
}
