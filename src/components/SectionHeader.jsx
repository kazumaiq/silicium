// SILICIUM — Cinematic Section Header with Red Laser Accents
import React from 'react'
import styles from './SectionHeader.module.css'

export default function SectionHeader({ code, title, subtitle, tag }) {
  return (
    <div className={styles.sectionHeaderArea}>
      <div className={styles.topCluster}>
        <span className={styles.codeText}>{code}</span>
        {tag && <span className={styles.tagBadge}>{tag}</span>}
        <div className={styles.laserLine} />
      </div>
      <h2 className={styles.titleText}>{title}</h2>
      {subtitle && <p className={styles.subtitleText}>{subtitle}</p>}
    </div>
  )
}
