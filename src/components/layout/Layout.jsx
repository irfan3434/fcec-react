import { Outlet, ScrollRestoration } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import LocaleProvider from '../../i18n/LocaleProvider'
import TopBar from './TopBar'
import Header from './Header'
import Footer from './Footer'
import styles from './Layout.module.css'

/** The chrome every page sits inside — the React equivalent of theme.liquid. */
export default function Layout() {
  const { t } = useTranslation()

  return (
    <LocaleProvider>
      <a className={styles.skip} href="#main">
        {t('common.skipToContent')}
      </a>
      <div className={styles.shell}>
        <TopBar />
        <Header />
        <main id="main" className={styles.main}>
          <Outlet />
        </main>
        <Footer />
      </div>
      <ScrollRestoration />
    </LocaleProvider>
  )
}
