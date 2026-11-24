import { useTranslation } from 'react-i18next'

import BackgroundMedia from '../../components/media/BackgroundMedia'
import LocaleLink from '../../components/LocaleLink'
import { useLocale } from '../../i18n/LocaleContext'
import { forLocale, mediaUrl, videoSources } from '../../lib/media'
import styles from './HeroBanner.module.css'

export default function HeroSlide({ slide, priority = false }) {
  const { t } = useTranslation()
  const { locale } = useLocale()
  const { media, cta, headlineKey, subheadlineKey } = slide

  return (
    <div className={styles.slide}>
      <BackgroundMedia
        className={styles.media}
        type={media.type}
        sources={videoSources((media.formats ?? []).map((path) => forLocale(path, locale)))}
        poster={mediaUrl(forLocale(media.poster, locale))}
        priority={priority}
      />
      <div className={styles.scrim} aria-hidden="true" />

      <div className={`container ${styles.content}`}>
        {headlineKey && <h1 className={styles.headline}>{t(headlineKey)}</h1>}
        {subheadlineKey && <p className={styles.subheadline}>{t(subheadlineKey)}</p>}
        {cta && (
          <LocaleLink to={cta.to} className={styles.cta}>
            {t(cta.labelKey)}
          </LocaleLink>
        )}
      </div>
    </div>
  )
}
