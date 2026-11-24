import LocaleLink from '../components/LocaleLink'
import { useTranslation } from 'react-i18next'

import styles from './PagePlaceholder.module.css'

export default function NotFound() {
  const { t } = useTranslation()

  return (
    <div className={`container ${styles.page}`}>
      <h1 className={styles.title}>404</h1>
      <p className={styles.note}>{t('nav.home')}</p>
      <p>
        <LocaleLink to="/">{t('nav.home')}</LocaleLink>
      </p>
    </div>
  )
}
