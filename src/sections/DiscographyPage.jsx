// SILICIUM — Discography Page (Catalog & Audio Vault)
import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../data/store'
import { RELEASES } from '../data/config'
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
  } = useStore()

  // Извлекаем уникальные годы
  const availableYears = useMemo(() => {
    const years = Array.from(new Set(RELEASES.map((r) => r.year)))
    return years.sort((a, b) => b - a)
  }, [])

  // Фильтрация и поиск
  const filteredReleases = useMemo(() => {
    return RELEASES.filter((rel) => {
      // Поиск
      const searchMatch =
        !discographySearch ||
        rel.title.toLowerCase().includes(discographySearch.toLowerCase()) ||
        rel.genre?.toLowerCase().includes(discographySearch.toLowerCase())

      // Тип
      const filterMatch =
        discographyFilter === 'all' || rel.type.toLowerCase() === discographyFilter.toLowerCase()

      // Год
      const yearMatch =
        discographyYear === 'all' || rel.year.toString() === discographyYear.toString()

      return searchMatch && filterMatch && yearMatch
    })
  }, [discographySearch, discographyFilter, discographyYear])

  return (
    <div className={styles.discographyContainer}>
      <div className={styles.headerArea}>
        <div className={styles.titleMeta}>
          <span className={styles.categoryCode}>// 02 //</span>
          <h1 className={styles.mainTitle}>DISCOGRAPHY</h1>
        </div>
        <p className={styles.subtitle}>
          Frequency catalog & physical/digital artifacts archive (2022 — 2026).
        </p>
      </div>

      {/* Control Bar: Search & Filters */}
      <div className={styles.controlBar}>
        <div className={styles.searchBox}>
          <span className={styles.searchIcon}>⌕</span>
          <input
            type="text"
            placeholder="SEARCH ARTIFACT..."
            value={discographySearch}
            onChange={(e) => setDiscographySearch(e.target.value)}
            className={styles.searchInput}
          />
          {discographySearch && (
            <button
              onClick={() => setDiscographySearch('')}
              className={styles.clearSearchBtn}
            >
              ✕
            </button>
          )}
        </div>

        <div className={styles.filterGroup}>
          <div className={styles.typeButtons}>
            {['all', 'single', 'ep', 'album'].map((type) => (
              <button
                key={type}
                onClick={() => setDiscographyFilter(type)}
                className={`${styles.filterBtn} ${discographyFilter === type ? styles.activeFilter : ''}`}
              >
                {type.toUpperCase()}
              </button>
            ))}
          </div>

          <div className={styles.selectWrapper}>
            <select
              value={discographyYear}
              onChange={(e) => setDiscographyYear(e.target.value)}
              className={styles.yearSelect}
            >
              <option value="all">ALL CYCLES</option>
              {availableYears.map((yr) => (
                <option key={yr} value={yr}>
                  CYCLE {yr}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.viewToggle}>
            <button
              onClick={() => setDiscographyView('grid')}
              className={`${styles.viewBtn} ${discographyView === 'grid' ? styles.activeView : ''}`}
              title="Grid Matrix View"
            >
              ⊞
            </button>
            <button
              onClick={() => setDiscographyView('list')}
              className={`${styles.viewBtn} ${discographyView === 'list' ? styles.activeView : ''}`}
              title="Sequential List View"
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      {/* Release List / Grid */}
      {filteredReleases.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyCode}>ERR_404: NO ARTIFACT LOCATED</div>
          <p className={styles.emptyMsg}>
            Adjust query parameters or frequency filters to decrypt archived records.
          </p>
          <button
            onClick={() => {
              setDiscographySearch('')
              setDiscographyFilter('all')
              setDiscographyYear('all')
            }}
            className={styles.resetBtn}
          >
            RESET FREQUENCY LOCK
          </button>
        </div>
      ) : discographyView === 'grid' ? (
        <div className={styles.releaseGrid}>
          {filteredReleases.map((rel) => (
            <article key={rel.id} className={styles.gridCard}>
              <div className={styles.cardCoverWrapper}>
                <img
                  src={rel.cover || '/images/demon-mask.jpg'}
                  alt={rel.title}
                  className={styles.cardCover}
                />
                <div className={styles.coverOverlay}>
                  {rel.tracks && rel.tracks[0] && (
                    <button
                      className={styles.quickPlayBtn}
                      onClick={(e) => {
                        e.preventDefault()
                        playTrack(rel.tracks[0], rel)
                      }}
                      title="Play track"
                    >
                      {isPlaying && currentTrack?.id === rel.tracks[0].id ? '▮▮' : '▶'}
                    </button>
                  )}
                  <Link to={`/discography/${rel.id}`} className={styles.inspectBtn}>
                    INSPECT ↗
                  </Link>
                </div>
              </div>

              <div className={styles.cardDetails}>
                <div className={styles.cardHeader}>
                  <span className={styles.cardYear}>CYCLE {rel.year}</span>
                  <span className={styles.cardType}>{rel.type.toUpperCase()}</span>
                </div>
                <h3 className={styles.cardTitle}>
                  <Link to={`/discography/${rel.id}`}>{rel.title}</Link>
                </h3>
                <div className={styles.cardFooter}>
                  <span className={styles.cardGenre}>{rel.genre || 'DARK PHONK'}</span>
                  <span className={styles.cardTrackCount}>
                    {rel.tracks?.length || 1} FREQ
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className={styles.releaseList}>
          {filteredReleases.map((rel, idx) => (
            <div key={rel.id} className={styles.listRow}>
              <span className={styles.listIdx}>0{idx + 1}</span>
              <img
                src={rel.cover || '/images/demon-mask.jpg'}
                alt={rel.title}
                className={styles.listCover}
              />
              <div className={styles.listInfo}>
                <h3 className={styles.listTitle}>
                  <Link to={`/discography/${rel.id}`}>{rel.title}</Link>
                </h3>
                <span className={styles.listMeta}>
                  CYCLE {rel.year} // {rel.genre || 'DARK PHONK'} // {rel.type.toUpperCase()}
                </span>
              </div>

              <div className={styles.listActions}>
                {rel.tracks && rel.tracks[0] && (
                  <button
                    className={styles.listPlayBtn}
                    onClick={() => playTrack(rel.tracks[0], rel)}
                  >
                    {isPlaying && currentTrack?.id === rel.tracks[0].id ? 'PAUSE' : 'TRANSMIT ▶'}
                  </button>
                )}
                <Link to={`/discography/${rel.id}`} className={styles.listDetailLink}>
                  DETAILS →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
