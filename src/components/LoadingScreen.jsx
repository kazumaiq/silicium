// SILICIUM — Cinematic Loading / Intro Screen
import { useEffect, useRef, useState, useMemo, useCallback } from 'react'
import gsap from 'gsap'
import { useStore } from '../data/store'
import styles from './LoadingScreen.module.css'

const SYSTEM_MESSAGES = [
  'CONNECTING TO ARCHIVE...',
  'SIGNAL DETECTED',
  'DECRYPTING DATA STREAM',
  'DIMENSION LOCK: ACQUIRED',
]

const PARTICLE_COUNT = 50

function generateParticles(count) {
  const particles = []
  for (let i = 0; i < count; i++) {
    particles.push({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 5}s`,
      animationDuration: `${4 + Math.random() * 6}s`,
      scale: 0.5 + Math.random() * 1.5,
    })
  }
  return particles
}

export default function LoadingScreen() {
  const setLoading = useStore((s) => s.setLoading)
  const setIntroComplete = useStore((s) => s.setIntroComplete)

  const overlayRef = useRef(null)
  const particleFieldRef = useRef(null)
  const demonMaskRef = useRef(null)
  const energyLinesRef = useRef(null)
  const logoRef = useRef(null)
  const systemLinesRef = useRef([])
  const skipButtonRef = useRef(null)
  const cornersRef = useRef([])
  const timelineRef = useRef(null)
  const [visible, setVisible] = useState(true)

  const particles = useMemo(() => generateParticles(PARTICLE_COUNT), [])

  const completeIntro = useCallback(() => {
    if (timelineRef.current) {
      timelineRef.current.kill()
    }

    const tl = gsap.timeline({
      onComplete: () => {
        setIntroComplete(true)
        setLoading(false)
        setVisible(false)
      },
    })

    tl.to(overlayRef.current, {
      opacity: 0,
      duration: 0.8,
      ease: 'power2.inOut',
    })
  }, [setIntroComplete, setLoading])

  useEffect(() => {
    // Reset refs arrays
    systemLinesRef.current = systemLinesRef.current.filter(Boolean)
    cornersRef.current = cornersRef.current.filter(Boolean)

    const tl = gsap.timeline()
    timelineRef.current = tl

    // Phase 1 (0–1s): Pure black — nothing happens
    tl.addLabel('phase1', 0)

    // Show skip button after 2s
    tl.to(skipButtonRef.current, {
      opacity: 1,
      duration: 0.4,
      ease: 'power2.out',
    }, 2)

    // Phase 2 (1–2.5s): Cosmic particles appear
    tl.addLabel('phase2', 1)
    tl.to(particleFieldRef.current, {
      opacity: 1,
      duration: 1.5,
      ease: 'power2.out',
    }, 'phase2')

    // Corner brackets fade in
    tl.to(cornersRef.current, {
      opacity: 0.5,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power2.out',
    }, 'phase2+=0.5')

    // System text appears (staggered typing effect)
    tl.addLabel('systemText', 1.5)
    systemLinesRef.current.forEach((line, i) => {
      if (line) {
        tl.to(line, {
          opacity: 1,
          x: 0,
          duration: 0.4,
          ease: 'power3.out',
        }, `systemText+=${i * 0.5}`)
      }
    })

    // Phase 3 (2.5–4s): Demon mask fades in
    tl.addLabel('phase3', 2.5)
    tl.to(demonMaskRef.current, {
      opacity: 0.6,
      scale: 1,
      duration: 1.5,
      ease: 'power2.out',
    }, 'phase3')

    // Phase 4 (4–5s): Red energy lines activate
    tl.addLabel('phase4', 4)
    tl.to(energyLinesRef.current, {
      opacity: 1,
      duration: 0.3,
      ease: 'power2.out',
    }, 'phase4')

    // Fade out demon mask as energy lines come in
    tl.to(demonMaskRef.current, {
      opacity: 0.15,
      duration: 0.8,
      ease: 'power2.inOut',
    }, 'phase4+=0.3')

    // Phase 5 (5–6s): Logo appears
    tl.addLabel('phase5', 5)
    tl.to(logoRef.current, {
      opacity: 1,
      scale: 1,
      duration: 1,
      ease: 'back.out(1.4)',
    }, 'phase5')

    // Fade energy lines to subtle
    tl.to(energyLinesRef.current, {
      opacity: 0.3,
      duration: 0.8,
      ease: 'power2.inOut',
    }, 'phase5+=0.3')

    // Phase 6 (6–7s): Fade out everything
    tl.addLabel('phase6', 6.2)
    tl.to(overlayRef.current, {
      opacity: 0,
      duration: 0.8,
      ease: 'power2.inOut',
      onComplete: () => {
        setIntroComplete(true)
        setLoading(false)
        setVisible(false)
      },
    }, 'phase6')

    return () => {
      tl.kill()
    }
  }, [setIntroComplete, setLoading])

  if (!visible) return null

  return (
    <div ref={overlayRef} className={styles.overlay}>
      {/* Scanline overlay */}
      <div className={styles.scanlines} />

      {/* Corner brackets */}
      <div ref={(el) => (cornersRef.current[0] = el)} className={styles.cornerTL} />
      <div ref={(el) => (cornersRef.current[1] = el)} className={styles.cornerTR} />
      <div ref={(el) => (cornersRef.current[2] = el)} className={styles.cornerBL} />
      <div ref={(el) => (cornersRef.current[3] = el)} className={styles.cornerBR} />

      {/* Particles */}
      <div ref={particleFieldRef} className={styles.particleField}>
        {particles.map((p) => (
          <div
            key={p.id}
            className={styles.particle}
            style={{
              left: p.left,
              top: p.top,
              animationDelay: p.animationDelay,
              animationDuration: p.animationDuration,
              transform: `scale(${p.scale})`,
            }}
          />
        ))}
      </div>

      {/* Demon mask */}
      <div ref={demonMaskRef} className={styles.demonMask}>
        <img
          src="/images/demon-mask.jpg"
          alt=""
          className={styles.demonMaskImage}
          draggable={false}
        />
      </div>

      {/* Red energy lines */}
      <div ref={energyLinesRef} className={styles.energyLines}>
        <div className={`${styles.energyLine} ${styles.horizontal}`} />
        <div className={`${styles.energyLine} ${styles.vertical}`} />
        <div className={`${styles.energyLine} ${styles.diagonal1}`} />
        <div className={`${styles.energyLine} ${styles.diagonal2}`} />
        <div className={`${styles.energyLine} ${styles.diagonal3}`} />
        <div className={`${styles.energyLine} ${styles.diagonal4}`} />
      </div>

      {/* Logo */}
      <div ref={logoRef} className={styles.logoContainer}>
        <img
          src="/images/logo-red.png"
          alt="SILICIUM"
          className={styles.logoImage}
          draggable={false}
        />
      </div>

      {/* System text */}
      <div className={styles.systemText}>
        {SYSTEM_MESSAGES.map((msg, i) => (
          <div
            key={i}
            ref={(el) => (systemLinesRef.current[i] = el)}
            className={styles.systemLine}
          >
            {msg}
            {i === SYSTEM_MESSAGES.length - 1 && <span className={styles.cursor} />}
          </div>
        ))}
      </div>

      {/* Skip button */}
      <button
        ref={skipButtonRef}
        className={styles.skipButton}
        onClick={completeIntro}
        type="button"
      >
        SKIP &gt;&gt;
      </button>
    </div>
  )
}
