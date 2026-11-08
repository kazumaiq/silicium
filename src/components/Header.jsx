// SILICIUM — Editorial Minimalist Header (Martin Garrix Style)
import React, { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { useStore } from '../data/store'
import { NAV_ITEMS } from '../data/config'
import gsap from 'gsap'
import styles from './Header.module.css'

export default function Header() {
  const location = useLocation()
  const {
    currentSection,
    setCurrentSection,
    menuOpen,
    toggleMenu,
    setMenuOpen,
    language,
    setLanguage,
  } = useStore()

  const [scrolled, setScrolled] = useState(false)
  const menuRef = useRef(null)
  const navItemsRef = useRef([])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLabels = {
    RU: {
      home: 'ГЛАВНАЯ',
      discography: 'РЕЛИЗЫ',
      archive: '3D VAULT',
      about: 'О ПРОЕКТЕ',
      community: 'СООБЩЕСТВО',
      platforms: 'ПЛАТФОРМЫ',
    },
    EN: {
      home: 'HOME',
      discography: 'RELEASES',
      archive: '3D VAULT',
      about: 'ABOUT',
      community: 'COMMUNITY',
      platforms: 'PLATFORMS',
    },
  }

  const currentNav = navLabels[language] || navLabels.RU

  const scrollToSection = (id) => {
    setMenuOpen(false)
    setCurrentSection(id)

    if (location.pathname !== '/') {
      window.location.href = `/#${id}`
      return
    }

    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
      if (window.history.replaceState) {
        window.history.replaceState(null, '', `#${id}`)
      }
    }
  }

  // GSAP animation for mobile/desktop full-screen menu
  useEffect(() => {
    if (!menuRef.current) return
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
      gsap.to(menuRef.current, {
        opacity: 1,
        visibility: 'visible',
        duration: 0.4,
        ease: 'power3.out',
      })
      navItemsRef.current.forEach((item, i) => {
        if (item) {
          gsap.fromTo(
            item,
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, delay: 0.1 + i * 0.05, ease: 'power3.out' }
          )
        }
      })
    } else {
      document.body.style.overflow = ''
      gsap.to(menuRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: 'power3.in',
        onComplete: () => {
          if (menuRef.current) menuRef.current.style.visibility = 'hidden'
        },
      })
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <>
      <header className={`${styles.header} ${scrolled ? styles.headerScrolled : ''}`}>
        {/* Left: Brand Logo */}
        <button
          onClick={() => scrollToSection('home')}
          className={styles.logoBtn}
          aria-label="SILICIUM (sillic1um) — Home"
        >
          <img
            src="/images/logo-silver-transparent.png"
            alt="SILICIUM"
            className={styles.logoImg}
          />
        </button>

        {/* Center: Desktop Minimalist Nav */}
        <nav className={styles.desktopNav}>
          {NAV_ITEMS.map((item) => {
            const isActive = currentSection === item.id
            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`${styles.navBtn} ${isActive ? styles.navActive : ''}`}
              >
                <span className={styles.navLabel}>
                  {currentNav[item.id] || item.label}
                </span>
                {isActive && <span className={styles.navActiveDot} />}
              </button>
            )
          })}
        </nav>

        {/* Right: Language switch + Minimalist Menu Toggle */}
        <div className={styles.rightCluster}>
          <div className={styles.langSwitch}>
            <button
              onClick={() => setLanguage('RU')}
              className={`${styles.langBtn} ${language === 'RU' ? styles.langActive : ''}`}
            >
              RU
            </button>
            <span className={styles.langSep}>/</span>
            <button
              onClick={() => setLanguage('EN')}
              className={`${styles.langBtn} ${language === 'EN' ? styles.langActive : ''}`}
            >
              EN
            </button>
          </div>

          <button
            className={`${styles.menuToggle} ${menuOpen ? styles.menuToggleActive : ''}`}
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span className={styles.menuBarTop} />
            <span className={styles.menuBarBottom} />
          </button>
        </div>
      </header>

      {/* Fullscreen Editorial Drawer Menu */}
      <div
        ref={menuRef}
        className={styles.fullscreenMenu}
        style={{ opacity: 0, visibility: 'hidden' }}
      >
        <div className={styles.menuWatermark} aria-hidden="true">
          SILICIUM
        </div>

        <div className={styles.menuInner}>
          <ul className={styles.menuList}>
            {NAV_ITEMS.map((item, i) => {
              const isActive = currentSection === item.id
              return (
                <li
                  key={item.id}
                  ref={(el) => (navItemsRef.current[i] = el)}
                  className={styles.menuItem}
                >
                  <button
                    onClick={() => scrollToSection(item.id)}
                    className={`${styles.menuLink} ${isActive ? styles.menuLinkActive : ''}`}
                  >
                    <span className={styles.menuIndex}>0{i + 1}</span>
                    <span className={styles.menuTitle}>
                      {currentNav[item.id] || item.label}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>

          <div className={styles.menuFooter}>
            <div className={styles.menuArtistMeta}>
              <span className={styles.artistName}>SILICIUM // sillic1um</span>
              <span className={styles.artistEra}>2022 — 2026 ARCHIVE</span>
            </div>
            <div className={styles.menuSocials}>
              <a href="https://soundcloud.com/sillic1um" target="_blank" rel="noreferrer">
                SOUNDCLOUD ↗
              </a>
              <a href="https://open.spotify.com/artist/5P7IaTkm7DkO2WdGPFbuWI" target="_blank" rel="noreferrer">
                SPOTIFY ↗
              </a>
              <a href="https://t.me/silliciumphonk" target="_blank" rel="noreferrer">
                TELEGRAM ↗
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
