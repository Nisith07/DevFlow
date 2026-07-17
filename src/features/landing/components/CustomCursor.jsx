import { useEffect, useState, useRef } from 'react'

export default function CustomCursor() {
  const [hoverState, setHoverState] = useState('default') // 'default', 'hovering', 'hovering-3d'
  const [visible, setVisible] = useState(false)
  const ringRef = useRef(null)
  const glowRef = useRef(null)
  
  // Track mouse coordinates for trailing delay interpolation
  const mouse = useRef({ x: 0, y: 0 })
  const ringPos = useRef({ x: 0, y: 0 })

  useEffect(() => {
    // Disable custom cursor on touch/mobile devices
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    if (isTouchDevice) return

    setVisible(true)

    const handleMouseMove = (e) => {
      mouse.current.x = e.clientX
      mouse.current.y = e.clientY

      // Instantly position the center glow dot
      if (glowRef.current) {
        glowRef.current.style.left = `${e.clientX}px`
        glowRef.current.style.top = `${e.clientY}px`
      }

      // Check what type of element we are hovering
      const target = e.target
      if (!target) return

      if (target.closest('.card-3d') || target.closest('.hero-3d-grid-wrap')) {
        setHoverState('hovering-3d')
      } else if (
        target.closest('a') || 
        target.closest('button') || 
        target.closest('.lp-btn') ||
        target.closest('[role="button"]')
      ) {
        setHoverState('hovering')
      } else {
        setHoverState('default')
      }
    }

    const handleMouseLeave = () => {
      if (ringRef.current) ringRef.current.style.opacity = '0'
      if (glowRef.current) glowRef.current.style.opacity = '0'
    }

    const handleMouseEnter = () => {
      if (ringRef.current) ringRef.current.style.opacity = '1'
      if (glowRef.current) glowRef.current.style.opacity = '0.85'
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseenter', handleMouseEnter)

    // Smooth trailing animation loop using requestAnimationFrame
    let animId
    const tick = () => {
      // Ease the trailing outer ring position
      const ease = 0.15
      ringPos.current.x += (mouse.current.x - ringPos.current.x) * ease
      ringPos.current.y += (mouse.current.y - ringPos.current.y) * ease

      if (ringRef.current) {
        ringRef.current.style.left = `${ringPos.current.x}px`
        ringRef.current.style.top = `${ringPos.current.y}px`
      }

      animId = requestAnimationFrame(tick)
    }
    tick()

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseenter', handleMouseEnter)
      cancelAnimationFrame(animId)
    }
  }, [])

  if (!visible) return null

  // State-based trailing ring class
  let ringClass = 'custom-cursor-ring'
  if (hoverState === 'hovering') ringClass += ' hovering'
  if (hoverState === 'hovering-3d') ringClass += ' hovering-3d'

  return (
    <>
      <div ref={ringRef} className={ringClass} aria-hidden="true" />
      <div ref={glowRef} className="custom-cursor-glow" aria-hidden="true" />
    </>
  )
}
