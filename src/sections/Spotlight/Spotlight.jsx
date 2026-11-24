import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import Button from '../../components/ui/Button'
import {
  FEATURED_PROJECTS,
  SPOTLIGHT_HEADING_KEY,
  SPOTLIGHT_INTERVAL_MS,
} from '../../content/projects'
import { useInView } from '../../hooks/useInView'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { mediaUrl } from '../../lib/media'
import styles from './Spotlight.module.css'

/**
 * The project showcase: one full-bleed project at a time, crossfading on the
 * theme's original 6s cycle.
 *
 * The theme's version ran that cycle with no way to stop it, go back, or skip
 * ahead, which is a WCAG 2.2.2 failure and merely annoying besides. The cycle
 * is kept; it now pauses while the pointer or keyboard focus is inside the
 * stage, stops entirely for `prefers-reduced-motion`, only runs while the
 * section is actually on screen, and has controls.
 *
 * On a phone there is no room for arrows and a pause button over the
 * caption, so the stage does not advance by itself there and the dots are
 * the whole control. Nothing moves on its own, so nothing needs pausing —
 * which is why dropping the chrome does not cost the 2.2.2 compliance.
 */
export default function Spotlight({ items = FEATURED_PROJECTS }) {
  const { t } = useTranslation()
  const reduced = usePrefersReducedMotion()
  const [ref, onScreen] = useInView({ once: false, threshold: 0.35 })
  // Matches the breakpoint that hides the arrows and the pause button.
  const compact = useMediaQuery('(max-width: 767px)')
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [held, setHeld] = useState(false)

  const count = items.length
  const step = useCallback(
    (delta) => setIndex((current) => (current + delta + count) % count),
    [count],
  )

  const running = count > 1 && onScreen && !paused && !held && !reduced && !compact

  useEffect(() => {
    if (!running) return undefined
    const id = setInterval(() => setIndex((current) => (current + 1) % count), SPOTLIGHT_INTERVAL_MS)
    return () => clearInterval(id)
  }, [running, count])

  if (!count) return null

  return (
    <section ref={ref} id="projects" className={styles.section}>
      <div className="container">
        <h2 className={styles.heading}>{t(SPOTLIGHT_HEADING_KEY)}</h2>
      </div>

      <div
        className={styles.stage}
        onMouseEnter={() => setHeld(true)}
        onMouseLeave={() => setHeld(false)}
        onFocusCapture={() => setHeld(true)}
        onBlurCapture={() => setHeld(false)}
        aria-roledescription="carousel"
        aria-label={t(SPOTLIGHT_HEADING_KEY)}
      >
        {/* Silent while it advances on its own; announces once a person drives it. */}
        <div className={styles.track} aria-live={running ? 'off' : 'polite'}>
          {items.map((item, slideIndex) => {
            const active = slideIndex === index

            return (
              <article
                key={item.slug}
                className={styles.slide}
                data-active={active}
                // Keeps the hidden slides' buttons out of the tab order.
                inert={!active}
                aria-roledescription="slide"
                aria-label={`${slideIndex + 1} / ${count}`}
              >
                <img
                  className={styles.image}
                  data-fit={item.fit}
                  src={mediaUrl(item.image)}
                  alt=""
                  loading="lazy"
                  decoding="async"
                />
                <div className={styles.scrim} aria-hidden="true" />

                <div className={`container ${styles.caption}`}>
                  <h3 className={styles.title}>{t(item.titleKey)}</h3>
                  <p className={styles.client}>
                    <span className={styles.clientLabel}>{t('projects.clientLabel')}</span>
                    {t(item.clientKey)}
                  </p>
                  <Button to={item.to} className={styles.viewprojectbutton}>
                    {t('projects.viewProject')}
                  </Button>
                </div>
              </article>
            )
          })}
        </div>

        <div className={styles.controls}>
          <button
            type="button"
            className={styles.arrow}
            onClick={() => step(-1)}
            aria-label={t('projects.previous')}
          >
            <i className="fa-solid fa-chevron-left" aria-hidden="true" />
          </button>

          <div className={styles.dots}>
            {items.map((item, slideIndex) => (
              <button
                key={item.slug}
                type="button"
                className={styles.dot}
                data-active={slideIndex === index}
                aria-current={slideIndex === index}
                aria-label={t(item.titleKey)}
                onClick={() => setIndex(slideIndex)}
              >
                <span />
              </button>
            ))}
          </div>

          <button
            type="button"
            className={styles.arrow}
            onClick={() => step(1)}
            aria-label={t('projects.next')}
          >
            <i className="fa-solid fa-chevron-right" aria-hidden="true" />
          </button>

          <button
            type="button"
            className={styles.toggle}
            onClick={() => setPaused((value) => !value)}
            aria-pressed={paused}
            aria-label={paused ? t('projects.play') : t('projects.pause')}
          >
            <i className={paused ? 'fa-solid fa-play' : 'fa-solid fa-pause'} aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  )
}
