import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import LocaleLink from '../components/LocaleLink'
import Button from '../components/ui/Button'
import Lightbox from '../components/ui/Lightbox'
import NotFound from './NotFound'
import { SERVICES, SERVICE_BY_SLUG } from '../content/services'
import { SERVICE_DETAILS } from '../content/serviceDetails'
import { mediaUrl } from '../lib/media'
import styles from './ServiceDetail.module.css'

/** The copy, as paragraphs and lists, in the order the store had it. */
function Prose({ blocks }) {
  return (
    <div className={styles.prose}>
      {blocks.map((block, index) =>
        block.type === 'list' ? (
          // eslint-disable-next-line react/no-array-index-key -- the blocks are a fixed, generated sequence
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
 * One service.
 *
 * The theme had no page for these at all: every card on the site linked out
 * to `/products/<handle>` on the Shopify store, with `target="_blank"` and
 * no `rel`, and the first card went to `themedevops.myshopify.com` — the dev
 * store, which the public cannot open. The copy and the galleries are the
 * store's, re-hosted; see scripts/build-service-details.py.
 */
export default function ServiceDetail() {
  const { t } = useTranslation()
  const { slug } = useParams()
  const [openImage, setOpenImage] = useState(null)

  const service = SERVICE_BY_SLUG[slug]
  const detail = SERVICE_DETAILS[slug]
  if (!service || !detail) return <NotFound />

  const { gallery } = detail
  const name = t(service.labelKey)
  const hero = gallery[0]

  const step = (delta) =>
    setOpenImage((current) =>
      current === null ? null : (current + delta + gallery.length) % gallery.length,
    )

  return (
    <article className={styles.page}>
      <header
        className={styles.hero}
        style={hero ? { '--hero-image': `url('${mediaUrl(hero.src)}')` } : undefined}
      >
        <div className={`container ${styles.heroInner}`}>
          <nav className={styles.breadcrumb} aria-label={t('gallery.breadcrumb')}>
            <LocaleLink to="/">{t('nav.home')}</LocaleLink>
            <span aria-hidden="true">/</span>
            <LocaleLink to="/services">{t('nav.services')}</LocaleLink>
            <span aria-hidden="true">/</span>
            <span className={styles.current}>{name}</span>
          </nav>

          <p className={styles.eyebrow}>{t('services.eyebrow')}</p>
          <h1 className={styles.title}>{name}</h1>
        </div>
      </header>

      <div className={`container ${styles.layout}`}>
        <aside className={styles.sidebar}>
          {/*
            The theme's sidebar card held a generic paragraph about the
            company. The nine services are what a visitor on this page is
            choosing between, so the card is the way across to the others.
          */}
          <nav className={styles.card} aria-labelledby="service-index">
            <h2 id="service-index" className={styles.cardTitle}>
              {t('services.allServices')}
            </h2>
            <ul className={styles.index}>
              {SERVICES.map((entry) => (
                <li key={entry.slug}>
                  <LocaleLink
                    className={styles.indexLink}
                    to={entry.to}
                    aria-current={entry.slug === slug ? 'page' : undefined}
                  >
                    {t(entry.labelKey)}
                  </LocaleLink>
                </li>
              ))}
            </ul>
          </nav>

          <Button className={styles.contact} to="/contact">
            {t('detail.contact')}
          </Button>
        </aside>

        <div className={styles.content}>
          <section aria-labelledby="service-overview">
            <h2 id="service-overview" className={styles.sectionTitle}>
              {t('detail.overview')}
            </h2>
            <Prose blocks={detail.blocks} />
          </section>

          {gallery.length > 0 && (
            <section className={styles.gallerySection} aria-labelledby="service-gallery">
              <h2 id="service-gallery" className={styles.sectionTitle}>
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
