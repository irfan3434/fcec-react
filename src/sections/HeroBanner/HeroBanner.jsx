import { Suspense, lazy } from 'react'

import HeroSlide from './HeroSlide'
import { HERO_SLIDES } from '../../content/hero'
import styles from './HeroBanner.module.css'

const HeroCarousel = lazy(() => import('./HeroCarousel'))

/**
 * The homepage hero. One slide renders on its own; two or more pull in the
 * carousel. The header sits over this section, which is why the top of the
 * frame is kept clear of content.
 */
export default function HeroBanner({ slides = HERO_SLIDES }) {
  if (!slides.length) return null

  return (
    <section className={styles.hero}>
      {slides.length === 1 ? (
        <HeroSlide slide={slides[0]} priority />
      ) : (
        <Suspense fallback={<HeroSlide slide={slides[0]} priority />}>
          <HeroCarousel slides={slides} />
        </Suspense>
      )}
    </section>
  )
}
