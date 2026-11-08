// SILICIUM — Pure Editorial Section Header (Martin Garrix Level Minimalist Architecture)
import React from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import styles from './SectionHeader.module.css'

export default function SectionHeader({ title, subtitle, category, watermark }) {
  const headerRef = useScrollReveal({ threshold: 0.2 })
  const titleRef = useScrollReveal({ threshold: 0.15 })
  const subtitleRef = useScrollReveal({ threshold: 0.1 })

  const displayWatermark = watermark || title

  return (
    <div ref={headerRef} className={styles.sectionHeaderArea}>
      {/* Editorial Giant Watermark Typography */}
      {displayWatermark && (
        <div className={styles.watermarkText} aria-hidden="true">
          {displayWatermark}
        </div>
      )}

      {category && (
        <div className={styles.categoryLine}>
          <span className={styles.categoryText}>{category}</span>
        </div>
      )}

      <h2 ref={titleRef} className={styles.titleText}>
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
