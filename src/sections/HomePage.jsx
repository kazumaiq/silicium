// SILICIUM — Target Concept Home Page
import React, { useRef, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Link } from 'react-router-dom'
import { ARTIST, RELEASES } from '../data/config'
import { useStore } from '../data/store'
import CentralDemonMask3D from '../scenes/CentralDemonMask3D'
import IntegratedPlayer from '../components/IntegratedPlayer'
import styles from './HomePage.module.css'

export default function HomePage() {
  const { playTrack, currentTrack, isPlaying } = useStore()
  const releaseGalleryRef = useRef(null)

  const scrollGallery = (direction) => {
    if (releaseGalleryRef.current) {
      releaseGalleryRef.current.scrollBy({
        left: direction * 280,
        behavior: 'smooth',
      })
    }
  }

  return (
    <div className={styles.homeViewport}>
      {/* Background Ambience Overlays */}
      <div className={styles.noiseOverlay} />
      <div className={styles.vignetteOverlay} />

      {/* Main 3-Column Cockpit Canvas / Dashboard */}
      <div className={styles.cockpitGrid}>
        {/* LEFT COLUMN: ARCHIVE DOSSIER & SOUND SIGNATURE */}
        <aside className={styles.leftColumn}>
          <div className={styles.systemBox}>
            <div className={styles.boxHeader}>
              <span className={styles.cornerDot} />
              <span className={styles.sysTag}>ARCHIVE SPECIFICATIONS</span>
            </div>

            <div className={styles.specSection}>
              <span className={styles.specTitle}>// ENTITY</span>
              <div className={styles.entityName}>{ARTIST.name}</div>
              <div className={styles.aliasName}>{ARTIST.alias}</div>
            </div>

            <div className={styles.specSection}>
              <span className={styles.specTitle}>// FREQUENCY SPECTRUM</span>
              <ul className={styles.genreList}>
                {ARTIST.genres.map((g, idx) => (
                  <li key={idx} className={styles.genreItem}>
                    <span className={styles.genreBullet}>◆</span>
                    <span>{g}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.specSection}>
              <span className={styles.specTitle}>// TRANSMISSION ERA</span>
              <div className={styles.eraValue}>{ARTIST.years}</div>
              <div className={styles.eraSub}>FOUNDATIONAL GENESIS: 2022</div>
            </div>

            <div className={styles.systemStatus}>
              <div className={styles.statusRow}>
                <span>STATUS:</span>
                <span className={styles.statusActive}>ONLINE</span>
              </div>
              <div className={styles.statusRow}>
                <span>SIGNAL:</span>
                <span className={styles.statusActive}>LOCKED</span>
              </div>
              <div className={styles.statusRow}>
                <span>COORDINATES:</span>
                <span>UNKNOWN DIMENSION</span>
              </div>
            </div>

            <div className={styles.archiveLinkBox}>
              <Link to="/about" className={styles.dossierBtn}>
                DECRYPT FULL CHRONICLE →
              </Link>
            </div>
          </div>
        </aside>

        {/* CENTER COLUMN: THE DEMON MASK 3D + METALLIC SILICIUM LOGO */}
        <main className={styles.centerStage}>
          {/* 3D Scene Layer */}
          <div className={styles.mask3DCanvas}>
            <Canvas
              camera={{ position: [0, 0, 5], fov: 50 }}
              gl={{ antialias: true, alpha: true }}
            >
              <Suspense fallback={null}>
                <CentralDemonMask3D />
              </Suspense>
            </Canvas>
          </div>

          {/* Central Logo Overlay */}
          <div className={styles.logoOverlay}>
            <img
              src="/images/logo-red.png"
              alt="SILICIUM"
              className={styles.siliciumLogo}
            />
            <div className={styles.logoSubtitle}>DIGITAL ARCHIVE</div>
            <div className={styles.genesisTag}>// MY WEED — GENESIS FREQUENCY 2022 //</div>

            <div className={styles.ctaRow}>
              <Link to="/archive" className={styles.enterArchiveBtn}>
                <span className={styles.btnGlow} />
                <span>ENTER 3D ARCHIVE</span>
                <span className={styles.btnIcon}>↗</span>
              </Link>
              <Link to="/discography" className={styles.listenMusicBtn}>
                <span>DISCOGRAPHY</span>
              </Link>
            </div>
          </div>
        </main>

        {/* RIGHT COLUMN: INTEGRATED MUSIC ENGINE */}
        <aside className={styles.rightColumn}>
          <div className={styles.playerContainer}>
            <div className={styles.playerMetaHeader}>
              <span className={styles.cornerDot} />
              <span className={styles.sysTag}>AUDIO ENGINE // DISPATCH</span>
            </div>

            <IntegratedPlayer variant="desktop" />

            {/* Quick Links to Platforms */}
            <div className={styles.quickPlatforms}>
              <a
                href={ARTIST.soundcloud}
                target="_blank"
                rel="noreferrer"
                className={styles.quickLink}
              >
                SOUNDCLOUD ↗
              </a>
              <a
                href={ARTIST.spotify}
                target="_blank"
                rel="noreferrer"
                className={styles.quickLink}
              >
                SPOTIFY ↗
              </a>
              <a
                href={ARTIST.telegram}
                target="_blank"
                rel="noreferrer"
                className={styles.quickLink}
              >
                TELEGRAM ↗
              </a>
            </div>
          </div>
        </aside>
      </div>

      {/* BOTTOM SECTION: HORIZONTAL RELEASE GALLERY / ARCHIVE STREAM */}
      <footer className={styles.bottomGallerySection}>
        <div className={styles.galleryHeader}>
          <div className={styles.galleryTitleArea}>
            <span className={styles.galleryIndex}>// 01.2 //</span>
            <span className={styles.galleryTitle}>RELEASES & SONIC ARTIFACTS</span>
          </div>

          <div className={styles.galleryNavControls}>
            <button
              onClick={() => scrollGallery(-1)}
              className={styles.scrollBtn}
              aria-label="Scroll left"
            >
              ⟨
            </button>
            <button
              onClick={() => scrollGallery(1)}
              className={styles.scrollBtn}
              aria-label="Scroll right"
            >
              ⟩
            </button>
          </div>
        </div>

        {/* Horizontal Scroll Track */}
        <div ref={releaseGalleryRef} className={styles.galleryTrack}>
          {RELEASES.map((rel) => {
            const isCur = currentTrack?.id === rel.tracks[0]?.id
            return (
              <div key={rel.id} className={styles.releaseCard}>
                <div className={styles.cardImageWrapper}>
                  <img
                    src={rel.cover || '/images/demon-mask.jpg'}
                    alt={rel.title}
                    className={styles.cardImage}
                  />
                  <div className={styles.cardHoverOverlay}>
                    <button
                      onClick={() => playTrack(rel.tracks[0], rel)}
                      className={styles.cardPlayBtn}
                      title="Play in Engine"
                    >
                      {isCur && isPlaying ? '▮▮' : '▶'}
                    </button>
                    <Link
                      to={`/discography/${rel.id}`}
                      className={styles.cardInspectBtn}
                    >
                      SPEC ↗
                    </Link>
                  </div>
                </div>

                <div className={styles.cardInfo}>
                  <div className={styles.cardMetaRow}>
                    <span className={styles.cardYear}>CYCLE {rel.year}</span>
                    <span className={styles.cardType}>{rel.type.toUpperCase()}</span>
                  </div>
                  <h4 className={styles.cardTitle}>
                    <Link to={`/discography/${rel.id}`}>{rel.title}</Link>
                  </h4>
                  <span className={styles.cardGenre}>{rel.genre}</span>
                </div>
              </div>
            )
          })}
        </div>
      </footer>

      {/* MOBILE-ONLY BOTTOM NAVIGATION BAR */}
      <nav className={styles.mobileNavDock}>
        <Link to="/" className={`${styles.dockItem} ${styles.dockActive}`}>
          <span className={styles.dockIcon}>⌂</span>
          <span className={styles.dockLabel}>HOME</span>
        </Link>
        <Link to="/discography" className={styles.dockItem}>
          <span className={styles.dockIcon}>♫</span>
          <span className={styles.dockLabel}>RECORDS</span>
        </Link>
        <Link to="/archive" className={styles.dockItem}>
          <span className={styles.dockIcon}>◈</span>
          <span className={styles.dockLabel}>3D VAULT</span>
        </Link>
        <Link to="/community" className={styles.dockItem}>
          <span className={styles.dockIcon}>✉</span>
          <span className={styles.dockLabel}>NODE</span>
        </Link>
      </nav>
    </div>
  )
}
