import { useEffect, useRef, useState } from 'react'
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
