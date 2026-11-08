// SILICIUM — 3D Vault Spatial Universe (Martin Garrix Level Immersion)
import React, { useState, Suspense, useRef, useEffect, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import ArchiveScene from '../scenes/ArchiveScene'
import { useStore } from '../data/store'
import SectionHeader from '../components/SectionHeader'
import styles from './ArchivePage.module.css'

export default function ArchivePage() {
  const [selectedRelease, setSelectedRelease] = useState(null)
  const [resetTrigger, setResetTrigger] = useState(0)
  const [isInView, setIsInView] = useState(false)
  const containerRef = useRef(null)

  const playTrack = useStore((s) => s.playTrack)
  const currentTrack = useStore((s) => s.currentTrack)
  const isPlaying = useStore((s) => s.isPlaying)
  const language = useStore((s) => s.language)
  const setSelectedReleaseModal = useStore((s) => s.setSelectedReleaseModal)

  // IntersectionObserver to save GPU outside viewport
  useEffect(() => {
    if (!containerRef.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting)
      },
      { rootMargin: '100px' }
    )
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  const handleSelectRelease = useCallback((rel) => {
    setSelectedRelease(rel)
  }, [])

  const handleResetCamera = useCallback(() => {
    setSelectedRelease(null)
    setResetTrigger((v) => v + 1)
  }, [])

  const isCurrentPlaying = isPlaying && currentTrack?.id === selectedRelease?.tracks?.[0]?.id

  const t = {
    RU: {
      category: 'ПРОСТРАНСТВЕННАЯ СЕТКА',
      title: '3D VAULT',
      subtitle: 'Интерактивная пространственная галерея релизов SILICIUM. Вращайте орбиту и нажимайте на артефакты для расшифровки.',
      hint: 'ВРАЩАЙТЕ ДЛЯ ОБЗОРА // НАЖМИТЕ НА ОБЛОЖКУ ДЛЯ ФОКУСА',
      playBtn: 'ЗАПУСТИТЬ ТРЕК',
      pauseBtn: 'ПАУЗА',
      detailsBtn: 'СПЕЦИФИКАЦИЯ ↗',
      resetBtn: 'ОБЩИЙ ПЛАН',
    },
    EN: {
      category: 'SPATIAL MATRIX',
      title: '3D VAULT',
      subtitle: 'Interactive spatial artifact gallery of SILICIUM. Drag to rotate orbits and tap covers to decrypt archive data.',
      hint: 'DRAG TO ROTATE // TAP ARTIFACT FOR FOCUS',
      playBtn: 'PLAY FREQUENCY',
      pauseBtn: 'PAUSE',
      detailsBtn: 'SPECIFICATION ↗',
      resetBtn: 'RESET VIEW',
    },
  }[language] || {
    category: 'SPATIAL MATRIX',
    title: '3D VAULT',
    subtitle: 'Interactive spatial gallery of SILICIUM.',
    hint: 'DRAG TO ROTATE // TAP ARTIFACT',
    playBtn: 'PLAY',
    pauseBtn: 'PAUSE',
    detailsBtn: 'DETAILS ↗',
    resetBtn: 'RESET',
  }

  return (
    <div ref={containerRef} className={styles.archiveContainer}>
      <SectionHeader
        category={t.category}
        title={t.title}
        subtitle={t.subtitle}
        watermark="3D VAULT"
      />

      <div className={styles.vaultWrapper}>
        {/* Subtle Spatial Lighting Fissure */}
        <div className={styles.spatialAuraGlow} />

        {/* Minimalist Hint Bar */}
        <div className={styles.interactiveHintBar}>
          <span className={styles.hintDot} />
          <span className={styles.hintText}>{t.hint}</span>
          {selectedRelease && (
            <button onClick={handleResetCamera} className={styles.resetViewButton}>
              ↺ {t.resetBtn}
            </button>
          )}
        </div>

        {/* 3D Canvas Arena */}
        <div className={styles.canvasContainer}>
          {isInView ? (
            <Canvas
              camera={{ position: [0, 3.8, 13.5], fov: 48 }}
              gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
              dpr={[1, Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 1.5)]}
            >
              <Suspense fallback={null}>
                <ArchiveScene
                  selectedRelease={selectedRelease}
                  onSelectRelease={handleSelectRelease}
                  exploreMode={true}
                  resetTrigger={resetTrigger}
                />
              </Suspense>
            </Canvas>
          ) : (
            <div className={styles.canvasStandby} />
          )}

          {/* Floating Selected Release Card */}
          {selectedRelease && (
            <div className={styles.selectedReleaseCard}>
              <div className={styles.cardHeader}>
                <span className={styles.cardYear}>{selectedRelease.year} // {selectedRelease.type}</span>
                <button
                  onClick={handleResetCamera}
                  className={styles.closeCardBtn}
                  aria-label="Close inspection"
                >
                  ✕
                </button>
              </div>

              <h3 className={styles.cardTitle}>{selectedRelease.title}</h3>
              <p className={styles.cardGenre}>{selectedRelease.genre}</p>

              <div className={styles.cardActions}>
                <button
                  onClick={() => playTrack(selectedRelease.tracks[0], selectedRelease)}
                  className={styles.cardPlayBtn}
                >
                  <span>{isCurrentPlaying ? '▮▮' : '▶'}</span>
                  <span>{isCurrentPlaying ? t.pauseBtn : t.playBtn}</span>
                </button>

                <button
                  onClick={() => setSelectedReleaseModal(selectedRelease)}
                  className={styles.cardDetailsBtn}
                >
                  {t.detailsBtn}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
