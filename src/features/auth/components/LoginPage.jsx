import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { LoaderCircle, LockKeyhole, Mail, X } from 'lucide-react'
import api from '@/shared/lib/axios'
import useAuthStore from '@/features/auth/store/authStore'

const API_URL = import.meta.env.VITE_API_URL || 'https://devflow-backend-53bm.onrender.com'

export default function LoginPage() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  const login    = useAuthStore((state) => state.login)
  const navigate = useNavigate()
  const location = useLocation()

  // Read success message passed from registration redirect
  const successMessage = location.state?.successMessage
  const redirectTo = location.state?.from?.pathname || '/dashboard'

  const handleSuccess = (user, token) => {
    login(user, token)
    navigate(redirectTo, { replace: true })
  }

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { data } = await api.post('/auth/login', { email, password })
      handleSuccess(data.user, data.token)
    } catch (err) {
      setError(err.message || 'Unable to reach the server. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const signInWithGoogle = () => {
    window.location.assign(`${API_URL}/api/auth/google`)
  }

  return (
    <div className="auth-page-container">
      <section
        className="auth-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-title"
      >
        <button
          className="auth-close"
          type="button"
          onClick={() => navigate('/')}
          aria-label="Back to home"
        >
          <X size={19} />
        </button>

        <div className="auth-brand" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <span className="auth-brand-mark" aria-hidden="true">⌘</span>
          <span>Dev<span style={{ color: 'var(--color-amber)' }}>Flow</span></span>
        </div>

        <h2 id="auth-title">Welcome back</h2>
        <p className="auth-subtitle">Sign in to continue to your workspace.</p>

        <button className="auth-google" type="button" onClick={signInWithGoogle}>
          <span className="auth-google-mark">G</span>
          Continue with Google
        </button>

        <div className="auth-divider"><span>or</span></div>

        <form className="auth-form" onSubmit={submit}>
          {successMessage && !error && (
            <p className="auth-success" role="alert">{successMessage}</p>
          )}

          <label className="auth-input-wrap">
            <Mail size={18} />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </label>

          <label className="auth-input-wrap">
            <LockKeyhole size={18} />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
              autoComplete="current-password"
              minLength={8}
              required
            />
          </label>

          {error && (
            <p className="auth-error" role="alert">{error}</p>
          )}

          <button className="auth-submit" type="submit" disabled={loading}>
            <span className="auth-submit-label">
              {loading && <LoaderCircle size={17} className="auth-spinner" />}
              {loading ? 'Please wait…' : 'Sign in'}
            </span>
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={() => navigate('/register')}
          >
            Create account
          </button>
        </p>
      </section>
    </div>
  )
}
