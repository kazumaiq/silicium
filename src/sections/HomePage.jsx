// SILICIUM — Exact Mockup Visual Architecture
import React, { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ARTIST, RELEASES } from '../data/config'
import { useStore } from '../data/store'
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
  } = useStore()

  const releasesScrollRef = useRef(null)
  const [activeReleaseIndex, setActiveReleaseIndex] = useState(0)

  // 5 последних релизов строго по референсу
  const latestFiveReleases = RELEASES.slice(0, 5)

  const activeRelease = currentRelease || latestFiveReleases[0]
  const activeTrack = currentTrack || activeRelease.tracks[0]

  // Скролл ленты релизов
  const handleScroll = (dir) => {
    if (releasesScrollRef.current) {
      releasesScrollRef.current.scrollBy({
        left: dir * 260,
        behavior: 'smooth',
      })
    }
  }

  // Тексты локализации
  const t = {
    RU: {
      digitalArchive: 'DIGITAL ARCHIVE',
      years: '2022 — 2026',
      latestReleases: 'ПОСЛЕДНИЕ РЕЛИЗЫ',
      scrollDown: 'ПРОКРУТИТЬ ВНИЗ',
      listenTrack: 'СЛУШАТЬ ТРЕК',
    },
    EN: {
      digitalArchive: 'DIGITAL ARCHIVE',
      years: '2022 — 2026',
      latestReleases: 'LATEST RELEASES',
      scrollDown: 'SCROLL DOWN',
      listenTrack: 'LISTEN TRACK',
    },
  }[language] || {
    digitalArchive: 'DIGITAL ARCHIVE',
    years: '2022 — 2026',
    latestReleases: 'ПОСЛЕДНИЕ РЕЛИЗЫ',
    scrollDown: 'SCROLL DOWN',
    listenTrack: 'LISTEN TRACK',
  }

  // Звуковая симуляция
  useEffect(() => {
    let timer = null
    if (isPlaying) {
      timer = setInterval(() => {
        setProgress((p) => (p >= 134 ? 0 : p + 1))
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [isPlaying, setProgress])

  return (
    <div className={styles.mockupContainer}>
      {/* ───────────────────────────────────────────────────────────── */}
      {/* МНОГОСЛОЙНЫЙ ТЕМНЫЙ ФОН: Металл, разбитое стекло, цепи, дым   */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className={styles.metalTextureLayer} />
      <div className={styles.smokeLayer} />
      <div className={styles.glassCracksLayer} />
      <div className={styles.redGlowAura} />

      {/* Декоративные цепи и угловые металлические детали */}
      <div className={styles.cornerBracketTL} />
      <div className={styles.cornerBracketTR} />
      <div className={styles.cornerBracketBL} />
      <div className={styles.cornerBracketBR} />
      <div className={styles.leftChainDecoration} />
      <div className={styles.rightChainDecoration} />

      {/* ───────────────────────────────────────────────────────────── */}
      {/* ГЛАВНАЯ СЕТКА ЭКРАНА (Strict Mockup Hierarchy)                */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className={styles.mainStageGrid}>
        {/* ЛЕВАЯ ЧАСТЬ: МУЗЫКАЛЬНЫЕ НАПРАВЛЕНИЯ (PHONK. DRIFT. EXPERIMENTAL. DARK.) */}
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
            <span>OCCULT SUB-BASS // 808 DISTORTION</span>
          </div>
        </aside>

        {/* ЦЕНТРАЛЬНАЯ КОМПОЗИЦИЯ: ДЕМОНИЧЕСКАЯ МАСКА + КРАСНОЕ КОЛЬЦО + ЛОГОТИП */}
        <section className={styles.centerFocalStage}>
          {/* Красное светящееся энергетическое кольцо */}
          <div className={styles.energyRingWrapper}>
            <div className={styles.pulsingEnergyRing} />
            <div className={styles.laserOrbitRing} />
            <div className={styles.innerSparksRing} />
          </div>

          {/* Огромная демоническая маска с органичным слиянием */}
          <div className={styles.maskCompositeContainer}>
            <img
              src="/images/demon-mask-blended.png"
              alt="SILICIUM Occult Mask"
              className={styles.centralDemonMask}
            />
          </div>

          {/* Металлический логотип поверх нижней части маски */}
          <div className={styles.logoTitleLockup}>
            <img
              src="/images/logo-red-transparent.png"
              alt="SILICIUM"
              className={styles.logoOverlayImage}
            />
            <div className={styles.archiveTagline}>{t.digitalArchive}</div>
            <div className={styles.yearsInterval}>// {t.years} //</div>

            {/* Индикатор прокрутки */}
            <div className={styles.scrollIndicator}>
              <span className={styles.scrollLine} />
              <span className={styles.scrollChevron}>↓</span>
            </div>
          </div>
        </section>

        {/* ПРАВАЯ ЧАСТЬ: КОМПАКТНЫЙ МУЗЫКАЛЬНЫЙ ПЛЕЕР */}
        <aside className={styles.rightPlayerBlock}>
          <div className={styles.compactPlayerBox}>
            <div className={styles.playerTrackHeader}>
              <span className={styles.currentTrackLabel}>CURRENT FREQUENCY</span>
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

      {/* ───────────────────────────────────────────────────────────── */}
      {/* НИЖНЯЯ ЧАСТЬ: ПОСЛЕДНИЕ РЕЛИЗЫ (LATEST RELEASES) — 5 ОБЛОЖЕК   */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className={styles.bottomReleasesSection}>
        <div className={styles.releasesHeaderBar}>
          <div className={styles.releasesTitleGroup}>
            <span className={styles.titleSlash}>//</span>
            <h2 className={styles.releasesMainHeading}>{t.latestReleases}</h2>
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

        {/* Горизонтальная лента из 5 обложек */}
        <div ref={releasesScrollRef} className={styles.fiveReleasesTrack}>
          {latestFiveReleases.map((rel, idx) => {
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
                  />
                  <div className={styles.coverOverlay}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        playTrack(rel.tracks[0], rel)
                      }}
                      className={styles.thumbPlayBtn}
                    >
                      {isPlayingThis ? '▮▮' : '▶'}
                    </button>
                    <Link
                      to={`/discography/${rel.id}`}
                      className={styles.thumbDetailLink}
                      onClick={(e) => e.stopPropagation()}
                    >
                      SPEC
                    </Link>
                  </div>
                </div>

                <div className={styles.releaseMetaBox}>
                  <div className={styles.releaseTitleText}>
                    <Link to={`/discography/${rel.id}`}>{rel.title}</Link>
                  </div>
                  <div className={styles.releaseYearText}>{rel.year}</div>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* МОБИЛЬНАЯ ФИКСИРОВАННАЯ НАВИГАЦИЯ С ИКОНКАМИ                 */}
      {/* ───────────────────────────────────────────────────────────── */}
      <nav className={styles.mobileFixedDock}>
        <Link to="/" className={`${styles.mobileDockTab} ${styles.mobileDockActive}`}>
          <span className={styles.dockIcon}>⌂</span>
          <span className={styles.dockText}>HOME</span>
        </Link>
        <Link to="/discography" className={styles.mobileDockTab}>
          <span className={styles.dockIcon}>♫</span>
          <span className={styles.dockText}>RELEASES</span>
        </Link>
        <Link to="/archive" className={styles.mobileDockTab}>
          <span className={styles.dockIcon}>◈</span>
          <span className={styles.dockText}>3D ARCHIVE</span>
        </Link>
        <Link to="/about" className={styles.mobileDockTab}>
          <span className={styles.dockIcon}>ℹ</span>
          <span className={styles.dockText}>ABOUT</span>
        </Link>
        <Link to="/community" className={styles.mobileDockTab}>
          <span className={styles.dockIcon}>✉</span>
          <span className={styles.dockText}>NODE</span>
        </Link>
      </nav>
    </div>
  )
}
