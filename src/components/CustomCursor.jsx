// SILICIUM — Editorial Minimalist Cursor (Martin Garrix Benchmark)
import React, { useEffect, useRef, useState } from 'react'
import styles from './CustomCursor.module.css'

export default function CustomCursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const [isHovered, setIsHovered] = useState(false)
  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => {
    // Disable on touch devices
    const touchCheck = window.matchMedia('(pointer: coarse)')
    if (touchCheck.matches || 'ontouchstart' in window) {
      setIsTouch(true)
      return
    }

    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2
    let ringX = mouseX
    let ringY = mouseY
    let rafId = null

    const onMouseMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`
      }
    }

    const onMouseOver = (e) => {
      const target = e.target
      const interactive = target.closest('button, a, input, select, [role="button"], article, [data-magnetic]')
      setIsHovered(!!interactive)
    }

    const animate = () => {
      ringX += (mouseX - ringX) * 0.15
      ringY += (mouseY - ringY) * 0.15

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`
      }

      rafId = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    document.addEventListener('mouseover', onMouseOver, { passive: true })
    rafId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseover', onMouseOver)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  if (isTouch) return null

  return (
    <>
      <div
        ref={ringRef}
        className={`${styles.cursorRing} ${isHovered ? styles.cursorRingHover : ''}`}
      />
      <div
        ref={dotRef}
        className={`${styles.cursorDot} ${isHovered ? styles.cursorDotHover : ''}`}
      />
    </>
  )
}
