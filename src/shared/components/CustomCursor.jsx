import { useEffect, useRef, useState } from 'react'

export default function CustomCursor() {
  const ringRef = useRef(null)
  const dotRef  = useRef(null)
  const [state, setState] = useState('default') // 'default' | 'hovering' | 'cta'

  useEffect(() => {
    // Disable on touch devices
    if (window.matchMedia('(hover: none)').matches) return

    const mouse  = { x: 0, y: 0 }
    const ring   = { x: 0, y: 0 }
    let rafId

    const move = (e) => {
      mouse.x = e.clientX
      mouse.y = e.clientY

      // Dot follows instantly
      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX}px`
        dotRef.current.style.top  = `${e.clientY}px`
      }

      // Detect hover target
      const t = e.target
      if (t.closest('[data-cursor="cta"]')) setState('cta')
      else if (t.closest('a, button, [role="button"]')) setState('hovering')
      else setState('default')
    }

    const tick = () => {
      const ease = 0.12
      ring.x += (mouse.x - ring.x) * ease
      ring.y += (mouse.y - ring.y) * ease
      if (ringRef.current) {
        ringRef.current.style.left = `${ring.x}px`
        ringRef.current.style.top  = `${ring.y}px`
      }
      rafId = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', move, { passive: true })
    rafId = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', move)
      cancelAnimationFrame(rafId)
    }
  }, [])

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
