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

// Global Bottom Music Player (Kept persistently mounted so audio playback is uninterrupted across continuous scrolling)
function GlobalBottomPlayer() {
  const currentTrack = useStore((s) => s.currentTrack)
  const currentSection = useStore((s) => s.currentSection)
  const location = useLocation()

  // Показываем плашку плеера внизу на всех страницах и секциях кроме первого экрана Hero,
  // но сохраняем компонент смонтированным, чтобы фоновое воспроизведение MP3 не прерывалось при возврате наверх
  const isHidden = !currentTrack || (location.pathname === '/' && currentSection === 'home')

  return (
    <div
      className={`${styles.playerContainer} ${isHidden ? styles.playerContainerHidden : ''}`}
      aria-hidden={isHidden}
    >
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

        {/* Atmospheric Cinematic Overlays */}
        <div className="atmospheric-pulse-overlay" />
        <div className="vignette-overlay" />

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
