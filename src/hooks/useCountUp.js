import { useEffect, useState } from 'react'

import { usePrefersReducedMotion } from './usePrefersReducedMotion'

// Fast at the start and easing out, so the figure is legible well before it
// settles rather than crawling the last few digits.
const easeOut = (t) => 1 - (1 - t) ** 3

/**
 * Count from zero to `target` once `active` turns true.
 *
 * The theme's version added 1 every 80ms regardless of the figure, so the
 * four counters finished at four different times — 9 landed in 0.7s and 70
 * took 5.6s, long after anyone had scrolled past. Driving all of them from
 * one duration keeps the band in step.
 *
 * Reduced motion returns the final figure outright, and so does a browser
 * with no rAF: the number is the content, and it is never withheld.
 */
export function useCountUp(target, { active = true, duration = 1600 } = {}) {
  const reduced = usePrefersReducedMotion()
  const canAnimate = !reduced && typeof requestAnimationFrame !== 'undefined'
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!active || !canAnimate) return undefined

    let frame = 0
    let start

    const tick = (now) => {
      start ??= now
      const progress = Math.min((now - start) / duration, 1)
      setValue(Math.round(easeOut(progress) * target))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [active, canAnimate, duration, target])

  return canAnimate ? value : target
}
