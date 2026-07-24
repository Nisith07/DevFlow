import { useEffect, useRef, useState } from 'react'

export default function CustomCursor() {
  const ringRef = useRef(null)
  const dotRef  = useRef(null)
  const [state, setState] = useState('default') // 'default' | 'hovering' | 'cta'
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    // Disable on touch devices
    if (window.matchMedia('(hover: none)').matches) return

    const mouse  = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const ring   = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    let rafId

    const move = (e) => {
      setVisible(true)
      mouse.x = e.clientX
      mouse.y = e.clientY

      // Dot follows instantly
      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX}px`
        dotRef.current.style.top  = `${e.clientY}px`
      }

      // Detect hover target
      const t = e.target
      if (t?.closest('[data-cursor="cta"]')) {
        setState('cta')
      } else if (t?.closest('a, button, [role="button"], input, select, textarea, .ob-role-card, .ob-chip, .ob-goal-card, .ob-time-card, .ob-exp-card, .ob-tone-card, [tabindex]')) {
        setState('hovering')
      } else {
        setState('default')
      }
    }

    const handleMouseLeave = () => setVisible(false)
    const handleMouseEnter = () => setVisible(true)

    window.addEventListener('mousemove', move, { passive: true })
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseenter', handleMouseEnter)

    const tick = () => {
      const ease = 0.18
      ring.x += (mouse.x - ring.x) * ease
      ring.y += (mouse.y - ring.y) * ease
      if (ringRef.current) {
        ringRef.current.style.left = `${ring.x}px`
        ringRef.current.style.top  = `${ring.y}px`
      }
      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', move)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseenter', handleMouseEnter)
      cancelAnimationFrame(rafId)
    }
  }, [])

  if (!visible) return null

  return (
    <>
      <div
        ref={ringRef}
        className={`lp-cursor-ring ${state === 'hovering' ? 'is-hovering' : ''} ${state === 'cta' ? 'is-cta' : ''}`}
        aria-hidden="true"
      />
      <div ref={dotRef} className="lp-cursor-dot" aria-hidden="true" />
    </>
  )
}
