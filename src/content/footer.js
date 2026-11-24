/*
 * Footer data.
 *
 * The theme had the four branches hard-coded in footer.liquid, each as a
 * `<li>` for the city and a loose `<p>` for the street address — the `<p>`
 * elements were direct children of the `<ul>`, which is invalid, and the
 * markup used three one-off classes (`non-arabic-paragraph`,
 * `-two`, `-three`) that no stylesheet ever defined.
 *
 * The Google Maps URLs are the theme's, trimmed of the tracking and session
 * parameters they had collected (`entry=gps`, `lucs`, `g_ep`, `g_st`, and in
 * one case an `hl=ar` that pinned the map to Arabic for English visitors).
 * Each is now a plain coordinate query, which resolves the same and will not
 * rot.
 */

export const BRANCHES = [
  {
    id: 'riyadh',
    cityKey: 'footer_headings_text_6',
    addressKey: 'footer_headings_text_7',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=24.7736944,46.6195278',
  },
  {
    id: 'jeddah',
    cityKey: 'footer_headings_text_8',
    addressKey: 'footer_headings_text_9',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=21.5095857,39.1766178',
  },
  {
    id: 'dammam',
    cityKey: 'footer_headings_text_10',
    addressKey: 'footer_headings_text_11',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=26.4584981,50.0835534',
  },
  {
    id: 'jizan',
    cityKey: 'footer_headings_text_12',
    addressKey: 'footer_headings_text_13',
    // The only branch the theme linked by name rather than by coordinates, so
    // the query is kept verbatim. Note that the name in it is a contracting
    // firm, not FCEC — worth checking the pin is the right one.
    mapUrl:
      'https://www.google.com/maps/search/?api=1&query=%D9%85%D8%A4%D8%B3%D8%B3%D8%A9+%D8%A5%D9%86%D8%AC%D8%A7%D8%B2%D9%8A+%D8%A7%D9%84%D9%85%D8%AA%D9%83%D8%A7%D9%85%D9%84%D8%A9+%D9%84%D9%84%D9%85%D9%82%D8%A7%D9%88%D9%84%D8%A7%D8%AA+%D8%A7%D9%84%D8%B9%D8%A7%D9%85%D8%A9%D8%8C+4496+%D8%B7%D8%B1%D9%8A%D9%82+%D8%A7%D9%84%D9%85%D9%84%D9%83+%D9%81%D9%8A%D8%B5%D9%84%D8%8C+%D8%AD%D9%8A+%D8%A7%D9%84%D8%B5%D9%81%D8%A7%D8%8C+%D8%AC%D8%A7%D8%B2%D8%A7%D9%86+82721+6386',
  },
]

/*
 * The theme pointed all three at `href="#"`, so they have never gone
 * anywhere. They route to placeholders now, which at least gives the pages
 * somewhere to land when the copy arrives — it only exists in Shopify admin.
 */
export const LEGAL_LINKS = [
  { to: '/terms', key: 'footer_headings_text_15' },
  { to: '/disclaimer', key: 'footer_headings_text_16' },
  { to: '/privacy', key: 'footer_headings_text_17' },
]

export const FOOTER_HEADING_KEYS = {
  quickLinks: 'footer_quicklinks_heading',
  branches: 'footer_headings_text_5',
  contact: 'footer_headings_text_14',
}

/*
 * The theme's quick links were a second, shorter copy of the main menu —
 * Home, Projects, Services, Contact, missing About and Careers. There is no
 * reason for a visitor to find fewer pages here than in the header, so the
 * footer uses PRIMARY_NAV. `footer_headings_text_1..4` are now unused.
 */
