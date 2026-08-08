import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { getProjects } from '../lib/content'
import { useLowFi } from '../hooks/useLowFi'
import Glass from './Glass'
import WorkGridFlat from './WorkGridFlat'

/**
 * The persistent stage.
 *
 * This is the DNA change. Both worlds were the same organism underneath: a
 * vertically scrolling document of stacked sections, each one eyebrow →
 * heading → content, work presented as a grid of discrete cards. Rails,
 * numerals and smoked glass were decoration on that skeleton, not a
 * replacement for it.
 *
 * Here the page opens ON the work rather than on a statement, and the work
 * never leaves: a viewport-filling stage stays fixed while the page scrolls,
 * and scrolling swaps which project occupies it. The site behaves like a
 * viewer, not a document.
 *
 * It does NOT hijack the scroll. The track is a real element of real height
 * and the stage is `position: sticky` inside it, so the scrollbar, keyboard
 * paging, scroll memory and deep links all behave exactly as the browser
 * intends. Sticky gives the effect; scroll-jacking would only take control
 * away.
 */
export default function Stage() {
  const projects = getProjects()
  const trackRef = useRef(null)
  const [active, setActive] = useState(0)
  const [progress, setProgress] = useState(0)
  const lowFi = useLowFi()

  useEffect(() => {
    if (lowFi) return
    const track = trackRef.current
    if (!track) return

    let frame = 0
    const apply = () => {
      frame = 0
      const rect = track.getBoundingClientRect()
      const scrollable = Math.max(1, rect.height - window.innerHeight)
      const p = Math.min(1, Math.max(0, -rect.top / scrollable))
      setProgress(p)
      setActive(Math.min(projects.length - 1, Math.floor(p * projects.length + 0.0001)))
    }
    const schedule = () => {
      if (frame) return
      frame = requestAnimationFrame(apply)
    }

    apply()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule, { passive: true })
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [lowFi, projects.length])

  /**
   * Mobile, reduced motion and no-WebGL get the stacked specimen plate
   * instead. A sticky full-viewport stage on a phone eats the whole screen
   * and makes the work harder to reach, which is the one thing this site is
   * not allowed to do.
   */
  if (lowFi) {
    return (
      <section id="work" className="shell py-24">
        <div className="band-ticks" aria-hidden="true" />
        <div className="mt-5 flex items-baseline justify-between gap-6">
          <span className="label">I — III</span>
          <span className="label">{projects.length} specimens</span>
        </div>
        <hr className="mt-4 border-0 border-t border-white/12" />
        <h1 className="mt-6 max-w-[22ch] text-display">
          I work from research through to something people can actually click.
        </h1>
        <WorkGridFlat projects={projects} />
      </section>
    )
  }

  const current = projects[active]

  return (
    <section
      id="work"
      ref={trackRef}
      style={{ height: `${projects.length * 100}vh` }}
      aria-label="Selected work"
    >
      <div className="sticky top-0 flex h-screen flex-col justify-end overflow-hidden">
        {/* The work itself, full bleed, permanently on stage. */}
        {projects.map((p, i) => (
          <div
            key={p.slug}
            aria-hidden={i !== active}
            className="absolute inset-0 transition-opacity duration-700 ease-out"
            style={{ opacity: i === active ? 1 : 0 }}
          >
            {p.cover ? (
              <img
                src={p.cover}
                alt={`Cover of the ${p.title} case study`}
                className="h-full w-full object-cover"
                loading={i === 0 ? 'eager' : 'lazy'}
                decoding="async"
              />
            ) : (
              /* No cover supplied yet. Rather than an empty frame, the
                 project's own title fills the stage — the work is still what
                 you land on, just set rather than photographed. */
              <div className="flex h-full w-full items-center justify-center px-8">
                <span className="max-w-[16ch] text-center text-hero leading-[0.95] text-white/8">
                  {p.title}
                </span>
              </div>
            )}
          </div>
        ))}

        {/* The positioning line is annotation ON the work, not a statement
            before it. It fades out as the first project hands over. */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 px-6 pt-28 md:px-12"
          style={{ opacity: Math.max(0, 1 - progress * projects.length * 1.6) }}
        >
          <div className="shell">
            <p className="label">Çağdaş Ergenç — Product and UX Design</p>
            <h1 className="mt-4 max-w-[20ch] text-display tracking-[-0.02em]">
              I work from research through to something people can actually click.
            </h1>
          </div>
        </div>

        {/* Stage annotation. The title sits on glass (measured 5.63:1 over a
            blown-out cover); role and year sit on the ground beside it, never
            on the glass, where --text-dim would fail at 2.25:1. */}
        <div className="relative z-10 pb-14">
          <div className="shell">
            <div className="flex items-end justify-between gap-6">
              <span className="label">{romanise(active + 1)} / {romanise(projects.length)}</span>
              <span className="label text-right">{current.role}{current.year ? ` · ${current.year}` : ''}</span>
            </div>
            <hr className="mt-3 border-0 border-t border-white/12" />
            <Link to={`/work/${current.slug}`} className="group mt-6 inline-block">
              <Glass as="span" className="inline-flex items-center gap-4 px-7 py-4">
                <span className="text-card text-text">{current.title}</span>
                <span className="label text-text" aria-hidden="true">Open →</span>
              </Glass>
            </Link>
            {current.tagline && (
              <p className="mt-5 max-w-[46ch] text-text-dim">{current.tagline}</p>
            )}
          </div>
        </div>
      </div>

      {/* The real keyboard and assistive path: every project reachable
          without depending on scroll position or the stage at all. */}
      <div className="sr-only focus-within:not-sr-only">
        <WorkGridFlat projects={projects} />
      </div>
    </section>
  )
}

const NUMERALS = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII']
const romanise = (n) => NUMERALS[n] || String(n)
