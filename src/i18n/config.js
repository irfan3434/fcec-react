/*
 * URL scheme mirrors the Shopify site that came before: English lives at the
 * bare path (`/about`), Arabic under a prefix (`/ar/about`). Keeping the old
 * shape means existing inbound links and search results still land correctly.
 */
export const DEFAULT_LOCALE = 'en'

export const LOCALES = {
  en: { code: 'en', dir: 'ltr', label: 'English', short: 'EN', prefix: '' },
  ar: { code: 'ar', dir: 'rtl', label: 'العربية', short: 'AR', prefix: '/ar' },
}

export const LOCALE_CODES = Object.keys(LOCALES)

export const isLocale = (value) => Object.hasOwn(LOCALES, value)

/** Prefix an app-relative path with the locale segment. */
export const localizePath = (path, locale) => {
  const { prefix } = LOCALES[locale] ?? LOCALES[DEFAULT_LOCALE]
  const clean = path === '/' ? '' : path.replace(/\/+$/, '')
  return `${prefix}${clean}` || '/'
}

/** Split a full pathname into its locale and the path beneath it. */
export const parsePath = (pathname) => {
  const [, first = '', ...rest] = pathname.split('/')
  if (isLocale(first) && first !== DEFAULT_LOCALE) {
    return { locale: first, path: `/${rest.join('/')}`.replace(/\/+$/, '') || '/' }
  }
  return { locale: DEFAULT_LOCALE, path: pathname.replace(/\/+$/, '') || '/' }
}
