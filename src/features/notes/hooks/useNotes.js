import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/shared/lib/axios'

export function useNotes(filters = {}) {
  const queryClient = useQueryClient()

  const params = {}
  if (filters.project) params.project = filters.project
  if (filters.tag)     params.tag     = filters.tag
  if (filters.search)  params.search  = filters.search
  if (filters.pinned !== undefined) params.pinned = filters.pinned
  if (filters.favorite !== undefined) params.favorite = filters.favorite
  if (filters.folder !== undefined) params.folder = filters.folder

  const notesQuery = useQuery({
    queryKey: ['notes', params],
    queryFn: async () => {
      const { data } = await api.get('/notes', { params })
      return data.data
    },
  })

  const createNoteMutation = useMutation({
    mutationFn: async (newNote) => {
      const { data } = await api.post('/notes', newNote)
      return data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    },
  })

  const updateNoteMutation = useMutation({
    mutationFn: async ({ id, ...updates }) => {
      const { data } = await api.patch(`/notes/${id}`, updates)
      return data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    },
  })

  const deleteNoteMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/notes/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    },
  })

  const togglePinMutation = useMutation({
    mutationFn: async (id) => {
      const { data } = await api.post(`/notes/${id}/pin`)
      return data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    },
  })

  return {
    notes:       notesQuery.data ?? [],
    isLoading:   notesQuery.isLoading,
    error:       notesQuery.error,
    createNote:  createNoteMutation.mutateAsync,
    isCreating:  createNoteMutation.isPending,
    updateNote:  updateNoteMutation.mutateAsync,
    isUpdating:  updateNoteMutation.isPending,
    deleteNote:  deleteNoteMutation.mutateAsync,
    isDeleting:  deleteNoteMutation.isPending,
    togglePin:   togglePinMutation.mutateAsync,
  }
}

export function useNote(id) {
  return useQuery({
    queryKey: ['note', id],
    queryFn: async () => {
      if (!id) return null
      const { data } = await api.get(`/notes/${id}`)
      return data.data
    },
    enabled: !!id,
  })
}
