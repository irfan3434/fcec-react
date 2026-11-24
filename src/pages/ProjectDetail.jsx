import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import LocaleLink from '../components/LocaleLink'
import Button from '../components/ui/Button'
import Lightbox from '../components/ui/Lightbox'
import NotFound from './NotFound'
import { PROJECT_DETAILS } from '../content/projectDetails'
import { translateFact } from '../content/projectFacts'
import { overviewBlocks } from '../content/projectOverviews'
import { useLocale } from '../i18n/LocaleContext'
import { mediaUrl } from '../lib/media'
import styles from './ProjectDetail.module.css'

/** The copy, as paragraphs and lists, in the order the store had it. */
function Prose({ blocks }) {
  return (
    <div className={styles.prose}>
      {blocks.map((block, index) =>
        block.type === 'list' ? (
          // eslint-disable-next-line react/no-array-index-key -- a fixed, generated sequence
          <ul key={index} className={styles.list}>
            {block.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ) : (
          <p key={index}>{block.text}</p>
        ),
      )}
    </div>
  )
}

/**
 * One project.
 *
 * The theme's version read the facts out of the product description with
 * string surgery — split on `<table`, take what is before `</table>`, and
 * drop the rest into the page as raw HTML. Then its stylesheet spent two
 * dozen `!important` declarations undoing the inline styles the rich-text
 * editor had left on those cells. The table is parsed into label and value
 * pairs at build time instead, so it arrives as data and renders as the
 * description list it always was.
 */
export default function ProjectDetail() {
  const { t } = useTranslation()
  const { locale } = useLocale()
  const { slug } = useParams()
  const [openImage, setOpenImage] = useState(null)

  const project = PROJECT_DETAILS[slug]
  if (!project) return <NotFound />

  const { gallery, facts, card, blocks } = project
  const title = t(`projects.${slug}.title`, { defaultValue: project.title })
  const client = t(`projects.${slug}.client`, { defaultValue: project.client ?? '' })
  const overview = overviewBlocks(slug, blocks, locale)

  const step = (delta) =>
    setOpenImage((current) =>
      current === null ? null : (current + delta + gallery.length) % gallery.length,
    )

  return (
    <article className={styles.page}>
      <header
        className={styles.hero}
        style={{ '--hero-image': `url('${mediaUrl(card.src)}')` }}
      >
        <div className={`container ${styles.heroInner}`}>
          <nav className={styles.breadcrumb} aria-label={t('gallery.breadcrumb')}>
            <LocaleLink to="/">{t('nav.home')}</LocaleLink>
            <span aria-hidden="true">/</span>
            <LocaleLink to="/projects">{t('nav.projects')}</LocaleLink>
            <span aria-hidden="true">/</span>
            <span className={styles.current}>{title}</span>
          </nav>

          <p className={styles.eyebrow}>{project.type ?? t('projects.eyebrow')}</p>
          <h1 className={styles.title}>{title}</h1>
        </div>
      </header>

      <div className={`container ${styles.layout}`}>
        <aside className={styles.sidebar}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>{t('projects.facts')}</h2>

            {facts.length > 0 ? (
              <dl className={styles.facts}>
                {facts.map((fact) => {
                  const row = translateFact(fact, locale)
                  // The Client row holds the same name the index card shows,
                  // so it reads from the one translation rather than a second.
                  const isClient = fact.label.toLowerCase().startsWith('client')

                  return (
                    <div key={fact.label} className={styles.fact}>
                      <dt className={styles.factLabel}>{row.label}</dt>
                      <dd className={styles.factValue}>{isClient ? client : row.value}</dd>
                    </div>
                  )
                })}
              </dl>
            ) : (
              <p className={styles.noFacts}>{t('projects.noFacts')}</p>
            )}

            <div className={styles.actions}>
              <Button to="/contact">{t('detail.contact')}</Button>
              <LocaleLink className={styles.back} to="/projects">
                {t('projects.allProjects')}
              </LocaleLink>
            </div>
          </div>
        </aside>

        <div className={styles.content}>
          {overview.length > 0 && (
            <section aria-labelledby="project-overview">
              <h2 id="project-overview" className={styles.sectionTitle}>
                {t('detail.overview')}
              </h2>
              <Prose blocks={overview} />
            </section>
          )}

          {gallery.length > 0 && (
            <section className={styles.gallerySection} aria-labelledby="project-gallery">
              <h2 id="project-gallery" className={styles.sectionTitle}>
                {t('detail.gallery')}
              </h2>

              <ul className={styles.gallery} data-single={gallery.length === 1}>
                {gallery.map((image, index) => (
                  <li key={image.src}>
                    <button
                      type="button"
                      className={styles.thumb}
                      onClick={() => setOpenImage(index)}
                      aria-label={t('gallery.open', { index: index + 1, total: gallery.length })}
                    >
                      <img
                        src={mediaUrl(image.src)}
                        alt=""
                        width={image.width}
                        height={image.height}
                        loading="lazy"
                        decoding="async"
                      />
                      <span className={styles.zoom} aria-hidden="true">
                        <i className="fa-solid fa-magnifying-glass-plus" />
                      </span>
                    </button>
                  </li>
                ))}
              </ul>

              <Lightbox
                images={gallery}
                index={openImage}
                label={t('detail.gallery')}
                onClose={() => setOpenImage(null)}
                onStep={step}
              />
            </section>
          )}
        </div>
      </div>
    </article>
  )
}
