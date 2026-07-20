import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/shared/lib/axios'

const API_URL = import.meta.env.VITE_API_URL || 'https://devflow-backend-53bm.onrender.com'

/**
 * Returns the URL to redirect the browser to for GitHub OAuth.
 * This is a full page redirect (not an axios call) — GitHub requires a real
 * browser navigation with proper cookies/redirects.
 */
export function getGitHubOAuthUrl() {
  return `${API_URL}/api/v1/github/oauth/start`
}

export function useGitHubTokenStatus() {
  return useQuery({
    queryKey: ['github-token-status'],
    queryFn: async () => {
      const { data } = await api.get('/github/token')
      return data.data
    }
  })
}

export function useDeleteGitHubToken() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      await api.delete('/github/token')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['github-token-status'] })
      queryClient.setQueryData(['github-repos'], [])
    }
  })
}

export function useGitHubRepos() {
  return useQuery({
    queryKey: ['github-repos'],
    queryFn: async () => {
      const { data } = await api.get('/github/repos')
      return data.data
    }
  })
}

export function useCreateGitHubRepo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (newRepo) => {
      const { data } = await api.post('/github/repos', newRepo)
      return data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['github-repos'] })
    }
  })
}

export function useGitHubRepoMeta(owner, repo) {
  return useQuery({
    queryKey: ['github-repo-meta', owner, repo],
    queryFn: async () => {
      if (!owner || !repo) return null
      const { data } = await api.get(`/github/repos/${owner}/${repo}`)
      return data.data
    },
    enabled: !!owner && !!repo
  })
}

export function useGitHubBranches(owner, repo) {
  return useQuery({
    queryKey: ['github-repo-branches', owner, repo],
    queryFn: async () => {
      if (!owner || !repo) return []
      const { data } = await api.get(`/github/repos/${owner}/${repo}/branches`)
      return data.data
    },
    enabled: !!owner && !!repo
  })
}

export function useGitHubPRs(owner, repo) {
  return useQuery({
    queryKey: ['github-repo-prs', owner, repo],
    queryFn: async () => {
      if (!owner || !repo) return []
      const { data } = await api.get(`/github/repos/${owner}/${repo}/pulls`)
      return data.data
    },
    enabled: !!owner && !!repo
  })
}

export function useGitHubCommits(owner, repo) {
  return useQuery({
    queryKey: ['github-repo-commits', owner, repo],
    queryFn: async () => {
      if (!owner || !repo) return []
      const { data } = await api.get(`/github/repos/${owner}/${repo}/commits`)
      return data.data
    },
    enabled: !!owner && !!repo
  })
}

export function useGitHubReleases(owner, repo) {
  return useQuery({
    queryKey: ['github-repo-releases', owner, repo],
    queryFn: async () => {
      if (!owner || !repo) return []
      const { data } = await api.get(`/github/repos/${owner}/${repo}/releases`)
      return data.data
    },
    enabled: !!owner && !!repo
  })
}
