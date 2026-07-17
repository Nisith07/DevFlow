import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LoaderCircle, LockKeyhole, Mail, X } from 'lucide-react'
import api from '@/shared/lib/axios'

const API_URL = import.meta.env.VITE_API_URL || 'https://devflow-backend-53bm.onrender.com'

export default function RegisterPage() {
  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  const navigate = useNavigate()

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      await api.post('/auth/signup', { name, email, password })
      // On success, redirect to Login with success message
      navigate('/login', {
        state: { successMessage: 'Account created successfully! Please sign in with your credentials.' }
      })
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
          <span className="auth-brand-mark" aria-hidden="true">
            <img src="/logo-icon.svg" alt="" />
          </span>
          <span>Dev<span style={{ color: '#8b5cf6' }}>Flow</span></span>
        </div>

        <h2 id="auth-title">Create your account</h2>
        <p className="auth-subtitle">Start building with DevFlow.</p>

        <button className="auth-google" type="button" onClick={signInWithGoogle}>
          <span className="auth-google-mark">G</span>
          Continue with Google
        </button>

        <div className="auth-divider"><span>or</span></div>

        <form className="auth-form" onSubmit={submit}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            autoComplete="name"
            required
            maxLength={80}
          />

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
              autoComplete="new-password"
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
              {loading ? 'Please wait…' : 'Create account'}
            </span>
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => navigate('/login')}
          >
            Sign in
          </button>
        </p>
      </section>
    </div>
  )
}
