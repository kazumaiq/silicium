// SILICIUM — Official Header with Language Switcher & Precise Mockup Layout
import React, { useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useStore } from '../data/store'
import { NAV_ITEMS } from '../data/config'
import gsap from 'gsap'
import styles from './Header.module.css'

export default function Header() {
  const location = useLocation()
  const { menuOpen, toggleMenu, setMenuOpen, introComplete, language, setLanguage } = useStore()
  const headerRef = useRef(null)
  const menuRef = useRef(null)
  const navItemsRef = useRef([])

  const navLabels = {
    RU: {
      home: 'ГЛАВНАЯ',
      discography: 'РЕЛИЗЫ',
      archive: '3D АРХИВ',
      about: 'О ПРОЕКТЕ',
      community: 'СООБЩЕСТВО',
      platforms: 'ПЛАТФОРМЫ',
    },
    EN: {
      home: 'HOME',
      discography: 'RELEASES',
      archive: '3D ARCHIVE',
      about: 'ABOUT',
      community: 'COMMUNITY',
      platforms: 'PLATFORMS',
    },
  }

  const currentNav = navLabels[language] || navLabels.RU

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname, setMenuOpen])

  // Animate menu
  useEffect(() => {
    if (!menuRef.current) return
    if (menuOpen) {
      gsap.to(menuRef.current, {
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 0.5,
        ease: 'power3.inOut',
      })
      navItemsRef.current.forEach((item, i) => {
        if (item) {
          gsap.fromTo(
            item,
            { x: -40, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.4, delay: 0.15 + i * 0.06, ease: 'power3.out' }
          )
        }
      })
    } else {
      gsap.to(menuRef.current, {
        clipPath: 'inset(0% 0% 100% 0%)',
        duration: 0.35,
        ease: 'power3.inOut',
      })
    }
  }, [menuOpen])

  return (
    <>
      <header ref={headerRef} className={styles.header}>
        {/* Left: Silicium Brand */}
        <Link to="/" className={styles.logo}>
          <span className={styles.logoMain}>SILICIUM</span>
        </Link>

        {/* Center: Clean Gothic Navigation */}
        <nav className={styles.centerNav}>
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className={`${styles.navLink} ${location.pathname === item.path ? styles.navActive : ''}`}
            >
              {currentNav[item.id] || item.label}
            </Link>
          ))}
        </nav>

        {/* Right: Language switch + Menu Button */}
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
            aria-label="Toggle menu"
          >
            <span className={styles.menuLine} />
            <span className={styles.menuLine} />
          </button>
        </div>
      </header>

      {/* Fullscreen Overlay Menu */}
      <nav ref={menuRef} className={styles.menu} style={{ clipPath: 'inset(0% 0% 100% 0%)' }}>
        <div className={styles.menuInner}>
          <div className={styles.menuHeader}>
            <span className={styles.menuTitle}>// DIGITAL ARCHIVE //</span>
            <span className={styles.menuStatus}>SIGNAL: LOCKED</span>
          </div>

          <ul className={styles.navList}>
            {NAV_ITEMS.map((item, i) => (
              <li key={item.id} ref={(el) => (navItemsRef.current[i] = el)}>
                <Link
                  to={item.path}
                  className={`${styles.navMenuItem} ${location.pathname === item.path ? styles.navMenuItemActive : ''}`}
                  onClick={() => setMenuOpen(false)}
                >
                  <span className={styles.menuNum}>0{i + 1}</span>
                  <span className={styles.menuItemLabel}>
                    {currentNav[item.id] || item.label}
                  </span>
                  <span className={styles.menuArrow}>→</span>
                </Link>
              </li>
            ))}
          </ul>

          <div className={styles.menuFooter}>
            <span>SILICIUM © 2022 — 2026</span>
            <a
              href="https://t.me/silliciumphonk"
              target="_blank"
              rel="noreferrer"
              className={styles.menuTelegram}
            >
              TELEGRAM ↗
            </a>
          </div>
        </div>
      </nav>
    </>
  )
}
