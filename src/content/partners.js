/*
 * International partners.
 *
 * The theme held these as 36 separate theme settings — int_partner_1..18 plus
 * a matching int_partner_flag_1..18 — so adding a partner meant editing both
 * the Liquid and the schema. A list is the whole of it here.
 *
 * `name` is the company's own name and is deliberately not a translation key:
 * brand names are not translated, and all eighteen are set in Latin script on
 * the partner's own marks. The country name is translated.
 */

/*
 * Flags share one height and keep their own width, because they are not all
 * the same shape — the Union Flag file is 1.60:1 and the Stars and Stripes
 * 1.92:1 against 1.50:1 for the rest. Cropping them to a common box would
 * mangle both, so the width is recorded per flag and the markup carries it as
 * the intrinsic size.
 */
export const FLAG_HEIGHT = 36

const FLAG_WIDTH = {
  at: 54,
  cn: 54,
  cz: 54,
  eg: 54,
  gb: 58,
  gr: 54,
  in: 54,
  it: 54,
  jo: 52,
  pl: 57,
  us: 69,
}

const partner = (slug, name, country) => ({
  slug,
  name,
  image: `international-partners/${slug}.webp`,
  country: {
    code: country,
    labelKey: `country.${country}`,
    flag: `international-partners/flags/${country}.webp`,
    flagWidth: FLAG_WIDTH[country],
  },
})

export const PARTNERS = [
  partner('esri', 'Esri', 'us'),
  partner('moorhouse', 'Moorhouse', 'gb'),
  partner('innowise', 'Innowise', 'pl'),
  partner('edge-pro', 'Edge-Pro for Information Systems', 'eg'),
  partner('avc', 'AVC', 'gb'),
  partner('industrial-automation-systems', 'Industrial Automation Systems', 'eg'),
  partner('coderize', 'Coderize', 'in'),
  partner('nucsaf', 'NucSaf', 'at'),
  partner('salfo', 'Salfo Engineering & Management', 'gr'),
  // Austria, not Australia. The live site flies an Australian flag beside the
  // Austrian Institute of Technology; that is a mistake, not something to port.
  partner('ait', 'AIT Austrian Institute of Technology', 'at'),
  partner('philadelphia-solar', 'Philadelphia Solar', 'jo'),
  partner('inspur', 'Inspur', 'cn'),
  partner('gevinst', 'Gevinst', 'in'),
  partner('spine', 'Spine Architecture and Engineering', 'eg'),
  partner('infinmobile', 'Infinmobile Solutions', 'in'),
  partner('rizzo-international', 'Rizzo International', 'cz'),
  partner('cgr-spa', 'CGR SpA', 'it'),
  partner('mifre-energy', 'Mifre Energy', 'cz'),
  partner('apesi', 'APESI', 'in'),
]

export const PARTNERS_HEADING_KEY = 'international_partners_text'
