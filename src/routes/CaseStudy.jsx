import { useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getProject } from '../lib/content'
import SEO from '../components/SEO'
import Band from '../components/Band'
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
    <div ref={ref}>
      <SEO
        title={`${project.title} — Case Study | Çağdaş Ergenç`}
        description={project.tagline}
        path={`/work/${project.slug}`}
      />
      <Band index="Case study" reading={project.role || ''} title={project.title} titleAs="h1">
        <p className="mt-6 max-w-[46ch] text-xl text-text-dim" data-reveal>{project.tagline}</p>

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
              /* Not `.label` here: that class is a plain (unlayered) rule in
                 index.css, so its `color` beats ANY Tailwind color utility on
                 the same element regardless of class order — measured via
                 getComputedStyle, this silently stayed --text-dim before the
                 fix. Typography is reproduced as plain utilities instead so
                 `text-void` actually wins. */
              className="inline-block rounded-pill bg-text px-6 py-4 font-mono text-[12px] font-normal uppercase tracking-[0.08em] text-void transition-opacity hover:opacity-80"
            >
              Open the app
            </a>
            {/* No extra `opacity-*` here: `.label` (--text-dim on void) is
                already 7.19:1 — measured, see the metadata-rail comment below.
                Stacking opacity-60 on top of that used to render this span at
                an actual 3.22:1, failing WCAG AA silently (getComputedStyle
                showed the true composite; the `.label` class alone never
                told you that). */}
            {project.live_hint && <span className="label">{project.live_hint}</span>}
          </div>
        )}

        <div className="mt-20 grid gap-16 md:grid-cols-[200px_1fr]">
          {/* Metadata rail per the binding rule (index.css `.glass`): dim text
              fails contrast on the smoked glass fill, so it never sits on a
              panel — it lives directly on the void ground, where --text-dim
              clears 7.19:1. `dt` carries no `opacity-*`: that used to stack on
              top of `.label`'s own --text-dim and render at an actual 3.22:1
              (measured via getComputedStyle), quietly contradicting this very
              comment. */}
          <dl className="label h-fit space-y-4 md:sticky md:top-28">
            {META.filter((k) => project[k]).map((k) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd className="mt-1 text-text normal-case tracking-normal">{project[k]}</dd>
              </div>
            ))}
          </dl>

          <div>
            {project.sections.map((s) => {
              // Insight is the punctuation beat: in Lit Paper the ground is
              // light and this band goes near-black. Here the ground is
              // ALREADY near-black (--color-void), so the same dark band would
              // sit flush against the page and disappear — no error, just a
              // section that silently stops reading as distinct. The fix is
              // to invert the other way: this band goes to --text (near-white)
              // with void text on it, so it punctuates a dark page the same
              // way the dark band punctuated a light one. Not `.glass` — the
              // measured glass fill (rgb(12 12 14 / 0.65)) composited over the
              // void ground lands within ~1 unit of the void itself, which is
              // no punctuation at all; a solid light fill is the only option
              // that reads at a glance.
              const inverted = s.heading === 'Insight'
              return (
                <section
                  key={s.heading}
                  className={inverted
                    ? 'my-16 -mx-6 bg-text px-6 py-16 text-void md:-mx-12 md:px-12'
                    : 'mb-16'}
                >
                  {/* Same unlayered-vs-utility conflict as the CTA above:
                      `.label` plus a color utility on one element loses the
                      utility, so the inverted heading is built from plain
                      utilities instead of `.label` when it needs void text. */}
                  <h2
                    className={inverted
                      ? 'mb-6 font-mono text-[12px] font-normal uppercase tracking-[0.08em] text-void/70'
                      : 'label mb-6'}
                    data-reveal
                  >{s.heading}</h2>
                  <Prose html={s.html} />
                </section>
              )
            })}

            {project.pdf && (
              <a
                href={project.pdf}
                download
                /* `hover:text-void` needs to win over `.label`'s unlayered
                   default on :hover too, so this is plain utilities, not
                   `.label` + a color override. */
                className="inline-block rounded-pill border border-white/20 px-6 py-4 font-mono text-[12px] font-normal uppercase tracking-[0.08em] text-text-dim transition-colors hover:bg-text hover:text-void"
              >
                Read the PDF
              </a>
            )}
          </div>
        </div>

        <Link to="/#work" className="label mt-24 inline-block underline underline-offset-4">All work</Link>
      </Band>
    </div>
  )
}
