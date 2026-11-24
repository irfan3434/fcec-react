/*
 * The Careers page (page.careers.liquid).
 *
 * Openings. The theme kept them in theme settings — `job_1_title`/`job_1_url`
 * through `job_8_title`/`job_8_url` — but the template only ever looped over
 * the first two, so openings 3 to 8 could be filled in and would never appear
 * on the page. Worse, the loop's `else` branch printed a row for every empty
 * slot: with one opening set, the live table reads
 *
 *     1   Marketing expert   Apply Now
 *     2   Not available
 *
 * — a table row advertising a vacancy that does not exist. Only openings that
 * exist are listed here, and the empty state is a panel rather than a header
 * row standing over an empty table.
 *
 * Left empty for now, as agreed: the page says there is nothing open. Shopify
 * currently has one — "Marketing expert", pointing at
 * https://www.fcec.sa/pages/apply-now-1/ — which is the Shopify application
 * form and will not survive the migration. Add entries in this shape:
 *
 *   { id: 'marketing-expert', title: 'Marketing expert', url: '/careers/marketing-expert' }
 *
 * `title` is a plain string rather than a translation key: a job title is
 * written when the role opens, not shipped with the theme. Give it
 * `{ en, ar }` if a posting needs both languages.
 */
export const JOB_OPENINGS = []

/*
 * Where "Apply Now" points. The theme's own CTA was commented out in the
 * markup, so `careers_template_paragraph_2` — "Click the following link and
 * find where your expertise meets our needs" — has been pointing at nothing
 * on the live site. Set this once the application form exists and the button
 * comes back on its own.
 */
export const APPLICATION_URL = null

export const CAREERS_PAGE_TITLE_KEY = 'careers_template_heading_1'

export const CAREERS_OPENINGS = {
  headingKey: 'careers_list_part_17',
  applyKey: 'careers_template_heading_6',
}

/** "Our Mission in Your Career" — the page's opening statement. */
export const CAREERS_INTRO = {
  headingKey: 'careers_template_heading_2',
  bodyKey: 'careers_template_paragraph_1',
}

/*
 * The two image-and-list blocks.
 *
 * `separator` is the punctuation between the bold term and the rest of the
 * item, and it differs between the blocks because the copy does. "Why FCEC?"
 * reads `Innovative Legacy: with over 16 years...`, a term and its gloss.
 * "Your Role" reads `Potential to design and develop smart city solutions.`,
 * one sentence whose first word happens to be bold. Running them through the
 * same separator would break one or the other.
 *
 * Both images came off the Shopify CDN as 2100x2100 PNGs — 2.96 MB and
 * 5.89 MB — displayed at 600px. Re-exported to 1000px WebP, which is 28 kB
 * and 158 kB. Masters are in `media-src/page-careers/`.
 */
export const CAREERS_HIGHLIGHTS = [
  {
    id: 'why-fcec',
    headingKey: 'careers_template_heading_3',
    image: 'page-careers/why-fcec.webp',
    separator: ': ',
    // Image leads at desktop, as it did in the theme. The second block
    // mirrors it, so the two do not stack identically.
    flip: true,
    items: [
      { termKey: 'careers_list_part_1', textKey: 'careers_list_part_2' },
      { termKey: 'careers_list_part_3', textKey: 'careers_list_part_4' },
      { termKey: 'careers_list_part_5', textKey: 'careers_list_part_6' },
      { termKey: 'careers_list_part_7', textKey: 'careers_list_part_8' },
    ],
  },
  {
    id: 'your-role',
    headingKey: 'careers_template_heading_4',
    image: 'page-careers/your-role.webp',
    separator: ' ',
    items: [
      { termKey: 'careers_list_part_9', textKey: 'careers_list_part_10' },
      { termKey: 'careers_list_part_11', textKey: 'careers_list_part_12' },
      { termKey: 'careers_list_part_13', textKey: 'careers_list_part_14' },
      { termKey: 'careers_list_part_15', textKey: 'careers_list_part_16' },
    ],
  },
]

/** Both exports are square. */
export const CAREERS_IMAGE = { width: 1000, height: 1000 }

/** "How to Join Us" — the closing paragraph, and the CTA when there is one. */
export const CAREERS_OUTRO = {
  headingKey: 'careers_template_heading_5',
  bodyKey: 'careers_template_paragraph_2',
}
