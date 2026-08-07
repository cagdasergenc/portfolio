import { useRef } from 'react'
import { useReveal } from '../hooks/useReveal'

export default function Hero() {
  const ref = useRef(null)
  useReveal(ref)

  return (
    <section ref={ref} className="shell relative flex min-h-[92vh] flex-col justify-end pb-24 pt-40">
      <p className="label" data-reveal>Çağdaş Ergenç — Product and UX Design</p>
      <h1
        className="mt-6 max-w-[19ch] text-hero tracking-[-0.02em]"
        data-reveal
        data-reveal-delay="0.08"
      >
        I work from research through to something people can actually click.
      </h1>
      <p className="mt-10 max-w-[48ch] text-lg text-muted" data-reveal data-reveal-delay="0.16">
        Five years across industrial, digital, and AI-assisted design.
        Turkey, Poland, Germany, now Barcelona.
      </p>
    </section>
  )
}
