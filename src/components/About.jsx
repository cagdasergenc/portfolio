import { useRef } from 'react'
import { useReveal } from '../hooks/useReveal'

// src/assets/about.jpg does not exist yet — the site owner needs to supply a
// portrait. import.meta.glob (rather than a static `import portrait from
// '../assets/about.jpg'`) resolves to an empty object when no file matches,
// so its absence doesn't fail the build. Once the file is added, this picks
// it up automatically with no code change.
const PORTRAIT_FILES = import.meta.glob('../assets/about.jpg', { eager: true, query: '?url', import: 'default' })
const portrait = PORTRAIT_FILES['../assets/about.jpg']

export default function About() {
  const ref = useRef(null)
  useReveal(ref)

  return (
    <section ref={ref} id="about" className="shell py-24">
      {/* A heading, not a styled <p>: every other section has one and this
          landmark needs one too. `.label` (class) beats the global h1,h2,h3
          rule (element), so it stays visually identical to the other
          eyebrows. When the owner supplies a bio, a display h2 can join it
          — the pattern the other sections use. */}
      <h2 className="label" data-reveal>About</h2>
      <div className="mt-4 grid gap-12 md:grid-cols-[1fr_1.2fr]">
        {/* Photo stays in the left column, matching the read order every
            other section on the page uses: eyebrow, then the wide content
            beside it. */}
        {portrait ? (
          <img
            src={portrait}
            alt="Çağdaş Ergenç, photographed against a warm wall in afternoon light"
            className="aspect-[4/5] w-full rounded-panel border border-white/10 object-cover"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="aspect-[4/5] rounded-panel border border-white/10 bg-white/5" aria-hidden="true" />
        )}
        <div className="max-w-[52ch] space-y-6 text-lg text-text-dim">
          <p data-reveal>
            Five years across industrial design, digital product design, and
            AI-assisted prototyping, built in Turkey, Poland, Germany, and
            Spain. I'm currently completing an MA in Strategic Design
            Management at IED Barcelona, graduating December 2026.
          </p>
          <p data-reveal>
            I work from research through to something people can actually
            click: user interviews and usability testing, Figma component
            systems, and functional builds in React Native when static
            screens aren't enough to actually learn something. Comfortable
            reading frontend and backend code, and explaining technical work
            to people who didn't build it.
          </p>
          <p data-reveal>
            Based in Barcelona. Available now, open to remote work across the
            EU.
          </p>
        </div>
      </div>
    </section>
  )
}
