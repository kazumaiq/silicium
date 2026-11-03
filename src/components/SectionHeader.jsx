// SILICIUM — Cinematic Section Header with Scroll-Triggered Reveal
import React from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import styles from './SectionHeader.module.css'

export default function SectionHeader({ code, title, subtitle, tag }) {
  const headerRef = useScrollReveal({ threshold: 0.2 })
  const titleRef = useScrollReveal({ threshold: 0.15 })
  const subtitleRef = useScrollReveal({ threshold: 0.1 })

  return (
    <div className={styles.sectionHeaderArea}>
      <div ref={headerRef} className={styles.topCluster}>
        <span className={styles.codeText}>{code}</span>
        {tag && <span className={styles.tagBadge}>{tag}</span>}
        <div className={styles.laserLine} />
      </div>
      <h2 ref={titleRef} className={styles.titleText} data-reveal="scale">{title}</h2>
      {subtitle && <p ref={subtitleRef} className={styles.subtitleText}>{subtitle}</p>}
    </div>
  )
}
