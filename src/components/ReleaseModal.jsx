// SILICIUM — Release Detail Modal Overlay (Release Experience 2.0)
import React, { useEffect, useRef } from 'react'
import { useStore } from '../data/store'
import { RELEASES } from '../data/config'
import { audioEngine } from '../services/audioEngine'
import styles from './ReleaseModal.module.css'

// Живая звуковая волна в реальном времени
function LiveModalWaveform() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const unsubscribe = audioEngine.onFrame((data) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const w = canvas.width
      const h = canvas.height
      const barCount = 32
      const barWidth = (w / barCount) - 2

      for (let i = 0; i < barCount; i++) {
        const bin = Math.floor((i / barCount) * (data.rawFft.length * 0.7))
        const val = data.rawFft ? data.rawFft[bin] || 0 : 0
        const barHeight = Math.max(2, (val / 255) * h)
        const x = i * (barWidth + 2)
        const y = h - barHeight

        // Двухцветный градиент полосы: темно-красный у основания, ярко-алый на пике
        const grad = ctx.createLinearGradient(0, h, 0, y)
        grad.addColorStop(0, '#55000a')
        grad.addColorStop(0.6, '#dc143c')
        grad.addColorStop(1, '#ff3344')

        ctx.fillStyle = grad
        ctx.fillRect(x, y, barWidth, barHeight)
      }
    })

    return () => unsubscribe()
  }, [])

  return (
    <div className={styles.liveWaveContainer}>
      <div className={styles.waveHeader}>
        <span className={styles.waveLabel}>FFT SPECTRUM ANALYSIS // 64 BINS</span>
        <span className={styles.waveStatus}>SYNC: ACTIVE</span>
      </div>
      <canvas ref={canvasRef} width={280} height={42} className={styles.liveWaveCanvas} />
    </div>
  )
}

export default function ReleaseModal() {
  const selectedRelease = useStore((s) => s.selectedReleaseModal)
  const setSelectedRelease = useStore((s) => s.setSelectedReleaseModal)
  const playTrack = useStore((s) => s.playTrack)
  const currentTrack = useStore((s) => s.currentTrack)
  const isPlaying = useStore((s) => s.isPlaying)

  const relatedReleases = selectedRelease
    ? RELEASES.filter((r) => r.id !== selectedRelease.id).slice(0, 4)
    : []

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedRelease(null)
      }
    }
    if (selectedRelease) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', onKeyDown)
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [selectedRelease, setSelectedRelease])

  if (!selectedRelease) return null

  return (
    <div
      className={styles.backdrop}
      onClick={() => setSelectedRelease(null)}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={styles.modalContent}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className={styles.modalHeader}>
          <div className={styles.codeCluster}>
            <span className={styles.redBadge}>// ARTIFACT DECRYPTION //</span>
            <span className={styles.codeText}>ID: {selectedRelease.id.toUpperCase()}</span>
          </div>
          <button
            onClick={() => setSelectedRelease(null)}
            className={styles.closeBtn}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Inner Content Grid */}
        <div className={styles.grid}>
          {/* Cover Side */}
          <div className={styles.coverSide}>
            <div className={styles.coverFrame}>
              <img
                src={selectedRelease.cover || '/images/demon-mask-blended.png'}
                alt={selectedRelease.title}
                className={styles.coverImage}
              />
              <div className={styles.cornerTL} />
              <div className={styles.cornerTR} />
              <div className={styles.cornerBL} />
              <div className={styles.cornerBR} />
              <div className={styles.glassReflection} />
            </div>

            {/* Живая звуковая волна */}
            <LiveModalWaveform />

            <div className={styles.techParams}>
              <div className={styles.paramRow}>
                <span>ENCODING:</span>
                <span className={styles.paramVal}>FLAC / 24-BIT / 96KHZ</span>
              </div>
              <div className={styles.paramRow}>
                <span>CYCLE:</span>
                <span className={styles.paramVal}>{selectedRelease.year}</span>
              </div>
              <div className={styles.paramRow}>
                <span>GENRE:</span>
                <span className={styles.paramVal}>{selectedRelease.genre || 'DARK PHONK'}</span>
              </div>
            </div>
          </div>

          {/* Details & Tracklist */}
          <div className={styles.infoSide}>
            <div className={styles.typeBadgeRow}>
              <span className={styles.typeTag}>{selectedRelease.type?.toUpperCase() || 'SINGLE'}</span>
              <span className={styles.yearTag}>CYCLE {selectedRelease.year}</span>
            </div>

            <h2 className={styles.releaseTitle}>{selectedRelease.title}</h2>
            <div className={styles.artistLabel}>SILICIUM</div>

            <p className={styles.description}>
              {selectedRelease.description ||
                'Heavy distorted 808 bass frequencies, dark occult choir pads, and underground Memphis phonk atmosphere.'}
            </p>

            {/* Track Sequence */}
            <div className={styles.trackSequenceBlock}>
              <div className={styles.trackHeading}>FREQUENCY SEQUENCE</div>
              <div className={styles.trackList}>
                {selectedRelease.tracks?.map((track, i) => {
                  const isActive = isPlaying && currentTrack?.id === track.id
                  return (
                    <div
                      key={track.id}
                      className={`${styles.trackItem} ${isActive ? styles.trackItemActive : ''}`}
                      onClick={() => playTrack(track, selectedRelease)}
                    >
                      <span className={styles.trackNum}>0{i + 1}</span>
                      <button className={styles.trackPlayBtn}>
                        {isActive ? '▮▮' : '▶'}
                      </button>
                      <span className={styles.trackTitle}>{track.title}</span>
                      {isActive && (
                        <div className={styles.eqIndicator}>
                          <span className={styles.eqBar} />
                          <span className={styles.eqBar} />
                          <span className={styles.eqBar} />
                        </div>
                      )}
                      <span className={styles.trackDuration}>{track.duration || '2:14'}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Platform Links */}
            <div className={styles.platformsRow}>
              {selectedRelease.soundcloudUrl && (
                <a
                  href={selectedRelease.soundcloudUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.platformLinkBtn}
                >
                  SOUNDCLOUD ↗
                </a>
              )}
              {selectedRelease.spotifyUrl && (
                <a
                  href={selectedRelease.spotifyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.platformLinkBtn}
                >
                  SPOTIFY ↗
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Related Artifacts Row */}
        {relatedReleases.length > 0 && (
          <div className={styles.relatedSection}>
            <div className={styles.relatedHeading}>// RELATED OCCULT ARTIFACTS //</div>
            <div className={styles.relatedGrid}>
              {relatedReleases.map((rel) => (
                <div
                  key={rel.id}
                  className={styles.relatedCard}
                  onClick={() => setSelectedRelease(rel)}
                >
                  <img
                    src={rel.cover || '/images/demon-mask-blended.png'}
                    alt={rel.title}
                    className={styles.relatedCover}
                  />
                  <div className={styles.relatedMeta}>
                    <span className={styles.relatedYear}>{rel.year}</span>
                    <span className={styles.relatedTitle}>{rel.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
