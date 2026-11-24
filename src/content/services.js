/*
 * The nine services, in the order the theme listed them.
 *
 * `slug` is the old Shopify product handle, so `/services/<slug>` matches the
 * `/products/<slug>` URL the site has been publishing for years, give or take
 * the segment — worth a redirect rule when this goes live.
 *
 * The theme linked each card to `/products/<slug>` with `target="_blank"`,
 * and the first card on both the homepage and the Services page pointed at
 * `themedevops.myshopify.com`, the dev store, which the public cannot reach.
 * Those pages die with the store; these are our own.
 *
 * Images were 1024x1024 JPEGs totalling 1.24 MB, displayed at ~130px. They
 * are 400x400 now, 295 KB for all nine. The originals are kept outside the
 * deploy in media-src/services/.
 */
const service = (slug, labelKey) => ({
  slug,
  labelKey,
  image: `services/${slug}.jpg`,
  to: `/services/${slug}`,
})

export const SERVICES = [
  service('hydrological-studies-and-flood-risk-assessment', 'services_section_heading_1'),
  service('urban-planning', 'services_section_heading_2'),
  service('reengineering-and-digital-transformation', 'services_section_heading_3'),
  service('smart-cities-services', 'services_section_heading_4'),
  service('engineering-consultations', 'services_section_heading_5'),
  service('engineering-services-to-the-public-in-all-cities', 'services_section_heading_6'),
  service('project-management', 'services_section_heading_7'),
  service('gis-and-its-applications', 'services_section_heading_8'),
  service('geomatics-and-surveying', 'services_section_heading_9'),
]

export const SERVICES_HEADING_KEY = 'services_section_major_heading'

/*
 * The Services page's own masthead.
 *
 * The theme put this in a blue panel at `width: 80%` with `padding: 1rem
 * 7.8rem`, which on a 1024px screen left about 100px of text column. Its
 * heading was styled by `.duties-title h2`, except that `.duties-title` is
 * the class on the <h2> itself, so that rule wanted an <h2> inside an <h2>
 * and never matched. The heading fell through to `.duties-title { color:
 * #e6ae37 }` and rendered gold on mid-blue, which is a contrast ratio of
 * about 2:1.
 */
export const SERVICES_INTRO = {
  headingKey: 'services_template_heading_1',
  bodyKey: 'services_template_paragraph_1',
}

export const SERVICE_BY_SLUG = Object.fromEntries(
  SERVICES.map((entry) => [entry.slug, entry]),
)
