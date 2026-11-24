import { useTranslation } from 'react-i18next'

import Button from '../../components/ui/Button'
import { CAREERS_OPENINGS, JOB_OPENINGS } from '../../content/careers'
import { useLocale } from '../../i18n/LocaleContext'
import { forLocale } from '../../lib/media'
import styles from './JobOpenings.module.css'

/**
 * The list of open roles, and what stands in its place when there are none.
 *
 * The theme drew a three-column table whose only row, with nothing open, read
 * "No job opportunities at the moment." across all three cells — column
 * headings standing over an empty table. There is no table until there is
 * something to put in one.
 *
 * Its mobile treatment was broken besides: `td:before { content: attr(data-label) }`
 * stacked the cells and printed each one's label beside it, except that no
 * `data-label` attribute was ever set on any cell. Every row carried an
 * empty absolutely-positioned box instead.
 */
export default function JobOpenings({ openings = JOB_OPENINGS }) {
  const { t } = useTranslation()
  const { locale } = useLocale()
  const { headingKey, applyKey } = CAREERS_OPENINGS

  return (
    <section className={styles.section} aria-labelledby="job-openings">
      <h2 id="job-openings" className={styles.heading}>
        {t(headingKey)}
      </h2>

      {openings.length === 0 ? (
        <div className={styles.empty}>
          <i className={`fa-regular fa-folder-open ${styles.emptyIcon}`} aria-hidden="true" />
          <p className={styles.emptyTitle}>{t('careers.noOpenings')}</p>
          <p className={styles.emptyNote}>{t('careers.noOpeningsNote')}</p>
        </div>
      ) : (
        <ul className={styles.list}>
          {openings.map((job) => {
            const title = forLocale(job.title, locale)
            // Internal postings route; an external one still opens safely.
            const external = /^https?:/.test(job.url)

            return (
              <li key={job.id} className={styles.job}>
                <h3 className={styles.jobTitle}>{title}</h3>
                <Button
                  className={styles.apply}
                  {...(external
                    ? { href: job.url, target: '_blank', rel: 'noreferrer noopener' }
                    : { to: job.url })}
                >
                  {t(applyKey)}
                  {/* Several buttons read "Apply Now"; the title tells them apart. */}
                  <span className="visually-hidden"> {title}</span>
                </Button>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
