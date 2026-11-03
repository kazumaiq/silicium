// SILICIUM — Discography Section (Catalog & Audio Vault)
import React, { useMemo } from 'react'
import { useStore } from '../data/store'
import { RELEASES } from '../data/config'
import SectionHeader from '../components/SectionHeader'
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

  // Извлекаем уникальные годы
  const availableYears = useMemo(() => {
    const years = Array.from(new Set(RELEASES.map((r) => r.year)))
    return years.sort((a, b) => b - a)
  }, [])

  // Фильтрация и поиск
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
      subtitle: 'Архив физических и цифровых артефактов SILICIUM (2022 — 2026). Оккультный саундтрек темных измерений.',
      searchPlaceholder: 'ПОИСК АРТЕФАКТА...',
      all: 'ВСЕ',
      single: 'СИНГЛЫ',
      ep: 'EP',
      album: 'АЛЬБОМЫ',
      allCycles: 'ВСЕ ЦИКЛЫ',
      spec: 'СПЕЦИФИКАЦИЯ',
    },
    EN: {
      code: '// 02 //',
      tag: 'FREQUENCY CATALOG',
      title: 'DISCOGRAPHY',
      subtitle: 'Physical & digital artifacts archive of SILICIUM (2022 — 2026). Occult frequencies extracted from the void.',
      searchPlaceholder: 'SEARCH ARTIFACT...',
      all: 'ALL',
      single: 'SINGLE',
      ep: 'EP',
      album: 'ALBUM',
      allCycles: 'ALL CYCLES',
      spec: 'SPECIFICATION',
    },
  }[language] || {
    code: '// 02 //',
    tag: 'FREQUENCY CATALOG',
    title: 'DISCOGRAPHY',
    subtitle: 'Physical & digital artifacts archive of SILICIUM (2022 — 2026).',
    searchPlaceholder: 'SEARCH ARTIFACT...',
    all: 'ALL',
    single: 'SINGLE',
    ep: 'EP',
    album: 'ALBUM',
    allCycles: 'ALL CYCLES',
    spec: 'SPECIFICATION',
  }

  return (
    <div className={styles.discographyContainer}>
      <SectionHeader
        code={t.code}
        tag={t.tag}
        title={t.title}
        subtitle={t.subtitle}
      />

      {/* Control Bar: Search & Filters */}
      <div className={styles.controlBar}>
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

        <div className={styles.filterGroup}>
          <div className={styles.typeButtons}>
            {[
              { id: 'all', label: t.all },
              { id: 'single', label: t.single },
              { id: 'ep', label: t.ep },
              { id: 'album', label: t.album },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setDiscographyFilter(item.id)}
                className={`${styles.filterBtn} ${discographyFilter === item.id ? styles.activeFilter : ''}`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className={styles.selectWrapper}>
            <select
              value={discographyYear}
              onChange={(e) => setDiscographyYear(e.target.value)}
              className={styles.yearSelect}
              aria-label="Filter by year"
            >
              <option value="all">{t.allCycles}</option>
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  CYCLE {year}
                </option>
              ))}
            </select>
          </div>

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

      {/* Release Matrix (Grid or List) */}
      {discographyView === 'grid' ? (
        <div className={styles.releaseGrid}>
          {filteredReleases.map((rel) => {
            const isSelected = currentTrack?.id === rel.tracks[0]?.id
            const isPlayingThis = isPlaying && isSelected

            return (
              <article
                key={rel.id}
                className={styles.gridCard}
                onClick={() => setSelectedReleaseModal(rel)}
                data-cursor-lock
                data-cursor-label="DECRYPT // ARTIFACT"
              >
                <div className={styles.cardCoverWrapper}>
                  <img
                    src={rel.cover || '/images/demon-mask-blended.png'}
                    alt={rel.title}
                    className={styles.cardCover}
                    loading="lazy"
                  />
                  <div className={styles.cardOverlay}>
                    <button
                      className={styles.overlayPlayBtn}
                      onClick={(e) => {
                        e.stopPropagation()
                        playTrack(rel.tracks[0], rel)
                      }}
                      aria-label={isPlayingThis ? 'Pause' : 'Play'}
                      data-magnetic
                      data-cursor-label={isPlayingThis ? 'PAUSE // FREQ' : 'TRANSMIT // BASS'}
                    >
                      {isPlayingThis ? '▮▮' : '▶'}
                    </button>
                    <span className={styles.inspectHint}>{t.spec} ↗</span>
                  </div>
                </div>

                <div className={styles.cardMeta}>
                  <div className={styles.cardTopRow}>
                    <span className={styles.cardYear}>CYCLE {rel.year}</span>
                    <span className={styles.cardType}>{rel.type.toUpperCase()}</span>
                  </div>

                  <h3 className={styles.cardTitle}>{rel.title}</h3>

                  <div className={styles.cardBottomRow}>
                    <span className={styles.cardGenre}>{rel.genre || 'DARK PHONK'}</span>
                    <span className={styles.cardTrackCount}>
                      {rel.tracks?.length || 1} FREQ
                    </span>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      ) : (
        /* List View */
        <div className={styles.releaseList}>
          {filteredReleases.map((rel, idx) => {
            const isSelected = currentTrack?.id === rel.tracks[0]?.id
            const isPlayingThis = isPlaying && isSelected

            return (
              <div
                key={rel.id}
                className={styles.listRow}
                onClick={() => setSelectedReleaseModal(rel)}
              >
                <span className={styles.listNum}>0{idx + 1}</span>

                <button
                  className={styles.listPlayBtn}
                  onClick={(e) => {
                    e.stopPropagation()
                    playTrack(rel.tracks[0], rel)
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
                    {rel.genre} // CYCLE {rel.year}
                  </div>
                </div>

                <div className={styles.listType}>{rel.type.toUpperCase()}</div>

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
