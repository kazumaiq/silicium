// SILICIUM — Editorial Single-Page Universe (Martin Garrix Benchmark)
import React, { useRef, useEffect } from 'react'
import { ARTIST, RELEASES } from '../data/config'
import { useStore } from '../data/store'
import { audioEngine } from '../services/audioEngine'

// Core Sections for Continuous Editorial Flow
import DiscographyPage from './DiscographyPage'
import ArchivePage from './ArchivePage'
import AboutPage from './AboutPage'
import CommunityPage from './CommunityPage'
import PlatformsPage from './PlatformsPage'
import Footer from '../components/Footer'
import ReleaseModal from '../components/ReleaseModal'

import styles from './HomePage.module.css'

export default function HomePage() {
  const {
    currentTrack,
    currentRelease,
    isPlaying,
    togglePlay,
    playTrack,
    language,
    setCurrentSection,
  } = useStore()

  const homeSectionRef = useRef(null)
  const ringRef = useRef(null)
  const laserRingRef = useRef(null)
  const maskRef = useRef(null)
  const auraRef = useRef(null)
  const waveBarsRef = useRef([])

  // Foundational Genesis Track ("MY WEED")
  const genesisRelease = RELEASES[0]
  const genesisTrack = genesisRelease.tracks[0]

  const isGenesisPlaying = isPlaying && (currentTrack?.id === genesisTrack.id || currentRelease?.id === genesisRelease.id)

  const handlePlayGenesis = () => {
    if (isGenesisPlaying) {
      togglePlay()
    } else {
      playTrack(genesisTrack, genesisRelease)
    }
  }

  const scrollToSection = (id) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
      if (window.history.replaceState) {
        window.history.replaceState(null, '', `#${id}`)
      }
    }
  }

  const t = {
    RU: {
      subGenre: 'OCCULT MEMPHIS PHONK // SUB-BASS TRANSCENDENCE',
      artistCoords: 'OFFICIAL DIGITAL ARCHIVE // 2022 — 2026',
      listenCta: isGenesisPlaying ? 'PAUSE TRANSMISSION' : 'TRANSMIT FREQUENCY // "MY WEED"',
      scrollHint: 'SCROLL TO EXPLORE',
    },
    EN: {
      subGenre: 'OCCULT MEMPHIS PHONK // SUB-BASS TRANSCENDENCE',
      artistCoords: 'OFFICIAL DIGITAL ARCHIVE // 2022 — 2026',
      listenCta: isGenesisPlaying ? 'PAUSE TRANSMISSION' : 'TRANSMIT FREQUENCY // "MY WEED"',
      scrollHint: 'SCROLL TO EXPLORE',
    },
  }[language] || {
    subGenre: 'OCCULT MEMPHIS PHONK // SUB-BASS TRANSCENDENCE',
    artistCoords: 'OFFICIAL DIGITAL ARCHIVE // 2022 — 2026',
    listenCta: 'TRANSMIT FREQUENCY // "MY WEED"',
    scrollHint: 'SCROLL TO EXPLORE',
  }

  // ScrollSpy to keep current section active
  useEffect(() => {
    const sectionIds = ['home', 'discography', 'archive', 'about', 'community', 'platforms']

    const handleScrollSpy = () => {
      const scrollPosition = window.scrollY + 140
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i])
        if (el && el.offsetTop <= scrollPosition) {
          setCurrentSection(sectionIds[i])
          break
        }
      }
    }

    window.addEventListener('scroll', handleScrollSpy, { passive: true })
    handleScrollSpy()

    return () => window.removeEventListener('scroll', handleScrollSpy)
  }, [setCurrentSection])

  // Real-time audio reactive pulse on mask & energy aura
  useEffect(() => {
    let laserAngle = 0

    const unsubscribe = audioEngine.onFrame((data) => {
      if (ringRef.current) {
        const scale = 1 + data.bass * 0.12
        const glowBlur = 30 + data.bass * 45
        ringRef.current.style.transform = `scale(${scale})`
        ringRef.current.style.boxShadow = `0 0 ${glowBlur}px rgba(255, 23, 61, 0.75), inset 0 0 ${glowBlur * 0.5}px rgba(255, 23, 61, 0.5)`
      }

      if (laserRingRef.current) {
        laserAngle += 0.4 + data.energy * 2.0
        laserRingRef.current.style.transform = `rotate(${laserAngle}deg)`
      }

      if (maskRef.current) {
        const timePulse = Math.sin(Date.now() * 0.0018) * 0.02
        const maskScale = 1 + timePulse + data.bass * 0.06
        maskRef.current.style.transform = `scale(${maskScale})`
      }

      if (auraRef.current) {
        const auraScale = 1 + data.bass * 0.2
        auraRef.current.style.transform = `translate(-50%, -50%) scale(${auraScale})`
      }

      if (waveBarsRef.current.length > 0 && data.rawFft) {
        const total = waveBarsRef.current.length
        for (let i = 0; i < total; i++) {
          const bar = waveBarsRef.current[i]
          if (bar) {
            const binIdx = Math.floor((i / total) * (data.rawFft.length * 0.6))
            const val = data.rawFft[binIdx] || 0
            const h = Math.max(3, (val / 255) * 22)
            bar.style.height = `${h}px`
          }
        }
      }
    })

    return () => unsubscribe()
  }, [])

  return (
    <div className={styles.seamlessContainer}>
      {/* ───────────────────────────────────────────────────────────── */}
      {/* 01 // HERO STAGE (PURE EDITORIAL ART DIRECTION)               */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section id="home" ref={homeSectionRef} className={styles.heroSection}>
        {/* Martin Garrix Style Colossal Ghost Watermark */}
        <div className={styles.heroWatermark} aria-hidden="true">
          SILICIUM
        </div>

        {/* Ambient Volumetric Red Light Void */}
        <div ref={auraRef} className={styles.heroAuraGlow} />

        <div className={styles.heroStageContainer}>
          {/* Central Artwork (Demon Mask + Gyro Ring + Chrome Identity) */}
          <div className={styles.centerFocalStage}>
            <div className={styles.artworkWrapper}>
              <div ref={ringRef} className={styles.pulsingEnergyRing} />
              <div ref={laserRingRef} className={styles.laserOrbitRing} />

              <div className={styles.maskContainer}>
                <img
                  ref={maskRef}
                  src="/images/demon-mask-seamless.png"
                  alt="SILICIUM Occult Entity"
                  className={styles.demonMaskImage}
                  loading="eager"
                />
              </div>

              <div className={styles.logoOverlayLockup}>
                <img
                  src="/images/logo-silver-transparent.png"
                  alt="SILICIUM"
                  className={styles.siliciumTitleImage}
                />
              </div>
            </div>
          </div>

          {/* Editorial Content Below Visual */}
          <div className={styles.heroEditorialContent}>
            <p className={styles.heroGenreLine}>
              {t.subGenre}
            </p>
            <span className={styles.heroCoords}>
              {t.artistCoords}
            </span>

            {/* High-End Minimal Audio Trigger */}
            <div className={styles.heroAudioCluster}>
              <button
                onClick={handlePlayGenesis}
                className={`${styles.heroPlayButton} ${isGenesisPlaying ? styles.heroPlayActive : ''}`}
                aria-label="Transmit Genesis Frequency"
              >
                <span className={styles.playIcon}>{isGenesisPlaying ? '▮▮' : '▶'}</span>
                <span className={styles.playText}>{t.listenCta}</span>

                {/* Subtle Mini FFT Waveform */}
                <div className={styles.miniWaveform}>
                  {Array.from({ length: 12 }).map((_, i) => (
                    <span
                      key={i}
                      ref={(el) => (waveBarsRef.current[i] = el)}
                      className={styles.miniWaveBar}
                      style={{ height: '3px' }}
                    />
                  ))}
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Scroll Down Hint */}
        <button
          onClick={() => scrollToSection('discography')}
          className={styles.scrollDownIndicator}
          aria-label="Scroll down"
        >
          <span className={styles.scrollText}>{t.scrollHint}</span>
          <span className={styles.scrollLine} />
        </button>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 02 // RELEASES (FULL-SCALE EDITORIAL GALLERY)                  */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section id="discography" className={styles.contentSection}>
        <DiscographyPage />
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 03 // 3D VAULT (IMMERSIVE SPATIAL RELICS)                     */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section id="archive" className={styles.contentSection}>
        <ArchivePage />
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 04 // ABOUT (CHRONICLE & PHILOSOPHY)                          */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section id="about" className={styles.contentSection}>
        <AboutPage />
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 05 // COMMUNITY & TRANSMISSION NODES                          */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section id="community" className={styles.contentSection}>
        <CommunityPage />
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 06 // PLATFORMS (GLOBAL AUDIO HUBS)                           */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section id="platforms" className={styles.contentSection}>
        <PlatformsPage />
      </section>

      {/* Final Editorial Footer */}
      <Footer />

      {/* Release Detail Modal */}
      <ReleaseModal />
    </div>
  )
}
