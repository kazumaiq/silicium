// SILICIUM — Cinematic Footer with Apex Scroll Return
import React from 'react'
import { ARTIST } from '../data/config'
import { useStore } from '../data/store'
import styles from './Footer.module.css'

export default function Footer() {
  const language = useStore((s) => s.language)

  const scrollToTop = () => {
    const el = document.getElementById('home')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
      if (window.history.replaceState) {
        window.history.replaceState(null, '', '#home')
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const t = {
    RU: {
      toApex: '↑ ВЕРНУТЬСЯ К ИСТОКУ // НАВЕРХ',
      rights: 'ВСЕ ПРАВА НА ЧАСТОТЫ ЗАЩИЩЕНЫ',
      archiveCode: 'ЦИФРОВОЙ АРХИВ // ОККУЛЬТНЫЙ ФОНК',
    },
    EN: {
      toApex: '↑ RETURN TO APEX // SCROLL TO TOP',
      rights: 'ALL FREQUENCY RIGHTS RESERVED',
      archiveCode: 'DIGITAL ARCHIVE // OCCULT PHONK',
    },
  }[language] || {
    toApex: '↑ RETURN TO APEX',
    rights: 'ALL RIGHTS RESERVED',
    archiveCode: 'DIGITAL ARCHIVE',
  }

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.topRow}>
          <div className={styles.brandBox}>
            <span className={styles.logoText}>SILICIUM</span>
            <span className={styles.tagline}>{t.archiveCode}</span>
          </div>

          <button onClick={scrollToTop} className={styles.returnBtn}>
            {t.toApex}
          </button>
        </div>

        <div className={styles.divider} />

        <div className={styles.bottomRow}>
          <div className={styles.copyright}>
            © 2022 — 2026 SILICIUM (sillic1um). {t.rights}.
          </div>

          <div className={styles.links}>
            <a href={ARTIST.soundcloud} target="_blank" rel="noopener noreferrer me">SOUNDCLOUD</a>
            <span className={styles.dot}>•</span>
            <a href={ARTIST.spotify} target="_blank" rel="noopener noreferrer me">SPOTIFY</a>
            <span className={styles.dot}>•</span>
            <a href={ARTIST.telegram} target="_blank" rel="noopener noreferrer me">TELEGRAM</a>
            <span className={styles.dot}>•</span>
            <a href={ARTIST.vkGroup} target="_blank" rel="noopener noreferrer me">VK</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
