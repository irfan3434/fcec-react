import { useTranslation } from 'react-i18next'

import PageHeader from '../components/ui/PageHeader'
import Button from '../components/ui/Button'
import JobOpenings from '../sections/JobOpenings/JobOpenings'
import {
  APPLICATION_URL,
  CAREERS_HIGHLIGHTS,
  CAREERS_IMAGE,
  CAREERS_INTRO,
  CAREERS_OPENINGS,
  CAREERS_OUTRO,
  CAREERS_PAGE_TITLE_KEY,
} from '../content/careers'
import { useInView } from '../hooks/useInView'
import { mediaUrl } from '../lib/media'
import styles from './Careers.module.css'

/**
 * One image-and-list block: "Why FCEC?" and "Your Role in Our Vision".
 *
 * The theme made each picture clickable through jQuery — a click toggled an
 * `.enlarged` class that scaled it to 1.2 in place, pushing it out of its own
 * container. Nothing marked the image as interactive, a keyboard could not
 * reach it, and jQuery 3.6 was pulled off a CDN for that one toggle. The
 * pictures are pictures.
 */
function Highlight({ block }) {
  const { t } = useTranslation()
  const [ref, visible] = useInView()
  const { id, headingKey, image, items, separator, flip } = block

  return (
    <section
      ref={ref}
      id={id}
      className={styles.highlight}
      data-visible={visible}
      data-flip={Boolean(flip)}
      aria-labelledby={`${id}-heading`}
    >
      <h2 id={`${id}-heading`} className={styles.heading}>
        {t(headingKey)}
      </h2>

      <div className={styles.highlightBody}>
        <ul className={styles.points}>
          {items.map(({ termKey, textKey }) => (
            <li key={termKey} className={styles.point}>
              <strong className={styles.term}>{t(termKey)}</strong>
              {separator}
              {t(textKey)}
            </li>
          ))}
        </ul>

        {/* Decorative: both are FCEC-branded renders beside copy that says
            the same thing in words. */}
        <img
          className={styles.highlightImage}
          src={mediaUrl(image)}
          alt=""
          width={CAREERS_IMAGE.width}
          height={CAREERS_IMAGE.height}
          loading="lazy"
          decoding="async"
        />
      </div>
    </section>
  )
}

/** A heading and a paragraph — the page's opening and closing statements. */
function Prose({ headingKey, bodyKey, children }) {
  const { t } = useTranslation()

  return (
    <section className={styles.prose}>
      <h2 className={styles.heading}>{t(headingKey)}</h2>
      <p className={styles.proseBody}>{t(bodyKey)}</p>
      {children}
    </section>
  )
}

/** page.careers.liquid. The application form is not part of this pass. */
export default function Careers() {
  const { t } = useTranslation()

  return (
    <>
      <PageHeader title={t(CAREERS_PAGE_TITLE_KEY)} />

      <div className={`container ${styles.page}`}>
        <JobOpenings />

        <Prose headingKey={CAREERS_INTRO.headingKey} bodyKey={CAREERS_INTRO.bodyKey} />

        {CAREERS_HIGHLIGHTS.map((block) => (
          <Highlight key={block.id} block={block} />
        ))}

        <Prose headingKey={CAREERS_OUTRO.headingKey} bodyKey={CAREERS_OUTRO.bodyKey}>
          {APPLICATION_URL && (
            <Button className={styles.applyCta} href={APPLICATION_URL}>
              {t(CAREERS_OPENINGS.applyKey)}
            </Button>
          )}
        </Prose>
      </div>
    </>
  )
}
