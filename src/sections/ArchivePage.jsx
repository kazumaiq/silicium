// SILICIUM — 3D Archive Interactive View
import React, { useState, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Link } from 'react-router-dom'
import ArchiveScene from '../scenes/ArchiveScene'
import { useStore } from '../data/store'
import { RELEASES } from '../data/config'
import styles from './ArchivePage.module.css'

export default function ArchivePage() {
  const [selectedRelease, setSelectedRelease] = useState(RELEASES[0] || null)
  const [panelOpen, setPanelOpen] = useState(false)
  const playTrack = useStore((s) => s.playTrack)
  const currentTrack = useStore((s) => s.currentTrack)
  const isPlaying = useStore((s) => s.isPlaying)

  const handleSelectRelease = (rel) => {
    setSelectedRelease(rel)
    setPanelOpen(true)
  }

  return (
    <div className={styles.archiveContainer}>
      {/* 3D Canvas Layer */}
      <div className={styles.canvasWrapper}>
        <Canvas
          camera={{ position: [0, 4, 12], fov: 55 }}
          gl={{ antialias: true, alpha: true }}
        >
          <Suspense fallback={null}>
            <ArchiveScene
              selectedRelease={selectedRelease}
              onSelectRelease={handleSelectRelease}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Top Header Overlay */}
      <div className={styles.topOverlay}>
        <div className={styles.metaLabel}>// 03 // 3D SPATIAL ARCHIVE</div>
        <h1 className={styles.pageTitle}>ORBITAL VAULT</h1>
        <p className={styles.instructions}>
          DRAG TO ROTATE MATRIX • SCROLL TO ZOOM • CLICK ARTIFACT TO DECRYPT
        </p>
      </div>

      {/* Side Slide-in Inspection Panel */}
      <aside
        className={`${styles.infoPanel} ${panelOpen && selectedRelease ? styles.panelOpen : ''}`}
      >
        {selectedRelease && (
          <div className={styles.panelInner}>
            <div className={styles.panelHeader}>
              <span className={styles.panelTag}>DECRYPTED ARTIFACT</span>
              <button
                onClick={() => setPanelOpen(false)}
                className={styles.closeBtn}
                title="Close Panel"
              >
                ✕
              </button>
            </div>

            <div className={styles.panelCoverBox}>
              <img
                src={selectedRelease.cover || '/images/demon-mask.jpg'}
                alt={selectedRelease.title}
                className={styles.panelCover}
              />
            </div>

            <div className={styles.panelMeta}>
              <div className={styles.panelYear}>CYCLE {selectedRelease.year}</div>
              <h2 className={styles.panelTitle}>{selectedRelease.title}</h2>
              <div className={styles.panelGenre}>
                {selectedRelease.genre || 'DARK PHONK'} // {selectedRelease.type.toUpperCase()}
              </div>
            </div>

            <p className={styles.panelDesc}>
              {selectedRelease.description ||
                'Dimensional frequency anomaly. Resonating within underground audio archives since 2022.'}
            </p>

            {/* Quick Play Trigger */}
            {selectedRelease.tracks && selectedRelease.tracks[0] && (
              <div className={styles.panelPlayArea}>
                <button
                  className={styles.playNowBtn}
                  onClick={() => playTrack(selectedRelease.tracks[0], selectedRelease)}
                >
                  <span className={styles.playSymbol}>
                    {isPlaying && currentTrack?.id === selectedRelease.tracks[0].id ? '▮▮' : '▶'}
                  </span>
                  <span>INITIATE PLAYBACK</span>
                </button>
              </div>
            )}

            <div className={styles.panelActions}>
              <Link
                to={`/discography/${selectedRelease.id}`}
                className={styles.fullSpecsBtn}
              >
                DETAILED RECORD ↗
              </Link>
            </div>
          </div>
        )}
      </aside>

      {/* Bottom Coordinates */}
      <div className={styles.bottomCoords}>
        <span>STATUS: MATRIX SYNCHRONIZED</span>
        <span>OBJECTS: {RELEASES.length} LOADED</span>
      </div>
    </div>
  )
}
