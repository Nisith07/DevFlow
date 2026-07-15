import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'https://devflow-backend-53bm.onrender.com'

const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  withCredentials: true,          // send httpOnly cookie on every request
  headers: { 'Content-Type': 'application/json' },
  timeout: 15_000,
})

// Read persisted token directly from sessionStorage (avoids circular import with authStore).
// This is the fallback for when the browser blocks cross-site httpOnly cookies.
function getStoredToken() {
  try {
    const raw = sessionStorage.getItem('devflow-auth')
    if (!raw) return null
    return JSON.parse(raw)?.state?.token ?? null
  } catch {
    return null
  }
}

// Attach JWT token to every request as Authorization header fallback
api.interceptors.request.use(
  (config) => {
    const token = getStoredToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Normalise error shape so every call can do: catch(e) => e.message
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred.'
    return Promise.reject(new Error(message))
  },
)

export default api
