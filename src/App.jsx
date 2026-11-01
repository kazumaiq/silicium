// SILICIUM — Main Application Component
import React, { Suspense, lazy, useEffect, useRef, useState, useCallback } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Canvas } from '@react-three/fiber'
import { useStore } from './data/store'
import styles from './App.module.css'

// ——— Lazy-loaded page components ———
const HomePage = lazy(() => import('./sections/HomePage'))
const DiscographyPage = lazy(() => import('./sections/DiscographyPage'))
const ReleasePage = lazy(() => import('./sections/ReleasePage'))
const ArchivePage = lazy(() => import('./sections/ArchivePage'))
const AboutPage = lazy(() => import('./sections/AboutPage'))
const CommunityPage = lazy(() => import('./sections/CommunityPage'))
const PlatformsPage = lazy(() => import('./sections/PlatformsPage'))

// ——— Lazy-loaded heavy components ———
const CosmicScene = lazy(() => import('./scenes/CosmicScene'))
const Header = lazy(() => import('./components/Header'))
const MusicPlayer = lazy(() => import('./player/MusicPlayer'))
const LoadingScreen = lazy(() => import('./components/LoadingScreen'))

// ——————————————————————————————————————
// Suspense fallback — minimal spinner
// ——————————————————————————————————————
function SuspenseFallback() {
  return (
    <div className={styles.suspenseFallback}>
      <div className={styles.suspenseSpinner} />
    </div>
  )
}

// ——————————————————————————————————————
// Custom Cursor (desktop only)
// ——————————————————————————————————————
function CustomCursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const cursorType = useStore((s) => s.cursorType)
  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => {
    // Detect touch device
    const touchCheck = window.matchMedia('(pointer: coarse)')
    setIsTouch(touchCheck.matches)

    const handleChange = (e) => setIsTouch(e.matches)
    touchCheck.addEventListener('change', handleChange)
    return () => touchCheck.removeEventListener('change', handleChange)
  }, [])

  useEffect(() => {
    if (isTouch) return

    let dotX = 0, dotY = 0
    let ringX = 0, ringY = 0
    let mouseX = 0, mouseY = 0
    let rafId = null

    const onMouseMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    const animate = () => {
      // Dot follows mouse tightly
      dotX += (mouseX - dotX) * 0.9
      dotY += (mouseY - dotY) * 0.9
      // Ring lags behind for fluid feel
      ringX += (mouseX - ringX) * 0.15
      ringY += (mouseY - ringY) * 0.15

      if (dotRef.current) {
        dotRef.current.style.left = `${dotX}px`
        dotRef.current.style.top = `${dotY}px`
      }
      if (ringRef.current) {
        ringRef.current.style.left = `${ringX}px`
        ringRef.current.style.top = `${ringY}px`
      }

      rafId = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', onMouseMove)
    rafId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      cancelAnimationFrame(rafId)
    }
  }, [isTouch])

  if (isTouch) return null

  const isHover = cursorType === 'hover' || cursorType === 'pointer'

  return (
    <>
      <div
        ref={dotRef}
        className={`${styles.cursorDot} ${isHover ? styles.hover : ''}`}
      />
      <div
        ref={ringRef}
        className={`${styles.cursorRing} ${isHover ? styles.hover : ''}`}
      />
    </>
  )
}

// ——————————————————————————————————————
// Route change listener — update store
// ——————————————————————————————————————
function RouteListener() {
  const location = useLocation()
  const setCurrentSection = useStore((s) => s.setCurrentSection)
  const setMenuOpen = useStore((s) => s.setMenuOpen)

  useEffect(() => {
    // Map pathname to section id
    const path = location.pathname
    let section = 'home'
    if (path.startsWith('/discography')) section = 'discography'
    else if (path.startsWith('/archive')) section = 'archive'
    else if (path.startsWith('/about')) section = 'about'
    else if (path.startsWith('/community')) section = 'community'
    else if (path.startsWith('/platforms')) section = 'platforms'

    setCurrentSection(section)
    setMenuOpen(false)

    // Scroll to top on route change
    window.scrollTo(0, 0)
  }, [location.pathname, setCurrentSection, setMenuOpen])

  return null
}

// ——————————————————————————————————————
// 3D Scene Wrapper
// ——————————————————————————————————————
function SceneBackground() {
  return (
    <div className={styles.sceneContainer}>
      <Suspense fallback={null}>
        <CosmicScene />
      </Suspense>
    </div>
  )
}

// ——————————————————————————————————————
// App Routes
// ——————————————————————————————————————
function AppRoutes() {
  return (
    <div className={styles.pageWrapper}>
      <Suspense fallback={<SuspenseFallback />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/discography" element={<DiscographyPage />} />
          <Route path="/discography/:id" element={<ReleasePage />} />
          <Route path="/archive" element={<ArchivePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/platforms" element={<PlatformsPage />} />
        </Routes>
      </Suspense>
    </div>
  )
}

// ——————————————————————————————————————
// Main App
// ——————————————————————————————————————
export default function App() {
  const currentTrack = useStore((s) => s.currentTrack)

  return (
    <BrowserRouter>
      <div className={styles.app}>
        {/* Persistent 3D cosmic background — z-index: 0 */}
        <SceneBackground />

        {/* Custom cursor — desktop only, highest z-index */}
        <CustomCursor />

        {/* Loading / intro overlay — z-index: 10000 */}
        <Suspense fallback={null}>
          <LoadingScreen />
        </Suspense>

        {/* Content layer — z-index: 10 (scrolls over 3D scene) */}
        <div className={styles.contentLayer}>
          {/* Fixed header — z-index: 100 */}
          <div className={styles.headerContainer}>
            <Suspense fallback={null}>
              <Header />
            </Suspense>
          </div>

          {/* Route listener for store sync */}
          <RouteListener />

          {/* Page routes */}
          <AppRoutes />
        </div>

        {/* Music player — fixed at bottom, z-index: 150 */}
        {currentTrack && (
          <div className={styles.playerContainer}>
            <Suspense fallback={null}>
              <MusicPlayer />
            </Suspense>
          </div>
        )}
      </div>
    </BrowserRouter>
  )
}
