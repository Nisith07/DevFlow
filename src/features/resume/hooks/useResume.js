import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/shared/lib/axios'

export function useResumeData() {
  return useQuery({
    queryKey: ['resume-data'],
    queryFn: async () => {
      const { data } = await api.get('/resume')
      return data.data
    }
  })
}

export function useSaveResumeData() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (updatedData) => {
      const { data } = await api.post('/resume', updatedData)
      return data.data
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['resume-data'], data)
    }
  })
}

export function useAIImproveResume() {
  return useMutation({
    mutationFn: async (text) => {
      const { data } = await api.post('/resume/ai-improve', { text })
      return data.data.improvement
    }
  })
}

export function useAISkillsSuggestions() {
  return useMutation({
    mutationFn: async ({ title, summary }) => {
      const { data } = await api.post('/resume/ai-skills', { title, summary })
      return data.data.skills
    }
  })
}

export function useImportLinkedIn() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (rawText) => {
      const { data } = await api.post('/resume/import-linkedin', { rawText })
      return data.data
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['resume-data'], data)
    }
  })
}
