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

// Import GSAP + ScrollTrigger
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function LandingPage() {
  const containerRef = useRef(null)
  const scrollContainerRef = useRef(null)

  const { isAuthenticated, loading } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  // 1. Redirection if already authenticated
  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate('/dashboard', { replace: true })
    }
  }, [isAuthenticated, loading, navigate])

  // 2. Handle Google OAuth redirect errors
  useEffect(() => {
    const authError = searchParams.get('authError')
    if (authError) {
      navigate('/login', { replace: true })
    }
  }, [searchParams, navigate])

  // 3. Cinematic GSAP ScrollTrigger Animation (Desktop only)
  useEffect(() => {
    const isMobile = window.innerWidth <= 768 || 'ontouchstart' in window
    if (isMobile) return

    const scrollContainer = scrollContainerRef.current
    const panels = scrollContainer.querySelectorAll('.cinematic-section')

    // Create custom scroll timeline mapping 5 compositions
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: scrollContainer,
        start: 'top top',
        end: '+=400%', // 4 transition folds
        scrub: 1.2,
        pin: true,
        anticipatePin: 1,
        snap: {
          snapTo: 1 / 4,
          duration: 0.5,
          delay: 0.1,
          ease: 'power2.inOut'
        },
        onUpdate: (self) => {
          // Identify active index (0 to 4)
          const activeIdx = Math.round(self.progress * 4)
          panels.forEach((panel, idx) => {
            if (idx === activeIdx) {
              panel.classList.add('active-pane')
            } else {
              panel.classList.remove('active-pane')
            }
          })
        }
      }
    })

    // --- FOLD 1: Hero -> Features ---
    tl.to('.cinematic-section-1 .lp-hero-copy', { opacity: 0, y: -120, scale: 0.85, duration: 1 })
      .to('.cinematic-section-1 .hero-3d-scene', { opacity: 0, scale: 4.5, rotateX: 60, duration: 1 }, '<')
      .to('.cinematic-section-1 .giant-bg-title', { opacity: 0, scale: 6, duration: 1 }, '<')
      
      .to('.cinematic-section-2', { opacity: 1, scale: 1, duration: 1 }, '<0.5')
      .fromTo('.cinematic-section-2 .lp-section-head', { y: 100, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, '>-0.4')
      .fromTo('.cinematic-section-2 .lp-glass-card', { y: 120, opacity: 0, stagger: 0.04 }, { y: 0, opacity: 1, duration: 0.8 }, '<0.2')

    // --- FOLD 2: Features -> How It Works ---
    tl.to('.cinematic-section-2', { opacity: 0, x: -1000, scale: 0.9, duration: 1 })
      
      .to('.cinematic-section-3', { opacity: 1, scale: 1, duration: 1 }, '<0.5')
      .fromTo('.cinematic-section-3 .lp-section-head', { y: 100, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, '>-0.4')
      .fromTo('.cinematic-section-3 .how-node-wrap', { y: 100, opacity: 0, scale: 0.95, stagger: 0.04 }, { y: 0, opacity: 1, scale: 1, duration: 0.8 }, '<0.2')

    // --- FOLD 3: How It Works -> About ---
    tl.to('.cinematic-section-3', { opacity: 0, y: -600, scale: 0.9, duration: 1 })

      .to('.cinematic-section-4', { opacity: 1, scale: 1, duration: 1 }, '<0.5')
      .fromTo('.cinematic-section-4 .lp-section-head', { y: 100, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, '>-0.4')
      .fromTo('.cinematic-section-4 .lp-glass-card', { x: (idx) => idx % 2 === 0 ? -250 : 250, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, stagger: 0.04 }, '<0.2')

    // --- FOLD 4: About -> Footer ---
    tl.to('.cinematic-section-4', { opacity: 0, scale: 1.15, duration: 1 })

      .to('.cinematic-section-5', { opacity: 1, translateY: 0, duration: 1 }, '<0.5')
      .fromTo('.cinematic-section-5 .lp-cta-band', { y: 150, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, '>-0.4')
      .fromTo('.cinematic-section-5 .lp-footer', { y: 150, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, '<0.2')

    return () => {
      // Clean up trigger instance
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [loading, isAuthenticated])

  return (
    <div className="lp-root" ref={containerRef}>
      {/* Custom trailing cinematic cursor */}
      <CustomCursor />

      {/* Persistent composite navbar */}
      <Navbar />

      {/* Cinematic scroll panels */}
      <div className="cinematic-container" ref={scrollContainerRef}>
        
        {/* Panel 1: Home */}
        <div className="cinematic-section cinematic-section-1 active-pane" id="home">
          <div className="giant-bg-title">DEVFLOW</div>
          <Hero />
        </div>

        {/* Panel 2: Features */}
        <div className="cinematic-section cinematic-section-2" id="features">
          <div className="giant-bg-title">CAPABILITIES</div>
          <Features />
        </div>

        {/* Panel 3: How It Works */}
        <div className="cinematic-section cinematic-section-3" id="how-it-works">
          <div className="giant-bg-title">PIPELINE</div>
          <HowItWorks />
        </div>

        {/* Panel 4: About */}
        <div className="cinematic-section cinematic-section-4" id="about">
          <div className="giant-bg-title">PHILOSOPHY</div>
          <About />
        </div>

        {/* Panel 5: Footer & CTA subscription band */}
        <div className="cinematic-section cinematic-section-5" id="footer" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', overflowY: 'auto' }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', padding: '40px 0' }}>
            <CtaBand onLoginClick={() => navigate('/register')} />
          </div>
          <Footer />
        </div>

      </div>
    </div>
  )
}
