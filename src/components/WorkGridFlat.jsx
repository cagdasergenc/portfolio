import { Link } from 'react-router-dom'
import Glass from './Glass'

/**
 * Where the title capsule sits over the media area. Mirrors `uCapsule` in
 * src/gl/refract.js — centre (0.5, 0.82), half-size (0.42, 0.085) in the
 * shader's bottom-up UV space (y=1 at the top of the canvas, confirmed by
 * rendering it in Task 4). Converted to CSS distance-from-top that is
 * inset-x 8%, top 9.5%, height 17%. GlassCard reuses this constant so the
 * DOM capsule and the shader's capsule land in the same place — keep the
 * two in sync by hand if either changes.
 */
export const CAPSULE_CLASS =
  'absolute inset-x-[8%] top-[9.5%] flex h-[17%] items-center justify-center overflow-hidden px-6'

/**
 * Role, year, the tagline, and the Live flag all read as dim metadata, so
 * per the measured contrast rule (index.css, `.glass`) none of it may sit
 * on the glass capsule — only the title does. It renders below the card on
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
 * refraction — GlassCard falls back to this exact markup when WebGL2 is
 * unavailable or a project has no cover, so the two paths are visually
 * identical apart from the shader.
 *
 * `hidden` is for GlassCard's own fallback use inside the aria-hidden glass
 * grid (see WorkIndex): it keeps that duplicate out of the tab order so the
 * one real keyboard path is always the accessible `WorkGridFlat` render.
 */
export function FlatCard({ project, hidden = false }) {
  return (
    <Link
      to={`/work/${project.slug}`}
      className="group block"
      tabIndex={hidden ? -1 : undefined}
      aria-hidden={hidden || undefined}
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-panel bg-white/5 transition-transform duration-500 ease-out group-hover:-translate-y-1">
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
          // box, the slot stays a deliberate dark panel — the title still
          // reads in its capsule, so this never looks broken.
          <div className="h-full w-full border border-white/10" />
        )}
        <Glass as="div" className={CAPSULE_CLASS}>
          <h3 className="truncate text-card text-text">{project.title}</h3>
        </Glass>
      </div>
      <Meta project={project} />
    </Link>
  )
}

/**
 * The mobile, reduced-motion and no-WebGL path. Per spec §6.1 this is what
 * most visitors see, so it carries the same layout and proportions as the
 * refracting version — just without the shader.
 */
export default function WorkGridFlat({ projects }) {
  return (
    <ul className="grid gap-x-8 gap-y-16 md:grid-cols-2">
      {projects.map((p) => (
        <li key={p.slug} data-reveal>
          <FlatCard project={p} />
        </li>
      ))}
    </ul>
  )
}
