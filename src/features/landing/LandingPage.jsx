import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/useAuth'
import Navbar    from '@/shared/components/Navbar'
import Hero      from './components/Hero'
import Features  from './components/Features'
import HowItWorks from './components/HowItWorks'
import About     from './components/About'
import CtaBand   from './components/CtaBand'
import Footer    from './components/Footer'
import CustomCursor from './components/CustomCursor'

export default function LandingPage() {
  const { isAuthenticated, loading } = useAuth()
  const navigate      = useNavigate()
  const [searchParams] = useSearchParams()

  /* Redirect authenticated users to the dashboard */
  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate('/dashboard', { replace: true })
    }
  }, [isAuthenticated, loading, navigate])

  /* Handle OAuth error query param */
  useEffect(() => {
    if (searchParams.get('authError')) {
      navigate('/login', { replace: true })
    }
  }, [searchParams, navigate])

  return (
    <div className="lp-root">
      {/* Custom cursor — auto-disabled on touch devices via CSS/JS */}
      <CustomCursor />

      {/* Navbar — fixed, scroll-aware */}
      <Navbar />

      {/* Page sections — normal document scroll */}
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <About />
        <CtaBand onLoginClick={() => navigate('/register')} />
        <Footer />
      </main>
    </div>
  )
}
