import { useTranslation } from 'react-i18next'

import BackgroundMedia from '../../components/media/BackgroundMedia'
import { COUNTER_MEDIA, COUNTER_STATS, COUNT_DURATION_MS } from '../../content/counter'
import { useCountUp } from '../../hooks/useCountUp'
import { useInView } from '../../hooks/useInView'
import { mediaUrl, videoSources } from '../../lib/media'
import styles from './Counter.module.css'

/**
 * The figures band.
 *
 * The theme's counter listened to every scroll event on the window, measured
 * the section's bounding box each time, and never removed the listener. One
 * IntersectionObserver does the same job, and the figures start together.
 *
 * Each figure is in the DOM twice: the animating one is hidden from assistive
 * technology, which reads the final value instead. A screen reader reaching
 * the band mid-count would otherwise announce whatever the number happened to
 * be at that instant.
 */
function Stat({ stat, active }) {
  const { t } = useTranslation()
  const count = useCountUp(stat.value, { active, duration: COUNT_DURATION_MS })
  // The rule under the figure is the same count in another channel: it draws
  // as the number climbs and stays as a rule once it lands. Scaled from the
  // value rather than timed separately, so the two can never fall out of step.
  const progress = stat.value ? count / stat.value : 1

  return (
    <li className={styles.stat}>
      {stat.icon ? (
        // Decorative: the label underneath names the figure.
        <img
          className={styles.icon}
          src={mediaUrl(stat.icon)}
          alt=""
          width="80"
          height="80"
          loading="lazy"
          decoding="async"
        />
      ) : null}

      <p className={styles.count}>
        <span aria-hidden="true">{count}</span>
        <span className="visually-hidden">{stat.value}</span>
      </p>
      <span className={styles.rule} style={{ '--progress': progress }} aria-hidden="true" />
      <p className={styles.label}>{t(stat.labelKey)}</p>
    </li>
  )
}

export default function Counter({ stats = COUNTER_STATS, media = COUNTER_MEDIA }) {
  const [ref, visible] = useInView({ threshold: 0.3 })

  return (
    <section ref={ref} className={styles.section} data-visible={visible}>
      <BackgroundMedia
        type={media.type}
        sources={videoSources(media.formats)}
        poster={media.poster ? mediaUrl(media.poster) : undefined}
        className={styles.media}
      />
      <div className={styles.scrim} />
      {/* The drifting drawing grid. Decorative, and purely CSS. */}
      <div className={styles.blueprint} />

      <div className="container">
        <ul className={styles.grid}>
          {stats.map((stat) => (
            <Stat key={stat.id} stat={stat} active={visible} />
          ))}
        </ul>
      </div>
    </section>
  )
}
