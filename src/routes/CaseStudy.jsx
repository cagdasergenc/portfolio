import { useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getProject } from '../lib/content'
import Prose from '../components/Prose'
import { useReveal } from '../hooks/useReveal'
import NotFound from './NotFound'

const META = ['role', 'context', 'year', 'duration', 'team', 'tools']

export default function CaseStudy() {
  const { slug } = useParams()
  const project = getProject(slug)
  const ref = useRef(null)
  useReveal(ref)
  if (!project) return <NotFound />

  return (
    <article ref={ref} className="mx-auto max-w-[1400px] px-6 pb-32 pt-40 md:px-12">
      <p className="label" data-reveal>Case study</p>
      <h1 className="mt-4 max-w-[18ch] text-[clamp(2.5rem,8vw,7rem)] tracking-[-0.02em]" data-reveal>{project.title}</h1>
      <p className="mt-6 max-w-[46ch] text-xl text-muted" data-reveal>{project.tagline}</p>

      {/* A deployed, working app is stronger evidence than a PDF, so it goes
          near the top, above the metadata rail — not buried at the bottom
          next to the download link. live_hint sits alongside it so a
          recruiter isn't blocked by a login screen. */}
      {project.live_url && (
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <a
            href={project.live_url}
            target="_blank"
            rel="noreferrer"
            className="label inline-block bg-ink px-6 py-4 text-paper transition-opacity hover:opacity-80"
          >
            Open the app
          </a>
          {project.live_hint && <span className="label opacity-60">{project.live_hint}</span>}
        </div>
      )}

      <div className="mt-20 grid gap-16 md:grid-cols-[200px_1fr]">
        <dl className="label h-fit space-y-4 md:sticky md:top-28">
          {META.filter((k) => project[k]).map((k) => (
            <div key={k}>
              <dt className="opacity-60">{k}</dt>
              <dd className="mt-1 text-ink normal-case tracking-normal">{project[k]}</dd>
            </div>
          ))}
        </dl>

        <div>
          {project.sections.map((s) => {
            const dark = s.heading === 'Insight'
            return (
              <section
                key={s.heading}
                className={dark
                  ? 'my-16 -mx-6 bg-dark px-6 py-16 text-paper md:-mx-12 md:px-12'
                  : 'mb-16'}
              >
                <h2 className={dark ? 'label mb-6 text-paper/60' : 'label mb-6'} data-reveal>{s.heading}</h2>
                <Prose html={s.html} />
              </section>
            )
          })}

          {project.pdf && (
            <a
              href={project.pdf}
              download
              className="label inline-block border border-ink/20 px-6 py-4 transition-colors hover:bg-ink hover:text-paper"
            >
              Read the PDF
            </a>
          )}
        </div>
      </div>

      <Link to="/#work" className="label mt-24 inline-block underline underline-offset-4">All work</Link>
    </article>
  )
}
