// SILICIUM — Editorial Narrative & Chronicle (Martin Garrix Benchmark)
import React, { useRef, useEffect } from 'react'
import { ARTIST, TIMELINE } from '../data/config'
import { useStore } from '../data/store'
import SectionHeader from '../components/SectionHeader'
import { useScrollReveal } from '../hooks/useScrollReveal'
import styles from './AboutPage.module.css'

export default function AboutPage() {
  const language = useStore((s) => s.language)

  const quoteRef = useScrollReveal({ threshold: 0.15 })
  const narrativeRef = useScrollReveal({ threshold: 0.1 })
  const timelineRef = useScrollReveal({ threshold: 0.08 })

  const timelineStreamRef = useRef(null)
  const laserFillRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!timelineStreamRef.current || !laserFillRef.current) return
      const rect = timelineStreamRef.current.getBoundingClientRect()
      const windowH = window.innerHeight
      const progress = Math.min(1, Math.max(0, (windowH * 0.75 - rect.top) / rect.height))
      laserFillRef.current.style.height = `${progress * 100}%`
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const t = {
    RU: {
      category: 'ХРОНИКА СУЩНОСТИ',
      title: 'О ПРОЕКТЕ',
      subtitle: 'Художественное повествование и хронологическая траектория проекта SILICIUM.',
      manifesto: '"Звук — это не просто колебания в пустоте. Это архитектура забытых измерений, деконструирующая реальность через 808-дисторшн."',
      paradoxTitle: 'ПАРАДОКС SILICIUM',
      bio1: 'SILICIUM (известен в сети как sillic1um) — оккультный аудиовизуальный проект на стыке сырого мемфисского фонка, космической блэк-метал атмосферы и холодных бруталистских звуковых ландшафтов.',
      bio2: 'Возникнув в декабре 2022 года с фундаментом в виде генезис-трека "MY WEED", проект последовательно деконструирует андеграундный саб-бас через аналоговый перегруз, священную геометрию и тёмный космический символизм.',
      designation: 'АРТИСТ // HANDLE:',
      activeEra: 'ЭПОХА АКТИВНОСТИ:',
      genesisBroadcast: 'ИСТОК:',
      scNode: 'ОФИЦИАЛЬНЫЙ КАНАЛ:',
      status: 'СТАТУС:',
      online: 'ВЕЩАНИЕ АКТИВНО // ОФИЦИАЛЬНЫЙ ПОРТАЛ',
      chronicleTitle: 'ХРОНОЛОГИЧЕСКАЯ ТРАЕКТОРИЯ',
    },
    EN: {
      category: 'ENTITY CHRONICLE',
      title: 'ABOUT',
      subtitle: 'Artistic narrative and chronological trajectory of the SILICIUM universe.',
      manifesto: '"Sound is not merely vibration in the void; it is the architecture of forgotten dimensions, deconstructing reality through 808 distortion."',
      paradoxTitle: 'THE SILICIUM PARADOX',
      bio1: 'SILICIUM (known online as sillic1um) is an occult audiovisual entity operating at the convergence of raw Memphis phonk aesthetics, cosmic black metal atmosphere, and cold brutalist soundscapes.',
      bio2: 'Emerging in December 2022 with the foundational genesis frequency "MY WEED", the project continues to deconstruct underground bass music through analog distortion, sacred geometry, and dark cosmic symbolism.',
      designation: 'ARTIST // HANDLE:',
      activeEra: 'ACTIVE ERA:',
      genesisBroadcast: 'GENESIS TRACK:',
      scNode: 'OFFICIAL CHANNEL:',
      status: 'STATUS:',
      online: 'BROADCAST ACTIVE // VERIFIED PORTAL',
      chronicleTitle: 'CHRONOLOGICAL TRAJECTORY',
    },
  }[language] || {
    category: 'ENTITY CHRONICLE',
    title: 'ABOUT',
    subtitle: 'Artistic narrative of the SILICIUM universe.',
    manifesto: '"Sound is not merely vibration in the void."',
    paradoxTitle: 'THE SILICIUM PARADOX',
    bio1: 'SILICIUM is an occult audiovisual entity.',
    bio2: 'Emerging in 2022 with genesis track "MY WEED".',
    designation: 'ARTIST:',
    activeEra: 'ERA:',
    genesisBroadcast: 'GENESIS:',
    scNode: 'CHANNEL:',
    status: 'STATUS:',
    online: 'ONLINE',
    chronicleTitle: 'CHRONOLOGY',
  }

  return (
    <div className={styles.aboutContainer}>
      <SectionHeader
        category={t.category}
        title={t.title}
        subtitle={t.subtitle}
        watermark="ORIGIN"
      />

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 01 // EDITORIAL PULL QUOTE SPREAD (MAGAZINE STYLE)           */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div ref={quoteRef} className={styles.quoteSpread}>
        <blockquote className={styles.quoteText}>
          {t.manifesto}
        </blockquote>
        <cite className={styles.quoteAuthor}>
          — SILICIUM // sillic1um
        </cite>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 02 // NARRATIVE SPREAD: ARTWORK + ESSAY                       */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section ref={narrativeRef} className={styles.narrativeSection}>
        <div className={styles.artworkColumn}>
          <div className={styles.artworkPosterFrame}>
            <img
              src="/images/demon-mask-seamless.png"
              alt="SILICIUM Occult Entity"
              className={styles.narrativeMaskImg}
            />
            <div className={styles.posterGlow} />
          </div>
        </div>

        <div className={styles.textColumn}>
          <h3 className={styles.paradoxHeading}>{t.paradoxTitle}</h3>
          
          <div className={styles.storyParagraphs}>
            <p>{t.bio1}</p>
            <p>{t.bio2}</p>
          </div>

          <div className={styles.specsRowList}>
            <div className={styles.specLine}>
              <span className={styles.specKey}>{t.designation}</span>
              <span className={styles.specVal}>SILICIUM // sillic1um</span>
            </div>
            <div className={styles.specLine}>
              <span className={styles.specKey}>{t.activeEra}</span>
              <span className={styles.specVal}>2022 — 2026</span>
            </div>
            <div className={styles.specLine}>
              <span className={styles.specKey}>{t.genesisBroadcast}</span>
              <span className={styles.specVal}>MY WEED (2022-12-14)</span>
            </div>
            <div className={styles.specLine}>
              <span className={styles.specKey}>{t.scNode}</span>
              <a
                href={ARTIST.soundcloud}
                target="_blank"
                rel="noreferrer"
                className={styles.specLink}
              >
                soundcloud.com/sillic1um ↗
              </a>
            </div>
            <div className={styles.specLine}>
              <span className={styles.specKey}>{t.status}</span>
              <span className={styles.specValOnline}>{t.online}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 03 // VERTICAL CHRONICLE TIMELINE (ORGANIC EDITORIAL FLOW)    */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section ref={timelineRef} className={styles.chronicleSection}>
        <h3 className={styles.chronicleHeading}>{t.chronicleTitle}</h3>

        <div ref={timelineStreamRef} className={styles.chronicleStream}>
          <div className={styles.laserLineTrack}>
            <div ref={laserFillRef} className={styles.laserLineFill} />
          </div>

          {TIMELINE.map((node, i) => (
            <div key={i} className={styles.chronicleNode}>
              <div className={styles.nodeYearBlock}>
                <span className={styles.yearNumber}>{node.year}</span>
              </div>

              <div className={styles.nodeEventsFlow}>
                {node.events.map((ev, eIdx) => (
                  <div key={eIdx} className={styles.eventItem}>
                    <span className={styles.eventBadge}>{ev.type}</span>
                    <h4 className={styles.eventHeading}>{ev.title}</h4>
                    <p className={styles.eventSummary}>{ev.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
