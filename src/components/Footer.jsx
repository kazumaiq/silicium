// SILICIUM — Martin Garrix Style Editorial 4-Column Footer with Watermark & Apex Return
import React from 'react'
import { ARTIST, NAV_ITEMS } from '../data/config'
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

  const scrollToSection = (id) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
      if (window.history.replaceState) {
        window.history.replaceState(null, '', `#${id}`)
      }
    }
  }

  const t = {
    RU: {
      toApex: '↑ ВЕРНУТЬСЯ К ИСТОКУ // НАВЕРХ',
      rights: 'ВСЕ ПРАВА НА ЧАСТОТЫ ЗАЩИЩЕНЫ',
      archiveCode: 'ОФИЦИАЛЬНЫЙ АРХИВ АРТИСТА // sillic1um',
      col1Title: '01 // СУЩНОСТЬ',
      col1Desc: 'Официальный цифровой портал музыкального артиста SILICIUM. Оккультный мемфис-фонк, сырой 808-дисторшн и космическая темная материя.',
      col2Title: '02 // НАВИГАЦИЯ',
      col3Title: '03 // УЗЛЫ СЕТИ',
      col4Title: '04 // ПАРАМЕТРЫ',
      specsList: [
        'ЭРА: 2022 — 2026',
        'АРТЕФАКТЫ: 14 РЕЛИЗОВ',
        'ФОРМАТ: LOSSLESS MASTER',
        'СТАТУС: ВЕЩАНИЕ АКТИВНО',
      ],
      canonicalNote: 'ОФИЦИАЛЬНЫЙ КАНАЛ: soundcloud.com/sillic1um',
    },
    EN: {
      toApex: '↑ RETURN TO APEX // SCROLL TO TOP',
      rights: 'ALL FREQUENCY RIGHTS RESERVED',
      archiveCode: 'OFFICIAL ARTIST ARCHIVE // sillic1um',
      col1Title: '01 // ENTITY',
      col1Desc: 'Official digital portal of music artist SILICIUM. Occult Memphis phonk, raw 808 distortion and dark cosmic void audio.',
      col2Title: '02 // NAVIGATION',
      col3Title: '03 // NETWORK NODES',
      col4Title: '04 // PARAMETERS',
      specsList: [
        'ERA: 2022 — 2026',
        'ARTIFACTS: 14 RELEASES',
        'FORMAT: LOSSLESS MASTER',
        'STATUS: BROADCAST ACTIVE',
      ],
      canonicalNote: 'VERIFIED CANONICAL: soundcloud.com/sillic1um',
    },
  }[language] || {
    toApex: '↑ RETURN TO APEX',
    rights: 'ALL RIGHTS RESERVED',
    archiveCode: 'OFFICIAL ARCHIVE // sillic1um',
    col1Title: '01 // ENTITY',
    col1Desc: 'Official portal of SILICIUM.',
    col2Title: '02 // NAVIGATION',
    col3Title: '03 // NETWORK',
    col4Title: '04 // SPECS',
    specsList: ['ERA: 2022 — 2026', 'ARTIFACTS: 14 RELEASES'],
    canonicalNote: 'soundcloud.com/sillic1um',
  }

  return (
    <footer className={styles.footer}>
      {/* Colossal Outline Watermark */}
      <div className={styles.footerWatermark} aria-hidden="true">
        SILICIUM
      </div>

      <div className={styles.inner}>
        {/* Top Bar: Brand Logo & Return to Top */}
        <div className={styles.topRow}>
          <div className={styles.brandBox}>
            <div className={styles.brandTitleRow}>
              <span className={styles.brandDot}>●</span>
              <span className={styles.logoText}>SILICIUM</span>
            </div>
            <span className={styles.tagline}>{t.archiveCode}</span>
          </div>

          <button onClick={scrollToTop} className={styles.returnBtn} data-magnetic>
            {t.toApex}
          </button>
        </div>

        <div className={styles.divider} />

        {/* 4-Column Editorial Matrix */}
        <div className={styles.columnsGrid}>
          {/* Col 1: Bio / Identity */}
          <div className={styles.footerCol}>
            <h4 className={styles.colHeader}>{t.col1Title}</h4>
            <p className={styles.colDesc}>{t.col1Desc}</p>
            <div className={styles.verifiedNodeBadge}>
              <span className={styles.verifiedDot} />
              <span>{t.canonicalNote}</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className={styles.footerCol}>
            <h4 className={styles.colHeader}>{t.col2Title}</h4>
            <ul className={styles.colNavList}>
              {NAV_ITEMS.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => scrollToSection(item.id)}
                    className={styles.colNavBtn}
                  >
                    <span className={styles.navSlash}>//</span>
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Network Nodes */}
          <div className={styles.footerCol}>
            <h4 className={styles.colHeader}>{t.col3Title}</h4>
            <ul className={styles.colNavList}>
              <li>
                <a
                  href={ARTIST.soundcloud}
                  target="_blank"
                  rel="noopener noreferrer me"
                  className={styles.colExternalLink}
                >
                  <span className={styles.linkArrow}>↗</span> SOUNDCLOUD
                </a>
              </li>
              <li>
                <a
                  href={ARTIST.spotify}
                  target="_blank"
                  rel="noopener noreferrer me"
                  className={styles.colExternalLink}
                >
                  <span className={styles.linkArrow}>↗</span> SPOTIFY
                </a>
              </li>
              <li>
                <a
                  href={ARTIST.telegram}
                  target="_blank"
                  rel="noopener noreferrer me"
                  className={styles.colExternalLink}
                >
                  <span className={styles.linkArrow}>↗</span> TELEGRAM CHANNEL
                </a>
              </li>
              <li>
                <a
                  href={ARTIST.vkGroup}
                  target="_blank"
                  rel="noopener noreferrer me"
                  className={styles.colExternalLink}
                >
                  <span className={styles.linkArrow}>↗</span> VK ARCHIVE
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Technical Specs */}
          <div className={styles.footerCol}>
            <h4 className={styles.colHeader}>{t.col4Title}</h4>
            <ul className={styles.specsList}>
              {t.specsList.map((spec, sIdx) => (
                <li key={sIdx} className={styles.specItem}>
                  <span className={styles.specDot}>◆</span>
                  <span>{spec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={styles.divider} />

        {/* Bottom Metadata Bar */}
        <div className={styles.bottomRow}>
          <div className={styles.copyright}>
            © 2022 — 2026 SILICIUM (sillic1um). {t.rights}.
          </div>

          <div className={styles.legalInfo}>
            <span>VERIFIED AUDIO TRANSMITTER // ALL STREAMS ENCRYPTED</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
