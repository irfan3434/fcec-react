import { useTranslation } from 'react-i18next'

import BackgroundMedia from '../../components/media/BackgroundMedia'
import Button from '../../components/ui/Button'
import { ABOUT_INTRO } from '../../content/about'
import { useInView } from '../../hooks/useInView'
import { useLocale } from '../../i18n/LocaleContext'
import { forLocale, mediaUrl, videoSources } from '../../lib/media'
import styles from './AboutUs.module.css'

/**
 * The homepage introduction: a short statement of who FCEC is, and the loop
 * that ran beside it on Shopify. `data-visible` drives the one entrance the
 * section has — see the stylesheet.
 */
export default function AboutUs({ content = ABOUT_INTRO }) {
  const { t } = useTranslation()
  const { locale } = useLocale()
  const [ref, visible] = useInView()
  const { headingKey, bodyKeys, cta, media } = content

  return (
    <section ref={ref} id="about-intro" className={styles.section} data-visible={visible}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.text}>
          <h2 className={styles.heading} style={{ '--i': 0 }}>
            {t(headingKey)}
          </h2>

          {bodyKeys.map((key, index) => (
            <p key={key} className={styles.body} style={{ '--i': index + 1 }}>
              {t(key)}
            </p>
          ))}

          {cta && (
            <div className={styles.actions} style={{ '--i': bodyKeys.length + 1 }}>
              <Button to={cta.to} className={styles.aboutButton}>
                {t(cta.labelKey)}
              </Button>
            </div>
          )}
        </div>

        <div className={styles.media}>
          <BackgroundMedia
            className={styles.plate}
            type={media.type}
            sources={videoSources((media.formats ?? []).map((path) => forLocale(path, locale)))}
            poster={mediaUrl(forLocale(media.poster, locale))}
          />
        </div>
      </div>
    </section>
  )
}
