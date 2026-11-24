import { useTranslation } from 'react-i18next'

import LogoWall from '../../components/LogoWall/LogoWall'
import {
  CLIENTS,
  CLIENTS_HEADING_KEY,
  LOCAL_PARTNERS,
  LOCAL_PARTNERS_HEADING_KEY,
} from '../../content/clients'
import styles from './Clients.module.css'

/**
 * Local partners and clients: one section, two walls, as in the theme.
 *
 * The theme gave each wall an `.animated-headline-partner` or
 * `.animated-headline-client` class that no stylesheet ever defined, and
 * styled the headings through `.logo-gallery h2` instead. Both classes are
 * gone; nothing was relying on them.
 */
export default function Clients({ partners = LOCAL_PARTNERS, clients = CLIENTS }) {
  const { t } = useTranslation()

  return (
    <section className={styles.section}>
      <div className="container">
        <LogoWall heading={t(LOCAL_PARTNERS_HEADING_KEY)} items={partners} maxCols={4} />
        <LogoWall heading={t(CLIENTS_HEADING_KEY)} items={clients} maxCols={5} />
      </div>
    </section>
  )
}
