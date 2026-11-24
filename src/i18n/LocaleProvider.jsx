import { useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { LOCALES, localizePath, parsePath } from './config'
import { LocaleContext } from './LocaleContext'

/**
 * Single source of truth for the active locale: the URL. Everything else —
 * i18next, <html lang>, <html dir> — follows from it, so a plain link is all
 * it takes to switch language and nothing can drift out of sync.
 */
export default function LocaleProvider({ children }) {
  const { pathname } = useLocation()
  const { i18n } = useTranslation()

  const { locale, path } = parsePath(pathname)
  const { dir } = LOCALES[locale]

  useEffect(() => {
    if (i18n.language !== locale) i18n.changeLanguage(locale)
  }, [i18n, locale])

  useEffect(() => {
    const root = document.documentElement
    root.lang = locale
    root.dir = dir
  }, [locale, dir])

  const value = useMemo(
    () => ({
      locale,
      dir,
      isRTL: dir === 'rtl',
      /** Build an href in the current locale. */
      href: (to) => localizePath(to, locale),
      /** The current page's href in another locale. */
      hrefFor: (target) => localizePath(path, target),
      locales: LOCALES,
    }),
    [locale, dir, path],
  )

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}
