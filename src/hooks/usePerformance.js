// SILICIUM — Performance Detection Hook
// Auto-detects WebGL support, measures FPS, adjusts scene quality
import { useEffect, useRef } from 'react'
import { useStore } from '../data/store'

function detectWebGLSupport() {
  try {
    const canvas = document.createElement('canvas')
    const gl =
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl')
    if (!gl) return false
    // Check for required extensions
    canvas.remove()
    return true
  } catch {
    return false
  }
}

function detectMobile() {
  if (typeof navigator === 'undefined') return false
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
}

function detectReducedMotion() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function detectLowEndDevice() {
  // Check hardware concurrency (CPU cores)
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) {
    return true
  }
  // Check device memory (Chrome only)
  if (navigator.deviceMemory && navigator.deviceMemory <= 2) {
    return true
  }
  return false
}

export function usePerformance() {
  const setSceneQuality = useStore((s) => s.setSceneQuality)
  const setWebglSupported = useStore((s) => s.setWebglSupported)
  const measuredRef = useRef(false)

  useEffect(() => {
    if (measuredRef.current) return
    measuredRef.current = true

    // 1. Check WebGL support
    const hasWebGL = detectWebGLSupport()
    setWebglSupported(hasWebGL)

    if (!hasWebGL) {
      setSceneQuality('low')
      return
    }

    // 2. Check reduced motion preference
    const prefersReducedMotion = detectReducedMotion()
    if (prefersReducedMotion) {
      setSceneQuality('low')
      return
    }

    // 3. Immediate low-end heuristics
    const isMobile = detectMobile()
    const isLowEnd = detectLowEndDevice()

    if (isLowEnd) {
      setSceneQuality('low')
      return
    }

    if (isMobile) {
      setSceneQuality('medium')
      // Still measure FPS in case mobile device is powerful
    }

    // 4. Measure FPS over first 3 seconds
    let frameCount = 0
    let startTime = performance.now()
    let rafId = null
    let settled = false

    // Wait 500ms for scene to initialize before measuring
    const settleTimeout = setTimeout(() => {
      settled = true
      frameCount = 0
      startTime = performance.now()
    }, 500)

    const measureFrame = () => {
      frameCount++

      if (settled) {
        const elapsed = performance.now() - startTime
        // Measure for 3 seconds after settle period
        if (elapsed >= 3000) {
          const fps = (frameCount / elapsed) * 1000

          if (fps < 30) {
            setSceneQuality('low')
          } else if (fps < 45) {
            setSceneQuality('medium')
          } else {
            setSceneQuality('high')
          }
          return // Stop measuring
        }
      }

      rafId = requestAnimationFrame(measureFrame)
    }

    rafId = requestAnimationFrame(measureFrame)

    // Listen for reduced motion changes
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handleMotionChange = (e) => {
      if (e.matches) {
        setSceneQuality('low')
      }
    }
    motionQuery.addEventListener('change', handleMotionChange)

    return () => {
      clearTimeout(settleTimeout)
      if (rafId) cancelAnimationFrame(rafId)
      motionQuery.removeEventListener('change', handleMotionChange)
    }
  }, [setSceneQuality, setWebglSupported])
}

// Utility to get particle counts based on quality level
export function getQualityCounts(quality) {
  switch (quality) {
    case 'high':
      return {
        stars: 4000,
        dust: 600,
        rifts: 5,
        debris: 12,
        rings: 3,
        nebula: 8,
      }
    case 'medium':
      return {
        stars: 2000,
        dust: 300,
        rifts: 3,
        debris: 8,
        rings: 2,
        nebula: 4,
      }
    case 'low':
      return {
        stars: 800,
        dust: 100,
        rifts: 2,
        debris: 4,
        rings: 1,
        nebula: 2,
      }
    default:
      return {
        stars: 3000,
        dust: 500,
        rifts: 4,
        debris: 10,
        rings: 3,
        nebula: 6,
      }
  }
}
