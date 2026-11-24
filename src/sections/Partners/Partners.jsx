import { useTranslation } from 'react-i18next'

import LogoWall from '../../components/LogoWall/LogoWall'
import { FLAG_HEIGHT, PARTNERS, PARTNERS_HEADING_KEY } from '../../content/partners'
import { mediaUrl } from '../../lib/media'
import styles from './Partners.module.css'

/**
 * The international partners wall.
 *
 * The flags are kept, but not as the theme had them: they were absolutely
 * positioned 40x25 thumbnails pinned to each card's top-right corner, which
 * put them on the wrong side in Arabic and gave a screen reader nothing but
 * "Int Partner Flag 7". Here the flag sits inline with the country name, so
 * the pair reads as one caption, flows correctly in both directions, and the
 * flag can be decorative — the name beside it already says the country.
 *
 * The theme's own IntersectionObserver rewrote `data-src` to `src` on scroll,
 * which meant no logo at all if the script failed. LogoWall leaves the
 * browser's own `loading="lazy"` to it.
 */
export default function Partners({ items = PARTNERS }) {
  const { t } = useTranslation()

  const withFlags = items.map((item) => ({
    ...item,
    caption: (
      <p className={styles.country}>
        {/* Decorative: the country is named right beside it. */}
        <img
          className={styles.flag}
          src={mediaUrl(item.country.flag)}
          alt=""
          width={item.country.flagWidth}
          height={FLAG_HEIGHT}
          loading="lazy"
          decoding="async"
        />
        {t(item.country.labelKey)}
      </p>
    ),
  }))

  return (
    <section className={styles.section}>
      <div className="container">
        <LogoWall heading={t(PARTNERS_HEADING_KEY)} items={withFlags} maxCols={5} />
      </div>
    </section>
  )
}
