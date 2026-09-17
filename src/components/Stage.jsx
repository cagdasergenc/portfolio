import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { getProjects } from '../lib/content'
import { useLowFi } from '../hooks/useLowFi'
import { useCapsuleRect } from '../hooks/useCapsuleRect'
import { nextActiveIndex } from '../lib/activeIndex'
import Glass from './Glass'
import StageCanvas from './StageCanvas'
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
  const stageRef = useRef(null)
  const [active, setActive] = useState(0)
  const [progress, setProgress] = useState(0)
  const lowFi = useLowFi()
  const current = projects[active]
  const capsuleRef = useRef(null)
  const [canvasReady, setCanvasReady] = useState(false)
  // `lowFi` is in the deps for a reason that costs a whole first paint if
  // it is left out: useLowFi starts true, so the first commit renders the
  // stacked fallback and capsuleRef is attached to nothing. The measure
  // that runs then finds no element and gives up, and since the effect
  // never re-ran, the shader kept its default capsule -- a full-width glass
  // rectangle across the top of the hero -- until the visitor happened to
  // scroll or resize. canvasReady is here too: the capsule swaps between
  // Glass and a plain span at that moment, which can change its width.
  const capsuleRect = useCapsuleRect(capsuleRef, stageRef, [current?.slug, lowFi, canvasReady])

  // Explicit reset, not left to the outgoing project's effect cleanup:
  // correctness for the "never both scrims at once" invariant shouldn't
  // depend on cleanup-ordering. React's documented pattern for resetting
  // state in response to a changed dep is to adjust it during render
  // (not in a useEffect, which is one render+commit too late and trips
  // react-hooks/set-state-in-effect) — see "Resetting state when a prop
  // changes" in the React docs.
  const [readySlug, setReadySlug] = useState(current?.slug)
  if (readySlug !== current?.slug) {
    setReadySlug(current?.slug)
    setCanvasReady(false)
  }

  useEffect(() => {
    if (lowFi) return
    const track = trackRef.current
    if (!track) return

    // A boundary crossed by a hair re-triggers the 700ms crossfade before
    // the last one finishes -- ordinary scroll jitter right at a boundary
    // (trackpads and high-precision wheels both produce this) was enough
    // to do it repeatedly, ghosting two projects together instead of ever
    // completing one clean transition. Confirmed live: a boundary-scroll
    // recording showed exactly this. 0.06 is a dead zone, in project units,
    // an already-active index must be pushed past before giving up its
    // slot, so noise that doesn't clear it can't retrigger anything.
    let frame = 0
    const apply = () => {
      frame = 0
      const rect = track.getBoundingClientRect()
      const scrollable = Math.max(1, rect.height - window.innerHeight)
      const p = Math.min(1, Math.max(0, -rect.top / scrollable))
      setProgress(p)
      const raw = p * projects.length
      setActive((prev) => nextActiveIndex(prev, raw, projects.length, 0.06))
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
      <section id="work" className="shell pb-16 pt-28">
        <div className="band-ticks" aria-hidden="true" />
        {/* Derived, not written down. This read "I — III" beside a live
            count of 2 for as long as there were three projects in the
            folder and one of them was a draft. */}
        <div className="mt-5 flex items-baseline justify-between gap-6">
          <span className="label">{romanise(1)} — {romanise(projects.length)}</span>
          <span className="label">{projects.length} {projects.length === 1 ? 'specimen' : 'specimens'}</span>
        </div>
        <hr className="mt-4 border-0 border-t border-white/12" />
        <h1 className="mt-6 max-w-[20ch] text-display">
          I turn complex problems into products people can actually use.
        </h1>
        <p className="mt-5 max-w-[42ch] text-lg text-text-dim">
          Product and UX designer in Barcelona. Research, interface design,
          and prototypes that really run.
        </p>
        <WorkGridFlat projects={projects} />
      </section>
    )
  }

  return (
    <section
      id="work"
      ref={trackRef}
      style={{ height: `${projects.length * 100}vh` }}
      aria-label="Selected work"
    >
      <div ref={stageRef} className="sticky top-0 flex h-screen flex-col justify-end overflow-hidden">
        {/* The work itself, full bleed, permanently on stage. */}
        {projects.map((p, i) => (
          <div
            key={p.slug}
            aria-hidden={i !== active}
            className="absolute inset-0 transition-opacity duration-700 ease-out"
            style={{ opacity: i === active ? 1 : 0 }}
          >
            <StageCanvas
              project={p}
              active={i === active}
              capsule={i === active ? capsuleRect : null}
              onCanvasReady={i === active ? setCanvasReady : undefined}
            />
          </div>
        ))}

        {/* Scrims. The dark world assumes light text on a dark ground — an
            assumption a full-bleed LIGHT cover breaks completely. Measured
            against Pocket Pediatrics' old cream illustration, unprotected
            overlay text sits at 1.09:1 (--text) and 2.30:1 (--text-dim):
            invisible, and worse than the nav bug on the sibling branch.

            src/lib/contrast.js gives the floors against a blown-out white
            cover, the worst case a photo can present:
              --text      needs void at 0.60
              --text-dim  needs void at 0.84
            First pass put the metadata row at 0.79 — measured, and short.
            Dim text has a far higher floor than display text, so the bottom
            band is stronger than it looks like it needs to be.
            So the top band runs to 0.86 where the annotation sits and the
            bottom to 0.92 where the metadata does, both fading to nothing
            across the middle so the work itself stays unobstructed.

            Fallback scrims. Visible whenever the active project's shader
            is not yet compositing its own darkening — the brief window
            before WebGL/texture is ready, or permanently if createRefractor
            never succeeds. Never both this AND the shader's scrim at once:
            this fades to 0 the instant onCanvasReady(true) fires. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[52%] bg-gradient-to-b from-void/86 via-void/60 to-transparent transition-opacity duration-300"
          style={{ opacity: canvasReady ? 0 : 1 }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[56%] bg-gradient-to-t from-void/96 via-void/88 to-transparent transition-opacity duration-300"
          style={{ opacity: canvasReady ? 0 : 1 }}
        />

        {/* The positioning line is annotation ON the work, not a statement
            before it. It fades out as the first project hands over.

            Two elements, both near-white. It used to be three, opening with
            a mono eyebrow repeating the name already in the nav, under a
            headline long enough to run four lines across the artwork. The
            role now lives in the second line, where it reads as information
            rather than as a label on a label — and keeping both lines at
            --text (rather than dimming the second) is what lets the top
            scrim be measured against the lower floor and stay light. */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-10 px-6 pt-28 md:px-12"
          style={{ opacity: Math.max(0, 1 - progress * projects.length * 1.6) }}
        >
          <div className="shell">
            <h1 className="max-w-[22ch] text-title tracking-[-0.02em]">
              I turn complex problems into products people can actually use.
            </h1>
            <p className="mt-5 max-w-[40ch] text-lg">
              Product and UX designer in Barcelona. Research, interface
              design, and prototypes that really run.
            </p>
          </div>
        </div>

        {/* Stage annotation. The title sits on glass (measured 5.63:1 over a
            blown-out cover); role and year sit on the ground beside it, never
            on the glass, where --text-dim would fail at 2.25:1. */}
        <div className="relative z-20 pb-14">
          <div className="shell">
            {/* The plate index stays: it is this world's signature and it
                tells you where you are in the sequence. The role and year
                that used to sit opposite it did not, and were a second run
                of dim metadata competing with the tagline three lines
                below for the same job. They are on the case-study page,
                which is one click away. */}
            <div className="flex items-end gap-6">
              <span className="label">{romanise(active + 1)} / {romanise(projects.length)}</span>
            </div>
            <hr className="mt-3 border-0 border-t border-white/12" />
            <Link to={`/work/${current.slug}`} className="group mt-6 inline-block" ref={capsuleRef}>
              {/*
                Once the shader is compositing this exact capsule (canvasReady),
                the DOM wrapper must NOT also apply CSS .glass — that would
                stack a second blur+tint on top of the shader's own tint+rim,
                the same double-darkening bug class the contrast audit found
                once already. `Glass` supplies the fallback look before that;
                a plain span carries only the text once the shader has it.
              */}
              {canvasReady ? (
                <span className="relative inline-flex items-center gap-4 px-7 py-4">
                  <span className="text-card text-text">{current.title}</span>
                  <span className="label text-text" aria-hidden="true">Open →</span>
                </span>
              ) : (
                <Glass as="span" className="inline-flex items-center gap-4 px-7 py-4">
                  <span className="text-card text-text">{current.title}</span>
                  <span className="label text-text" aria-hidden="true">Open →</span>
                </Glass>
              )}
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
