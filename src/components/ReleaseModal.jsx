// SILICIUM — Release Detail Modal Overlay for Seamless Browsing
import React, { useEffect } from 'react'
import { useStore } from '../data/store'
import styles from './ReleaseModal.module.css'

export default function ReleaseModal() {
  const selectedRelease = useStore((s) => s.selectedReleaseModal)
  const setSelectedRelease = useStore((s) => s.setSelectedReleaseModal)
  const playTrack = useStore((s) => s.playTrack)
  const currentTrack = useStore((s) => s.currentTrack)
  const isPlaying = useStore((s) => s.isPlaying)

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
            aria-label="Close specification"
          >
            ✕
          </button>
        </div>

        {/* Inner Content Grid */}
        <div className={styles.grid}>
          {/* Cover Art Box */}
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
            </div>

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
      </div>
    </div>
  )
}
