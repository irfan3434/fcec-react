import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import en from './locales/en.json'
import ar from './locales/ar.json'
import enApp from './locales/en.app.json'
import arApp from './locales/ar.app.json'
import { DEFAULT_LOCALE, LOCALE_CODES } from './config'

// Two dictionaries per locale. `*.json` is generated from the Shopify theme by
// `scripts/extract-locales.mjs` and must not be hand-edited — rerunning the
// script overwrites it. `*.app.json` holds keys this app owns (navigation,
// chrome, anything the theme kept in Shopify admin). App keys win on collision.
//
// Strings are bundled rather than fetched: there are only two locales and the
// whole dictionary is a few KB gzipped, so a network round trip buys nothing.
i18n.use(initReactI18next).init({
  resources: {
    en: { translation: { ...en, ...enApp } },
    ar: { translation: { ...ar, ...arApp } },
  },
  lng: DEFAULT_LOCALE,
  fallbackLng: DEFAULT_LOCALE,
  supportedLngs: LOCALE_CODES,
  interpolation: { escapeValue: false },
  returnEmptyString: false,
})

export default i18n
