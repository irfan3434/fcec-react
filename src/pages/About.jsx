import { useTranslation } from 'react-i18next'

import PageHeader from '../components/ui/PageHeader'
import AboutStory from '../sections/AboutStory/AboutStory'
import { ABOUT_PAGE_TITLE_KEY } from '../content/about'

/** page.about.liquid, less the portfolio video. */
export default function About() {
  const { t } = useTranslation()

  return (
    <>
      <PageHeader title={t(ABOUT_PAGE_TITLE_KEY)} />
      <AboutStory />
    </>
  )
}
