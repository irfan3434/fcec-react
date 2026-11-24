import { useTranslation } from 'react-i18next'

import PageHeader from '../components/ui/PageHeader'
import {
  CONTACT_CHANNELS,
  CONTACT_HEADING_KEYS,
  CONTACT_INTRO_KEYS,
  CONTACT_PAGE_TITLE_KEY,
} from '../content/contact'
import { BRANCHES } from '../content/footer'
import { CONTACT, SOCIAL_LINKS } from '../content/site'
import { useInView } from '../hooks/useInView'
import { formatPhone } from '../lib/format'
import styles from './Contact.module.css'

/**
 * Contact.
 *
 * The theme's page was the admin page body printed into a generic shell,
 * with the FCEC logo sitting at 50% opacity behind the text. The content is
 * the same — the same words, the same four branches, the same hours — laid
 * out as the structured thing it always was. See src/content/contact.js for
 * the two broken links it also carried.
 */
export default function Contact() {
  const { t } = useTranslation()
  const [ref, visible] = useInView()

  return (
    <>
      <PageHeader title={t(CONTACT_PAGE_TITLE_KEY)} />

      <div className={`container ${styles.page}`}>
        <div className={styles.intro}>
          {CONTACT_INTRO_KEYS.map((key) => (
            <p key={key}>{t(key)}</p>
          ))}
        </div>

        <ul className={styles.channels}>
          {CONTACT_CHANNELS.map(({ id, icon, titleKey, noteKey }) => (
            <li key={id} className={styles.channel}>
              <span className={styles.channelIcon} aria-hidden="true">
                <i className={icon} />
              </span>
              <h2 className={styles.channelTitle}>{t(titleKey)}</h2>

              {id === 'email' ? (
                <a className={styles.channelLink} href={`mailto:${CONTACT.email}`}>
                  {CONTACT.email}
                </a>
              ) : (
                <span className={styles.phones}>
                  {CONTACT.phones.map((phone) => (
                    // A phone number reads left to right even in Arabic.
                    <a key={phone} className={styles.channelLink} href={`tel:${phone}`} dir="ltr">
                      {formatPhone(phone)}
                    </a>
                  ))}
                </span>
              )}

              <p className={styles.channelNote}>{t(noteKey)}</p>
            </li>
          ))}
        </ul>

        <section aria-labelledby="contact-branches">
          <h2 id="contact-branches" className={styles.sectionTitle}>
            {t(CONTACT_HEADING_KEYS.branches)}
          </h2>

          <ul ref={ref} className={styles.branches} data-visible={visible}>
            {BRANCHES.map(({ id, cityKey, addressKey, mapUrl }, index) => (
              <li key={id} className={styles.branch} style={{ '--i': index }}>
                <h3 className={styles.city}>{t(cityKey)}</h3>
                <p className={styles.address}>{t(addressKey)}</p>
                <a
                  className={styles.map}
                  href={mapUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <i className="fa-solid fa-location-dot" aria-hidden="true" />
                  {t('contact.openInMaps')}
                  {/* Several links read the same; the city tells them apart. */}
                  <span className="visually-hidden"> {t(cityKey)}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.follow} aria-labelledby="contact-follow">
          <h2 id="contact-follow" className={styles.sectionTitle}>
            {t(CONTACT_HEADING_KEYS.follow)}
          </h2>
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
    </>
  )
}
