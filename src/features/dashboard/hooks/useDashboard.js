import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/shared/lib/axios'

/**
 * Fetches the dashboard summary from a single backend endpoint.
 * Returns today's tasks, yesterday's completions, streak, and task stats.
 */
export function useDashboard() {
  return useQuery({
    queryKey: ['dashboard', 'summary'],
    queryFn: async () => {
      const { data } = await api.get('/dashboard/summary')
      return data.data
    },
    // Refresh on window focus so the dashboard stays current after
    // the user switches away and completes work in another tab.
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 2, // 2 minutes
  })
}

/**
 * Mark a today-task complete directly from the dashboard.
 * Invalidates both the dashboard summary and the general tasks cache.
 */
export function useCompleteTask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (taskId) => {
      const { data } = await api.post(`/tasks/${taskId}/complete`)
      return data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}

/**
 * Create a quick task pinned to today from the dashboard QuickAdd form.
 */
export function useCreateTodayTask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (title) => {
      const { data } = await api.post('/tasks', { title, isToday: true })
      return data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}

/**
 * Update a task's status from the dashboard.
 */
export function useUpdateTaskStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, status }) => {
      const { data } = await api.patch(`/tasks/${id}`, { status })
      return data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}

