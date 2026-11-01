// SILICIUM — Integrated Desktop/Mobile Music Player
import React, { useState, useRef, useEffect } from 'react'
import { useStore } from '../data/store'
import { RELEASES } from '../data/config'
import styles from './IntegratedPlayer.module.css'

export default function IntegratedPlayer({ variant = 'desktop' }) {
  const {
    currentTrack,
    currentRelease,
    isPlaying,
    volume,
    progress,
    duration,
    togglePlay,
    setIsPlaying,
    setCurrentTrack,
    setCurrentRelease,
    setVolume,
    setProgress,
    setDuration,
  } = useStore()

  const [showSoundCloudEmbed, setShowSoundCloudEmbed] = useState(false)
  const audioRef = useRef(null)
  const [synthPlaying, setSynthPlaying] = useState(false)
  const synthIntervalRef = useRef(null)

  // Переключение трека
  const handleNextTrack = () => {
    const currentIndex = RELEASES.findIndex((r) => r.id === currentRelease?.id)
    const nextIndex = (currentIndex + 1) % RELEASES.length
    const nextRelease = RELEASES[nextIndex]
    setCurrentRelease(nextRelease)
    setCurrentTrack(nextRelease.tracks[0])
  }

  const handlePrevTrack = () => {
    const currentIndex = RELEASES.findIndex((r) => r.id === currentRelease?.id)
    const prevIndex = (currentIndex - 1 + RELEASES.length) % RELEASES.length
    const prevRelease = RELEASES[prevIndex]
    setCurrentRelease(prevRelease)
    setCurrentTrack(prevRelease.tracks[0])
  }

  // Симуляция таймлайна, если нет прямого аудиопотока
  useEffect(() => {
    if (isPlaying) {
      synthIntervalRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 134) {
            handleNextTrack()
            return 0
          }
          return prev + 1
        })
      }, 1000)
    } else {
      clearInterval(synthIntervalRef.current)
    }
    return () => clearInterval(synthIntervalRef.current)
  }, [isPlaying, currentTrack])

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60)
    const s = Math.floor(secs % 60)
    return `${m}:${s < 10 ? '0' : ''}${s}`
  }

  const activeRelease = currentRelease || RELEASES[0]
  const activeTrack = currentTrack || activeRelease.tracks[0]

  return (
    <div className={`${styles.playerWrapper} ${styles[variant]}`}>
      <div className={styles.playerHeader}>
        <span className={styles.terminalSignal}>
          <span className={`${styles.signalLed} ${isPlaying ? styles.ledActive : ''}`} />
          {isPlaying ? 'AUDIO ENGINE // TRANSMITTING' : 'AUDIO ENGINE // STANDBY'}
        </span>
        <span className={styles.sourceTag}>SOUNDCLOUD LINKED</span>
      </div>

      {/* Main Track Info */}
      <div className={styles.trackCard}>
        <div className={styles.coverWrapper}>
          <img
            src={activeRelease.cover || '/images/demon-mask.jpg'}
            alt={activeTrack.title}
            className={styles.coverImg}
          />
          <div className={styles.cornerAccent} />
        </div>

        <div className={styles.trackDetails}>
          <div className={styles.trackNumber}>
            FREQ // 0{RELEASES.findIndex((r) => r.id === activeRelease.id) + 1}
          </div>
          <h4 className={styles.trackTitle}>{activeTrack.title}</h4>
          <span className={styles.releaseMeta}>
            SILICIUM // {activeRelease.year} // {activeRelease.genre}
          </span>
        </div>
      </div>

      {/* Real-time Frequency Waveform Bars */}
      <div className={styles.waveformContainer}>
        {Array.from({ length: 24 }).map((_, i) => (
          <div
            key={i}
            className={styles.waveBar}
            style={{
              height: isPlaying ? `${Math.max(4, (Math.sin(i * 0.8 + progress) * 0.5 + 0.5) * 26 + 3)}px` : '3px',
              opacity: isPlaying ? 0.9 : 0.3,
            }}
          />
        ))}
      </div>

      {/* Progress Timeline */}
      <div className={styles.timelineArea}>
        <span className={styles.timeLabel}>{formatTime(progress)}</span>
        <div
          className={styles.progressBar}
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect()
            const clickPos = (e.clientX - rect.left) / rect.width
            setProgress(Math.floor(clickPos * 134))
          }}
        >
          <div
            className={styles.progressFill}
            style={{ width: `${(progress / 134) * 100}%` }}
          />
        </div>
        <span className={styles.timeLabel}>{activeTrack.duration || '2:14'}</span>
      </div>

      {/* Playback Controls */}
      <div className={styles.controlRow}>
        <button
          onClick={handlePrevTrack}
          className={styles.stepBtn}
          title="Previous Frequency"
        >
          ⟨⟨
        </button>

        <button
          onClick={togglePlay}
          className={`${styles.playMainBtn} ${isPlaying ? styles.playActive : ''}`}
          title={isPlaying ? 'Pause Transmission' : 'Transmit Frequency'}
        >
          {isPlaying ? '▮▮' : '▶'}
        </button>

        <button
          onClick={handleNextTrack}
          className={styles.stepBtn}
          title="Next Frequency"
        >
          ⟩⟩
        </button>
      </div>

      {/* SoundCloud Direct Stream Integration */}
      <div className={styles.soundcloudIntegration}>
        <button
          onClick={() => setShowSoundCloudEmbed(!showSoundCloudEmbed)}
          className={styles.soundcloudToggle}
        >
          <span>{showSoundCloudEmbed ? 'HIDE SOUNDCLOUD PLAYER' : 'OFFICIAL SOUNDCLOUD STREAM ♫'}</span>
          <span>{showSoundCloudEmbed ? '▲' : '▼'}</span>
        </button>

        {showSoundCloudEmbed && (
          <div className={styles.embedContainer}>
            <iframe
              width="100%"
              height="166"
              scrolling="no"
              frameBorder="no"
              allow="autoplay"
              src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(
                activeRelease.soundcloudUrl || 'https://soundcloud.com/sillic1um/my-weed'
              )}&color=%23ff0022&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false`}
              title="SILICIUM SoundCloud Stream"
            />
          </div>
        )}
      </div>

      <div className={styles.playerFooter}>
        <a
          href={activeRelease.soundcloudUrl || 'https://soundcloud.com/sillic1um'}
          target="_blank"
          rel="noreferrer"
          className={styles.externalLink}
        >
          LISTEN ON SOUNDCLOUD ↗
        </a>
      </div>
    </div>
  )
}
