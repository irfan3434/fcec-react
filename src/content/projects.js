/*
 * The three projects in the homepage showcase.
 *
 * The theme kept these in `settings.spotlight_*` as plain strings with no
 * translation keys, so Arabic visitors read English titles. They are
 * dictionary keys here like everything else.
 *
 * All three "Learn More" links pointed at themedevops.myshopify.com — the dev
 * store — so none of them worked in production. They point at each project's
 * own page now. The slugs are the Shopify product handles, which is also how
 * the translation keys are named, so the showcase and the Projects pages
 * share one vocabulary.
 *
 * `fit` describes the artwork, because the three pieces are not a matched
 * set: two are wide project visuals that should fill the frame, and the
 * Jeddah one is a logo on white, which `cover` would crop and stretch.
 */
export const FEATURED_PROJECTS = [
  {
    slug: 'wildlife-restoration-complex-concept-master-plan',
    titleKey: 'projects.wildlife-restoration-complex-concept-master-plan.title',
    clientKey: 'projects.wildlife-restoration-complex-concept-master-plan.client',
    image: 'spotlight/wildlife-restoration-complex.webp',
    fit: 'cover',
    to: '/projects/wildlife-restoration-complex-concept-master-plan',
  },
  {
    slug: 'development-of-investment-agency-operations-at-jeddah-municipality',
    titleKey: 'projects.development-of-investment-agency-operations-at-jeddah-municipality.title',
    clientKey: 'projects.development-of-investment-agency-operations-at-jeddah-municipality.client',
    // A 476x303 logo, not a project visual. Contained on its own white
    // ground so it is not cropped or upscaled into the frame.
    image: 'spotlight/jeddah-investment-agency.png',
    fit: 'contain',
    to: '/projects/development-of-investment-agency-operations-at-jeddah-municipality',
  },
  {
    slug: 'assessing-valley-and-reef-orientations-and-identifying-flood-prone-areas',
    titleKey: 'projects.assessing-valley-and-reef-orientations-and-identifying-flood-prone-areas.title',
    clientKey: 'projects.assessing-valley-and-reef-orientations-and-identifying-flood-prone-areas.client',
    image: 'spotlight/valley-and-reef-flood-risk.webp',
    fit: 'cover',
    to: '/projects/assessing-valley-and-reef-orientations-and-identifying-flood-prone-areas',
  },
]

export const SPOTLIGHT_HEADING_KEY = 'spotlight_showcase_section_heading_text'

/** Matches the theme's 6s cycle. */
export const SPOTLIGHT_INTERVAL_MS = 6000

/*
 * The Projects index.
 *
 * `projects_template_heading_1` and `_paragraph_1` are the only two keys the
 * theme's locale files actually carry for this page. The index template
 * referenced about seventy more — `projects_eyebrow`, `projects_card_cta`,
 * `projects_stat_label_line1`, and a `project_<name>_title` and
 * `_client` pair for each of the thirty cards — and not one of them exists
 * in en.default.json or ar.json. Titles and client names come from the store
 * instead; see src/content/projectDetails.js.
 */
export const PROJECTS_INTRO = {
  headingKey: 'projects_template_heading_1',
  bodyKey: 'projects_template_paragraph_1',
}
