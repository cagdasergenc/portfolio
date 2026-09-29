/**
 * The contact section, and the CV download.
 *
 * Used by: routes/Home.jsx
 * Uses: hooks/useReveal.js, src/assets/resume.pdf
 *
 * How it works: the CV is imported as a URL so Vite fingerprints it and the
 * browser cannot serve a stale copy after I replace the file. The download
 * attribute sets the filename people end up with on their disk.
 */
import { useRef } from 'react'
import resume from '../assets/resume.pdf?url'
import { useReveal } from '../hooks/useReveal'
import { track } from '../lib/analytics'

export default function Contact() {
  const ref = useRef(null)
  useReveal(ref)

  return (
    // The last section gets the longest tail, so the page ends on space
    // rather than stopping at the edge of the links.
    <section ref={ref} id="contact" className="shell pb-40 pt-16 md:pb-64 md:pt-24">
      <p className="label" data-reveal>Contact</p>
      <h2 className="mt-4 max-w-[16ch] text-display" data-reveal>
        Barcelona. Available now, remote or relocating in the EU.
      </h2>
      {/* The CV says "available now, with some constraints until 15 Dec
          2026". The headline keeps the short version; the constraint sits
          here so nobody finds it first in the PDF. */}
      <p className="mt-6 max-w-[42ch] text-lg text-text-dim" data-reveal>
        Some constraints on my time until 15 December 2026.
      </p>
      <ul className="mt-12 flex flex-wrap gap-x-10 gap-y-4 text-lg" data-reveal>
        <li><a className="underline underline-offset-4 decoration-1" href="mailto:cagdasergencc@gmail.com" onClick={() => track('email_click')}>cagdasergencc@gmail.com</a></li>
        <li><a className="underline underline-offset-4 decoration-1" href="https://www.linkedin.com/in/cagdas-ergenc" target="_blank" rel="noreferrer">LinkedIn</a></li>
        <li><a className="underline underline-offset-4 decoration-1" href={resume} download="Cagdas-Ergenc-CV.pdf" onClick={() => track('cv_download')}>CV (PDF)</a></li>
      </ul>
    </section>
  )
}
