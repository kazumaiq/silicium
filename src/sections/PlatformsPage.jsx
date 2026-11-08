// SILICIUM — Music Platforms Hub (Martin Garrix Benchmark)
import React from 'react'
import { PLATFORMS } from '../data/config'
import { useStore } from '../data/store'
import SectionHeader from '../components/SectionHeader'
import { useScrollReveal } from '../hooks/useScrollReveal'
import styles from './PlatformsPage.module.css'

export default function PlatformsPage() {
  const language = useStore((s) => s.language)
  const gridRef = useScrollReveal({ threshold: 0.1 })

  const t = {
    RU: {
      category: 'РАСПРОСТРАНЕНИЕ ЗВУКА',
      title: 'ПЛАТФОРМЫ',
      subtitle: 'Официальные цифровые каналы и стриминговые узлы артиста SILICIUM в глобальных аудиосетях.',
      stream: 'STREAM //',
      verified: 'VERIFIED NODE',
    },
    EN: {
      category: 'SONIC DISTRIBUTION',
      title: 'PLATFORMS',
      subtitle: 'Official digital streaming hubs and distribution vectors across global audio networks.',
      stream: 'STREAM //',
      verified: 'VERIFIED NODE',
    },
  }[language] || {
    category: 'SONIC DISTRIBUTION',
    title: 'PLATFORMS',
    subtitle: 'Official digital channels and streaming hubs across global networks.',
    stream: 'STREAM //',
    verified: 'VERIFIED',
  }

  return (
    <div className={styles.platformsContainer}>
      <SectionHeader
        category={t.category}
        title={t.title}
        subtitle={t.subtitle}
        watermark="STREAM"
      />

      <div ref={gridRef} className={styles.platformsGrid}>
        {Object.entries(PLATFORMS).map(([key, item]) => (
          <a
            key={key}
            href={item.url || '#'}
            target="_blank"
            rel="noopener noreferrer me"
            className={styles.platformCard}
            aria-label={`Open official ${item.name}`}
          >
            <div className={styles.cardHeader}>
              <span className={styles.platformBadge}>{t.verified}</span>
              <span className={styles.arrowIcon}>↗</span>
            </div>

            <h3 className={styles.platformName}>{item.name}</h3>
            <span className={styles.streamLabel}>{t.stream} {key.toUpperCase()}</span>
          </a>
        ))}
      </div>
    </div>
  )
}
