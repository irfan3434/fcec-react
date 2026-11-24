/*
 * The Shopify hero was a single autoplaying video in `header.liquid` with one
 * EXPLORE button over it. (`hero-banner.liquid`, a Swiper carousel, was never
 * wired into a template and all of its settings were blank.) That carousel
 * capability is kept here as data: add a second entry and the hero becomes a
 * slider, with Swiper loaded only at that point.
 *
 * Paths resolve against VITE_MEDIA_BASE_URL — see src/lib/media.js.
 * The old source was:
 *   https://cdn.shopify.com/videos/c/o/v/962c0aff8b214aa9933c81325efff20e.mp4
 */
export const HERO_SLIDES = [
  {
    id: 'explore',
    media: {
      type: 'video',
      // Ordered by preference: the browser takes the first type it supports.
      // Only the MP4 exists today (H.264 + AAC, 4.07 MB). Adding a VP9 WebM
      // ahead of it would serve everything but Safari at roughly half the
      // bytes — the ffmpeg command is in the README.
      //
      // One video serves both languages. When an Arabic cut exists, swap any
      // of these strings for `{ en: '...', ar: '...' }` — every media field
      // accepts either form.
      formats: ['hero/fcec-hero.mp4'],
      // Shown before the video paints, and instead of it when the visitor has
      // asked for reduced motion. It is the video's own opening frame — the
      // steel logo on the blue wall — so playback starts with no visual jump.
      poster: 'hero/fcec-hero.jpg',
    },
    // The Shopify button pointed at themedevops.myshopify.com; it is an
    // internal route now.
    cta: { labelKey: 'herobanner_heading_text', to: '/projects' },
  },
]
