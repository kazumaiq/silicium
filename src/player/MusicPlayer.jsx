// SILICIUM — Music Player Component
import { useEffect, useRef, useState, useCallback } from 'react'
import { useStore } from '../data/store'
import { audioEngine } from '../services/audioEngine'
import styles from './MusicPlayer.module.css'

export default function MusicPlayer() {
  const audioRef = useRef(null)
  const analyserRef = useRef(null)
  const audioContextRef = useRef(null)
  const sourceRef = useRef(null)
  const progressRef = useRef(null)
  const vizBarsRef = useRef([])

  // Real-time authentic FFT visualizer
  useEffect(() => {
    const unsubscribe = audioEngine.onFrame((data) => {
      if (!vizBarsRef.current || !data.rawFft) return
      const total = vizBarsRef.current.length
      for (let i = 0; i < total; i++) {
        const bar = vizBarsRef.current[i]
        if (bar) {
          const binIdx = Math.floor((i / total) * (data.rawFft.length * 0.75))
          const val = data.rawFft[binIdx] || 0
          const h = Math.max(2, (val / 255) * 24)
          bar.style.height = `${h}px`
          bar.style.opacity = (0.3 + (val / 255) * 0.7).toString()
        }
      }
    })
    return () => unsubscribe()
  }, [])
  
  const {
    isPlaying, currentTrack, currentRelease,
    volume, progress, duration, miniPlayer,
    setIsPlaying, setProgress, setDuration,
    setVolume, setMiniPlayer, togglePlay,
    setAudioVisualizerData, setCurrentTrack
  } = useStore()

  const [isDragging, setIsDragging] = useState(false)
  const [showVolume, setShowVolume] = useState(false)

  // Initialize audio context for visualization
  const initAudioContext = useCallback(() => {
    if (audioContextRef.current || !audioRef.current) return
    
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 128
      analyser.smoothingTimeConstant = 0.8
      
      const source = ctx.createMediaElementSource(audioRef.current)
      source.connect(analyser)
      analyser.connect(ctx.destination)
      
      audioContextRef.current = ctx
      analyserRef.current = analyser
      sourceRef.current = source
    } catch (e) {
      console.warn('AudioContext not available:', e)
    }
  }, [])

  // Update visualizer data
  useEffect(() => {
    if (!isPlaying || !analyserRef.current) return
    
    const dataArray = new Float32Array(analyserRef.current.frequencyBinCount)
    let raf
    
    const update = () => {
      analyserRef.current.getFloatFrequencyData(dataArray)
      setAudioVisualizerData(new Float32Array(dataArray))
      raf = requestAnimationFrame(update)
    }
    
    update()
    return () => cancelAnimationFrame(raf)
  }, [isPlaying, setAudioVisualizerData])

  // Handle play/pause
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !currentTrack?.audioSrc) return

    if (isPlaying) {
      initAudioContext()
      audio.play().catch(() => setIsPlaying(false))
    } else {
      audio.pause()
    }
  }, [isPlaying, currentTrack, initAudioContext, setIsPlaying])

  // Handle track change
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !currentTrack?.audioSrc) return
    
    audio.src = currentTrack.audioSrc
    audio.load()
    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false))
    }
  }, [currentTrack, setIsPlaying])

  // Handle volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  // Time update
  const handleTimeUpdate = () => {
    if (!isDragging && audioRef.current) {
      setProgress(audioRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }

  // Skip to next/prev track in release
  const skipTrack = (direction) => {
    if (!currentRelease?.tracks) return
    const currentIndex = currentRelease.tracks.findIndex(t => t.id === currentTrack?.id)
    const newIndex = currentIndex + direction
    if (newIndex >= 0 && newIndex < currentRelease.tracks.length) {
      setCurrentTrack(currentRelease.tracks[newIndex])
    }
  }

  // Progress bar interaction
  const handleProgressClick = (e) => {
    if (!progressRef.current || !audioRef.current || !duration) return
    const rect = progressRef.current.getBoundingClientRect()
    const pos = (e.clientX - rect.left) / rect.width
    const newTime = pos * duration
    audioRef.current.currentTime = newTime
    setProgress(newTime)
  }

  const formatTime = (t) => {
    if (!t || isNaN(t)) return '0:00'
    const m = Math.floor(t / 60)
    const s = Math.floor(t % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  const progressPercent = duration ? (progress / duration) * 100 : 0

  // Show mini player on scroll
  useEffect(() => {
    const onScroll = () => {
      setMiniPlayer(window.scrollY > 300)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [setMiniPlayer])

  if (!currentTrack) return null

  return (
    <div className={`${styles.player} ${miniPlayer ? styles.mini : ''}`}>
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => skipTrack(1)}
        preload="metadata"
      />

      {/* Visualizer bars */}
      <div className={styles.visualizer}>
        {Array.from({ length: 32 }).map((_, i) => (
          <div
            key={i}
            ref={(el) => (vizBarsRef.current[i] = el)}
            className={styles.vizBar}
            style={{
              height: '2px',
              opacity: 0.3,
            }}
          />
        ))}
      </div>

      <div className={styles.playerInner}>
        {/* Cover art */}
        <div className={styles.cover}>
          {currentRelease?.cover ? (
            <img src={currentRelease.cover} alt={currentRelease.title} />
          ) : (
            <div className={styles.coverPlaceholder}>
              <span>◆</span>
            </div>
          )}
        </div>

        {/* Track info */}
        <div className={styles.info}>
          <span className={styles.trackTitle}>{currentTrack.title}</span>
          <span className={styles.trackArtist}>SILICIUM</span>
        </div>

        {/* Controls */}
        <div className={styles.controls}>
          <button 
            className={styles.controlBtn} 
            onClick={() => skipTrack(-1)}
            aria-label="Previous track"
          >
            ⟨⟨
          </button>
          <button 
            className={styles.playBtn} 
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? '▮▮' : '▶'}
          </button>
          <button 
            className={styles.controlBtn} 
            onClick={() => skipTrack(1)}
            aria-label="Next track"
          >
            ⟩⟩
          </button>
        </div>

        {/* Progress */}
        <div className={styles.progressSection}>
          <span className={styles.time}>{formatTime(progress)}</span>
          <div 
            ref={progressRef}
            className={styles.progressBar}
            onClick={handleProgressClick}
          >
            <div 
              className={styles.progressFill} 
              style={{ width: `${progressPercent}%` }}
            />
            <div 
              className={styles.progressHandle}
              style={{ left: `${progressPercent}%` }}
            />
          </div>
          <span className={styles.time}>{formatTime(duration)}</span>
        </div>

        {/* Volume */}
        <div className={styles.volumeSection}>
          <button 
            className={styles.controlBtn}
            onClick={() => setShowVolume(!showVolume)}
            aria-label="Volume"
          >
            {volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊'}
          </button>
          {showVolume && (
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className={styles.volumeSlider}
            />
          )}
        </div>
      </div>
    </div>
  )
}
