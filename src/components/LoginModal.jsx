import { useState } from 'react'
import { LoaderCircle, LockKeyhole, Mail, X } from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function LoginModal({ onClose, onAuthenticated }) {
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const isSignup = mode === 'signup'

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch(`${API_URL}/api/auth/${isSignup ? 'signup' : 'login'}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isSignup ? { name, email, password } : { email, password }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Unable to sign in.')
      onAuthenticated(data.user)
    } catch (requestError) {
      setError(requestError.message || 'Unable to reach the server. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const signInWithGoogle = () => {
    window.location.assign(`${API_URL}/api/auth/google`)
  }

  return (
    <div className="auth-overlay" role="presentation" onMouseDown={onClose}>
      <section className="auth-modal" role="dialog" aria-modal="true" aria-labelledby="auth-title" onMouseDown={(event) => event.stopPropagation()}>
        <button className="auth-close" type="button" onClick={onClose} aria-label="Close sign in"><X size={19} /></button>
        <div className="auth-brand">
          <span className="auth-brand-mark" aria-hidden="true">⌘</span>
          <span>Dev<span>Flow</span></span>
        </div>
        <h2 id="auth-title">{isSignup ? 'Create your account' : 'Welcome back'}</h2>
        <p className="auth-subtitle">{isSignup ? 'Start building with DevFlow.' : 'Sign in to continue to your workspace.'}</p>

        <button className="auth-google" type="button" onClick={signInWithGoogle}>
          <span className="auth-google-mark">G</span> Continue with Google
        </button>
        <div className="auth-divider"><span>or</span></div>

        <form className="auth-form" onSubmit={submit}>
          {isSignup && <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" autoComplete="name" required maxLength="80" />}
          <label className="auth-input-wrap"><Mail size={18} /><input value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="you@example.com" autoComplete="email" required /></label>
          <label className="auth-input-wrap"><LockKeyhole size={18} /><input value={password} onChange={(event) => setPassword(event.target.value)} type="password" placeholder="Password" autoComplete={isSignup ? 'new-password' : 'current-password'} minLength="8" required /></label>
          {error && <p className="auth-error" role="alert">{error}</p>}
          <button className="auth-submit" type="submit" disabled={loading}>
            <span className="auth-bubble auth-bubble-one" /><span className="auth-bubble auth-bubble-two" /><span className="auth-bubble auth-bubble-three" />
            <span className="auth-submit-label">
            {loading ? <LoaderCircle size={17} className="auth-spinner" /> : null}
            {loading ? 'Please wait…' : isSignup ? 'Create account' : 'Sign in'}
            </span>
          </button>
        </form>
        <p className="auth-switch">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button type="button" onClick={() => { setMode(isSignup ? 'login' : 'signup'); setError('') }}>
            {isSignup ? 'Sign in' : 'Create account'}
          </button>
        </p>
      </section>
    </div>
  )
}
