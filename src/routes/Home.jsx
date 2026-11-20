import SEO from '../components/SEO'
import Rail from '../components/Rail'
import Intro from '../components/Intro'
import WebBand from '../components/WebBand'
import About from '../components/About'
import Contact from '../components/Contact'

export default function Home() {
  return (
    <>
      <SEO
        title="Çağdaş Ergenç · Product & UX Designer"
        description="Product and UX designer in Barcelona. A healthcare prototype tested with 14 caregivers, a bike-repair marketplace, an AI concept, and e-commerce work."
        path="/"
      />
      <Rail />
      <Intro />
      <WebBand />
      <About />
      <Contact />
    </>
  )
}
