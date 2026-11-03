// SILICIUM — Modern Smooth-Scroll Header with Section Highlighting & Mobile Overlay
import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
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

  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth <= 1050 : false
  )

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1050)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const headerRef = useRef(null)
  const menuRef = useRef(null)
  const navItemsRef = useRef([])

  const navLabels = {
    RU: {
      home: '01 // ГЛАВНАЯ',
      discography: '02 // РЕЛИЗЫ',
      archive: '03 // 3D АРХИВ',
      about: '04 // О ПРОЕКТЕ',
      community: '05 // СООБЩЕСТВО',
      platforms: '06 // ПЛАТФОРМЫ',
    },
    EN: {
      home: '01 // HOME',
      discography: '02 // DISCOGRAPHY',
      archive: '03 // 3D ARCHIVE',
      about: '04 // ABOUT',
      community: '05 // COMMUNITY',
      platforms: '06 // PLATFORMS',
    },
  }

  const currentNav = navLabels[language] || navLabels.RU

  // Плавный скролл к секции
  const scrollToSection = (id) => {
    setMenuOpen(false)
    setCurrentSection(id)

    // Если находимся на другой странице (например /discography/:id)
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

  // Анимация мобильного меню
  useEffect(() => {
    if (!menuRef.current) return
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
      gsap.to(menuRef.current, {
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 0.45,
        ease: 'power3.inOut',
      })
      navItemsRef.current.forEach((item, i) => {
        if (item) {
          gsap.fromTo(
            item,
            { x: -30, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.35, delay: 0.12 + i * 0.05, ease: 'power3.out' }
          )
        }
      })
    } else {
      document.body.style.overflow = ''
      gsap.to(menuRef.current, {
        clipPath: 'inset(0% 0% 100% 0%)',
        duration: 0.3,
        ease: 'power3.inOut',
      })
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <>
      <header ref={headerRef} className={styles.header}>
        {/* Left: Brand Logo */}
        <button
          onClick={() => scrollToSection('home')}
          className={styles.logoBtn}
          aria-label="Silicium Home"
        >
          <img 
            src="/images/logo-silver-new.png"
            alt="SILICIUM"
            className={styles.logoImg}
          />
        </button>

        {/* Center: Desktop 6-Tab Navigation with Red Active Accent */}
        {!isMobile && (
          <nav className={styles.centerNav}>
            {NAV_ITEMS.map((item) => {
              const isActive = currentSection === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`${styles.navBtn} ${isActive ? styles.navActive : ''}`}
                  aria-current={isActive ? 'true' : undefined}
                >
                  <span className={styles.navLabel}>
                    {currentNav[item.id] || item.label}
                  </span>
                  {isActive && <span className={styles.activePill} />}
                </button>
              )
            })}
          </nav>
        )}

        {/* Right: Language switch + Hamburger Toggle */}
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
            className={`${styles.menuBtn} ${menuOpen ? styles.menuBtnActive : ''}`}
            onClick={toggleMenu}
            aria-label="Toggle navigation menu"
          >
            <span className={styles.menuLine} />
            <span className={styles.menuLine} />
          </button>
        </div>
      </header>

      {/* Fullscreen Mobile / Drawer Overlay Menu */}
      <div ref={menuRef} className={styles.mobileMenuOverlay} style={{ clipPath: 'inset(0% 0% 100% 0%)' }}>
        <div className={styles.menuInner}>
          <div className={styles.menuTopMeta}>
            <span className={styles.menuTitle}>// DIGITAL ARCHIVE ARCHITECTURE //</span>
            <span className={styles.menuStatus}>FREQUENCY: CONNECTED</span>
          </div>

          <ul className={styles.mobileNavList}>
            {NAV_ITEMS.map((item, i) => {
              const isActive = currentSection === item.id
              return (
                <li key={item.id} ref={(el) => (navItemsRef.current[i] = el)}>
                  <button
                    onClick={() => scrollToSection(item.id)}
                    className={`${styles.mobileNavItem} ${isActive ? styles.mobileNavItemActive : ''}`}
                  >
                    <span className={styles.mobileNum}>0{i + 1}</span>
                    <span className={styles.mobileLabel}>
                      {currentNav[item.id] || item.label}
                    </span>
                    <span className={styles.mobileArrow}>→</span>
                  </button>
                </li>
              )
            })}
          </ul>

          <div className={styles.menuFooter}>
            <div className={styles.menuLangGroup}>
              <span className={styles.menuLangLabel}>LANGUAGE:</span>
              <button
                onClick={() => setLanguage('RU')}
                className={`${styles.menuLangBtn} ${language === 'RU' ? styles.menuLangBtnActive : ''}`}
              >
                RUSSIAN
              </button>
              <button
                onClick={() => setLanguage('EN')}
                className={`${styles.menuLangBtn} ${language === 'EN' ? styles.menuLangBtnActive : ''}`}
              >
                ENGLISH
              </button>
            </div>
            <div className={styles.menuCoord}>
              <span>SILICIUM AUDIO RESIDUALS // 2022 — 2026</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
