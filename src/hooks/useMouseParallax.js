// SILICIUM — Mouse Parallax Hook
// Tracks normalized mouse/touch position (-1 to 1) and updates zustand store
import { useEffect, useRef, useCallback } from 'react'
import { useStore } from '../data/store'

export function useMouseParallax({ smoothing = 0.08, enabled = true } = {}) {
  const setMousePosition = useStore((s) => s.setMousePosition)
  const rawRef = useRef({ x: 0, y: 0 })
  const smoothRef = useRef({ x: 0, y: 0 })
  const rafRef = useRef(null)
  const activeRef = useRef(true)

  const updatePosition = useCallback((clientX, clientY) => {
    if (!enabled) return
    rawRef.current.x = (clientX / window.innerWidth) * 2 - 1
    rawRef.current.y = -(clientY / window.innerHeight) * 2 + 1
  }, [enabled])

  const handleMouseMove = useCallback((e) => {
    updatePosition(e.clientX, e.clientY)
  }, [updatePosition])

  const handleTouchMove = useCallback((e) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0]
      updatePosition(touch.clientX, touch.clientY)
    }
  }, [updatePosition])

  const handleTouchStart = useCallback((e) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0]
      updatePosition(touch.clientX, touch.clientY)
    }
  }, [updatePosition])

  useEffect(() => {
    if (!enabled) {
      setMousePosition({ x: 0, y: 0 })
      return
    }

    activeRef.current = true

    const tick = () => {
      if (!activeRef.current) return

      // Lerp toward raw position for smooth movement
      smoothRef.current.x += (rawRef.current.x - smoothRef.current.x) * smoothing
      smoothRef.current.y += (rawRef.current.y - smoothRef.current.y) * smoothing

      // Only update store if values actually changed (avoids unnecessary re-renders)
      const sx = Math.round(smoothRef.current.x * 1000) / 1000
      const sy = Math.round(smoothRef.current.y * 1000) / 1000
      setMousePosition({ x: sx, y: sy })

      rafRef.current = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: true })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      activeRef.current = false
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchstart', handleTouchStart)
    }
  }, [enabled, smoothing, handleMouseMove, handleTouchMove, handleTouchStart, setMousePosition])

  return smoothRef
}
