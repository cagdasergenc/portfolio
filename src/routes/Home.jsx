/**
 * The landing page. Scroll order: Stage, WebBand, About, Contact, with Rail
 * pinned down the right edge.
 *
 * Used by: App.jsx at "/"
 * Uses: components/Stage.jsx, WebBand.jsx, About.jsx, Contact.jsx, Rail.jsx, SEO.jsx
 *
 * How it works: the page opens on the work itself, so there is no hero
 * section. Stage pins one project to the viewport and swaps it as you
 * scroll. Everything below it is supporting material. SEO sets the title and
 * meta tags for this route.
 */
import SEO from '../components/SEO'
import Rail from '../components/Rail'
import Stage from '../components/Stage'
import WebBand from '../components/WebBand'
import About from '../components/About'
import Contact from '../components/Contact'

/**
 * Opens on the work.
 *
 * There is no Hero section any more, and that is the point. Both worlds used
 * to be the same organism, a scrolling document of stacked sections, each
 * eyebrow → heading → content, work shown as a grid of cards. Changing the
 * palette and adding rails did not touch that skeleton.
 *
 * Now the first viewport IS a project, the work stays on a persistent stage
 * while the page scrolls, and the positioning line is annotation layered on
 * it rather than a statement standing before it. The sections that follow
 * are supporting material, not peers.
 */
export default function Home() {
  return (
    <>
      <SEO
        title="Çağdaş Ergenç · Product & UX Designer"
        description="Three UX case studies, written out in full, plus the e-commerce sites I designed."
        path="/"
      />
      <Rail />
      <Stage />
      <WebBand />
      <About />
      <Contact />
    </>
  )
}
