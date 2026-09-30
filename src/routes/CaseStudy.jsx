/**
 * One project page, served at /work/:slug.
 *
 * Used by: App.jsx
 * Uses: lib/content.js (all the text and images), components/Band.jsx,
 *       Prose.jsx, Lightbox.jsx, SEO.jsx, hooks/useReveal.js, routes/NotFound.jsx
 *
 * How it works:
 * - getProject(slug) returns one project built from content/<slug>/index.md.
 *   An unknown slug renders NotFound rather than an empty page.
 * - Everything on the page comes off that object: the summary list from the
 *   summary_* fields, the sidebar links and section ids from the "##"
 *   headings, the deck card from case-study.pdf. Add a heading to the
 *   markdown and a sidebar link appears with it.
 * - Clicks in the prose are caught once, here, in onProseClick. The figures
 *   arrive as an HTML string so there is no React element per image to bind to.
 * - Lightbox takes whatever is in `zoom`: a figure, or the PDF from the deck card.
 */
import { useRef, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getProject } from '../lib/content'
import SEO from '../components/SEO'
import Band from '../components/Band'
import Prose from '../components/Prose'
import Lightbox from '../components/Lightbox'
import { useReveal } from '../hooks/useReveal'
import NotFound from './NotFound'
import resume from '../assets/resume.pdf?url'
import { trackEvent } from '../lib/analytics'

const META = ['role', 'context', 'year', 'duration', 'team', 'tools']

const SUMMARY = [
  ['The problem', 'summary_problem'],
  ['My part', 'summary_role'],
  ['What came out of it', 'summary_output'],
  ['Where it stands', 'summary_status'],
]

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

/** Shared by both top-of-page actions and the deck card at the foot. */
const SOLID = 'inline-block rounded-pill bg-text px-6 py-4 font-mono text-[12px] font-normal uppercase tracking-[0.08em] text-void transition-opacity hover:opacity-80'
const OUTLINE = 'inline-block rounded-pill border border-white/20 px-6 py-4 font-mono text-[12px] font-normal uppercase tracking-[0.08em] text-text-dim transition-colors hover:bg-text hover:text-void'

export default function CaseStudy() {
  const { slug } = useParams()
  const project = getProject(slug)
  const ref = useRef(null)
  const [zoom, setZoom] = useState(null)
  useReveal(ref)

  // Delegated rather than bound per image: the figures come out of
  // content.js as an HTML string, so there is no React element to attach a
  // handler to. Every zoomable figure ships as a real <button data-zoom>,
  // which keeps this a plain click on a focusable control.
  const onProseClick = (e) => {
    const btn = e.target.closest?.('[data-zoom]')
    if (!btn) return
    setZoom({ type: 'image', src: btn.dataset.zoom, alt: btn.dataset.zoomAlt, title: btn.dataset.zoomAlt })
  }

  const closeZoom = () => setZoom(null)

  if (!project) return <NotFound />

  const summary = SUMMARY.filter(([, key]) => project[key])
  const deckLabel = project.pdfPages ? `Preview the deck (${project.pdfPages} pages)` : 'Preview the deck'
  const openDeck = () => {
    trackEvent('deck_preview', { project: project.slug })
    setZoom({
      type: 'pdf',
      src: project.pdf,
      poster: project.deckCover,
      pages: project.pdfPages,
      title: `${project.title} deck`,
    })
  }

  return (
    <div ref={ref}>
      <SEO
        title={`${project.title} · Case Study | Çağdaş Ergenç`}
        description={project.tagline}
        path={`/work/${project.slug}`}
      />
      <Band index="Case study" reading={project.role || ''} title={project.title} titleAs="h1">
        <p className="mt-6 max-w-[46ch] text-xl text-text-dim" data-reveal>{project.tagline}</p>

        {/* Both real ways into the work, together and above the fold: the
            running app, and the document. The deck used to sit at the very
            bottom, behind the entire article. */}
        <div className="mt-8 flex flex-wrap items-center gap-4">
          {project.live_url && (
            <a
              href={project.live_url}
              data-analytics="open_live_app"
              data-project={project.slug}
              data-placement="case_study"
              target="_blank"
              rel="noreferrer"
              /* Not `.label` here: that class is a plain (unlayered) rule in
                 index.css, so its `color` beats ANY Tailwind color utility on
                 the same element regardless of class order, measured via
                 getComputedStyle, this silently stayed --text-dim before the
                 fix. Typography is reproduced as plain utilities instead so
                 `text-void` actually wins. */
              className={SOLID}
            >
              Open the app
            </a>
          )}
          {project.pdf && (
            <button type="button" onClick={openDeck} className={project.live_url ? OUTLINE : SOLID}>
              {deckLabel}
            </button>
          )}
          {/* No extra `opacity-*` here: `.label` (--text-dim on void) is
              already 7.19:1, measured, see the metadata-rail comment below.
              Stacking opacity-60 on top of that used to render this span at
              an actual 3.22:1, failing WCAG AA silently. */}
          {project.live_hint && <span className="label">{project.live_hint}</span>}
        </div>

        {summary.length > 0 && (
          <dl className="mt-16 grid gap-x-12 gap-y-8 border-t border-white/12 pt-10 md:grid-cols-2" data-reveal>
            {summary.map(([term, key]) => (
              <div key={key}>
                <dt className="label">{term}</dt>
                <dd className="mt-2 max-w-[46ch] text-text-dim">{project[key]}</dd>
              </div>
            ))}
          </dl>
        )}

        {project.lead && (
          <figure className="mt-16" data-reveal>
            <button
              type="button"
              className="fig-zoom"
              onClick={() => setZoom({ type: 'image', src: project.lead, alt: project.lead_alt || project.lead_caption, title: project.title })}
            >
              <img
                src={project.lead}
                alt={project.lead_alt || project.lead_caption || `${project.title} project visual`}
                /* Above the fold on this route, so it loads eagerly while
                   every figure further down stays lazy. */
                decoding="async"
              />
            </button>
            {project.lead_caption && <figcaption>{project.lead_caption}</figcaption>}
          </figure>
        )}

        <div className="mt-20 grid gap-16 md:grid-cols-[210px_1fr]">
          {/* Metadata rail per the binding rule (index.css `.glass`): dim text
              fails contrast on the smoked glass fill, so it never sits on a
              panel, it lives directly on the void ground, where --text-dim
              clears 7.19:1. `dt` carries no `opacity-*`: that used to stack on
              top of `.label`'s own --text-dim and render at an actual 3.22:1
              (measured via getComputedStyle), quietly contradicting this very
              comment. */}
          <div className="h-fit md:sticky md:top-28">
            <nav aria-label="Sections">
              <ul className="flex flex-wrap gap-x-4 gap-y-1 md:block">
                {project.sections.map((s) => (
                  <li key={s.heading}>
                    <a
                      href={`#${slugify(s.heading)}`}
                      className="label inline-block py-2 transition-colors hover:text-text"
                    >
                      {s.heading}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <dl className="label mt-8 space-y-4 border-t border-white/12 pt-8">
              {META.filter((k) => project[k]).map((k) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd className="mt-1 text-text normal-case tracking-normal">{project[k]}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Delegation only. Every clickable thing inside is a real
              <button>, so this adds no interactive surface of its own. */}
          <div onClick={onProseClick}>
            {project.sections.map((s) => {
              // Insight is the punctuation beat. On a light ground this band
              // light and this band goes near-black. Here the ground is
              // ALREADY near-black (--color-void), so the same dark band would
              // sit flush against the page and disappear, no error, just a
              // section that silently stops reading as distinct. The fix is
              // to invert the other way: this band goes to --text (near-white)
              // with void text on it, so it punctuates a dark page the same
              // way the dark band punctuated a light one.
              const inverted = s.heading === 'Insight'
              return (
                <section
                  key={s.heading}
                  id={slugify(s.heading)}
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
              <div className="specimen mt-4 overflow-hidden" data-reveal>
                {project.deckCover && (
                  <button type="button" onClick={openDeck} className="fig-zoom block w-full">
                    <img
                      src={project.deckCover}
                      alt={`A spread from the ${project.title} deck`}
                      loading="lazy"
                      decoding="async"
                      className="aspect-video w-full object-cover"
                    />
                  </button>
                )}
                <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/12 p-6">
                  <div>
                    <p className="text-card text-text">{project.title} deck</p>
                    <p className="label mt-1">
                      PDF{project.pdfPages ? ` · ${project.pdfPages} pages` : ''} · landscape
                    </p>
                  </div>
                  <button type="button" onClick={openDeck} className={SOLID}>Preview PDF</button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="case-contact">
          <p className="label">Work with me</p>
          <h2>Looking for a Product / UX designer?</h2>
          <p>I’m based in Barcelona and open to roles across the EU.</p>
          <div className="intro-actions">
            <a className="action-primary" href="mailto:cagdasergencc@gmail.com" data-analytics="email_click" data-placement="case_study">Get in touch ↗</a>
            <a className="action-secondary" href={resume} download="Cagdas-Ergenc-CV.pdf" data-analytics="cv_download" data-placement="case_study">Download CV ↓</a>
            <Link to="/#work" className="action-secondary">All work →</Link>
          </div>
        </div>
      </Band>

      <Lightbox item={zoom} onClose={closeZoom} />
    </div>
  )
}
