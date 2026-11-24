import { useTranslation } from 'react-i18next'

import LocaleLink from '../../components/LocaleLink'
import { SERVICES, SERVICES_HEADING_KEY } from '../../content/services'
import { useInView } from '../../hooks/useInView'
import { mediaUrl } from '../../lib/media'
import styles from './Services.module.css'

/**
 * All nine services, visible at once.
 *
 * The theme put these in an autoplaying Swiper showing four at a time, which
 * meant five of the nine were always hidden and the visitor had to wait out a
 * 2.5s timer to read the rest. A list people are meant to scan should not
 * move on its own; a grid shows everything and costs no JavaScript.
 */
export default function Services({ items = SERVICES }) {
  const { t } = useTranslation()
  const [ref, visible] = useInView()

  return (
    <section ref={ref} id="services" className={styles.section} data-visible={visible}>
      <div className="container">
        <h2 className={styles.heading}>{t(SERVICES_HEADING_KEY)}</h2>

        <ul className={styles.grid}>
          {items.map((item, index) => (
            // The stagger is capped so the last card is not held back by the
            // eight before it.
            <li key={item.slug} className={styles.item} style={{ '--i': Math.min(index, 7) }}>
              <LocaleLink to={item.to} className={styles.card}>
                <span className={styles.frame}>
                  {/* Decorative: the heading beside it is the link's name. */}
                  <img
                    className={styles.icon}
                    src={mediaUrl(item.image)}
                    alt=""
                    width="400"
                    height="400"
                    loading="lazy"
                    decoding="async"
                  />
                </span>
                <h3 className={styles.title}>{t(item.labelKey)}</h3>
              </LocaleLink>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
