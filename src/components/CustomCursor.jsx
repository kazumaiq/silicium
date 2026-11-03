// SILICIUM — Cybernetic Reticle Cursor & Magnetic Micro-interactions
import React, { useEffect, useRef, useState } from 'react'
import { useStore } from '../data/store'
import styles from './CustomCursor.module.css'

export default function CustomCursor() {
  const reticleRef = useRef(null)
  const dotRef = useRef(null)
  const coordsRef = useRef(null)
  const trailCanvasRef = useRef(null)
  const [isHovered, setIsHovered] = useState(false)
  const [hoverLabel, setHoverLabel] = useState('')
  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => {
    // Strict touch device check
    const touchCheck = window.matchMedia('(pointer: coarse)')
    if (touchCheck.matches || 'ontouchstart' in window) {
      setIsTouch(true)
      return
    }

    const canvas = trailCanvasRef.current
    const ctx = canvas ? canvas.getContext('2d') : null

    if (canvas) {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
      }
    }
    window.addEventListener('resize', handleResize)

    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2
    let reticleX = mouseX
    let reticleY = mouseY
    let dotX = mouseX
    let dotY = mouseY
    let rafId = null

    // Trail points
    const trailPoints = []
    const maxTrail = 14

    const onMouseMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY

      // Add to trail
      trailPoints.push({ x: mouseX, y: mouseY, age: 1.0 })
      if (trailPoints.length > maxTrail) {
        trailPoints.shift()
      }
    }

    // Auto hover and magnetic detection
    const onMouseOver = (e) => {
      const target = e.target
      const interactive = target.closest('button, a, input, select, [role="button"], article, [data-cursor-lock]')
      if (interactive) {
        setIsHovered(true)
        const label = interactive.getAttribute('data-cursor-label') ||
          (interactive.tagName === 'BUTTON' ? 'TARGET // ENGAGE' :
           interactive.tagName === 'A' ? 'LINK // DISPATCH' : 'INSPECT // DECRYPT')
        setHoverLabel(label)
      } else {
        setIsHovered(false)
        setHoverLabel('')
      }
    }

    // Magnetic effect on elements with [data-magnetic]
    const onMouseMoveMagnetic = (e) => {
      const magneticEls = document.querySelectorAll('[data-magnetic]')
      magneticEls.forEach((el) => {
        const rect = el.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        const dist = Math.hypot(e.clientX - centerX, e.clientY - centerY)
        const maxDist = 70

        if (dist < maxDist) {
          const power = (1 - dist / maxDist) * 12
          const moveX = ((e.clientX - centerX) / maxDist) * power
          const moveY = ((e.clientY - centerY) / maxDist) * power
          el.style.transform = `translate(${moveX}px, ${moveY}px)`
        } else {
          el.style.transform = ''
        }
      })
    }

    const animate = () => {
      // Smooth follow for reticle
      reticleX += (mouseX - reticleX) * 0.16
      reticleY += (mouseY - reticleY) * 0.16

      // Instant follow for laser dot
      dotX += (mouseX - dotX) * 0.75
      dotY += (mouseY - dotY) * 0.75

      if (reticleRef.current) {
        reticleRef.current.style.transform = `translate3d(${reticleX}px, ${reticleY}px, 0)`
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${dotX}px, ${dotY}px, 0)`
      }
      if (coordsRef.current) {
        const padX = Math.round(mouseX).toString().padStart(4, '0')
        const padY = Math.round(mouseY).toString().padStart(4, '0')
        coordsRef.current.textContent = `X:${padX} Y:${padY}`
      }

      // Draw subtle laser trail on canvas
      if (ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        for (let i = 0; i < trailPoints.length; i++) {
          const p = trailPoints[i]
          p.age -= 0.05
          if (p.age > 0) {
            ctx.beginPath()
            ctx.arc(p.x, p.y, (1 - i / trailPoints.length) * 2.5, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(220, 20, 60, ${p.age * 0.3})`
            ctx.fill()
          }
        }
      }

      rafId = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('mousemove', onMouseMoveMagnetic, { passive: true })
    document.addEventListener('mouseover', onMouseOver, { passive: true })
    rafId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mousemove', onMouseMoveMagnetic)
      document.removeEventListener('mouseover', onMouseOver)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  if (isTouch) return null

  return (
    <>
      {/* Laser particle trail canvas */}
      <canvas ref={trailCanvasRef} className={styles.trailCanvas} />

      {/* Cybernetic Reticle Cursor */}
      <div
        ref={reticleRef}
        className={`${styles.reticle} ${isHovered ? styles.reticleLock : ''}`}
      >
        {/* Corner Brackets */}
        <span className={styles.cornerTL} />
        <span className={styles.cornerTR} />
        <span className={styles.cornerBL} />
        <span className={styles.cornerBR} />

        {/* Reticle crosshair ticks */}
        <span className={styles.crosshairH} />
        <span className={styles.crosshairV} />

        {/* Floating tech HUD */}
        <div className={styles.reticleHud}>
          <span ref={coordsRef} className={styles.hudCoords}>
            X:0000 Y:0000
          </span>
          {isHovered && (
            <span className={styles.hudLockLabel}>{hoverLabel}</span>
          )}
        </div>
      </div>

      {/* Central High-Intensity Red Laser Dot */}
      <div ref={dotRef} className={styles.laserDot} />
    </>
  )
}
