import { useEffect, useRef, useState } from 'react'
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/useAuth'
import Navbar from '@/shared/components/Navbar'
import LoginModal from '@/features/auth/components/LoginModal'
import Hero from './components/Hero'
import HowItWorks from './components/HowItWorks'
import Features from './components/Features'
import CtaBand from './components/CtaBand'
import Footer from './components/Footer'

export default function LandingPage() {
  const [loginOpen, setLoginOpen] = useState(false)
  const containerRef = useRef(null)

  const { isAuthenticated, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()

  // 1. Redirection if already authenticated
  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate('/dashboard', { replace: true })
    }
  }, [isAuthenticated, loading, navigate])

  // 2. Open login modal if requested by AuthGuard
  useEffect(() => {
    if (location.state?.openLogin) {
      setLoginOpen(true)
      // Clear the state so page refresh doesn't reopen it
      navigate(location.pathname, { replace: true, state: {} })
    }
  }, [location, navigate])

  // 3. Handle Google OAuth redirect errors
  useEffect(() => {
    const authError = searchParams.get('authError')
    if (authError) {
      setLoginOpen(true)
      searchParams.delete('authError')
      setSearchParams(searchParams, { replace: true })
    }
  }, [searchParams, setSearchParams])

  // Scroll reveal animation
  useEffect(() => {
    const els = containerRef.current?.querySelectorAll('.reveal') ?? []
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in')
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12 },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <div className="lp-root" ref={containerRef}>
      <Navbar onLoginClick={(redirectPath) => setLoginOpen(redirectPath || true)} />

      <Hero onLoginClick={() => setLoginOpen(true)} />
      <HowItWorks />
      <Features />
      <CtaBand onLoginClick={() => setLoginOpen(true)} />
      <Footer />

      {loginOpen && (
        <LoginModal
          onClose={() => setLoginOpen(false)}
          defaultRedirectTo={typeof loginOpen === 'string' ? loginOpen : undefined}
        />
      )}
    </div>
  )
}
