import AboutUs from '../sections/AboutUs/AboutUs'
import Accreditation from '../sections/Accreditation/Accreditation'
import Clients from '../sections/Clients/Clients'
import Counter from '../sections/Counter/Counter'
import HeroBanner from '../sections/HeroBanner/HeroBanner'
import Partners from '../sections/Partners/Partners'
import Services from '../sections/Services/Services'
import Spotlight from '../sections/Spotlight/Spotlight'

export default function Home() {
  return (
    <>
      <HeroBanner />
      <AboutUs />
      <Services />
      <Spotlight />
      <Partners />
      <Clients />
      <Counter />
      <Accreditation />
    </>
  )
}
