// SILICIUM — Home Page (Main Digital Experience)
import React from 'react'
import HeroSection from './HeroSection'
import styles from './HomePage.module.css'
import { RELEASES } from '../data/config'
import { Link } from 'react-router-dom'
import { useStore } from '../data/store'

export default function HomePage() {
  const playTrack = useStore((s) => s.playTrack)
  const firstRelease = RELEASES[0]

  return (
    <main className={styles.homeContainer}>
      <HeroSection />

      {/* Featured Release Teaser Section */}
      <section className={styles.featuredSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionIndex}>// 01.1 //</span>
          <h2 className={styles.sectionTitle}>FEATURED ARTIFACT</h2>
          <div className={styles.sectionLine} />
        </div>

        <div className={styles.featuredCard}>
          <div className={styles.maskContainer}>
            <img
              src="/images/demon-mask.jpg"
              alt="SILICIUM Mask Artifact"
              className={styles.maskImage}
            />
            <div className={styles.scanline} />
          </div>

          <div className={styles.featuredInfo}>
            <div className={styles.metaBadge}>GENESIS // 2022</div>
            <h3 className={styles.releaseTitle}>MY WEED</h3>
            <p className={styles.releaseDesc}>
              The primary sonic anomaly recorded in the SILICIUM Digital Archive. 
              Atmospheric phonk resonance, occult sub-bass frequencies, and dark gothic compression.
            </p>

            <div className={styles.actionRow}>
              {firstRelease && firstRelease.tracks && firstRelease.tracks[0] && (
                <button
                  className={styles.playButton}
                  onClick={() => playTrack(firstRelease.tracks[0], firstRelease)}
                >
                  <span className={styles.playIcon}>▶</span>
                  <span>INITIATE FREQUENCY</span>
                </button>
              )}

              <Link to="/discography" className={styles.viewArchiveBtn}>
                FULL ARCHIVE →
              </Link>
            </div>
          </div>
        </div>

        {/* Quick System Navigation Pillars */}
        <div className={styles.pillarsGrid}>
          <Link to="/archive" className={styles.pillarCard}>
            <span className={styles.pillarNum}>03</span>
            <h4 className={styles.pillarTitle}>3D ARCHIVE</h4>
            <p className={styles.pillarDesc}>Orbiting artifacts & spatial navigation matrix.</p>
            <span className={styles.pillarArrow}>ENTER ↗</span>
          </Link>

          <Link to="/about" className={styles.pillarCard}>
            <span className={styles.pillarNum}>04</span>
            <h4 className={styles.pillarTitle}>CHRONICLE</h4>
            <p className={styles.pillarDesc}>Entity background and digital evolution timeline.</p>
            <span className={styles.pillarArrow}>DECRYPT ↗</span>
          </Link>

          <Link to="/community" className={styles.pillarCard}>
            <span className={styles.pillarNum}>05</span>
            <h4 className={styles.pillarTitle}>TRANSMISSION</h4>
            <p className={styles.pillarDesc}>Telegram frequency & occult network coordinates.</p>
            <span className={styles.pillarArrow}>CONNECT ↗</span>
          </Link>
        </div>
      </section>
    </main>
  )
}
