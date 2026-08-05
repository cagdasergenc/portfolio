import { useRef } from 'react'
import resume from '../assets/resume.pdf?url'
import { useReveal } from '../hooks/useReveal'

export default function Contact() {
  const ref = useRef(null)
  useReveal(ref)

  return (
    <section ref={ref} id="contact" className="shell py-32">
      <p className="label" data-reveal>Contact</p>
      <h2 className="mt-4 max-w-[16ch] text-[clamp(2.5rem,7vw,5.5rem)]" data-reveal>
        Barcelona. Available now, remote across the EU.
      </h2>
      <ul className="mt-12 flex flex-wrap gap-x-10 gap-y-4 text-lg" data-reveal>
        <li><a className="underline underline-offset-4 decoration-1" href="mailto:cagdasergencc@gmail.com">cagdasergencc@gmail.com</a></li>
        <li><a className="underline underline-offset-4 decoration-1" href="https://www.linkedin.com/in/cagdas-ergenc" target="_blank" rel="noreferrer">LinkedIn</a></li>
        <li><a className="underline underline-offset-4 decoration-1" href={resume} download>Resume (PDF)</a></li>
      </ul>
    </section>
  )
}
