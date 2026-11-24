import { useEffect, useRef, useState } from 'react'

/*
 * The theme used AOS — a scroll-animation library pulled in wholesale and
 * re-initialised inside every section that wanted a fade. This replaces it.
 * One observer per section, no dependency, and the section decides what the
 * reveal looks like in its own CSS.
 *
 * `threshold` is 0 on purpose. A fraction is a share of the observed
 * element, so on a tall one it is a trap: the Projects grid is thirty cards
 * and runs to several screens, and at the old 0.2 the reveal waited for a
 * fifth of all of it — about two screens — to be showing. The page opened
 * blank and stayed blank until you scrolled well past the fold. The
 * negative bottom `rootMargin` is what holds the trigger back now, and it
 * measures the viewport rather than the element, so it behaves the same
 * whether the section is one screen tall or ten.
 */
export function useInView({ threshold = 0, rootMargin = '0px 0px -10% 0px', once = true } = {}) {
  const ref = useRef(null)
  // Anything without IntersectionObserver starts visible rather than blank.
  const [inView, setInView] = useState(() => typeof IntersectionObserver === 'undefined')

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          if (once) observer.disconnect()
        } else if (!once) {
          setInView(false)
        }
      },
      { threshold, rootMargin },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, rootMargin, once])

  return [ref, inView]
}
