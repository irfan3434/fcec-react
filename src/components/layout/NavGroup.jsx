import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import LocaleLink from '../LocaleLink'
import styles from './NavGroup.module.css'

/*
 * A nav group sitting on a surveyor's baseline: a hairline rail spanning the
 * items, with a gold station marker that slides to whichever one is active or
 * hovered.
 *
 * The marker is positioned with a physical `left` offset measured from the
 * rail, deliberately not a logical property — the measurement already accounts
 * for RTL, so converting it would invert it twice.
 */
export default function NavGroup({ items, align = 'start', label }) {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const navRef = useRef(null)
  const [marker, setMarker] = useState(null)

  const moveTo = useCallback((el) => {
    const nav = navRef.current
    if (!nav || !el) return setMarker(null)
    const rail = nav.getBoundingClientRect()
    const item = el.getBoundingClientRect()
    return setMarker({ x: item.left - rail.left, w: item.width })
  }, [])

  const settle = useCallback(() => {
    moveTo(navRef.current?.querySelector('[aria-current="page"]'))
  }, [moveTo])

  // Re-measure whenever the content or its box can have changed: route, font
  // swap, and container resize all shift the item positions.
  useEffect(() => {
    settle()
    document.fonts?.ready.then(settle)
    const nav = navRef.current
    if (!nav) return undefined
    const observer = new ResizeObserver(settle)
    observer.observe(nav)
    return () => observer.disconnect()
  }, [settle, pathname])

  return (
    <nav className={styles.nav} data-align={align} aria-label={label} onMouseLeave={settle}>
      <div ref={navRef} className={styles.rail}>
        <ul className={styles.list}>
          {items.map(({ to, key }) => (
            <li key={to}>
              <LocaleLink
                to={to}
                className={({ isActive }) => (isActive ? `${styles.link} ${styles.active}` : styles.link)}
                onMouseEnter={(e) => moveTo(e.currentTarget)}
                onFocus={(e) => moveTo(e.currentTarget)}
                onBlur={settle}
              >
                {t(key)}
              </LocaleLink>
            </li>
          ))}
        </ul>

        <span
          className={styles.marker}
          data-visible={marker ? 'true' : 'false'}
          style={marker ? { '--marker-x': `${marker.x}px`, '--marker-w': `${marker.w}px` } : undefined}
          aria-hidden="true"
        />
      </div>
    </nav>
  )
}
