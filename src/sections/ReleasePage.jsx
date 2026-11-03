// SILICIUM — Release Detail Page
import React, { useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { RELEASES, PLATFORMS } from '../data/config'
import { useStore } from '../data/store'
import styles from './ReleasePage.module.css'

export default function ReleasePage() {
  const { id } = useParams()
  const playTrack = useStore((s) => s.playTrack)
  const currentTrack = useStore((s) => s.currentTrack)
  const isPlaying = useStore((s) => s.isPlaying)

  const release = useMemo(() => {
    return RELEASES.find((r) => r.id === id) || RELEASES[0]
  }, [id])

  if (!release) {
    return (
      <div className={styles.notFoundContainer}>
        <h1 className={styles.errTitle}>ERR_NULL_ARTIFACT</h1>
        <p className={styles.errMsg}>The requested release matrix could not be resolved.</p>
        <Link to="/discography" className={styles.backBtn}>
          ← RETURN TO DISCOGRAPHY
        </Link>
      </div>
    )
  }

  return (
    <div className={styles.releaseContainer}>
      <div className={styles.navRow}>
        <Link to="/#discography" className={styles.backLink}>
          ← BACK TO ARCHIVE
        </Link>
        <span className={styles.archiveCode}>
          ARTIFACT // {release.id.toUpperCase()}
        </span>
      </div>

      <div className={styles.mainGrid}>
        {/* Cover Art Box with Occult Framing */}
        <div className={styles.coverSection}>
          <div className={styles.coverFrame}>
            <img
              src={release.cover || '/images/demon-mask.jpg'}
              alt={release.title}
              className={styles.coverImage}
            />
            <div className={styles.cornerTL} />
            <div className={styles.cornerTR} />
            <div className={styles.cornerBL} />
            <div className={styles.cornerBR} />
          </div>

          <div className={styles.technicalMeta}>
            <div className={styles.techRow}>
              <span>ENCODING:</span>
              <span className={styles.techVal}>FLAC / 24-BIT / 96KHZ</span>
            </div>
            <div className={styles.techRow}>
              <span>CYCLE:</span>
              <span className={styles.techVal}>{release.year}</span>
            </div>
            <div className={styles.techRow}>
              <span>CLASSIFICATION:</span>
              <span className={styles.techVal}>{release.genre || 'DARK PHONK'}</span>
            </div>
          </div>
        </div>

        {/* Release Metadata & Tracklist */}
        <div className={styles.infoSection}>
          <div className={styles.badgeRow}>
            <span className={styles.typeBadge}>{release.type.toUpperCase()}</span>
            <span className={styles.yearBadge}>CYCLE {release.year}</span>
          </div>

          <h1 className={styles.releaseTitle}>{release.title}</h1>
          <div className={styles.artistName}>SILICIUM</div>

          <p className={styles.description}>
            {release.description ||
              'Authentic dark phonk frequencies extracted from underground digital dimensions. Heavy 808 distortion, gothic choir atmospheres, occult textures.'}
          </p>

          {/* Tracklist */}
          <div className={styles.tracklistArea}>
            <h3 className={styles.tracklistHeading}>FREQUENCY SEQUENCE</h3>
            <div className={styles.trackList}>
              {release.tracks?.map((track, idx) => {
                const isActive = currentTrack?.id === track.id
                return (
                  <div
                    key={track.id}
                    className={`${styles.trackRow} ${isActive ? styles.activeTrack : ''}`}
                    onClick={() => playTrack(track, release)}
                  >
                    <span className={styles.trackNum}>0{idx + 1}</span>
                    <button className={styles.playTrackBtn}>
                      {isActive && isPlaying ? '▮▮' : '▶'}
                    </button>
                    <span className={styles.trackTitle}>{track.title}</span>
                    <span className={styles.trackDuration}>{track.duration || '2:45'}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Streaming Platforms */}
          <div className={styles.platformsArea}>
            <h4 className={styles.platformsHeading}>EXTERNAL PLATFORM COORDINATES</h4>
            <div className={styles.platformButtons}>
              {Object.entries(PLATFORMS).map(([key, item]) => (
                <a
                  key={key}
                  href={item.url || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.platformLink}
                >
                  <span>{item.name}</span>
                  <span className={styles.linkArrow}>↗</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
