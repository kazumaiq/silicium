// SILICIUM — Hero Section
import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { useStore } from '../data/store'
import { ARTIST } from '../data/config'
import styles from './HeroSection.module.css'

const STATUS_LINES = [
  'ARCHIVE STATUS: ONLINE',
  'SIGNAL: ACTIVE',
  'UNKNOWN DIMENSION DETECTED',
]

export default function HeroSection() {
  const introComplete = useStore((s) => s.introComplete)
  const navigate = useNavigate()

  const sectionRef = useRef(null)
  const logoRef = useRef(null)
  const subtitleRef = useRef(null)
  const dateRangeRef = useRef(null)
  const firstReleaseRef = useRef(null)
  const dividerRef = useRef(null)
  const ctaGroupRef = useRef(null)
  const statusPanelRef = useRef(null)
  const scrollIndicatorRef = useRef(null)

  useEffect(() => {
    if (!introComplete) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
      })

      // Logo entrance
      tl.to(logoRef.current, {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: 'power2.out',
      }, 0)

      // Subtitle
      tl.to(subtitleRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
      }, 0.3)

      // Date range
      tl.to(dateRangeRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
      }, 0.5)

      // First release
      tl.to(firstReleaseRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
      }, 0.7)

      // Divider
      tl.to(dividerRef.current, {
        opacity: 1,
        scaleX: 1,
        duration: 0.6,
        ease: 'power2.inOut',
      }, 0.9)

      // CTA buttons
      tl.to(ctaGroupRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
      }, 1.0)

      // Status panel
      tl.to(statusPanelRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
      }, 1.2)

      // Scroll indicator
      tl.to(scrollIndicatorRef.current, {
        opacity: 0.6,
        duration: 1,
        ease: 'power2.out',
      }, 1.5)
    }, sectionRef)

    return () => ctx.revert()
  }, [introComplete])

  const handleNavigate = (path) => {
    navigate(path)
  }

  return (
    <section ref={sectionRef} className={styles.hero}>
      {/* Side accent lines */}
      <div className={styles.accentLineLeft} />
      <div className={styles.accentLineRight} />

      {/* Main content */}
      <div className={styles.content}>
        {/* Logo */}
        <div ref={logoRef} className={styles.logoWrapper}>
          <img
            src="/images/logo-red.png"
            alt={ARTIST.name}
            className={styles.logo}
            draggable={false}
          />
        </div>

        {/* Subtitle */}
        <div ref={subtitleRef} className={styles.subtitle}>
          {ARTIST.tagline}
        </div>

        {/* Date range */}
        <div ref={dateRangeRef} className={styles.dateRange}>
          // {ARTIST.years} //
        </div>

        {/* First release callout */}
        <div ref={firstReleaseRef} className={styles.firstRelease}>
          {ARTIST.firstTrack}
        </div>

        {/* Divider */}
        <div ref={dividerRef} className={styles.divider} />

        {/* CTA Buttons */}
        <div ref={ctaGroupRef} className={styles.ctaGroup}>
          <button
            className={`${styles.ctaButton} ${styles.ctaPrimary}`}
            onClick={() => handleNavigate('/archive')}
            type="button"
          >
            ENTER THE ARCHIVE
          </button>
          <button
            className={styles.ctaButton}
            onClick={() => handleNavigate('/discography')}
            type="button"
          >
            LISTEN TO MUSIC
          </button>
        </div>
      </div>

      {/* Status panel */}
      <div ref={statusPanelRef} className={styles.statusPanel}>
        {STATUS_LINES.map((line, i) => (
          <div key={i} className={styles.statusLine}>
            {i === 1 && <span className={styles.statusDot} />}
            {line}
          </div>
        ))}
      </div>

      {/* Scroll indicator */}
      <div ref={scrollIndicatorRef} className={styles.scrollIndicator}>
        <span className={styles.scrollText}>SCROLL</span>
        <div className={styles.scrollLine} />
      </div>

      {/* Bottom border */}
      <div className={styles.borderBottom} />
    </section>
  )
}
