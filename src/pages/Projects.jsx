import { useTranslation } from 'react-i18next'

import LocaleLink from '../components/LocaleLink'
import PageHeader from '../components/ui/PageHeader'
import { PROJECTS_INTRO } from '../content/projects'
import { PROJECT_DETAILS, PROJECT_ORDER } from '../content/projectDetails'
import { useInView } from '../hooks/useInView'
import { mediaUrl } from '../lib/media'
import styles from './Projects.module.css'

/**
 * The projects index.
 *
 * The theme wrote all thirty cards out by hand, each one a copied block with
 * the handle and two translation keys swapped — and those keys were never
 * added to the locale files, so every title and every client name on the
 * page rendered as an empty string. They come from the store here; see
 * scripts/build-project-details.py.
 */
export default function Projects() {
  const { t } = useTranslation()
  const [ref, visible] = useInView()

  return (
    <>
      <PageHeader title={t(PROJECTS_INTRO.headingKey)} />

      <div className={`container ${styles.page}`}>
        <div className={styles.intro}>
          <p className={styles.introBody}>{t(PROJECTS_INTRO.bodyKey)}</p>
          <p className={styles.count}>{t('projects.count', { total: PROJECT_ORDER.length })}</p>
        </div>

        <ul ref={ref} className={styles.grid} data-visible={visible}>
          {PROJECT_ORDER.map((slug, index) => {
            const project = PROJECT_DETAILS[slug]
            const title = t(`projects.${slug}.title`, { defaultValue: project.title })
            const client = t(`projects.${slug}.client`, { defaultValue: project.client ?? '' })

            return (
              <li key={slug} className={styles.item} style={{ '--i': Math.min(index, 8) }}>
                <LocaleLink className={styles.card} to={`/projects/${slug}`}>
                  <span className={styles.media}>
                    <img
                      className={styles.image}
                      src={mediaUrl(project.card.src)}
                      alt=""
                      width={project.card.width}
                      height={project.card.height}
                      loading={index < 3 ? 'eager' : 'lazy'}
                      decoding="async"
                    />
                    {/*
                      The theme drew this with a CSS counter, then needed a
                      second copy of the whole badge rule under
                      `html[lang="ar"]` to move it to the other corner — and
                      that copy set `max-width` where the original set
                      `min-width`, so a two-digit number was squeezed in
                      Arabic. One rule, placed logically, and the number is
                      just a string.
                    */}
                    <span className={styles.number} aria-hidden="true">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    {client && (
                      <span className={styles.client}>
                        <span className={styles.clientLabel}>{t('projects.clientLabel')}</span>
                        <span className={styles.clientName}>{client}</span>
                      </span>
                    )}
                  </span>

                  <span className={styles.body}>
                    <span className={styles.title}>{title}</span>
                    <span className={styles.cta} aria-hidden="true">
                      {t('projects.viewProject')}
                    </span>
                  </span>
                </LocaleLink>
              </li>
            )
          })}
        </ul>
      </div>
    </>
  )
}
