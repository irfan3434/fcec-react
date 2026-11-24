/*
 * Certifications and accreditations.
 *
 * Eight theme settings, accredit_1_image..accredit_8_image, with alt text
 * that read "Accredited Logo 1" through "Accredited Logo 8". These are the
 * certificates the firm is trading on, so each one is named.
 *
 * Exported with a taller height cap than the other walls — half of these are
 * portrait seals, and the default cap left them reading light next to the
 * wordmarks. See scripts/normalize-logos.py.
 */

const accreditation = (slug, name) => ({
  slug,
  name,
  image: `accreditation/${slug}.webp`,
})

export const ACCREDITATIONS = [
  accreditation('otabu-iso-9001', 'ISO 9001:2015, certified by Otabu Global Services'),
  accreditation('otabu-iso-14001', 'ISO 14001:2015, certified by Otabu Global Services'),
  accreditation('ias', 'International Accreditation Service (IAS)'),
  accreditation('balady', 'Balady'),
  accreditation('ehkaam', 'Ehkaam'),
  accreditation('tasneef', 'Tasneef, the classification of city service providers'),
  accreditation('iaf', 'International Accreditation Forum (IAF)'),
  accreditation('subdivision', 'Subdivision of real estate units'),
]

export const ACCREDITATION_HEADING_KEY = 'certification_accreditation_section_heading_text'
