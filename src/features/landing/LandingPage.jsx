import { useEffect } from 'react'
import { useNavigate, useSearchParams, Outlet } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/useAuth'
import Navbar from '@/shared/components/Navbar'
import Hero from './components/Hero'
import HowItWorks from './components/HowItWorks'
import Features from './components/Features'
import DashboardPreview from './components/DashboardPreview'
import Integrations from './components/Integrations'
import About from './components/About'
import Testimonials from './components/Testimonials'
import Pricing from './components/Pricing'
import Faq from './components/Faq'
import CtaBand from './components/CtaBand'
import Footer from './components/Footer'

export default function LandingPage() {
  const { isAuthenticated, loading } = useAuth()
  const navigate = useNavigate()
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
      {/* Background patterns */}
      <div className="lp-bg-canvas" />
      <div className="lp-bg-glow-3" />

      {/* Navbar — fixed, scroll-aware */}
      <Navbar />

      {/* Page sections — normal document scroll */}
      <main>
        <Hero />
        <HowItWorks />
        <Features />
        <DashboardPreview />
        <Integrations />
        <About />
        <Testimonials />
        <Pricing />
        <Faq />
        <CtaBand onLoginClick={() => navigate('/register')} />
        <Footer />
      </main>

      {/* Login / Register modals render here */}
      <Outlet />
    </div>
  )
}
