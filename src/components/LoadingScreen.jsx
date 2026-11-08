// SILICIUM — Editorial Entry Curtain (Martin Garrix Benchmark)
import { useEffect, useRef, useState, useCallback } from 'react'
import gsap from 'gsap'
import { useStore } from '../data/store'
import styles from './LoadingScreen.module.css'

export default function LoadingScreen() {
  const isLoading = useStore((s) => s.isLoading)
  const introComplete = useStore((s) => s.introComplete)
  const setLoading = useStore((s) => s.setLoading)
  const setIntroComplete = useStore((s) => s.setIntroComplete)

  const curtainRef = useRef(null)
  const contentRef = useRef(null)
  const progressLineRef = useRef(null)
  const percentRef = useRef(null)
  const timelineRef = useRef(null)
  const [percent, setPercent] = useState(0)
  const [visible, setVisible] = useState(true)

  const finishIntro = useCallback(() => {
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

    // Cinematic curtain lift
    tl.to(contentRef.current, {
      opacity: 0,
      y: -30,
      duration: 0.4,
      ease: 'power3.in',
    })
    .to(curtainRef.current, {
      yPercent: -100,
      duration: 0.85,
      ease: 'power4.inOut',
    }, '-=0.2')
  }, [setIntroComplete, setLoading])

  useEffect(() => {
    if (introComplete || !isLoading) return

    const counter = { val: 0 }
    const tl = gsap.timeline({
      onComplete: () => {
        finishIntro()
      },
    })
    timelineRef.current = tl

    // Fade in brand elements immediately
    tl.to(contentRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power2.out',
    })

    // Progress counter 0 -> 100% in 1.4s
    tl.to(counter, {
      val: 100,
      duration: 1.4,
      ease: 'power2.inOut',
      onUpdate: () => {
        setPercent(Math.round(counter.val))
      },
    }, '-=0.2')

    // Progress hairline expand
    tl.to(progressLineRef.current, {
      width: '100%',
      duration: 1.4,
      ease: 'power2.inOut',
    }, '<')

    return () => {
      tl.kill()
    }
  }, [isLoading, introComplete, finishIntro])

  if (introComplete || !isLoading || !visible) return null

  return (
    <div
      ref={curtainRef}
      className={styles.curtain}
      onClick={finishIntro}
      role="button"
      tabIndex={0}
      aria-label="Enter Silicium Experience"
    >
      <div ref={contentRef} className={styles.centerStage}>
        <div className={styles.categoryBadge}>OFFICIAL ARTIST PORTAL</div>

        <div className={styles.brandDisplay}>
          <img
            src="/images/logo-silver-transparent.png"
            alt="SILICIUM"
            className={styles.brandLogo}
            draggable={false}
          />
          <div className={styles.subTitle}>PHONK // BASS // SILLIC1UM</div>
        </div>

        {/* Minimal progress tracker */}
        <div className={styles.progressContainer}>
          <div className={styles.progressTrack}>
            <div ref={progressLineRef} className={styles.progressBar} />
          </div>
          <div className={styles.progressMeta}>
            <span ref={percentRef} className={styles.percentNumber}>
              {String(percent).padStart(3, '0')}%
            </span>
            <span className={styles.enterHint}>CLICK ANYWHERE TO ENTER</span>
          </div>
        </div>
      </div>
    </div>
  )
}
