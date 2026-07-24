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
import Changelog from './components/Changelog'
import Faq from './components/Faq'
import CtaBand from './components/CtaBand'
import Footer from './components/Footer'

export default function LandingPage() {
  const { isAuthenticated, loading } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  /* Redirect authenticated users */
  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate('/dashboard', { replace: true })
    }
  }, [isAuthenticated, loading, navigate])

  /* Handle OAuth error */
  useEffect(() => {
    if (searchParams.get('authError')) {
      navigate('/login', { replace: true })
    }
  }, [searchParams, navigate])

  /* Lenis smooth scrolling */
  useEffect(() => {
    let lenis

    const initLenis = async () => {
      try {
        const LenisModule = await import('lenis')
        const Lenis = LenisModule.default

        lenis = new Lenis({
          lerp: 0.09,
          smoothWheel: true,
          wheelMultiplier: 0.9,
          touchMultiplier: 1.5,
          infinite: false,
        })

        const raf = (time) => {
          lenis.raf(time)
          requestAnimationFrame(raf)
        }
        requestAnimationFrame(raf)
      } catch (e) {
        // Lenis not available — graceful degradation
        console.warn('Lenis smooth scroll not available:', e.message)
      }
    }

    initLenis()

    return () => {
      if (lenis) lenis.destroy()
    }
  }, [])

  return (
    <div className="lp-root">
      {/* Background */}
      <div className="lp-bg-canvas" />
      <div className="lp-bg-glow-3" />

      {/* Nav */}
      <Navbar />

      {/* Sections */}
      <main>
        <Hero />
        <HowItWorks />
        <Features />
        <DashboardPreview />
        <About />
        <Integrations />
        <Testimonials />
        <Pricing />
        <Changelog />
        <Faq />
        <CtaBand onLoginClick={() => navigate('/register')} />
        <Footer />
      </main>


      <Outlet />
    </div>
  )
}
