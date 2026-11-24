import { useEffect, useId, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import LocaleLink from '../LocaleLink'
import NavGroup from './NavGroup'
import { NAV_SPLIT_INDEX, OVERLAY_ROUTES, PRIMARY_NAV } from '../../content/navigation'
import { useScrolled } from '../../hooks/useScrolled'
import { parsePath } from '../../i18n/config'
import logo from '../../assets/brand/fcec-logo.png'
import styles from './Header.module.css'

export default function Header() {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const scrolled = useScrolled()
  const headerRef = useRef(null)
  const overlay = OVERLAY_ROUTES.includes(parsePath(pathname).path)
  const [open, setOpen] = useState(false)
  const drawerId = useId()
  const drawerRef = useRef(null)
  const toggleRef = useRef(null)
  const wasOpen = useRef(false)

  // Hold the page still behind the drawer, and restore whatever was there.
  useEffect(() => {
    if (!open) return undefined
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = overflow
    }
  }, [open])

  // Publish the resting height so an overlaid hero knows how far to pull up.
  // Only measured while un-condensed: the scrolled height is the wrong number.
  useEffect(() => {
    const el = headerRef.current
    if (!el || scrolled) return undefined
    const write = () =>
      document.documentElement.style.setProperty('--header-h', `${el.offsetHeight}px`)
    write()
    const observer = new ResizeObserver(write)
    observer.observe(el)
    return () => observer.disconnect()
  }, [scrolled])

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  // Send the keyboard into the panel on open, and hand it back to the toggle on
  // close so tabbing resumes where the visitor left off. Closing is guarded on
  // the open -> closed transition: the browser's focus fixup for `inert` runs
  // after this effect, so activeElement alone can't tell us what happened, and
  // acting on first mount would steal focus on page load.
  useEffect(() => {
    const drawer = drawerRef.current
    if (open) {
      drawer?.querySelector('a')?.focus()
    } else if (wasOpen.current) {
      const active = document.activeElement
      const stranded = !active || active === document.body || drawer?.contains(active)
      if (stranded) toggleRef.current?.focus()
    }
    wasOpen.current = open
  }, [open])

  return (
    <header
      ref={headerRef}
      className={styles.header}
      data-scrolled={scrolled}
      data-overlay={overlay}
    >
      <div className={`container ${styles.inner}`}>
        <NavGroup items={PRIMARY_NAV.slice(0, NAV_SPLIT_INDEX)} label={t('nav.primary')} />

        <LocaleLink to="/" className={styles.brand} aria-label="FCEC">
          <img src={logo} alt="" width="160" height="160" />
        </LocaleLink>

        <NavGroup items={PRIMARY_NAV.slice(NAV_SPLIT_INDEX)} align="end" label={t('nav.primary')} />

        <button
          type="button"
          ref={toggleRef}
          className={styles.toggle}
          aria-expanded={open}
          aria-controls={drawerId}
          aria-label={open ? t('nav.closeMenu') : t('nav.openMenu')}
          onClick={() => setOpen((v) => !v)}
        >
          <span className={styles.bars} data-open={open} aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </button>
      </div>

      <div
        className={styles.scrim}
        data-open={open}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* Closing on the click that navigates beats reacting to the route change
          afterwards: no extra render, and it still fires when the visitor taps
          the page they are already on. */}
      <div
        id={drawerId}
        ref={drawerRef}
        className={styles.drawer}
        data-open={open}
        inert={!open || undefined}
      >
        <nav aria-label={t('nav.primary')} onClick={() => setOpen(false)}>
          <ul className={styles.drawerList}>
            {PRIMARY_NAV.map(({ to, key }, i) => (
              <li key={to} style={{ '--i': i }}>
                <LocaleLink
                  to={to}
                  className={({ isActive }) =>
                    isActive ? `${styles.drawerLink} ${styles.drawerActive}` : styles.drawerLink
                  }
                >
                  {t(key)}
                </LocaleLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
