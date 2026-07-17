import { useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/useAuth'
import Navbar from '@/shared/components/Navbar'
import Hero from './components/Hero'
import Features from './components/Features'
import HowItWorks from './components/HowItWorks'
import About from './components/About'
import CtaBand from './components/CtaBand'
import Footer from './components/Footer'
import CustomCursor from './components/CustomCursor'

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

  // Scroll reveal IntersectionObserver animations
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
      {/* Animated Glowing Trail Cursor (Desktop only) */}
      <CustomCursor />

      {/* Floating Glassmorphic Navbar */}
      <Navbar />

      {/* Sections */}
      <Hero />
      <Features />
      <HowItWorks />
      <About />
      <CtaBand onLoginClick={() => navigate('/register')} />
      
      {/* Footer */}
      <Footer />
    </div>
  )
}
