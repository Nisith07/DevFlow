import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/shared/lib/axios'

/**
 * @param {{ status?: string, priority?: string, project?: string, isToday?: boolean }} filters
 */
export function useTasks(filters = {}) {
  const queryClient = useQueryClient()

  const params = {}
  if (filters.status)   params.status   = filters.status
  if (filters.priority) params.priority = filters.priority
  if (filters.project)  params.project  = filters.project
  if (filters.isToday !== undefined) params.isToday = filters.isToday

  const tasksQuery = useQuery({
    queryKey: ['tasks', params],
    queryFn: async () => {
      const { data } = await api.get('/tasks', { params })
      return data.data
    },
  })

  const createTaskMutation = useMutation({
    mutationFn: async (newTask) => {
      const { data } = await api.post('/tasks', newTask)
      return data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })

  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, ...updates }) => {
      const { data } = await api.patch(`/tasks/${id}`, updates)
      return data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })

  const deleteTaskMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/tasks/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })

  const completeTaskMutation = useMutation({
    mutationFn: async (id) => {
      const { data } = await api.post(`/tasks/${id}/complete`)
      return data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })

  const addSubtaskMutation = useMutation({
    mutationFn: async ({ taskId, title }) => {
      const { data } = await api.post(`/tasks/${taskId}/subtasks`, { title })
      return data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })

  const updateSubtaskMutation = useMutation({
    mutationFn: async ({ taskId, subId, ...updates }) => {
      const { data } = await api.patch(`/tasks/${taskId}/subtasks/${subId}`, updates)
      return data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })

  const deleteSubtaskMutation = useMutation({
    mutationFn: async ({ taskId, subId }) => {
      const { data } = await api.delete(`/tasks/${taskId}/subtasks/${subId}`)
      return data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })

  return {
    tasks:        tasksQuery.data ?? [],
    isLoading:    tasksQuery.isLoading,
    error:        tasksQuery.error,
    createTask:   createTaskMutation.mutateAsync,
    isCreating:   createTaskMutation.isPending,
    updateTask:   updateTaskMutation.mutateAsync,
    isUpdating:   updateTaskMutation.isPending,
    deleteTask:   deleteTaskMutation.mutateAsync,
    isDeleting:   deleteTaskMutation.isPending,
    completeTask: completeTaskMutation.mutateAsync,
    addSubtask:   addSubtaskMutation.mutateAsync,
    updateSubtask: updateSubtaskMutation.mutateAsync,
    deleteSubtask: deleteSubtaskMutation.mutateAsync,
  }
}

export function useReorderTasks() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (updates) => {
      const { data } = await api.patch('/tasks/reorder', { updates })
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}

export function useEstimateTask() {
  return useMutation({
    mutationFn: async ({ title, description }) => {
      const { data } = await api.post('/ai/estimate-task', { title, description })
      return data.data
    },
  })
}
