/*
 * The Shopify theme drove this from an admin-managed menu. Six fixed pages
 * don't need that indirection, so the menu lives in code and the labels come
 * from the `nav.*` translation keys.
 */
export const PRIMARY_NAV = [
  { to: '/', key: 'nav.home' },
  { to: '/about', key: 'nav.about' },
  { to: '/careers', key: 'nav.careers' },
  { to: '/services', key: 'nav.services' },
  { to: '/projects', key: 'nav.projects' },
  { to: '/contact', key: 'nav.contact' },
]

/** The desktop header splits the menu around the centred logo. */
export const NAV_SPLIT_INDEX = 3

/*
 * Routes whose first section runs under the header. On these the header starts
 * transparent and turns solid once you scroll past the hero.
 */
export const OVERLAY_ROUTES = ['/']
