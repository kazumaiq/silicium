// SILICIUM — Custom Cursor Component
import { useEffect, useRef } from 'react'
import { useStore } from '../data/store'
import styles from './CustomCursor.module.css'

export default function CustomCursor() {
  const cursorRef = useRef(null)
  const cursorDotRef = useRef(null)
  const cursorType = useStore((s) => s.cursorType)
  
  useEffect(() => {
    // Don't show on touch devices
    if ('ontouchstart' in window) return
    
    const cursor = cursorRef.current
    const dot = cursorDotRef.current
    if (!cursor || !dot) return
    
    let mouseX = 0, mouseY = 0
    let cursorX = 0, cursorY = 0
    let dotX = 0, dotY = 0
    
    const onMouseMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }
    
    const animate = () => {
      // Smooth follow for outer cursor
      cursorX += (mouseX - cursorX) * 0.12
      cursorY += (mouseY - cursorY) * 0.12
      cursor.style.transform = `translate(${cursorX - 20}px, ${cursorY - 20}px)`
      
      // Faster follow for dot
      dotX += (mouseX - dotX) * 0.25
      dotY += (mouseY - dotY) * 0.25
      dot.style.transform = `translate(${dotX - 3}px, ${dotY - 3}px)`
      
      requestAnimationFrame(animate)
    }
    
    window.addEventListener('mousemove', onMouseMove)
    const raf = requestAnimationFrame(animate)
    
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      cancelAnimationFrame(raf)
    }
  }, [])
  
  // Don't render on touch devices
  if (typeof window !== 'undefined' && 'ontouchstart' in window) return null
  
  return (
    <>
      <div 
        ref={cursorRef} 
        className={`${styles.cursor} ${styles[cursorType] || ''}`} 
      />
      <div 
        ref={cursorDotRef} 
        className={styles.dot} 
      />
    </>
  )
}
