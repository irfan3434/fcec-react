// One-off migration helper: pulls the `translations` map out of the Shopify
// theme locale files and writes flat dictionaries for react-i18next.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const THEME = process.env.FCEC_THEME ??
  'D:/WEB DEVs/Shopify Themes/Personally Developed Themes/FCEC'

// Shopify prepends a /* ... */ banner to generated locale files, and the
// admin language editor leaves trailing commas behind. Tolerate both.
const parseLocale = (file) => {
  const raw = readFileSync(file, 'utf8')
  const body = raw.slice(raw.indexOf('{')).replace(/,(\s*[}\]])/g, '$1')
  return JSON.parse(body)
}

const sources = { en: 'en.default.json', ar: 'ar.json' }
const outDir = resolve(root, 'src/i18n/locales')
mkdirSync(outDir, { recursive: true })

for (const [lng, file] of Object.entries(sources)) {
  const { translations = {} } = parseLocale(resolve(THEME, 'locales', file))
  const sorted = Object.fromEntries(Object.entries(translations).sort(([a], [b]) => a.localeCompare(b)))
  writeFileSync(resolve(outDir, `${lng}.json`), JSON.stringify(sorted, null, 2) + '\n')
  console.log(`${lng}: ${Object.keys(sorted).length} keys`)
}
