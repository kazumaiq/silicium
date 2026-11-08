// SILICIUM — Unified Seamless Continuous Scroll Architecture
import React, { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ARTIST, RELEASES } from '../data/config'
import { useStore } from '../data/store'
import { audioEngine } from '../services/audioEngine'

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

  // Audio Reactive & Parallax Refs
  const ringRef = useRef(null)
  const laserRingRef = useRef(null)
  const maskRef = useRef(null)
  const auraRef = useRef(null)
  const waveBarsRef = useRef([])
  const centerStageRef = useRef(null)

  const metalRef = useRef(null)
  const smokeRef = useRef(null)
  const cracksRef = useRef(null)

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
      digitalArchive: 'OFFICIAL ARCHIVE // sillic1um',
      years: '2022 — 2026',
      latestReleases: 'ПОСЛЕДНИЕ РЕЛИЗЫ',
      scrollDown: 'ПРОКРУТИТЬ ВНИЗ',
      spec: 'СПЕЦИФИКАЦИЯ',
      genresNotice: 'OCCULT SUB-BASS // 808 DISTORTION',
      frequencyLabel: 'ТЕКУЩАЯ ЧАСТОТА',
    },
    EN: {
      digitalArchive: 'OFFICIAL ARCHIVE // sillic1um',
      years: '2022 — 2026',
      latestReleases: 'LATEST RELEASES',
      scrollDown: 'SCROLL DOWN',
      spec: 'SPEC',
      genresNotice: 'OCCULT SUB-BASS // 808 DISTORTION',
      frequencyLabel: 'CURRENT FREQUENCY',
    },
  }[language] || {
    digitalArchive: 'OFFICIAL ARCHIVE // sillic1um',
    years: '2022 — 2026',
    latestReleases: 'ПОСЛЕДНИЕ РЕЛИЗЫ',
    scrollDown: 'SCROLL DOWN',
    spec: 'SPEC',
    genresNotice: 'OCCULT SUB-BASS // 808 DISTORTION',
    frequencyLabel: 'CURRENT FREQUENCY',
  }

  // Звуковая симуляция прогресса только при отсутствии физического аудио-файла
  useEffect(() => {
    let timer = null
    if (isPlaying && !currentTrack?.audioSrc) {
      timer = setInterval(() => {
        setProgress((p) => (p >= 187 ? 0 : p + 1))
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [isPlaying, currentTrack, setProgress])

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

  // Реальное аудио-реактивное воздействие на Hero элементы в реальном времени (60 FPS)
  useEffect(() => {
    let laserAngle = 0

    const unsubscribe = audioEngine.onFrame((data) => {
      // 1. Центральное пульсирующее энергетическое кольцо
      if (ringRef.current) {
        const scale = 1 + data.bass * 0.14
        const glowBlur = 25 + data.bass * 50
        const glowOpacity = 0.75 + data.energy * 0.25
        ringRef.current.style.transform = `scale(${scale})`
        ringRef.current.style.boxShadow = `0 0 ${glowBlur}px rgba(255, 0, 34, ${glowOpacity}), 0 0 ${glowBlur * 2}px rgba(139, 0, 0, 0.6), inset 0 0 ${glowBlur}px rgba(255, 0, 34, 0.5)`
        ringRef.current.style.borderColor = `rgba(255, ${Math.round(data.bass * 60)}, 34, 0.95)`
      }

      // 2. Лазерное орбитальное кольцо вращается в такт с частотами
      if (laserRingRef.current) {
        laserAngle += 0.5 + data.energy * 2.5
        laserRingRef.current.style.transform = `rotate(${laserAngle}deg)`
        laserRingRef.current.style.borderColor = `rgba(255, 40, 60, ${0.5 + data.treble * 0.5})`
      }

      // 3. Центральная демоническая маска — медленное дыхание + микровздрагивание на 808 бас
      if (maskRef.current) {
        const timePulse = Math.sin(Date.now() * 0.0016) * 0.025
        const maskScale = 1 + timePulse + data.bass * 0.07
        maskRef.current.style.transform = `scale(${maskScale})`
        maskRef.current.style.filter = `contrast(${1.25 + data.bass * 0.22}) brightness(${1.05 + data.energy * 0.16}) drop-shadow(0 0 ${35 + data.bass * 35}px rgba(220, 20, 60, ${0.45 + data.bass * 0.4}))`
      }

      // 4. Фоновая красная аура разрастается при низких частотах
      if (auraRef.current) {
        const auraScale = 1 + data.bass * 0.24
        const auraOpacity = 0.28 + data.bass * 0.28
        auraRef.current.style.transform = `translateX(-50%) scale(${auraScale})`
        auraRef.current.style.opacity = auraOpacity.toString()
      }

      // 5. Полосы звуковой волны в компактном плеере
      if (waveBarsRef.current.length > 0 && data.rawFft) {
        const total = waveBarsRef.current.length
        for (let i = 0; i < total; i++) {
          const bar = waveBarsRef.current[i]
          if (bar) {
            const binIdx = Math.floor((i / total) * (data.rawFft.length * 0.65))
            const val = data.rawFft[binIdx] || 0
            const h = Math.max(3, (val / 255) * 26)
            bar.style.height = `${h}px`
            bar.style.opacity = (0.35 + (val / 255) * 0.65).toString()
          }
        }
      }
    })

    // Многослойный скролл-параллакс и живое перемещение красной ауры
    const handleScrollParallax = () => {
      const y = window.scrollY
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      const scrollRatio = y / maxScroll

      // Hero композиция плавно уходит вверх при скролле
      if (centerStageRef.current) {
        centerStageRef.current.style.transform = `translate3d(0, ${-y * 0.16}px, 0)`
        centerStageRef.current.style.opacity = Math.max(0, 1 - y * 0.0016).toString()
      }

      if (metalRef.current) metalRef.current.style.transform = `translate3d(0, ${y * 0.06}px, 0)`
      if (smokeRef.current) smokeRef.current.style.transform = `translate3d(0, ${y * 0.12}px, 0)`
      if (cracksRef.current) cracksRef.current.style.transform = `translate3d(0, ${y * 0.03}px, 0)`

      // Красное свечение перемещается между секциями в зависимости от прогресса
      if (auraRef.current) {
        const targetTop = 15 + scrollRatio * 68
        auraRef.current.style.top = `${targetTop}%`
      }
    }
    window.addEventListener('scroll', handleScrollParallax, { passive: true })

    return () => {
      unsubscribe()
      window.removeEventListener('scroll', handleScrollParallax)
    }
  }, [])

  return (
    <div className={styles.seamlessContainer}>
      {/* ───────────────────────────────────────────────────────────── */}
      {/* МНОГОСЛОЙНЫЙ ТЕМНЫЙ ФОН: Металл, дым, трещины стекла, аура    */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div ref={metalRef} className={styles.metalTextureLayer} />
      <div ref={smokeRef} className={styles.smokeLayer} />
      <div ref={cracksRef} className={styles.glassCracksLayer} />
      <div ref={auraRef} className={styles.redGlowAura} />

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

          {/* ЦЕНТР: ЕДИНАЯ ХУДОЖЕСТВЕННАЯ КОМПОЗИЦИЯ МАСКА + КОЛЬЦО + ЛОГОТИП */}
          <div ref={centerStageRef} className={styles.centerFocalStage}>
            <div className={styles.artworkContainer}>
              {/* Энергетическое многослойное кольцо */}
              <div className={styles.energyRingWrapper}>
                <div ref={ringRef} className={styles.pulsingEnergyRing} />
                <div ref={laserRingRef} className={styles.laserOrbitRing} />
                <div className={styles.innerSparksRing} />
              </div>

              {/* Органично растворенная круглая маска в центре кольца */}
              <div className={styles.maskCompositeContainer}>
                <img
                  ref={maskRef}
                  src="/images/demon-mask-seamless.png"
                  alt="SILICIUM Occult Mask"
                  className={styles.centralDemonMask}
                  loading="eager"
                />
              </div>

              {/* Металлический прозрачный логотип точно поверх нижней челюсти маски */}
              <div className={styles.logoTitleLockup}>
                <img
                  src="/images/logo-red-transparent.png"
                  alt="SILICIUM"
                  className={styles.logoOverlayImage}
                />
              </div>
            </div>

            {/* Подпись архива и кнопка скролла под маской */}
            <div className={styles.metaTaglineCluster}>
              <div className={styles.archiveTagline}>{t.digitalArchive}</div>
              <div className={styles.yearsInterval}>// {t.years} //</div>

              {/* Кликабельный индикатор прокрутки вниз к дискографии */}
              <button
                onClick={() => scrollToSection('discography')}
                className={styles.scrollDownBtn}
                aria-label="Scroll down to Discography"
                data-magnetic
                data-cursor-label="NAVIGATE // DOWN"
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
                {Array.from({ length: 22 }).map((_, i) => (
                  <span
                    key={i}
                    ref={(el) => (waveBarsRef.current[i] = el)}
                    className={styles.waveStick}
                    style={{
                      height: '4px',
                      opacity: 0.35,
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
                  data-magnetic
                  data-cursor-label={isPlaying ? 'PAUSE // STREAM' : 'TRANSMIT // BASS'}
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

      {/* Cinematic Transition Divider */}
      <div className={styles.sectionDivider}>
        <span className={styles.dividerLine} />
        <span className={styles.dividerNode}>◆</span>
        <span className={styles.dividerLine} />
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 02 // СЕКЦИЯ DISCOGRAPHY (ПОЛНЫЙ КАТАЛОГ ЧАСТОТ)              */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section id="discography" className={styles.contentSection}>
        <DiscographyPage />
      </section>

      {/* Cinematic Transition Divider */}
      <div className={styles.sectionDivider}>
        <span className={styles.dividerLine} />
        <span className={styles.dividerNode}>◆</span>
        <span className={styles.dividerLine} />
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 03 // СЕКЦИЯ 3D ARCHIVE (ПРОСТРАНСТВЕННАЯ МАТРИЦА АРТЕФАКТОВ) */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section id="archive" className={styles.contentSection}>
        <ArchivePage />
      </section>

      {/* Cinematic Transition Divider */}
      <div className={styles.sectionDivider}>
        <span className={styles.dividerLine} />
        <span className={styles.dividerNode}>◆</span>
        <span className={styles.dividerLine} />
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 04 // СЕКЦИЯ ABOUT (ORIGIN, PARADOX & TIMELINE)               */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section id="about" className={styles.contentSection}>
        <AboutPage />
      </section>

      {/* Cinematic Transition Divider */}
      <div className={styles.sectionDivider}>
        <span className={styles.dividerLine} />
        <span className={styles.dividerNode}>◆</span>
        <span className={styles.dividerLine} />
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 05 // СЕКЦИЯ COMMUNITY (ТЕРМИНАЛЫ СВЯЗИ & TELEGRAM)          */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section id="community" className={styles.contentSection}>
        <CommunityPage />
      </section>

      {/* Cinematic Transition Divider */}
      <div className={styles.sectionDivider}>
        <span className={styles.dividerLine} />
        <span className={styles.dividerNode}>◆</span>
        <span className={styles.dividerLine} />
      </div>

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
