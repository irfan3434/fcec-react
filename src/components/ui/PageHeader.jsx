import styles from './PageHeader.module.css'

/**
 * The masthead for an interior page.
 *
 * The theme's page templates had no <h1> at all — About opened on an <h2>
 * reading "Our Portfolio", so the page never announced what it was, to a
 * screen reader or to a search engine. Every ported page gets one of these.
 */
export default function PageHeader({ title, id = 'page-title' }) {
  return (
    <header className={styles.header}>
      <div className="container">
        <h1 id={id} className={styles.title}>
          {title}
        </h1>
      </div>
    </header>
  )
}
