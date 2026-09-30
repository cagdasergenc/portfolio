/**
 * The About section on the landing page.
 *
 * Used by: routes/Home.jsx
 * Uses: hooks/useReveal.js, src/assets/about.jpg
 *
 * How it works: static copy, kept in step with the CV in src/assets/resume.pdf,
 * which is the source of truth for dates, stack and availability. When the CV
 * changes, this text and Contact.jsx get checked against it.
 */
import { useRef } from 'react'
import { useReveal } from '../hooks/useReveal'

// import.meta.glob rather than a static `import portrait from
// '../assets/about.jpg'`: it resolves to an empty object when no file
// matches, so removing or replacing the portrait can never fail the build.
const PORTRAIT_FILES = import.meta.glob('../assets/about.jpg', { eager: true, query: '?url', import: 'default' })
const portrait = PORTRAIT_FILES['../assets/about.jpg']

export default function About() {
  const ref = useRef(null)
  useReveal(ref)

  return (
    // Short top, long bottom: About reads as a continuation of the work
    // above it, then the page takes a real break before Contact.
    <section ref={ref} id="about" className="shell pb-40 pt-12 md:pb-52 md:pt-16">
      {/* A heading, not a styled <p>: every other section has one and this
          landmark needs one too. `.label` (class) beats the global h1,h2,h3
          rule (element), so it stays visually identical to the other
          eyebrows. */}
      <h2 className="label" data-reveal>About</h2>
      <div className="mt-6 grid gap-12 md:grid-cols-[1fr_1.2fr]">
        {/* Photo stays in the left column, matching the read order every
            other section on the page uses: eyebrow, then the wide content
            beside it. */}
        {portrait ? (
          <img
            src={portrait}
            alt="Çağdaş Ergenç, a black and white portrait against a dark background"
            className="aspect-[4/5] w-full rounded-panel border border-white/10 object-cover"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="aspect-[4/5] rounded-panel border border-white/10 bg-white/5" aria-hidden="true" />
        )}
        <div className="max-w-[52ch] space-y-6 text-lg text-text-dim">
          {/* Kept in step with the master CV (src/assets/resume.pdf), which
              is the source of truth for dates, stack, and availability. */}
          <p data-reveal>
            I’m a Product / UX designer focused on research, interface design,
            and working prototypes. Recent work includes Shopify and
            WooCommerce journeys, Figma component libraries, and a caregiver
            app tested with 14 participants. I’m completing an MA in Strategic
            Design Management at IED Barcelona in December 2026.
          </p>
          {/* The intro states the positioning; this is the detail behind it. */}
          <p data-reveal>
            I start with interviews, usability tests, and task flows, then
            prototype in Figma, Flutter, or React when an idea needs to be
            tested in use.
          </p>
          <p data-reveal>
            I use AI tools to explore and prototype faster, then check the
            results with people. Working with code helps me discuss design
            decisions and implementation constraints with developers.
          </p>
          <p data-reveal>
            I’m currently the designer on a Challenge Based Innovation team
            with Esade, UPC and IED Barcelona, exploring a problem through a
            quantum-computing lens.
          </p>
          <p data-reveal>
            Based in Barcelona. Available now, with some constraints until
            15 December 2026. Open to relocating or remote across the EU.
          </p>
        </div>
      </div>
    </section>
  )
}
