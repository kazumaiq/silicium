// SILICIUM — About Section (Origin & Evolution Dossier)
import React from 'react'
import { ARTIST, TIMELINE } from '../data/config'
import { useStore } from '../data/store'
import SectionHeader from '../components/SectionHeader'
import { useScrollReveal } from '../hooks/useScrollReveal'
import styles from './AboutPage.module.css'

export default function AboutPage() {
  const language = useStore((s) => s.language)

  const dossierRef = useScrollReveal({ threshold: 0.1 })
  const timelineRef = useScrollReveal({ threshold: 0.08 })
  const quoteRef = useScrollReveal({ threshold: 0.15 })

  const t = {
    RU: {
      code: '// 04 //',
      tag: 'ХРОНИКА СУЩНОСТИ',
      title: 'О ПРОЕКТЕ',
      subtitle: 'Цифровое досье и параметры хронологической траектории проекта SILICIUM.',
      classified: 'ЗАСЕКРЕЧЕННАЯ ТРАНСЛЯЦИЯ',
      subFreq: 'ПОДЧАСТОТА: #SIL-2022',
      paradoxTitle: 'ПАРАДОКС SILICIUM',
      designation: 'ОБОЗНАЧЕНИЕ:',
      activeEra: 'ЭПОХА АКТИВНОСТИ:',
      genesisBroadcast: 'ПЕРВАЯ ТРАНСЛЯЦИЯ:',
      status: 'СТАТУС:',
      online: 'В СЕТИ // ВЕЩАНИЕ',
      trajectoryTitle: 'ХРОНОЛОГИЧЕСКАЯ ТРАЕКТОРИЯ',
      manifesto: '"Звук — это не просто колебания в пустоте. Это архитектура забытых измерений, деконструирующая реальность через 808-дисторшн."',
    },
    EN: {
      code: '// 04 //',
      tag: 'ENTITY CHRONICLE',
      title: 'ABOUT',
      subtitle: 'Digital dossier and timeline parameters of the SILICIUM project.',
      classified: 'CLASSIFIED TRANSMISSION',
      subFreq: 'SUB-FREQ: #SIL-2022',
      paradoxTitle: 'THE SILICIUM PARADOX',
      designation: 'DESIGNATION:',
      activeEra: 'ACTIVE ERA:',
      genesisBroadcast: 'GENESIS BROADCAST:',
      status: 'STATUS:',
      online: 'ONLINE // BROADCASTING',
      trajectoryTitle: 'CHRONOLOGICAL TRAJECTORY',
      manifesto: '"Sound is not merely vibration in the void; it is the architecture of forgotten dimensions, deconstructing reality through 808 distortion."',
    },
  }[language] || {
    code: '// 04 //',
    tag: 'ENTITY CHRONICLE',
    title: 'ABOUT',
    subtitle: 'Digital dossier and timeline parameters of the SILICIUM project.',
    classified: 'CLASSIFIED TRANSMISSION',
    subFreq: 'SUB-FREQ: #SIL-2022',
    paradoxTitle: 'THE SILICIUM PARADOX',
    designation: 'DESIGNATION:',
    activeEra: 'ACTIVE ERA:',
    genesisBroadcast: 'GENESIS BROADCAST:',
    status: 'STATUS:',
    online: 'ONLINE // BROADCASTING',
    trajectoryTitle: 'CHRONOLOGICAL TRAJECTORY',
    manifesto: '"Sound is not merely vibration in the void; it is the architecture of forgotten dimensions."',
  }

  return (
    <div className={styles.aboutContainer}>
      <SectionHeader
        code={t.code}
        tag={t.tag}
        title={t.title}
        subtitle={t.subtitle}
      />

      <div className={styles.contentGrid}>
        {/* Entity Dossier / Bio */}
        <section className={styles.dossierSection}>
          <div ref={dossierRef} className={styles.dossierBox}>
            <div className={styles.dossierHeader}>
              <span>{t.classified}</span>
              <span className={styles.idCode}>{t.subFreq}</span>
            </div>

            <h3 className={styles.identityTitle}>{t.paradoxTitle}</h3>

            <div className={styles.dossierText}>
              <p>
                {ARTIST.bio ||
                  'SILICIUM is an occult audiovisual entity operating at the convergence of raw Memphis phonk aesthetics, cosmic black metal atmosphere, and cold brutalist soundscapes.'}
              </p>
              <p>
                {ARTIST.description ||
                  'Emerging in 2022 with the foundational genesis frequency "MY WEED", the project continues to deconstruct underground bass music through analog distortion, sacred geometry, and dark cosmic symbolism.'}
              </p>
            </div>

            <div className={styles.specsGrid}>
              <div className={styles.specItem}>
                <span className={styles.specLabel}>{t.designation}</span>
                <span className={styles.specVal}>{ARTIST.name}</span>
              </div>
              <div className={styles.specItem}>
                <span className={styles.specLabel}>{t.activeEra}</span>
                <span className={styles.specVal}>{ARTIST.years}</span>
              </div>
              <div className={styles.specItem}>
                <span className={styles.specLabel}>{t.genesisBroadcast}</span>
                <span className={styles.specVal}>{ARTIST.firstTrack}</span>
              </div>
              <div className={styles.specItem}>
                <span className={styles.specLabel}>{t.status}</span>
                <span className={styles.specValActive}>{t.online}</span>
              </div>
            </div>
          </div>

          <div ref={quoteRef} className={styles.quoteBox} data-reveal="scale">
            <blockquote>{t.manifesto}</blockquote>
            <cite>// SILICIUM ARCHIVE MANIFESTO</cite>
          </div>
        </section>

        {/* Timeline Trajectory */}
        <section ref={timelineRef} className={styles.timelineSection} data-reveal="left">
          <div className={styles.timelineHeader}>
            <span>{t.trajectoryTitle}</span>
          </div>

          <div className={styles.timelineStream}>
            {TIMELINE.map((node, i) => (
              <div key={i} className={styles.timelineNode}>
                <div className={styles.nodeMarker}>
                  <div className={styles.pulseDot} />
                  <span className={styles.nodeYear}>{node.year}</span>
                </div>

                <div className={styles.nodeCards}>
                  {node.events.map((ev, eIdx) => (
                    <div key={eIdx} className={styles.eventCard}>
                      <span className={styles.eventType}>{ev.type.toUpperCase()}</span>
                      <h4 className={styles.eventTitle}>{ev.title}</h4>
                      <p className={styles.eventDesc}>{ev.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
