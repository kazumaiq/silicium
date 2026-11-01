// SILICIUM — Music Platforms Matrix
import React from 'react'
import { PLATFORMS } from '../data/config'
import styles from './PlatformsPage.module.css'

export default function PlatformsPage() {
  const platformIcons = {
    spotify: '♫',
    appleMusic: '',
    youtube: '▶',
    youtubeMusic: '▷',
    vkMusic: 'VK',
    yandexMusic: 'Я',
  }

  return (
    <div className={styles.platformsContainer}>
      <div className={styles.headerArea}>
        <span className={styles.metaLabel}>// 06 // SONIC DISTRIBUTION</span>
        <h1 className={styles.pageTitle}>PLATFORMS</h1>
        <p className={styles.subtitle}>
          Official digital channels and streaming hubs across global networks.
        </p>
      </div>

      <div className={styles.platformsGrid}>
        {Object.entries(PLATFORMS).map(([key, item]) => (
          <a
            key={key}
            href={item.url || '#'}
            target="_blank"
            rel="noreferrer"
            className={styles.platformCard}
          >
            <div className={styles.iconCircle}>
              <span>{platformIcons[key] || '◆'}</span>
            </div>

            <div className={styles.cardInfo}>
              <h2 className={styles.platformName}>{item.name}</h2>
              <span className={styles.channelCode}>
                STREAM // {key.toUpperCase()}
              </span>
            </div>

            <div className={styles.arrowBox}>
              <span>↗</span>
            </div>
          </a>
        ))}
      </div>

      <div className={styles.notesBox}>
        <div className={styles.notesHeader}>
          <span>CONFIGURATION NOTICE</span>
        </div>
        <p>
          Coordinates can be redirected via <code>src/data/config.js</code>. All streams feature lossless master stems and certified metadata verification.
        </p>
      </div>
    </div>
  )
}
