// SILICIUM — Editorial Discography (Martin Garrix Architecture + Occult Dark Aesthetic)
import React, { useMemo } from 'react'
import { useStore } from '../data/store'
import { RELEASES } from '../data/config'
import SectionHeader from '../components/SectionHeader'
import { useScrollReveal } from '../hooks/useScrollReveal'
import styles from './DiscographyPage.module.css'

export default function DiscographyPage() {
  const {
    discographyView,
    discographyFilter,
    discographyYear,
    discographySearch,
    setDiscographyView,
    setDiscographyFilter,
    setDiscographyYear,
    setDiscographySearch,
    playTrack,
    currentTrack,
    isPlaying,
    setSelectedReleaseModal,
    language,
  } = useStore()

  const heroRef = useScrollReveal({ threshold: 0.1 })
  const controlRef = useScrollReveal({ threshold: 0.1 })
  const gridRef = useScrollReveal({ threshold: 0.05, rootMargin: '0px 0px -20px 0px' })

  // Genesis Featured Release (MY WEED)
  const genesisRelease = RELEASES.find((r) => r.id === 'my-weed') || RELEASES[0]
  const isGenesisPlaying = isPlaying && currentTrack?.id === genesisRelease?.tracks?.[0]?.id

  // Available unique years in descending order
  const availableYears = useMemo(() => {
    const years = Array.from(new Set(RELEASES.map((r) => r.year)))
    return years.sort((a, b) => b - a)
  }, [])

  // Filtered releases
  const filteredReleases = useMemo(() => {
    return RELEASES.filter((rel) => {
      const searchMatch =
        !discographySearch ||
        rel.title.toLowerCase().includes(discographySearch.toLowerCase()) ||
        rel.genre?.toLowerCase().includes(discographySearch.toLowerCase())

      const filterMatch =
        discographyFilter === 'all' || rel.type.toLowerCase() === discographyFilter.toLowerCase()

      const yearMatch =
        discographyYear === 'all' || rel.year.toString() === discographyYear.toString()

      return searchMatch && filterMatch && yearMatch
    })
  }, [discographySearch, discographyFilter, discographyYear])

  const t = {
    RU: {
      code: '// 02 //',
      tag: 'КАТАЛОГ ЧАСТОТ',
      title: 'ДИСКОГРАФИЯ',
      subtitle: 'Официальный архив релизов SILICIUM (2022 — 2026). Оккультный темный фонк, дисторшн 808 саб-баса и студийные мастера.',
      featuredBadge: 'ИСТОК // GENESIS RELEASE',
      featuredArtist: '— SILICIUM // sillic1um',
      playGenesis: 'ЗАПУСТИТЬ ВОСПРОИЗВЕДЕНИЕ',
      pauseGenesis: 'ПАУЗА ЧАСТОТЫ',
      decryptStory: 'СПЕЦИФИКАЦИЯ ↗',
      allReleasesHeader: 'АРХИВ РЕЛИЗОВ',
      searchPlaceholder: 'ПОИСК ПО КАТАЛОГУ...',
      all: 'ВСЕ',
      single: 'СИНГЛЫ',
      ep: 'EP',
      album: 'АЛЬБОМЫ',
      allCycles: 'ВСЕ ГОДЫ',
      spec: 'СПЕЦИФИКАЦИЯ',
    },
    EN: {
      code: '// 02 //',
      tag: 'FREQUENCY CATALOG',
      title: 'DISCOGRAPHY',
      subtitle: 'Official physical & digital release archive of SILICIUM (2022 — 2026). Occult dark phonk, 808 sub distortion & master stems.',
      featuredBadge: 'GENESIS RELEASE // DEC 2022',
      featuredArtist: '— SILICIUM // sillic1um',
      playGenesis: 'INITIATE PLAYBACK',
      pauseGenesis: 'PAUSE FREQUENCY',
      decryptStory: 'FULL SPECIFICATION ↗',
      allReleasesHeader: 'ALL RELEASES',
      searchPlaceholder: 'SEARCH CATALOG...',
      all: 'ALL',
      single: 'SINGLES',
      ep: 'EP',
      album: 'ALBUMS',
      allCycles: 'ALL YEARS',
      spec: 'SPECIFICATION',
    },
  }[language] || {
    code: '// 02 //',
    tag: 'FREQUENCY CATALOG',
    title: 'DISCOGRAPHY',
    subtitle: 'Official release archive of SILICIUM (2022 — 2026).',
    featuredBadge: 'GENESIS RELEASE',
    featuredArtist: '— SILICIUM // sillic1um',
    playGenesis: 'INITIATE PLAYBACK',
    pauseGenesis: 'PAUSE FREQUENCY',
    decryptStory: 'SPECIFICATION ↗',
    allReleasesHeader: 'ALL RELEASES',
    searchPlaceholder: 'SEARCH CATALOG...',
    all: 'ALL',
    single: 'SINGLES',
    ep: 'EP',
    album: 'ALBUMS',
    allCycles: 'ALL YEARS',
    spec: 'SPECIFICATION',
  }

  return (
    <div className={styles.discographyContainer}>
      <SectionHeader
        code={t.code}
        tag={t.tag}
        title={t.title}
        subtitle={t.subtitle}
        watermark="CATALOG"
      />

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. EDITORIAL FEATURED HERO (MARTIN GARRIX STYLE)              */}
      {/* ───────────────────────────────────────────────────────────── */}
      {genesisRelease && (
        <section ref={heroRef} className={styles.featuredHeroSection}>
          {/* Subtle Background Watermark Text */}
          <div className={styles.heroWatermarkText} aria-hidden="true">
            {genesisRelease.title}
          </div>

          <div className={styles.featuredHeroGrid}>
            {/* Left Column: Massive Editorial Typography & Story */}
            <div className={styles.heroContentCol}>
              <div className={styles.heroBadgeRow}>
                <span className={styles.heroBadge}>{t.featuredBadge}</span>
                <span className={styles.heroDate}>{genesisRelease.releaseDate}</span>
              </div>

              <h1 className={styles.heroTitle}>{genesisRelease.title}</h1>

              <div className={styles.heroArtistLine}>{t.featuredArtist}</div>

              <p className={styles.heroDescription}>
                {genesisRelease.description ||
                  'The foundational genesis frequency of SILICIUM (December 2022). Heavy blown-out 808 sub-harmonics, haunting choir pads, and slow occult dark phonk groove.'}
              </p>

              <div className={styles.heroActionsRow}>
                <button
                  className={`${styles.heroPlayBtn} ${isGenesisPlaying ? styles.heroPlayBtnActive : ''}`}
                  onClick={() => playTrack(genesisRelease.tracks[0], genesisRelease)}
                  aria-label={isGenesisPlaying ? t.pauseGenesis : t.playGenesis}
                >
                  <span className={styles.playIcon}>{isGenesisPlaying ? '▮▮' : '▶'}</span>
                  <span className={styles.playLabel}>
                    {isGenesisPlaying ? t.pauseGenesis : t.playGenesis}
                  </span>
                </button>

                <button
                  className={styles.heroSpecBtn}
                  onClick={() => setSelectedReleaseModal(genesisRelease)}
                  aria-label="Open Release Specification"
                >
                  {t.decryptStory}
                </button>
              </div>
            </div>

            {/* Right Column: High-Fashion Planar Artwork Presentation */}
            <div
              className={styles.heroArtworkCol}
              onClick={() => setSelectedReleaseModal(genesisRelease)}
            >
              <div className={styles.artworkFrame}>
                <div className={styles.artworkAmbientGlow} />
                <img
                  src={genesisRelease.cover || '/covers/my-weed.jpg'}
                  alt={genesisRelease.title}
                  className={styles.heroArtworkImg}
                />
                <div className={styles.artworkCornerTL} />
                <div className={styles.artworkCornerBR} />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 2. EDITORIAL FILTER & YEAR SELECTOR BAR                       */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div ref={controlRef} className={styles.controlBarSection}>
        <div className={styles.filterBarHeaderRow}>
          <h3 className={styles.archiveSectionHeading}>{t.allReleasesHeader}</h3>

          <div className={styles.yearFilterTabs}>
            <button
              onClick={() => setDiscographyYear('all')}
              className={`${styles.yearTabBtn} ${discographyYear === 'all' ? styles.yearTabActive : ''}`}
            >
              {t.all}
            </button>
            {availableYears.map((yr) => (
              <button
                key={yr}
                onClick={() => setDiscographyYear(yr.toString())}
                className={`${styles.yearTabBtn} ${discographyYear === yr.toString() ? styles.yearTabActive : ''}`}
              >
                {yr}
              </button>
            ))}
          </div>
        </div>

        {/* Secondary Filter: Search & Type */}
        <div className={styles.subFilterRow}>
          <div className={styles.searchBox}>
            <span className={styles.searchIcon}>⌕</span>
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={discographySearch}
              onChange={(e) => setDiscographySearch(e.target.value)}
              className={styles.searchInput}
            />
            {discographySearch && (
              <button
                onClick={() => setDiscographySearch('')}
                className={styles.clearSearchBtn}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          <div className={styles.typeButtonGroup}>
            {[
              { id: 'all', label: t.all },
              { id: 'single', label: t.single },
              { id: 'ep', label: t.ep },
              { id: 'album', label: t.album },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setDiscographyFilter(item.id)}
                className={`${styles.typeBtn} ${discographyFilter === item.id ? styles.typeBtnActive : ''}`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* View Mode Toggle */}
          <div className={styles.viewToggle}>
            <button
              onClick={() => setDiscographyView('grid')}
              className={`${styles.viewBtn} ${discographyView === 'grid' ? styles.activeView : ''}`}
              title="Grid View"
              aria-label="Grid View"
            >
              ⊞
            </button>
            <button
              onClick={() => setDiscographyView('list')}
              className={`${styles.viewBtn} ${discographyView === 'list' ? styles.activeView : ''}`}
              title="List View"
              aria-label="List View"
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 3. RELEASE CATALOG (EDITORIAL GRID OR LIST)                   */}
      {/* ───────────────────────────────────────────────────────────── */}
      {discographyView === 'grid' ? (
        <div ref={gridRef} className={styles.releaseGrid} data-reveal="fade">
          {filteredReleases.map((rel) => {
            const isSelected = currentTrack?.id === rel.tracks?.[0]?.id
            const isPlayingThis = isPlaying && isSelected

            return (
              <article
                key={rel.id}
                className={`${styles.gridCard} ${isPlayingThis ? styles.gridCardActive : ''}`}
                onClick={() => setSelectedReleaseModal(rel)}
              >
                <div className={styles.cardCoverBox}>
                  <img
                    src={rel.cover || '/images/demon-mask-blended.png'}
                    alt={rel.title}
                    className={styles.cardCover}
                    loading="lazy"
                  />
                  
                  {/* Subtle Gothic Frame Clips */}
                  <div className={styles.cardCornerClipTL} />
                  <div className={styles.cardCornerClipBR} />

                  <div className={styles.cardHoverOverlay}>
                    <button
                      className={styles.overlayPlayBtn}
                      onClick={(e) => {
                        e.stopPropagation()
                        if (rel.tracks && rel.tracks[0]) {
                          playTrack(rel.tracks[0], rel)
                        }
                      }}
                      aria-label={isPlayingThis ? 'Pause' : 'Play'}
                    >
                      {isPlayingThis ? '▮▮' : '▶'}
                    </button>
                    <span className={styles.inspectHint}>{t.spec} ↗</span>
                  </div>
                </div>

                <div className={styles.cardMeta}>
                  <div className={styles.cardTopRow}>
                    <span className={styles.cardYear}>{rel.year}</span>
                    <span className={styles.cardType}>{rel.type?.toUpperCase()}</span>
                  </div>

                  <h3 className={styles.cardTitle}>{rel.title}</h3>

                  <div className={styles.cardBottomRow}>
                    <span className={styles.cardGenre}>{rel.genre || 'DARK PHONK'}</span>
                    {rel.tracks?.[0]?.duration && (
                      <span className={styles.cardDuration}>
                        {rel.tracks[0].duration}
                      </span>
                    )}
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      ) : (
        /* List View */
        <div ref={gridRef} className={styles.releaseList} data-reveal="fade">
          {filteredReleases.map((rel, idx) => {
            const isSelected = currentTrack?.id === rel.tracks?.[0]?.id
            const isPlayingThis = isPlaying && isSelected
            const indexFormatted = String(idx + 1).padStart(2, '0')

            return (
              <div
                key={rel.id}
                className={`${styles.listRow} ${isPlayingThis ? styles.listRowActive : ''}`}
                onClick={() => setSelectedReleaseModal(rel)}
              >
                <span className={styles.listNum}>{indexFormatted}</span>

                <button
                  className={styles.listPlayBtn}
                  onClick={(e) => {
                    e.stopPropagation()
                    if (rel.tracks && rel.tracks[0]) {
                      playTrack(rel.tracks[0], rel)
                    }
                  }}
                  aria-label={isPlayingThis ? 'Pause' : 'Play'}
                >
                  {isPlayingThis ? '▮▮' : '▶'}
                </button>

                <div className={styles.listThumb}>
                  <img src={rel.cover} alt={rel.title} loading="lazy" />
                </div>

                <div className={styles.listInfo}>
                  <div className={styles.listTitle}>{rel.title}</div>
                  <div className={styles.listMeta}>
                    {rel.genre} // {rel.year}
                  </div>
                </div>

                <div className={styles.listType}>{rel.type?.toUpperCase()}</div>

                <button
                  className={styles.listSpecBtn}
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedReleaseModal(rel)
                  }}
                >
                  {t.spec} ↗
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
