import { useInView } from '../../hooks/useInView'
import { mediaUrl } from '../../lib/media'
import styles from './LogoWall.module.css'

/**
 * The canvas every logo is exported onto by scripts/normalize-logos.py. One
 * size for all of them is the point: the markup can state intrinsic
 * dimensions without a per-logo lookup, and nothing reflows as they load.
 */
const LOGO_CANVAS = { width: 480, height: 240 }

/**
 * A headed wall of partner or client logos.
 *
 * Three sections in the theme were near-copies of each other — international
 * partners, local partners and clients — each with its own grid, its own card
 * and its own set of bugs. They share this.
 *
 * `maxCols` is 4 or 5: the wall is always two up on a phone and three on a
 * small tablet, and this caps how far it opens out on a wide screen.
 */
export default function LogoWall({ heading, items, maxCols = 5 }) {
  const [ref, visible] = useInView()

  if (!items.length) return null

  return (
    <div ref={ref} className={styles.block} data-visible={visible}>
      {heading ? <h2 className={styles.heading}>{heading}</h2> : null}

      <ul className={styles.wall} data-max-cols={maxCols}>
        {items.map((item, index) => (
          // Capped, so the tail of a long wall is not still waiting to appear
          // well after the top of it has settled.
          <li key={item.slug} className={styles.item} style={{ '--i': Math.min(index, 11) }}>
            <img
              className={styles.logo}
              src={mediaUrl(item.image)}
              alt={item.name}
              width={LOGO_CANVAS.width}
              height={LOGO_CANVAS.height}
              loading="lazy"
              decoding="async"
            />
            {item.caption ?? null}
          </li>
        ))}
      </ul>
    </div>
  )
}
