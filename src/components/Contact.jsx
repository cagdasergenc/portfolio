import resume from '../assets/resume.pdf?url'

export default function Contact() {
  return (
    <section id="contact" className="shell py-32">
      <p className="label">Contact</p>
      <h2 className="mt-4 max-w-[16ch] text-[clamp(2.5rem,7vw,5.5rem)]">
        Barcelona. Available now, remote across the EU.
      </h2>
      <ul className="mt-12 flex flex-wrap gap-x-10 gap-y-4 text-lg">
        <li><a className="underline underline-offset-4 decoration-1" href="mailto:cagdasergencc@gmail.com">cagdasergencc@gmail.com</a></li>
        <li><a className="underline underline-offset-4 decoration-1" href="https://www.linkedin.com/in/cagdas-ergenc" target="_blank" rel="noreferrer">LinkedIn</a></li>
        <li><a className="underline underline-offset-4 decoration-1" href={resume} download>Resume (PDF)</a></li>
      </ul>
    </section>
  )
}
