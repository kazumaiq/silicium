// SILICIUM — About / Chronicle Section
import React from 'react'
import { ARTIST, TIMELINE } from '../data/config'
import styles from './AboutPage.module.css'

export default function AboutPage() {
  return (
    <div className={styles.aboutContainer}>
      <div className={styles.headerArea}>
        <span className={styles.metaLabel}>// 04 // ENTITY CHRONICLE</span>
        <h1 className={styles.pageTitle}>ORIGIN & EVOLUTION</h1>
        <p className={styles.subtitle}>
          Digital dossier and timeline parameters of SILICIUM.
        </p>
      </div>

      <div className={styles.contentGrid}>
        {/* Entity Dossier / Bio */}
        <section className={styles.dossierSection}>
          <div className={styles.dossierBox}>
            <div className={styles.dossierHeader}>
              <span>CLASSIFIED TRANSMISSION</span>
              <span className={styles.idCode}>SUB-FREQ: #SIL-2022</span>
            </div>

            <h2 className={styles.identityTitle}>THE SILICIUM PARADOX</h2>

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
                <span className={styles.specLabel}>DESIGNATION:</span>
                <span className={styles.specVal}>{ARTIST.name}</span>
              </div>
              <div className={styles.specItem}>
                <span className={styles.specLabel}>ACTIVE ERA:</span>
                <span className={styles.specVal}>{ARTIST.years}</span>
              </div>
              <div className={styles.specItem}>
                <span className={styles.specLabel}>GENESIS BROADCAST:</span>
                <span className={styles.specVal}>{ARTIST.firstTrack}</span>
              </div>
              <div className={styles.specItem}>
                <span className={styles.specLabel}>STATUS:</span>
                <span className={styles.specValActive}>ONLINE // BROADCASTING</span>
              </div>
            </div>
          </div>

          <div className={styles.quoteBox}>
            <blockquote>
              "Sound is not merely vibration in the void; it is the architecture of forgotten dimensions."
            </blockquote>
            <cite>// ARCHIVE CODEX</cite>
          </div>
        </section>

        {/* Timeline Component */}
        <section className={styles.timelineSection}>
          <h3 className={styles.timelineHeading}>CHRONOLOGICAL TRAJECTORY</h3>

          <div className={styles.timeline}>
            {TIMELINE.map((cycle, idx) => (
              <div key={idx} className={styles.timelineItem}>
                <div className={styles.timelineMarker}>
                  <div className={styles.markerDot} />
                  <div className={styles.markerYear}>{cycle.year}</div>
                </div>

                <div className={styles.timelineContent}>
                  {cycle.events.map((evt, eIdx) => (
                    <div key={eIdx} className={styles.eventCard}>
                      <div className={styles.eventBadge}>
                        {evt.type?.toUpperCase() || 'EVENT'}
                      </div>
                      <h4 className={styles.eventTitle}>{evt.title}</h4>
                      <p className={styles.eventDesc}>{evt.description}</p>
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
