// SILICIUM — Unified Seamless Continuous Scroll Architecture
import React, { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ARTIST, RELEASES } from '../data/config'
import { useStore } from '../data/store'

// Secondary Sections for Single-Page Seamless Flow
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
    progress,
    togglePlay,
    playTrack,
    language,
    setProgress,
    setCurrentTrack,
    setCurrentRelease,
    currentSection,
    setCurrentSection,
    setSelectedReleaseModal,
  } = useStore()

  const releasesScrollRef = useRef(null)
  const homeSectionRef = useRef(null)

  // 5 последних релизов для Hero-карусели
  const latestFiveReleases = RELEASES.slice(0, 5)
  const activeRelease = currentRelease || latestFiveReleases[0]
  const activeTrack = currentTrack || activeRelease.tracks[0]

  // Скролл ленты релизов в Hero
  const handleScroll = (dir) => {
    if (releasesScrollRef.current) {
      releasesScrollRef.current.scrollBy({
        left: dir * 260,
        behavior: 'smooth',
      })
    }
  }

  // Плавный скролл к секции
  const scrollToSection = (id) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
      if (window.history.replaceState) {
        window.history.replaceState(null, '', `#${id}`)
      }
    }
  }

  // Тексты локализации
  const t = {
    RU: {
      digitalArchive: 'DIGITAL ARCHIVE',
      years: '2022 — 2026',
      latestReleases: 'ПОСЛЕДНИЕ РЕЛИЗЫ',
      scrollDown: 'ПРОКРУТИТЬ ВНИЗ',
      spec: 'СПЕЦИФИКАЦИЯ',
      genresNotice: 'OCCULT SUB-BASS // 808 DISTORTION',
      frequencyLabel: 'ТЕКУЩАЯ ЧАСТОТА',
    },
    EN: {
      digitalArchive: 'DIGITAL ARCHIVE',
      years: '2022 — 2026',
      latestReleases: 'LATEST RELEASES',
      scrollDown: 'SCROLL DOWN',
      spec: 'SPEC',
      genresNotice: 'OCCULT SUB-BASS // 808 DISTORTION',
      frequencyLabel: 'CURRENT FREQUENCY',
    },
  }[language] || {
    digitalArchive: 'DIGITAL ARCHIVE',
    years: '2022 — 2026',
    latestReleases: 'ПОСЛЕДНИЕ РЕЛИЗЫ',
    scrollDown: 'SCROLL DOWN',
    spec: 'SPEC',
    genresNotice: 'OCCULT SUB-BASS // 808 DISTORTION',
    frequencyLabel: 'CURRENT FREQUENCY',
  }

  // Звуковая симуляция волны
  useEffect(() => {
    let timer = null
    if (isPlaying) {
      timer = setInterval(() => {
        setProgress((p) => (p >= 134 ? 0 : p + 1))
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [isPlaying, setProgress])

  // ScrollSpy для точного определения активного раздела в реальном времени
  useEffect(() => {
    const sectionIds = ['home', 'discography', 'archive', 'about', 'community', 'platforms']

    const handleScrollSpy = () => {
      const scrollPosition = window.scrollY + 120 // Смещение под фиксированный header
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i])
        if (el && el.offsetTop <= scrollPosition) {
          setCurrentSection(sectionIds[i])
          break
        }
      }
    }

    window.addEventListener('scroll', handleScrollSpy, { passive: true })
    // Запуск при старте
    handleScrollSpy()

    // Начальный скролл к хешу при первом открытии
    if (window.location.hash) {
      const targetId = window.location.hash.replace('#', '')
      const targetEl = document.getElementById(targetId)
      if (targetEl) {
        setTimeout(() => {
          targetEl.scrollIntoView({ behavior: 'smooth' })
        }, 150)
      }
    }

    return () => window.removeEventListener('scroll', handleScrollSpy)
  }, [setCurrentSection])

  return (
    <div className={styles.seamlessContainer}>
      {/* ───────────────────────────────────────────────────────────── */}
      {/* МНОГОСЛОЙНЫЙ ТЕМНЫЙ ФОН: Металл, дым, трещины стекла, аура    */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className={styles.metalTextureLayer} />
      <div className={styles.smokeLayer} />
      <div className={styles.glassCracksLayer} />
      <div className={styles.redGlowAura} />

      {/* Угловые металлические скобы и вертикальные цепи */}
      <div className={styles.cornerBracketTL} />
      <div className={styles.cornerBracketTR} />
      <div className={styles.cornerBracketBL} />
      <div className={styles.cornerBracketBR} />
      <div className={styles.leftChainDecoration} />
      <div className={styles.rightChainDecoration} />

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 01 // СЕКЦИЯ HOME (EXACT CONCEPT MOCKUP HERO STAGE)           */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section id="home" ref={homeSectionRef} className={styles.homeSection}>
        <div className={styles.mainStageGrid}>
          {/* ЛЕВАЯ ЧАСТЬ: МУЗЫКАЛЬНЫЕ НАПРАВЛЕНИЯ */}
          <aside className={styles.leftGenresBlock}>
            <div className={styles.genreList}>
              <div className={styles.genreWord}>
                <span>PHONK</span><span className={styles.dotAccent}>.</span>
              </div>
              <div className={styles.genreWord}>
                <span>DRIFT</span><span className={styles.dotAccent}>.</span>
              </div>
              <div className={styles.genreWord}>
                <span>EXPERIMENTAL</span><span className={styles.dotAccent}>.</span>
              </div>
              <div className={styles.genreWord}>
                <span>DARK</span><span className={styles.dotAccent}>.</span>
              </div>
            </div>
            <div className={styles.subBassNotice}>
              <span>{t.genresNotice}</span>
            </div>
          </aside>

          {/* ЦЕНТР: ДЕМОНИЧЕСКАЯ МАСКА + КРАСНОЕ КОЛЬЦО + ЛОГОТИП */}
          <div className={styles.centerFocalStage}>
            {/* Энергетическое кольцо */}
            <div className={styles.energyRingWrapper}>
              <div className={styles.pulsingEnergyRing} />
              <div className={styles.laserOrbitRing} />
              <div className={styles.innerSparksRing} />
            </div>

            {/* Органично растворенная круглая маска */}
            <div className={styles.maskCompositeContainer}>
              <img
                src="/images/demon-mask-blended.png"
                alt="SILICIUM Occult Mask"
                className={styles.centralDemonMask}
                loading="eager"
              />
            </div>

            {/* Металлический прозрачный логотип */}
            <div className={styles.logoTitleLockup}>
              <img
                src="/images/logo-red-transparent.png"
                alt="SILICIUM"
                className={styles.logoOverlayImage}
              />
              <div className={styles.archiveTagline}>{t.digitalArchive}</div>
              <div className={styles.yearsInterval}>// {t.years} //</div>

              {/* Кликабельный индикатор прокрутки вниз к дискографии */}
              <button
                onClick={() => scrollToSection('discography')}
                className={styles.scrollDownBtn}
                aria-label="Scroll down to Discography"
              >
                <span className={styles.scrollDownText}>{t.scrollDown}</span>
                <span className={styles.scrollLine} />
                <span className={styles.scrollChevron}>↓</span>
              </button>
            </div>
          </div>

          {/* ПРАВАЯ ЧАСТЬ: КОМПАКТНЫЙ МУЗЫКАЛЬНЫЙ ПЛЕЕР */}
          <aside className={styles.rightPlayerBlock}>
            <div className={styles.compactPlayerBox}>
              <div className={styles.playerTrackHeader}>
                <span className={styles.currentTrackLabel}>{t.frequencyLabel}</span>
                <span className={styles.trackYearBadge}>{activeRelease.year}</span>
              </div>

              <h3 className={styles.compactTrackTitle}>{activeTrack.title}</h3>
              <div className={styles.compactArtistLabel}>SILICIUM</div>

              {/* Компактная анимированная звуковая волна */}
              <div className={styles.compactWaveform}>
                {Array.from({ length: 18 }).map((_, i) => (
                  <span
                    key={i}
                    className={styles.waveStick}
                    style={{
                      height: isPlaying
                        ? `${Math.max(4, (Math.sin(i * 0.9 + progress) * 0.5 + 0.5) * 22 + 4)}px`
                        : '4px',
                      opacity: isPlaying ? 0.95 : 0.35,
                    }}
                  />
                ))}
              </div>

              {/* Кнопка воспроизведения */}
              <div className={styles.playerActionsRow}>
                <button
                  onClick={togglePlay}
                  className={`${styles.compactPlayBtn} ${isPlaying ? styles.compactPlayActive : ''}`}
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? '▮▮' : '▶'}
                </button>

                <div className={styles.trackStatusText}>
                  {isPlaying ? 'TRANSMITTING' : 'STANDBY'}
                </div>

                <a
                  href={activeRelease.soundcloudUrl || 'https://soundcloud.com/sillic1um/my-weed'}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.scDirectLink}
                  title="Open in SoundCloud"
                >
                  SOUNDCLOUD ↗
                </a>
              </div>
            </div>
          </aside>
        </div>

        {/* НИЖНЯЯ ЧАСТЬ HERO: ПОСЛЕДНИЕ РЕЛИЗЫ (5 ОБЛОЖЕК) */}
        <div className={styles.bottomReleasesSection}>
          <div className={styles.releasesHeaderBar}>
            <div className={styles.releasesTitleGroup}>
              <span className={styles.titleSlash}>//</span>
              <h3 className={styles.releasesMainHeading}>{t.latestReleases}</h3>
            </div>

            <div className={styles.galleryNavButtons}>
              <button
                onClick={() => handleScroll(-1)}
                className={styles.galleryArrowBtn}
                aria-label="Previous releases"
              >
                ⟨
              </button>
              <button
                onClick={() => handleScroll(1)}
                className={styles.galleryArrowBtn}
                aria-label="Next releases"
              >
                ⟩
              </button>
            </div>
          </div>

          {/* Горизонтальная лента из 5 карточек */}
          <div ref={releasesScrollRef} className={styles.fiveReleasesTrack}>
            {latestFiveReleases.map((rel) => {
              const isSelected = activeRelease.id === rel.id
              const isPlayingThis = isPlaying && isSelected

              return (
                <article
                  key={rel.id}
                  className={`${styles.releaseThumbCard} ${isSelected ? styles.cardActiveSelection : ''}`}
                  onClick={() => {
                    setCurrentRelease(rel)
                    setCurrentTrack(rel.tracks[0])
                  }}
                >
                  <div className={styles.coverFrame}>
                    <img
                      src={rel.cover}
                      alt={rel.title}
                      className={styles.coverImg}
                      loading="lazy"
                    />
                    <div className={styles.coverOverlay}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          playTrack(rel.tracks[0], rel)
                        }}
                        className={styles.thumbPlayBtn}
                        aria-label={isPlayingThis ? 'Pause' : 'Play'}
                      >
                        {isPlayingThis ? '▮▮' : '▶'}
                      </button>
                      <button
                        className={styles.thumbDetailLink}
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedReleaseModal(rel)
                        }}
                      >
                        {t.spec}
                      </button>
                    </div>
                  </div>

                  <div className={styles.releaseMetaBox}>
                    <div className={styles.releaseTitleText}>
                      <button
                        className={styles.textLinkBtn}
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedReleaseModal(rel)
                        }}
                      >
                        {rel.title}
                      </button>
                    </div>
                    <div className={styles.releaseYearText}>{rel.year}</div>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 02 // СЕКЦИЯ DISCOGRAPHY (ПОЛНЫЙ КАТАЛОГ ЧАСТОТ)              */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section id="discography" className={styles.contentSection}>
        <DiscographyPage />
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 03 // СЕКЦИЯ 3D ARCHIVE (ПРОСТРАНСТВЕННАЯ МАТРИЦА АРТЕФАКТОВ) */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section id="archive" className={styles.contentSection}>
        <ArchivePage />
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 04 // СЕКЦИЯ ABOUT (ORIGIN, PARADOX & TIMELINE)               */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section id="about" className={styles.contentSection}>
        <AboutPage />
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 05 // СЕКЦИЯ COMMUNITY (ТЕРМИНАЛЫ СВЯЗИ & TELEGRAM)          */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section id="community" className={styles.contentSection}>
        <CommunityPage />
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 06 // СЕКЦИЯ PLATFORMS (СТРИМИНГОВЫЕ УЗЛЫ)                   */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section id="platforms" className={styles.contentSection}>
        <PlatformsPage />
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* ФИНАЛЬНЫЙ ПОДВАЛ                                              */}
      {/* ───────────────────────────────────────────────────────────── */}
      <Footer />

      {/* ───────────────────────────────────────────────────────────── */}
      {/* МОДАЛЬНОЕ ОКНО ДЕТАЛЕЙ РЕЛИЗА                                */}
      {/* ───────────────────────────────────────────────────────────── */}
      <ReleaseModal />

      {/* ───────────────────────────────────────────────────────────── */}
      {/* МОБИЛЬНЫЙ ФИКСИРОВАННЫЙ ДОК НАВИГАЦИИ (HOME, RELEASES, 3D...)  */}
      {/* ───────────────────────────────────────────────────────────── */}
      <nav className={styles.mobileFixedDock}>
        <button
          onClick={() => scrollToSection('home')}
          className={`${styles.mobileDockTab} ${currentSection === 'home' ? styles.mobileDockActive : ''}`}
        >
          <span className={styles.dockIcon}>⌂</span>
          <span className={styles.dockText}>HOME</span>
        </button>
        <button
          onClick={() => scrollToSection('discography')}
          className={`${styles.mobileDockTab} ${currentSection === 'discography' ? styles.mobileDockActive : ''}`}
        >
          <span className={styles.dockIcon}>♫</span>
          <span className={styles.dockText}>RELEASES</span>
        </button>
        <button
          onClick={() => scrollToSection('archive')}
          className={`${styles.mobileDockTab} ${currentSection === 'archive' ? styles.mobileDockActive : ''}`}
        >
          <span className={styles.dockIcon}>◈</span>
          <span className={styles.dockText}>3D VAULT</span>
        </button>
        <button
          onClick={() => scrollToSection('about')}
          className={`${styles.mobileDockTab} ${currentSection === 'about' ? styles.mobileDockActive : ''}`}
        >
          <span className={styles.dockIcon}>ℹ</span>
          <span className={styles.dockText}>ABOUT</span>
        </button>
        <button
          onClick={() => scrollToSection('community')}
          className={`${styles.mobileDockTab} ${currentSection === 'community' ? styles.mobileDockActive : ''}`}
        >
          <span className={styles.dockIcon}>✉</span>
          <span className={styles.dockText}>NODES</span>
        </button>
      </nav>
    </div>
  )
}
