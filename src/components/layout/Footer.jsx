import { useTranslation } from 'react-i18next'

import LocaleLink from '../LocaleLink'
import { BRANCHES, FOOTER_HEADING_KEYS, LEGAL_LINKS } from '../../content/footer'
import { PRIMARY_NAV } from '../../content/navigation'
import { CONTACT, SOCIAL_LINKS } from '../../content/site'
import { formatPhone } from '../../lib/format'
import styles from './Footer.module.css'

// Read once at module load: the copyright year is not worth a re-render.
const YEAR = new Date().getFullYear()

/**
 * The site footer.
 *
 * Changes of substance from footer.liquid:
 *
 *   - Quick links are the full menu. The theme listed four of the six pages,
 *     so About and Careers could not be reached from here at all.
 *   - The branch addresses were `<p>` elements parented directly by a `<ul>`,
 *     which is invalid; each branch is one list item now.
 *   - The three legal links were `href="#"`. They are routes.
 *   - The email was plain text. It and the two phone numbers are links.
 *   - `target="_blank"` with no `rel`, on four external map links.
 *   - The copyright year was typed into the markup as 2024.
 */
export default function Footer() {
  const { t } = useTranslation()

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <nav className={styles.column} aria-labelledby="footer-quicklinks">
          <h2 id="footer-quicklinks" className={styles.heading}>
            {t(FOOTER_HEADING_KEYS.quickLinks)}
          </h2>
          <ul className={styles.list}>
            {PRIMARY_NAV.map(({ to, key }) => (
              <li key={to}>
                <LocaleLink className={styles.link} to={to}>
                  {t(key)}
                </LocaleLink>
              </li>
            ))}
          </ul>
        </nav>

        <section className={styles.column} aria-labelledby="footer-branches">
          <h2 id="footer-branches" className={styles.heading}>
            {t(FOOTER_HEADING_KEYS.branches)}
          </h2>
          <ul className={styles.branches}>
            {BRANCHES.map(({ id, cityKey, addressKey, mapUrl }) => (
              <li key={id}>
                <a className={styles.link} href={mapUrl} target="_blank" rel="noreferrer noopener">
                  {t(cityKey)}
                </a>
                <p className={styles.address}>{t(addressKey)}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.column} aria-labelledby="footer-contact">
          <h2 id="footer-contact" className={styles.heading}>
            {t(FOOTER_HEADING_KEYS.contact)}
          </h2>
          <ul className={styles.list}>
            <li>
              <a className={styles.link} href={`mailto:${CONTACT.email}`}>
                {CONTACT.email}
              </a>
            </li>
            {CONTACT.phones.map((phone) => (
              <li key={phone}>
                {/* A phone number reads left to right even in Arabic. */}
                <a className={styles.link} href={`tel:${phone}`} dir="ltr">
                  {formatPhone(phone)}
                </a>
              </li>
            ))}
          </ul>

          <ul className={styles.socials}>
            {SOCIAL_LINKS.map(({ id, href, icon, label }) => (
              <li key={id}>
                <a href={href} target="_blank" rel="noreferrer noopener" aria-label={label}>
                  <i className={icon} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className={styles.bottom}>
        <div className={`container ${styles.bottomInner}`}>
          <ul className={styles.legal}>
            {LEGAL_LINKS.map(({ to, key }) => (
              <li key={to}>
                <LocaleLink to={to}>{t(key)}</LocaleLink>
              </li>
            ))}
          </ul>
          <p className={styles.copyright}>© {YEAR} FCEC. {t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  )
}
