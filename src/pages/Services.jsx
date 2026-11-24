import { useTranslation } from 'react-i18next'

import LocaleLink from '../components/LocaleLink'
import PageHeader from '../components/ui/PageHeader'
import { SERVICES, SERVICES_INTRO } from '../content/services'
import { useInView } from '../hooks/useInView'
import { mediaUrl } from '../lib/media'
import styles from './Services.module.css'

/*
 * The card image. These are the same nine the homepage grid uses —
 * `service_icon_1..9` in theme settings, already exported to 400x400.
 *
 * The Services page had its own set, `duty_image_1..10`, which were animated
 * GIFs of the same subjects, and skipped `duty_image_5` so the nine cards ran
 * 1-4 and 6-10. One set of marks for one set of services.
 */
const CARD_IMAGE = { width: 400, height: 400 }

/** page.services.liquid: the nine services, each linking to its own page. */
export default function Services() {
  const { t } = useTranslation()
  const [ref, visible] = useInView()

  return (
    <>
      <PageHeader className={styles.serviceheader} title={t(SERVICES_INTRO.headingKey)} />

      <div className={`container ${styles.page}`}>
        <p className={styles.intro}>{t(SERVICES_INTRO.bodyKey)}</p>

        <ul ref={ref} className={styles.grid} data-visible={visible}>
          {SERVICES.map((service, index) => (
            <li key={service.slug} className={styles.item} style={{ '--i': Math.min(index, 8) }}>
              {/*
                One link per card rather than the theme's two — an image link
                and an "Explore" button floated over the middle of it, both
                going to the same place, with the card itself carrying
                `cursor: pointer` while doing nothing when clicked.
              */}
              <LocaleLink className={styles.card} to={service.to}>
                <span className={styles.frame}>
                  <img
                    className={styles.image}
                    src={mediaUrl(service.image)}
                    alt=""
                    width={CARD_IMAGE.width}
                    height={CARD_IMAGE.height}
                    loading={index < 3 ? 'eager' : 'lazy'}
                    decoding="async"
                  />
                </span>
                <span className={styles.title}>{t(service.labelKey)}</span>
                <span className={styles.explore} aria-hidden="true">
                  {t('services.explore')}
                </span>
              </LocaleLink>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
