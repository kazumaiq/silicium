// SILICIUM — Editorial Music Gallery (Martin Garrix Architecture Benchmark)
import React, { useMemo } from 'react'
import { useStore } from '../data/store'
import { RELEASES } from '../data/config'
import SectionHeader from '../components/SectionHeader'
import { useScrollReveal } from '../hooks/useScrollReveal'
import styles from './DiscographyPage.module.css'

export default function DiscographyPage() {
  const {
    discographyFilter,
    discographyYear,
    discographySearch,
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
  const filterRef = useScrollReveal({ threshold: 0.1 })

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
      category: 'КАТАЛОГ ЧАСТОТ',
      title: 'ДИСКОГРАФИЯ',
      subtitle: 'Официальный архив релизов SILICIUM (2022 — 2026). Оккультный темный фонк, 808 саб-бас и студийные мастера.',
      featuredBadge: 'GENESIS RELEASE // ДЕКАБРЬ 2022',
      featuredArtist: '— SILICIUM // sillic1um',
      playGenesis: 'ЗАПУСТИТЬ ВОСПРОИЗВЕДЕНИЕ',
      pauseGenesis: 'ПАУЗА',
      decryptStory: 'СПЕЦИФИКАЦИЯ ↗',
      all: 'ВСЕ ГОДЫ',
      searchPlaceholder: 'ПОИСК РЕЛИЗА...',
      listenNow: 'СЛУШАТЬ',
    },
    EN: {
      category: 'FREQUENCY CATALOG',
      title: 'DISCOGRAPHY',
      subtitle: 'Official release archive of SILICIUM (2022 — 2026). Occult dark phonk, 808 sub-distortion & master stems.',
      featuredBadge: 'GENESIS RELEASE // DEC 2022',
      featuredArtist: '— SILICIUM // sillic1um',
      playGenesis: 'INITIATE PLAYBACK',
      pauseGenesis: 'PAUSE',
      decryptStory: 'SPECIFICATION ↗',
      all: 'ALL YEARS',
      searchPlaceholder: 'SEARCH RELEASES...',
      listenNow: 'PLAY',
    },
  }[language] || {
    category: 'FREQUENCY CATALOG',
    title: 'DISCOGRAPHY',
    subtitle: 'Official release archive of SILICIUM.',
    featuredBadge: 'GENESIS RELEASE // 2022',
    featuredArtist: '— SILICIUM',
    playGenesis: 'PLAY NOW',
    pauseGenesis: 'PAUSE',
    decryptStory: 'SPEC ↗',
    all: 'ALL YEARS',
    searchPlaceholder: 'SEARCH...',
    listenNow: 'PLAY',
  }

  return (
    <div className={styles.discographyContainer}>
      <SectionHeader
        category={t.category}
        title={t.title}
        subtitle={t.subtitle}
        watermark="CATALOG"
      />

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 01 // FEATURED GENESIS HERO POSTER (MY WEED)                  */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section ref={heroRef} className={styles.genesisHeroSection}>
        <div className={styles.genesisContent}>
          <div className={styles.genesisBadgeRow}>
            <span className={styles.genesisBadge}>{t.featuredBadge}</span>
            <span className={styles.genesisDate}>{genesisRelease.releaseDate}</span>
          </div>

          <h3 className={styles.genesisTitle}>
            {genesisRelease.title}
          </h3>

          <p className={styles.genesisArtist}>
            {t.featuredArtist}
          </p>

          <p className={styles.genesisExcerpt}>
            {genesisRelease.description}
          </p>

          <div className={styles.genesisActionRow}>
            <button
              onClick={() => playTrack(genesisRelease.tracks[0], genesisRelease)}
              className={styles.genesisPlayBtn}
            >
              <span className={styles.genesisPlayIcon}>
                {isGenesisPlaying ? '▮▮' : '▶'}
              </span>
              <span>
                {isGenesisPlaying ? t.pauseGenesis : t.playGenesis}
              </span>
            </button>

            <button
              onClick={() => setSelectedReleaseModal(genesisRelease)}
              className={styles.genesisSpecBtn}
            >
              {t.decryptStory}
            </button>
          </div>
        </div>

        <div
          className={styles.genesisArtworkWrapper}
          onClick={() => playTrack(genesisRelease.tracks[0], genesisRelease)}
        >
          <img
            src={genesisRelease.cover}
            alt={genesisRelease.title}
            className={styles.genesisCoverImg}
          />
          <div className={styles.genesisArtworkGlow} />
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 02 // EDITORIAL YEAR FILTER TABS & SEARCH                      */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div ref={filterRef} className={styles.filterBar}>
        <div className={styles.yearTabs}>
          <button
            onClick={() => setDiscographyYear('all')}
            className={`${styles.yearTab} ${discographyYear === 'all' ? styles.yearTabActive : ''}`}
          >
            {t.all}
          </button>
          {availableYears.map((yr) => (
            <button
              key={yr}
              onClick={() => setDiscographyYear(yr.toString())}
              className={`${styles.yearTab} ${discographyYear === yr.toString() ? styles.yearTabActive : ''}`}
            >
              {yr}
            </button>
          ))}
        </div>

        <div className={styles.searchBoxWrapper}>
          <input
            type="text"
            value={discographySearch}
            onChange={(e) => setDiscographySearch(e.target.value)}
            placeholder={t.searchPlaceholder}
            className={styles.searchInput}
          />
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 03 // ASYMMETRIC EDITORIAL GALLERY SPREADS                    */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className={styles.editorialGallery}>
        {filteredReleases.map((rel, index) => {
          const isThisPlaying = isPlaying && currentTrack?.id === rel.tracks?.[0]?.id

          // Editorial rhythm: alternate large feature, pairs, and trio cards
          const isLeadFeature = index === 0 && discographyYear === 'all' && !discographySearch
          const rhythmClass = isLeadFeature
            ? styles.spreadLead
            : (index % 5 === 0)
            ? styles.spreadWide
            : (index % 5 === 1 || index % 5 === 2)
            ? styles.spreadDuo
            : styles.spreadStandard

          return (
            <article
              key={rel.id}
              className={`${styles.releaseArticle} ${rhythmClass}`}
              onClick={() => setSelectedReleaseModal(rel)}
            >
              <div className={styles.imageFrame}>
                <img
                  src={rel.cover}
                  alt={rel.title}
                  className={styles.releaseImage}
                  loading="lazy"
                />

                {/* Instant Play Action Overlay */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    playTrack(rel.tracks[0], rel)
                  }}
                  className={`${styles.quickPlayBtn} ${isThisPlaying ? styles.quickPlayActive : ''}`}
                  aria-label={isThisPlaying ? 'Pause' : 'Play'}
                >
                  {isThisPlaying ? '▮▮' : '▶'}
                </button>
              </div>

              <div className={styles.articleMeta}>
                <div className={styles.metaTop}>
                  <span className={styles.metaYear}>{rel.year}</span>
                  <span className={styles.metaType}>{rel.type}</span>
                </div>
                <h4 className={styles.metaTitle}>{rel.title}</h4>
                <p className={styles.metaGenre}>{rel.genre}</p>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
