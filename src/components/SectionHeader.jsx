// SILICIUM — Editorial Section Header (Martin Garrix Scale + Occult Tech Identity)
import React from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import styles from './SectionHeader.module.css'

export default function SectionHeader({ code, title, subtitle, tag, watermark }) {
  const headerRef = useScrollReveal({ threshold: 0.2 })
  const titleRef = useScrollReveal({ threshold: 0.15 })
  const subtitleRef = useScrollReveal({ threshold: 0.1 })

  const displayWatermark = watermark || title

  return (
    <div className={styles.sectionHeaderArea}>
      {/* Editorial Giant Watermark Background Typography */}
      {displayWatermark && (
        <div className={styles.watermarkText} aria-hidden="true">
          {displayWatermark}
        </div>
      )}

      <div ref={headerRef} className={styles.topCluster}>
        <span className={styles.codeBadge}>
          <span className={styles.codePulseDot} />
          {code}
        </span>
        {tag && <span className={styles.tagBadge}>{tag}</span>}
        <div className={styles.laserLine} />
      </div>

      <h2 ref={titleRef} className={styles.titleText} data-reveal="scale">
        {title}
      </h2>

      {subtitle && (
        <p ref={subtitleRef} className={styles.subtitleText}>
          {subtitle}
        </p>
      )}
    </div>
  )
}
