// SILICIUM — Music Platforms Matrix Section
import React from 'react'
import { PLATFORMS } from '../data/config'
import { useStore } from '../data/store'
import SectionHeader from '../components/SectionHeader'
import styles from './PlatformsPage.module.css'

export default function PlatformsPage() {
  const language = useStore((s) => s.language)

  const platformIcons = {
    spotify: '♫',
    appleMusic: '',
    youtube: '▶',
    vkMusic: 'VK',
    yandexMusic: 'Я',
    soundcloud: '◆',
  }

  const t = {
    RU: {
      code: '// 06 //',
      tag: 'РАСПРОСТРАНЕНИЕ ЗВУКА',
      title: 'ПЛАТФОРМЫ',
      subtitle: 'Официальные цифровые каналы и стриминговые узлы артиста SILICIUM в глобальных сетях.',
      stream: 'СТРИМИНГ //',
      noticeTitle: 'ПАРАМЕТРЫ СТРИМИНГА',
      noticeText: 'Все релизы закодированы в формате высокого разрешения (Lossless FLAC Master). Прямой доступ к официальным аудиопотокам.',
    },
    EN: {
      code: '// 06 //',
      tag: 'SONIC DISTRIBUTION',
      title: 'PLATFORMS',
      subtitle: 'Official digital streaming hubs and distribution vectors across global audio networks.',
      stream: 'STREAM //',
      noticeTitle: 'STREAMING PARAMETERS',
      noticeText: 'All frequencies feature high-resolution master audio encoding (Lossless FLAC Master stems). Direct connection to verified nodes.',
    },
  }[language] || {
    code: '// 06 //',
    tag: 'SONIC DISTRIBUTION',
    title: 'PLATFORMS',
    subtitle: 'Official digital channels and streaming hubs across global networks.',
    stream: 'STREAM //',
    noticeTitle: 'STREAMING PARAMETERS',
    noticeText: 'All frequencies feature high-resolution master stems.',
  }

  return (
    <div className={styles.platformsContainer}>
      <SectionHeader
        code={t.code}
        tag={t.tag}
        title={t.title}
        subtitle={t.subtitle}
      />

      <div className={styles.platformsGrid}>
        {Object.entries(PLATFORMS).map(([key, item]) => (
          <a
            key={key}
            href={item.url || '#'}
            target="_blank"
            rel="noreferrer"
            className={styles.platformCard}
            aria-label={`Open ${item.name}`}
          >
            <div className={styles.iconCircle}>
              <span>{platformIcons[key] || '◆'}</span>
            </div>

            <div className={styles.cardInfo}>
              <h3 className={styles.platformName}>{item.name}</h3>
              <span className={styles.channelCode}>
                {t.stream} {key.toUpperCase()}
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
          <span>{t.noticeTitle}</span>
        </div>
        <p>{t.noticeText}</p>
      </div>
    </div>
  )
}
