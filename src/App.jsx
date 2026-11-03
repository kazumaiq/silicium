// SILICIUM — Unified Seamless Application Root
import React, { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useStore } from './data/store'
import styles from './App.module.css'

// ——— Core Immediate Components ———
import HomePage from './sections/HomePage'
import Header from './components/Header'
import LoadingScreen from './components/LoadingScreen'
import CustomCursor from './components/CustomCursor'

// ——— Lazy Deep-Link Routes ———
const ReleasePage = lazy(() => import('./sections/ReleasePage'))
const CosmicScene = lazy(() => import('./scenes/CosmicScene'))
const MusicPlayer = lazy(() => import('./player/MusicPlayer'))

// Suspense Fallback
function SuspenseFallback() {
  return (
    <div className={styles.suspenseFallback}>
      <div className={styles.suspenseSpinner} />
    </div>
  )
}

// 3D Cosmic Background
function SceneBackground() {
  return (
    <div className={styles.sceneContainer}>
      <Suspense fallback={null}>
        <CosmicScene />
      </Suspense>
    </div>
  )
}

// Global Bottom Music Player (Active when scrolled past hero or on deep links)
function GlobalBottomPlayer() {
  const currentTrack = useStore((s) => s.currentTrack)
  const currentSection = useStore((s) => s.currentSection)
  const location = useLocation()

  // Показываем плеер везде, кроме первого экрана Hero, чтобы не дублировать встроенный плеер
  const shouldShow =
    currentTrack &&
    (location.pathname !== '/' || currentSection !== 'home')

  if (!shouldShow) return null

  return (
    <div className={styles.playerContainer}>
      <Suspense fallback={null}>
        <MusicPlayer />
      </Suspense>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <div className={styles.app}>
        {/* Persistent 3D Cosmic Background */}
        <SceneBackground />

        {/* Loading / Cinematic Intro Overlay */}
        <LoadingScreen />

        {/* Custom Cursor */}
        <CustomCursor />

        {/* Fixed Header */}
        <Header />

        {/* Main Content Stream */}
        <main className={styles.contentLayer}>
          <Suspense fallback={<SuspenseFallback />}>
            <Routes>
              {/* Главный непрерывный скролл-поток всех 6 разделов */}
              <Route path="/" element={<HomePage />} />

              {/* Детальная страница релиза для глубоких ссылок */}
              <Route path="/discography/:id" element={<ReleasePage />} />

              {/* Редиректы со старых роутов к секциям единой страницы */}
              <Route path="/discography" element={<Navigate to="/#discography" replace />} />
              <Route path="/archive" element={<Navigate to="/#archive" replace />} />
              <Route path="/about" element={<Navigate to="/#about" replace />} />
              <Route path="/community" element={<Navigate to="/#community" replace />} />
              <Route path="/platforms" element={<Navigate to="/#platforms" replace />} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </main>

        {/* Global Bottom Audio Player */}
        <GlobalBottomPlayer />
      </div>
    </BrowserRouter>
  )
}
