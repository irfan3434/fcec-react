import { useTranslation } from 'react-i18next'

import LogoWall from '../../components/LogoWall/LogoWall'
import { ACCREDITATIONS, ACCREDITATION_HEADING_KEY } from '../../content/accreditation'
import styles from './Accreditation.module.css'

/**
 * Certifications and accreditations: the third logo wall on the homepage, and
 * the third to share components/LogoWall.
 */
export default function Accreditation({ items = ACCREDITATIONS }) {
  const { t } = useTranslation()

  return (
    <section className={styles.section}>
      <div className="container">
        <LogoWall heading={t(ACCREDITATION_HEADING_KEY)} items={items} maxCols={4} />
      </div>
    </section>
  )
}
