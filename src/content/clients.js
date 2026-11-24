/*
 * Local partners and clients.
 *
 * One Liquid section held both walls, as 18 theme settings named
 * partner_1_image..partner_8_image and client_1_image..client_10_image.
 *
 * `name` is the organisation's own name and is deliberately not a translation
 * key, the same decision as in content/partners.js: these are brand marks,
 * and the ones that are bilingual are bilingual in the artwork itself.
 */

const logo = (folder) => (slug, name) => ({
  slug,
  name,
  image: `${folder}/${slug}.webp`,
})

const localPartner = logo('local-partners')

export const LOCAL_PARTNERS = [
  localPartner('almesbar', 'Almesbar'),
  localPartner('aviation-business-consultants', 'Aviation Business Consultants'),
  localPartner('dar-al-riyadh', 'Dar Al Riyadh'),
  localPartner('king-saud-university', 'King Saud University'),
  localPartner('opal-business-advisory', 'OPAL Business Advisory'),
  localPartner(
    'king-abdullah-institute',
    'King Abdullah Institute for Research & Consulting Studies, King Saud University',
  ),
  localPartner('wastech', 'Wastech — Smart Environmental Solutions'),
  localPartner('sadeem', 'Sadeem'),
]

const client = logo('valued-clients')

/*
 * Named in English because that is what the alt text needs to be a sentence,
 * and because seven of the ten set their own English name on the mark. The
 * official Arabic names belong here too once they are confirmed; see the
 * README.
 */
export const CLIENTS = [
  // Read from the square Kufic in the emblem — the Najdi tower above it and
  // the inner "الرياض" both point to Riyadh. Worth confirming.
  client('riyadh-region-municipality', 'Riyadh Region Municipality'),
  client('gaca', 'General Authority of Civil Aviation'),
  client('jazan-municipality', 'Jazan Municipality'),
  client('jeddah-municipality', 'Jeddah Municipality'),
  client('madinah-region-municipality', 'Madinah Region Municipality'),
  client('momrah', 'Ministry of Municipal and Rural Affairs and Housing'),
  client('un-habitat', 'UN-Habitat'),
  client('larsen-and-toubro', 'Larsen & Toubro'),
  client('al-balad-development', 'Al Balad Development Company'),
  client('pif', 'Public Investment Fund'),
]

export const LOCAL_PARTNERS_HEADING_KEY = 'strategic_partnership_section_heading_text'
export const CLIENTS_HEADING_KEY = 'valued_client_section_heading_text'
