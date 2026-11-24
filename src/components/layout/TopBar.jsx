import LanguageSwitcher from './LanguageSwitcher'
import { CONTACT, SOCIAL_LINKS } from '../../content/site'
import styles from './TopBar.module.css'

/*
 * The quiet strip above the header: ways to reach FCEC on one side, the
 * language switch on the other. It scrolls away — only the header sticks.
 *
 * Site search and employee login from the old top bar are still missing; both
 * need a data source we haven't settled, so they are left out rather than
 * stubbed.
 */
export default function TopBar() {
  return (
    <div className={styles.bar}>
      <div className={`container ${styles.inner}`}>
        <ul className={styles.socials}>
          {SOCIAL_LINKS.map(({ id, href, icon, label }) => (
            <li key={id}>
              <a href={href} target="_blank" rel="noreferrer noopener" aria-label={label}>
                <i className={icon} aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>

        <div className={styles.end}>
          <a className={styles.email} href={`mailto:${CONTACT.email}`}>
            <i className="fa-regular fa-envelope" aria-hidden="true" />
            <span>{CONTACT.email}</span>
          </a>
          <LanguageSwitcher />
        </div>
      </div>
    </div>
  )
}
