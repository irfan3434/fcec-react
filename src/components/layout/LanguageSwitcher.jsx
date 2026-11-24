import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { useLocale } from '../../i18n/LocaleContext'
import styles from './LanguageSwitcher.module.css'

/**
 * Renders the *other* locale as a plain link to the same page. A real <a>
 * rather than a dropdown: two languages don't warrant a menu, and it keeps the
 * alternate URL crawlable and the whole control one tap wide.
 */
export default function LanguageSwitcher() {
  const { t } = useTranslation()
  const { locale, locales, hrefFor } = useLocale()
  const target = locale === 'en' ? 'ar' : 'en'

  return (
    <Link
      className={styles.switcher}
      to={hrefFor(target)}
      lang={target}
      hrefLang={target}
      title={t('common.switchLanguage')}
    >
      <i className="fa-solid fa-globe" aria-hidden="true" />
      <span>{locales[target].label}</span>
    </Link>
  )
}
