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
            Five years of design work across Turkey, Poland, Germany and
            Spain. Most of it industrial design. I moved to digital UI/UX in
            2023 and have worked at it since. MA in Strategic Design
            Management at IED Barcelona, finishing December 2026.
          </p>
          {/* Deliberately not a second copy of the hero line. The stage
              states the positioning; this is the detail behind it. */}
          <p data-reveal>
            Day to day: user interviews and usability testing, Figma
            component systems, and builds in Flutter or React when a static
            screen cannot answer the question.
          </p>
          <p data-reveal>
            AI is part of the process. I run problems through Claude Code
            before opening a design tool, and prototype with Lovable to get
            to something that runs. I read frontend and backend code and can
            explain it to people who do not.
          </p>
          <p data-reveal>
            Right now I am the designer on CBI, a program run by Esade, UPC
            and IED Barcelona, working a challenge through a quantum
            computing lens.
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
