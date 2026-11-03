// SILICIUM — High-Performance Scroll Reveal Hook (IntersectionObserver)
import { useEffect, useRef } from 'react'

export function useScrollReveal(options = {}) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const {
      threshold = 0.12,
      rootMargin = '0px 0px -40px 0px',
      once = true,
    } = options

    el.classList.add('scroll-hidden')

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('scroll-revealed')
          el.classList.remove('scroll-hidden')
          if (once) observer.unobserve(el)
        } else if (!once) {
          el.classList.remove('scroll-revealed')
          el.classList.add('scroll-hidden')
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [options.threshold, options.rootMargin, options.once])

  return ref
}

export function useStaggerReveal(options = {}) {
  const refs = useRef([])

  useEffect(() => {
    const {
      threshold = 0.1,
      rootMargin = '0px 0px -30px 0px',
      staggerDelay = 70,
    } = options

    const elements = refs.current.filter(Boolean)
    elements.forEach((el) => el.classList.add('scroll-hidden'))

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = elements.indexOf(entry.target)
            setTimeout(() => {
              entry.target.classList.add('scroll-revealed')
              entry.target.classList.remove('scroll-hidden')
            }, (idx >= 0 ? idx : 0) * staggerDelay)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold, rootMargin }
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [options.threshold, options.rootMargin, options.staggerDelay])

  return refs
}
