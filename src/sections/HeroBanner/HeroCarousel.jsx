import { Swiper, SwiperSlide } from 'swiper/react'
import { A11y, Autoplay, EffectFade, Keyboard, Navigation, Pagination } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/effect-fade'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

import HeroSlide from './HeroSlide'
import { useLocale } from '../../i18n/LocaleContext'
import styles from './HeroBanner.module.css'

/*
 * Loaded only when there is more than one slide, so a single-video hero never
 * pays for Swiper. Matches the old theme's setup — fade, 5s autoplay, arrows
 * and clickable dots — plus keyboard support it never had.
 */
export default function HeroCarousel({ slides }) {
  const { dir } = useLocale()

  return (
    <Swiper
      className={styles.carousel}
      modules={[A11y, Autoplay, EffectFade, Keyboard, Navigation, Pagination]}
      // Swiper caches direction at init; the key forces a clean rebuild when
      // the visitor switches language.
      key={dir}
      dir={dir}
      effect="fade"
      fadeEffect={{ crossFade: true }}
      speed={700}
      loop
      autoplay={{ delay: 5000, disableOnInteraction: true, pauseOnMouseEnter: true }}
      navigation
      pagination={{ clickable: true }}
      keyboard={{ enabled: true }}
      a11y={{ enabled: true }}
    >
      {slides.map((slide, i) => (
        <SwiperSlide key={slide.id}>
          <HeroSlide slide={slide} priority={i === 0} />
        </SwiperSlide>
      ))}
    </Swiper>
  )
}
