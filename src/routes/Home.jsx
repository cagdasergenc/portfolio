import Hero from '../components/Hero'
import Rail from '../components/Rail'
import WorkIndex from '../components/WorkIndex'
import WebBand from '../components/WebBand'
import About from '../components/About'
import Contact from '../components/Contact'

/**
 * The plate sequence.
 *
 * On the sibling branch this file is five sections stacked in a centred
 * column, and for a while this one was byte-identical to it — which is
 * exactly the "it's just a copy" problem. It is not any more: the rail runs
 * the full height alongside every plate, and each section is a numbered
 * measurement band rather than a heading over content.
 */
export default function Home() {
  return (
    <>
      <Rail />
      <Hero />
      <WorkIndex />
      <WebBand />
      <About />
      <Contact />
    </>
  )
}
