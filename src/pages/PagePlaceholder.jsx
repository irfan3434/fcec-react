import { useTranslation } from 'react-i18next'

import styles from './PagePlaceholder.module.css'

/**
 * Stand-in for a page we haven't ported yet. Each one gets replaced wholesale
 * as we work through the theme section by section.
 */
export default function PagePlaceholder({ titleKey }) {
  const { t } = useTranslation()

  return (
    <div className={`container ${styles.page}`}>
      <h1 className={styles.title}>{t(titleKey)}</h1>
      <p className={styles.note}>{t('common.comingSoon')}</p>
    </div>
  )
}
