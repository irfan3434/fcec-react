import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { ABOUT_BLOCKS, ABOUT_IMAGE } from '../../content/about'
import { useInView } from '../../hooks/useInView'
import { mediaUrl } from '../../lib/media'
import styles from './AboutStory.module.css'

/**
 * One alternating text-and-image block.
 *
 * The theme's "Read More" never worked. Its script looked for a `.more-text`
 * span inside the paragraph, and no such span was ever in the markup — so on
 * load it threw on `moreText.style`, and the click handler threw again after
 * `preventDefault()` had already run. On a phone you saw the link, the whole
 * wall of copy below it, and nothing happened when you tapped. It is a real
 * control now: a <button> with `aria-expanded`, clamping the copy behind a
 * fade. The clamp itself is CSS, so only narrow screens collapse anything.
 */
function Block({ block, eager }) {
  const { t } = useTranslation()
  const [ref, visible] = useInView()
  const [expanded, setExpanded] = useState(false)
  const { id, headingKey, bodyKeys, image, flip } = block
  const copyId = `${id}-copy`

  return (
    <article
      ref={ref}
      id={id}
      className={styles.block}
      data-visible={visible}
      data-flip={Boolean(flip)}
      aria-labelledby={`${id}-heading`}
    >
      <div className={styles.text}>
        <h2 id={`${id}-heading`} className={styles.heading}>
          {t(headingKey)}
        </h2>

        <div id={copyId} className={styles.copy} data-expanded={expanded}>
          {bodyKeys.map((key) => (
            <p key={key}>{t(key)}</p>
          ))}
        </div>

        <button
          type="button"
          className={styles.toggle}
          aria-expanded={expanded}
          aria-controls={copyId}
          onClick={() => setExpanded((open) => !open)}
        >
          {t(expanded ? 'about.readLess' : 'about.readMore')}
        </button>
      </div>

      <div className={styles.media}>
        {/*
          Decorative. Neither picture carries information the heading beside
          it does not already give, so an alt string would only repeat it.
          The theme's `alt="CEO Image"` named the file, not the picture.
        */}
        <img
          className={styles.image}
          src={mediaUrl(image)}
          alt=""
          width={ABOUT_IMAGE.width}
          height={ABOUT_IMAGE.height}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
        />
      </div>
    </article>
  )
}

/** The body of the About page: the CEO's message, then the company's story. */
export default function AboutStory({ blocks = ABOUT_BLOCKS }) {
  return (
    <div className={`container ${styles.blocks}`}>
      {blocks.map((block, index) => (
        <Block key={block.id} block={block} eager={index === 0} />
      ))}
    </div>
  )
}
