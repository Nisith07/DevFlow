import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/shared/lib/axios'

export function useProjects() {
  const queryClient = useQueryClient()

  const projectsQuery = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data } = await api.get('/projects')
      return data.data
    },
  })

  const createProjectMutation = useMutation({
    mutationFn: async (newProject) => {
      const { data } = await api.post('/projects', newProject)
      return data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })

  const updateProjectMutation = useMutation({
    mutationFn: async ({ id, ...updates }) => {
      const { data } = await api.patch(`/projects/${id}`, updates)
      return data.data
    },
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      queryClient.invalidateQueries({ queryKey: ['project', updated.id] })
    },
  })

  const deleteProjectMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/projects/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })

  return {
    projects: projectsQuery.data || [],
    isLoading: projectsQuery.isLoading,
    error: projectsQuery.error,
    createProject: createProjectMutation.mutateAsync,
    isCreating: createProjectMutation.isPending,
    updateProject: updateProjectMutation.mutateAsync,
    isUpdating: updateProjectMutation.isPending,
    deleteProject: deleteProjectMutation.mutateAsync,
    isDeleting: deleteProjectMutation.isPending,
  }
}

export function useProject(id) {
  return useQuery({
    queryKey: ['project', id],
    queryFn: async () => {
      if (!id) return null
      const { data } = await api.get(`/projects/${id}`)
      return data.data
    },
    enabled: !!id,
  })
}
