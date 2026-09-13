import { useRef } from 'react'
import resume from '../assets/resume.pdf?url'
import { useReveal } from '../hooks/useReveal'

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
      <ul className="mt-12 flex flex-wrap gap-x-10 gap-y-4 text-lg" data-reveal>
        <li><a className="underline underline-offset-4 decoration-1" href="mailto:cagdasergencc@gmail.com">cagdasergencc@gmail.com</a></li>
        <li><a className="underline underline-offset-4 decoration-1" href="https://www.linkedin.com/in/cagdas-ergenc" target="_blank" rel="noreferrer">LinkedIn</a></li>
        <li><a className="underline underline-offset-4 decoration-1" href={resume} download="Cagdas-Ergenc-CV.pdf">CV (PDF)</a></li>
      </ul>
    </section>
  )
}
