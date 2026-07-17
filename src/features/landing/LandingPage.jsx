import { useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/useAuth'
import Navbar from '@/shared/components/Navbar'
import Hero from './components/Hero'
import HowItWorks from './components/HowItWorks'
import Features from './components/Features'
import CtaBand from './components/CtaBand'
import Footer from './components/Footer'

export default function LandingPage() {
  const containerRef = useRef(null)

  const { isAuthenticated, loading } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  // 1. Redirection if already authenticated
  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate('/dashboard', { replace: true })
    }
  }, [isAuthenticated, loading, navigate])

  // 2. Handle Google OAuth redirect errors by redirecting to LoginPage
  useEffect(() => {
    const authError = searchParams.get('authError')
    if (authError) {
      navigate('/login', { replace: true })
    }
  }, [searchParams, navigate])

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
      <Navbar />

      <Hero onLoginClick={() => navigate('/register')} />
      <HowItWorks />
      <Features />
      <CtaBand onLoginClick={() => navigate('/register')} />
      <Footer />
    </div>
  )
}
