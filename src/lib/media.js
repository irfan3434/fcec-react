/*
 * Media lives outside the bundle. Content files store bare paths
 * ('hero/fcec-hero.mp4'); this resolves them against VITE_MEDIA_BASE_URL at
 * build time. Leave that unset and paths resolve to the app's own /public
 * folder, which is what a Vercel deploy serves from its CDN. An absolute URL
 * passes through untouched, so a one-off external asset still works.
 */
const BASE = (import.meta.env.VITE_MEDIA_BASE_URL ?? '').replace(/\/+$/, '')

export const mediaUrl = (path) => {
  if (!path) return undefined
  if (/^(https?:)?\/\//.test(path) || path.startsWith('data:')) return path
  return `${BASE}/${path.replace(/^\/+/, '')}`
}

/**
 * Pick the value for a locale. Content fields may be a plain value shared by
 * both languages, or `{ en, ar }` when the asset itself differs — a hero video
 * with burnt-in text, for instance.
 */
export const forLocale = (value, locale, fallback = 'en') => {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value[locale] ?? value[fallback]
  }
  return value
}

const VIDEO_TYPES = {
  webm: 'video/webm',
  mp4: 'video/mp4',
  ogv: 'video/ogg',
}

/**
 * Build the <source> list for a video, in the order the browser should try.
 * Put the smallest modern format first: a browser takes the first type it
 * claims to support, so ordering is the whole mechanism.
 */
export const videoSources = (paths) =>
  paths
    .filter(Boolean)
    .map((path) => {
      const ext = path.split('?')[0].split('.').pop()?.toLowerCase()
      return { src: mediaUrl(path), type: VIDEO_TYPES[ext] ?? 'video/mp4' }
    })
