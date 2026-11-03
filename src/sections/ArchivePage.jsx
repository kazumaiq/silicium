// SILICIUM — 3D Archive Interactive Section with Performance Throttling
import React, { useState, Suspense, useRef, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import ArchiveScene from '../scenes/ArchiveScene'
import { useStore } from '../data/store'
import { RELEASES } from '../data/config'
import SectionHeader from '../components/SectionHeader'
import styles from './ArchivePage.module.css'

export default function ArchivePage() {
  const [selectedRelease, setSelectedRelease] = useState(RELEASES[0] || null)
  const [panelOpen, setPanelOpen] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const containerRef = useRef(null)

  const playTrack = useStore((s) => s.playTrack)
  const currentTrack = useStore((s) => s.currentTrack)
  const isPlaying = useStore((s) => s.isPlaying)
  const language = useStore((s) => s.language)
  const setSelectedReleaseModal = useStore((s) => s.setSelectedReleaseModal)

  // IntersectionObserver для отключения 3D рендера вне видимости
  useEffect(() => {
    if (!containerRef.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting)
      },
      { rootMargin: '150px' }
    )
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  const handleSelectRelease = (rel) => {
    setSelectedRelease(rel)
    setPanelOpen(true)
  }

  const t = {
    RU: {
      code: '// 03 //',
      tag: 'ПРОСТРАНСТВЕННАЯ СЕТКА',
      title: '3D АРХИВ',
      subtitle: 'Интерактивная матрица артефактов SILICIUM. Вращайте орбиту, масштабируйте и нажимайте на артефакты для расшифровки.',
      dragRotate: 'УДЕРЖИВАЙТЕ ДЛЯ ВРАЩЕНИЯ • ЗУМ КОЛЕСОМ • КЛИК ДЛЯ РАСШИФРОВКИ',
      decrypted: 'РАСШИФРОВАННЫЙ АРТЕФАКТ',
      cycle: 'ЦИКЛ',
      initiate: 'ЗАПУСТИТЬ ВОСПРОИЗВЕДЕНИЕ',
      fullSpec: 'ПОЛНАЯ СПЕЦИФИКАЦИЯ ↗',
    },
    EN: {
      code: '// 03 //',
      tag: 'SPATIAL MATRIX',
      title: '3D ARCHIVE',
      subtitle: 'Interactive spatial artifact matrix of SILICIUM. Drag to rotate orbit, zoom and click artifacts to decrypt data.',
      dragRotate: 'DRAG TO ROTATE MATRIX • SCROLL TO ZOOM • CLICK ARTIFACT TO DECRYPT',
      decrypted: 'DECRYPTED ARTIFACT',
      cycle: 'CYCLE',
      initiate: 'INITIATE PLAYBACK',
      fullSpec: 'FULL SPECIFICATION ↗',
    },
  }[language] || {
    code: '// 03 //',
    tag: 'SPATIAL MATRIX',
    title: '3D ARCHIVE',
    subtitle: 'Interactive spatial artifact matrix of SILICIUM.',
    dragRotate: 'DRAG TO ROTATE MATRIX • SCROLL TO ZOOM • CLICK ARTIFACT TO DECRYPT',
    decrypted: 'DECRYPTED ARTIFACT',
    cycle: 'CYCLE',
    initiate: 'INITIATE PLAYBACK',
    fullSpec: 'FULL SPECIFICATION ↗',
  }

  return (
    <div ref={containerRef} className={styles.archiveContainer}>
      <div className={styles.headerWrapper}>
        <SectionHeader
          code={t.code}
          tag={t.tag}
          title={t.title}
          subtitle={t.subtitle}
        />
        <div className={styles.instructionBadge}>
          {t.dragRotate}
        </div>
      </div>

      {/* 3D Canvas Box */}
      <div className={styles.canvasArena}>
        {isInView ? (
          <Canvas
            camera={{ position: [0, 4, 12], fov: 52 }}
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
            dpr={[1, 1.5]}
          >
            <Suspense fallback={null}>
              <ArchiveScene
                selectedRelease={selectedRelease}
                onSelectRelease={handleSelectRelease}
              />
            </Suspense>
          </Canvas>
        ) : (
          <div className={styles.canvasStandby}>
            <span className={styles.standbyText}>// 3D MATRIX SUSPENDED //</span>
          </div>
        )}

        {/* Side Slide-in Inspection Panel */}
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

              <div className={styles.panelCoverBox}>
                <img
                  src={selectedRelease.cover || '/images/demon-mask-blended.png'}
                  alt={selectedRelease.title}
                  className={styles.panelCover}
                />
              </div>

              <div className={styles.panelMeta}>
                <div className={styles.panelYear}>{t.cycle} {selectedRelease.year}</div>
                <h3 className={styles.panelTitle}>{selectedRelease.title}</h3>
                <div className={styles.panelGenre}>
                  {selectedRelease.genre || 'DARK PHONK'} // {selectedRelease.type.toUpperCase()}
                </div>
              </div>

              <p className={styles.panelDesc}>
                {selectedRelease.description ||
                  'Dimensional frequency anomaly. Resonating within underground audio archives since 2022.'}
              </p>

              {/* Playback & Full Spec buttons */}
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
