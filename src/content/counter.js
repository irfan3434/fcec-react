/*
 * The figures band.
 *
 * The theme kept the numbers in the markup as `data-target` attributes and
 * the labels in the translation files, so changing a figure meant editing
 * Liquid. They sit together here.
 *
 * The theme also put an 80x80 image above each number (counter_image_1..4),
 * held as Shopify store images rather than theme assets, so they did not come
 * across with the theme files. `icon` is read if present — drop the four into
 * public/counter/ and add the paths — and the band reads fine without them.
 */

export const COUNTER_STATS = [
  { id: 'services', value: 9, labelKey: 'counter_section_text_1' },
  // 30, not the theme's 20.
  { id: 'projects', value: 30, labelKey: 'counter_section_text_2' },
  { id: 'clients', value: 70, labelKey: 'counter_section_text_3' },
  { id: 'firms', value: 12, labelKey: 'counter_section_text_4' },
]

/*
 * Still on Shopify's CDN and not re-hosted yet, so nothing is listed. The
 * section paints its own brand gradient until a file lands here; add the path
 * and the video layers over it.
 *   https://cdn.shopify.com/videos/c/o/v/89d9c61edfe341dca77aad0d8a98b47d.mp4
 */
export const COUNTER_MEDIA = {
  type: 'video',
  formats: [],
  poster: undefined,
}

/** Long enough to read as counting, short enough not to be waited on. */
export const COUNT_DURATION_MS = 1600
