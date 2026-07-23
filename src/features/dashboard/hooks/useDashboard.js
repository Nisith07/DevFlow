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

/**
 * Fetches the AI-generated daily briefing.
 * Cached for 4 hours so it only re-generates once per morning.
 */
export function useDailyBriefing() {
  return useQuery({
    queryKey: ['ai', 'briefing'],
    queryFn: async () => {
      const { data } = await api.post('/ai/briefing')
      return data.data
    },
    staleTime: 1000 * 60 * 60 * 4, // 4-hour cache
    retry: false,
  })
}

/**
 * Focus session stats hook.
 */
export function useFocusStats() {
  return useQuery({
    queryKey: ['focus', 'stats'],
    queryFn: async () => {
      const { data } = await api.get('/focus/stats')
      return data.data
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

/**
 * Active focus session hook.
 */
export function useActiveSession() {
  return useQuery({
    queryKey: ['focus', 'active'],
    queryFn: async () => {
      const { data } = await api.get('/focus/active')
      return data.data
    },
    refetchInterval: 10_000, // poll every 10s while mounted
    staleTime: 0,
  })
}
