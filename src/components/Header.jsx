// SILICIUM — Header / Navigation Component
import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useStore } from '../data/store'
import { NAV_ITEMS } from '../data/config'
import gsap from 'gsap'
import styles from './Header.module.css'

export default function Header() {
  const location = useLocation()
  const menuOpen = useStore((s) => s.menuOpen)
  const toggleMenu = useStore((s) => s.toggleMenu)
  const setMenuOpen = useStore((s) => s.setMenuOpen)
  const introComplete = useStore((s) => s.introComplete)
  const headerRef = useRef(null)
  const menuRef = useRef(null)
  const navItemsRef = useRef([])

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname, setMenuOpen])

  // Animate header entrance
  useEffect(() => {
    if (introComplete && headerRef.current) {
      gsap.fromTo(headerRef.current,
        { y: -80, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.3 }
      )
    }
  }, [introComplete])

  // Animate menu
  useEffect(() => {
    if (!menuRef.current) return
    
    if (menuOpen) {
      gsap.to(menuRef.current, {
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 0.6,
        ease: 'power3.inOut'
      })
      navItemsRef.current.forEach((item, i) => {
        if (item) {
          gsap.fromTo(item,
            { x: -60, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.5, delay: 0.2 + i * 0.08, ease: 'power3.out' }
          )
        }
      })
    } else {
      gsap.to(menuRef.current, {
        clipPath: 'inset(0% 0% 100% 0%)',
        duration: 0.4,
        ease: 'power3.inOut'
      })
    }
  }, [menuOpen])

  if (!introComplete) return null

  return (
    <>
      <header ref={headerRef} className={styles.header} style={{ opacity: 0 }}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoText}>SILICIUM</span>
          <span className={styles.logoSub}>DIGITAL ARCHIVE</span>
        </Link>

        {/* Desktop Quick Nav Bar */}
        <nav className={styles.desktopNav}>
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className={`${styles.desktopNavLink} ${location.pathname === item.path ? styles.desktopNavActive : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className={styles.headerRight}>
          <div className={styles.status}>
            <span className={styles.statusDot} />
            <span className={styles.statusText}>ONLINE</span>
          </div>
          
          <button
            className={`${styles.menuBtn} ${menuOpen ? styles.menuBtnActive : ''}`}
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span className={styles.menuLine} />
            <span className={styles.menuLine} />
            <span className={styles.menuLine} />
          </button>
        </div>
      </header>

      <nav ref={menuRef} className={styles.menu} style={{ clipPath: 'inset(0% 0% 100% 0%)' }}>
        <div className={styles.menuInner}>
          <div className={styles.menuDecor}>
            <div className={styles.menuDecorLine} />
            <span className={styles.menuDecorText}>// NAVIGATION SYSTEM //</span>
            <div className={styles.menuDecorLine} />
          </div>
          
          <ul className={styles.navList}>
            {NAV_ITEMS.map((item, i) => (
              <li key={item.id} ref={(el) => (navItemsRef.current[i] = el)}>
                <Link
                  to={item.path}
                  className={`${styles.navItem} ${location.pathname === item.path ? styles.navItemActive : ''}`}
                  onClick={() => setMenuOpen(false)}
                >
                  <span className={styles.navLabel}>{item.label}</span>
                  <span className={styles.navArrow}>→</span>
                </Link>
              </li>
            ))}
          </ul>

          <div className={styles.menuFooter}>
            <span>ARCHIVE v1.0</span>
            <span>SIGNAL: ACTIVE</span>
          </div>
        </div>
      </nav>
    </>
  )
}
