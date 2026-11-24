/*
 * The Contact page.
 *
 * The theme had no contact template. `page.template.liquid` is a generic
 * shell — page title, the admin-managed `page.content` blob, and a "Join Our
 * Newsletter" heading with `<!-- Add your form here -->` under it, so the
 * live page ends on a heading for a form that has never existed. Everything
 * of substance was typed into the Shopify page body as one rich-text blob
 * with <br><br> between the sections. It is structured data here.
 *
 * Two things in that blob are broken on the live site:
 *
 *   - The "Email Us" link reads `info@futurecityec.com` and points at
 *     `mailto:info@rougeradiance.com` — a different company altogether.
 *     Every visitor who clicks it mails the wrong recipient.
 *   - Both phone links point at `tel:966500399991`, so the first number
 *     displays +966558808533 and dials the other one. Neither carries the
 *     leading `+`, which matters when the caller is abroad.
 *
 * The branches are the same four the footer lists, so they come from
 * src/content/footer.js rather than being written out twice.
 */

export const CONTACT_PAGE_TITLE_KEY = 'footer_headings_text_14'

export const CONTACT_INTRO_KEYS = ['contact.intro1', 'contact.intro2']

/**
 * How to reach us. `icon` is Font Awesome, already loaded for the socials.
 */
export const CONTACT_CHANNELS = [
  {
    id: 'email',
    icon: 'fa-regular fa-envelope',
    titleKey: 'contact.emailTitle',
    noteKey: 'contact.emailNote',
  },
  {
    id: 'phone',
    icon: 'fa-solid fa-phone',
    titleKey: 'contact.callTitle',
    noteKey: 'contact.callNote',
  },
]

export const CONTACT_HEADING_KEYS = {
  branches: 'contact.branchesTitle',
  follow: 'contact.followTitle',
}
