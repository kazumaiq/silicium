// SILICIUM — 3D Archive Spatial Universe (No-Box Seamless Experience)
import React, { useState, Suspense, useRef, useEffect, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import ArchiveScene from '../scenes/ArchiveScene'
import { useStore } from '../data/store'
import { RELEASES } from '../data/config'
import SectionHeader from '../components/SectionHeader'
import styles from './ArchivePage.module.css'

export default function ArchivePage() {
  const [selectedRelease, setSelectedRelease] = useState(null)
  const [panelOpen, setPanelOpen] = useState(false)
  const [exploreMode, setExploreMode] = useState(false)
  const [resetTrigger, setResetTrigger] = useState(0)
  const [isInView, setIsInView] = useState(false)
  const containerRef = useRef(null)

  const playTrack = useStore((s) => s.playTrack)
  const currentTrack = useStore((s) => s.currentTrack)
  const isPlaying = useStore((s) => s.isPlaying)
  const language = useStore((s) => s.language)
  const setSelectedReleaseModal = useStore((s) => s.setSelectedReleaseModal)

  // IntersectionObserver для экономии ресурсов GPU вне видимости
  useEffect(() => {
    if (!containerRef.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting)
        // При выходе из секции автоматически отключаем режим исследования, возвращая нативный скролл
        if (!entry.isIntersecting) {
          setExploreMode(false)
        }
      },
      { rootMargin: '100px' }
    )
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  const handleSelectRelease = useCallback((rel) => {
    setSelectedRelease(rel)
    setPanelOpen(true)
  }, [])

  const handleResetCamera = useCallback(() => {
    setResetTrigger((v) => v + 1)
  }, [])

  const toggleExploreMode = useCallback(() => {
    setExploreMode((prev) => !prev)
  }, [])

  const isTouch = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)

  const t = {
    RU: {
      code: '// 03 //',
      tag: 'ПРОСТРАНСТВЕННАЯ СЕТКА',
      title: '3D АРХИВ',
      subtitle: 'Бесшовная пространственная матрица артефактов SILICIUM. Исследуйте орбиты и нажимайте на артефакты для расшифровки.',
      exploreBtn: '⊕ ИССЛЕДОВАТЬ 3D-МАТРИЦУ',
      exitExploreBtn: '✕ ЗАВЕРШИТЬ ОБЗОР',
      resetBtn: '↺ СБРОС КАМЕРЫ',
      exploreActive: 'РЕЖИМ ОБЗОРА АКТИВЕН // СВАЙП ДЛЯ ВРАЩЕНИЯ • PINCH ДЛЯ ЗУМА',
      scrollFree: 'ТАП ПО АРТЕФАКТУ ДЛЯ РАСШИФРОВКИ • СКРОЛЛ РАБОТАЕТ СВОБОДНО',
      decrypted: 'РАСШИФРОВАННЫЙ АРТЕФАКТ',
      cycle: 'ЦИКЛ',
      initiate: 'ЗАПУСТИТЬ ВОСПРОИЗВЕДЕНИЕ',
      fullSpec: 'СПЕЦИФИКАЦИЯ ↗',
    },
    EN: {
      code: '// 03 //',
      tag: 'SPATIAL MATRIX',
      title: '3D ARCHIVE',
      subtitle: 'Seamless spatial artifact matrix of SILICIUM. Explore orbits and tap artifacts to decrypt archive data.',
      exploreBtn: '⊕ EXPLORE 3D MATRIX',
      exitExploreBtn: '✕ EXIT 3D VIEW',
      resetBtn: '↺ RESET CAMERA',
      exploreActive: 'EXPLORE MODE ACTIVE // SWIPE TO ROTATE • PINCH TO ZOOM',
      scrollFree: 'TAP ARTIFACT TO DECRYPT • SCROLL FLOWS NATURALLY',
      decrypted: 'DECRYPTED ARTIFACT',
      cycle: 'CYCLE',
      initiate: 'INITIATE PLAYBACK',
      fullSpec: 'FULL SPEC ↗',
    },
  }[language] || {
    code: '// 03 //',
    tag: 'SPATIAL MATRIX',
    title: '3D ARCHIVE',
    subtitle: 'Seamless spatial artifact matrix of SILICIUM.',
    exploreBtn: '⊕ EXPLORE 3D',
    exitExploreBtn: '✕ EXIT 3D',
    resetBtn: '↺ RESET',
    exploreActive: 'EXPLORE MODE ACTIVE',
    scrollFree: 'TAP ARTIFACT TO DECRYPT',
    decrypted: 'DECRYPTED ARTIFACT',
    cycle: 'CYCLE',
    initiate: 'INITIATE PLAYBACK',
    fullSpec: 'FULL SPEC ↗',
  }

  return (
    <div ref={containerRef} className={styles.archiveContainer}>
      {/* Dynamic Background Red Glow Pulse */}
      <div className={styles.spatialGlowFissure} />

      {/* Header with Mode Switcher */}
      <div className={styles.headerWrapper}>
        <SectionHeader
          code={t.code}
          tag={t.tag}
          title={t.title}
          subtitle={t.subtitle}
        />

        {/* Cyberpunk Interactive Mode Controls */}
        <div className={styles.controlBarRow}>
          <button
            onClick={toggleExploreMode}
            className={`${styles.exploreModeBtn} ${exploreMode ? styles.exploreModeActive : ''}`}
            data-magnetic
            data-cursor-label={exploreMode ? 'EXIT // 3D' : 'ENTER // 3D'}
            aria-label={exploreMode ? 'Exit Explore Mode' : 'Enter Explore Mode'}
          >
            {exploreMode ? t.exitExploreBtn : t.exploreBtn}
          </button>

          <div className={styles.modeStatusBadge}>
            {exploreMode ? t.exploreActive : t.scrollFree}
          </div>
        </div>
      </div>

      {/* Seamless Open 3D Space (NO Box, NO Border, Transparent) */}
      <div className={`${styles.canvasArena} ${exploreMode ? styles.canvasExplore : styles.canvasNormal}`}>
        {isInView ? (
          <Canvas
            camera={{ position: [0, 4.8, 14], fov: 50 }}
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
            dpr={[1, 1.5]}
          >
            <Suspense fallback={null}>
              <ArchiveScene
                selectedRelease={selectedRelease}
                onSelectRelease={handleSelectRelease}
                exploreMode={exploreMode}
                resetTrigger={resetTrigger}
              />
            </Suspense>
          </Canvas>
        ) : (
          <div className={styles.canvasStandby}>
            <span className={styles.standbyText}>// 3D ARCHIVE STANDBY //</span>
          </div>
        )}

        {/* Floating HUD Controls in Explore Mode */}
        {exploreMode && (
          <div className={styles.floatingHud}>
            <button
              onClick={handleResetCamera}
              className={styles.hudActionBtn}
              title="Reset Camera"
              aria-label="Reset Camera"
            >
              {t.resetBtn}
            </button>
            <button
              onClick={() => setExploreMode(false)}
              className={`${styles.hudActionBtn} ${styles.hudExitBtn}`}
              title="Exit 3D View"
              aria-label="Exit 3D View"
            >
              {t.exitExploreBtn}
            </button>
          </div>
        )}

        {/* Selected Artifact Inspection Drawer / Bottom Sheet */}
        <aside
          className={`${styles.infoPanel} ${panelOpen && selectedRelease ? styles.panelOpen : ''}`}
        >
          {selectedRelease && (
            <div className={styles.panelInner}>
              <div className={styles.panelHeader}>
                <span className={styles.panelTag}>{t.decrypted}</span>
                <button
                  onClick={() => setPanelOpen(false)}
                  className={styles.closeBtn}
                  aria-label="Close panel"
                >
                  ✕
                </button>
              </div>

              <div className={styles.panelBodyGrid}>
                <div className={styles.panelCoverBox}>
                  <img
                    src={selectedRelease.cover || '/images/demon-mask-blended.png'}
                    alt={selectedRelease.title}
                    className={styles.panelCover}
                  />
                </div>

                <div className={styles.panelDetails}>
                  <div className={styles.panelYear}>{t.cycle} {selectedRelease.year}</div>
                  <h3 className={styles.panelTitle}>{selectedRelease.title}</h3>
                  <div className={styles.panelGenre}>
                    {selectedRelease.genre || 'DARK PHONK'} // {selectedRelease.type.toUpperCase()}
                  </div>
                  <p className={styles.panelDesc}>
                    {selectedRelease.description ||
                      'Dimensional frequency anomaly. Resonating within underground audio archives since 2022.'}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className={styles.panelActions}>
                {selectedRelease.tracks && selectedRelease.tracks[0] && (
                  <button
                    className={styles.playNowBtn}
                    onClick={() => playTrack(selectedRelease.tracks[0], selectedRelease)}
                  >
                    <span>
                      {isPlaying && currentTrack?.id === selectedRelease.tracks[0].id ? '▮▮' : '▶'}
                    </span>
                    <span>{t.initiate}</span>
                  </button>
                )}
                <button
                  className={styles.specBtn}
                  onClick={() => {
                    setPanelOpen(false)
                    setSelectedReleaseModal(selectedRelease)
                  }}
                >
                  {t.fullSpec}
                </button>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}
