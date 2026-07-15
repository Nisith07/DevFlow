import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  withCredentials: true,          // send httpOnly cookie on every request
  headers: { 'Content-Type': 'application/json' },
  timeout: 15_000,
})

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
