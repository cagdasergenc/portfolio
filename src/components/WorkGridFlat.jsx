/**
 * The plain version of the stage: a stacked list of project cards.
 *
 * Used by: components/Stage.jsx whenever useLowFi is true, which means
 *          reduced motion, a small screen, or no WebGL
 * Uses: components/Glass.jsx
 *
 * How it works: same projects, same capsule, no canvas and no scroll pinning.
 * This is a real path and not an error state, so it gets the same care as the
 * shader version. CAPSULE_CLASS below is shared with the shader's own capsule
 * coordinates, so the two stay in the same place.
 */
import { Link } from 'react-router-dom'
import Glass from './Glass'

/**
 * Where the title capsule sits over the media area. Mirrors `uCapsule` in
 * src/gl/refract.js, centre (0.5, 0.82), half-size (0.42, 0.085) in the
 * shader's bottom-up UV space (y=1 at the top of the canvas, confirmed by
 * rendering it). Converted to CSS distance-from-top that is
 * inset-x 8%, top 9.5%, height 17%. GlassCard reuses this constant so the
 * DOM capsule and the shader's capsule land in the same place, keep the
 * two in sync by hand if either changes.
 */
export const CAPSULE_CLASS =
  'absolute inset-x-[8%] top-[9.5%] flex h-[17%] items-center justify-center overflow-hidden px-6'

/**
 * Role, year, the tagline, and the Live flag all read as dim metadata, so
 * per the measured contrast rule (index.css, `.glass`) none of it may sit
 * on the glass capsule, only the title does. It renders below the card on
 * the void ground instead, where `--text-dim` clears 7.19:1 instead of the
 * 2.25:1 it would fail at on glass over a bright cover.
 */
export function Meta({ project }) {
  return (
    <>
      <div className="mt-5 flex items-baseline justify-between gap-4">
        <span className="label">{project.role}</span>
        <span className="label shrink-0">{project.year}</span>
      </div>
      {project.tagline && <p className="mt-1 max-w-[38ch] text-text-dim">{project.tagline}</p>}
      {project.live_url && <span className="label mt-3 inline-block text-text">Live</span>}
    </>
  )
}

/**
 * One card: media area with the title capsule on top, metadata below. No
 * refraction, GlassCard falls back to this exact markup when WebGL2 is
 * unavailable or a project has no cover, so the two paths are visually
 * identical apart from the shader.
 *
 * `hidden` is for GlassCard's own fallback use inside the aria-hidden glass
 * grid (see WorkIndex): it keeps that duplicate out of the tab order so the
 * one real keyboard path is always the accessible `WorkGridFlat` render.
 */
export function FlatCard({ project, hidden = false, numeral }) {
  return (
    <Link
      to={`/work/${project.slug}`}
      className="group block"
      tabIndex={hidden ? -1 : undefined}
      aria-hidden={hidden || undefined}
    >
      {/* The plate numeral sits in the margin, outside the frame, the way a
          figure is labelled, not as a badge on the artwork. Work is
          catalogued here, not merchandised. */}
      {numeral && (
        <div className="mb-3 flex items-baseline gap-3">
          <span className="label text-text">{numeral}</span>
          <span className="h-px flex-1 bg-white/12" aria-hidden="true" />
        </div>
      )}
      <div className="specimen relative aspect-video w-full bg-white/5 transition-transform duration-500 ease-out group-hover:-translate-y-1">
        {project.cover ? (
          <img
            src={project.cover}
            alt={`Cover of the ${project.title} case study`}
            className="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
        ) : (
          // No `p.cover` exists for any project yet. Rather than an empty
          // box, the slot stays a deliberate dark panel, the title still
          // reads in its capsule, so this never looks broken.
          <div className="h-full w-full border border-white/10" />
        )}
        <Glass as="div" className={CAPSULE_CLASS}>
          {/* h2, not h3: the only heading above this on the page is the
              section h1, so h3 skipped a level for every project. */}
          {/* font-semibold keeps the 600 the h3 had: base layer sets h1/h2
              to 800, which would have changed the look along with the level. */}
          <h2 className="truncate text-card font-semibold text-text">{project.title}</h2>
        </Glass>
      </div>
      <Meta project={project} />
    </Link>
  )
}

/**
 * The mobile, reduced-motion and no-WebGL path. This is what
 * most visitors see, so it carries the same layout and proportions as the
 * refracting version, just without the shader.
 */
const NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII']

/**
 * Specimens on a 12-column plate, deliberately asymmetric, each one sits in
 * a different span so the eye steps down the page instead of scanning a
 * uniform 2-up grid. A uniform grid is the obvious version of this, and one
 * worlds do not read as the same page in different colours.
 */
const PLACEMENT = [
  'md:col-span-6 md:col-start-1',
  'md:col-span-5 md:col-start-8 md:mt-24',
  'md:col-span-5 md:col-start-3',
]

export default function WorkGridFlat({ projects }) {
  return (
    <ul className="grid12 mt-16 gap-y-20">
      {projects.map((p, i) => (
        <li
          key={p.slug}
          data-reveal
          className={`col-span-full ${PLACEMENT[i % PLACEMENT.length]}`}
        >
          <FlatCard project={p} numeral={NUMERALS[i]} />
        </li>
      ))}
    </ul>
  )
}
