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
        description="Product and UX designer in Barcelona. Explore a healthcare prototype tested with 14 caregivers, an AI interaction concept, and e-commerce design work."
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
