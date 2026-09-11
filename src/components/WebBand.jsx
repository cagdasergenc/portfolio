import { useRef } from 'react'
import { webWork } from '../data/web'
import { useReveal } from '../hooks/useReveal'

/**
 * Preview cards, not a list of rows.
 *
 * These were three text rows with a status word on the right, which showed
 * none of the work and made the archived one read as a dead link rather
 * than a project. Each card now leads with a real screenshot of the live
 * site, captured at desktop width.
 *
 * The whole card is one link rather than a card containing a link: it keeps
 * the tab order at one stop per project and makes the entire surface a
 * touch target, with the labelled action still visible for anyone scanning
 * for where to click.
 */
export default function WebBand() {
  const ref = useRef(null)
  useReveal(ref)

  return (
    <section ref={ref} id="web" className="shell py-24">
      <h2 className="mb-12 mt-4 text-title" data-reveal>Shops I designed.</h2>
      <ul className="grid gap-x-8 gap-y-14 md:grid-cols-2">
        {webWork.map((w) => {
          const body = (
            <>
              <div className="specimen relative aspect-[16/9] w-full overflow-hidden bg-white/5">
                {w.shot ? (
                  <img
                    src={w.shot}
                    alt={w.alt}
                    /* Below the fold on every viewport, so these never
                       compete with the stage cover for first paint. */
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center p-10">
                    {w.logo && (
                      <img
                        src={w.logo}
                        alt={`${w.title} logo`}
                        loading="lazy"
                        decoding="async"
                        className="max-h-20 w-auto opacity-80"
                      />
                    )}
                  </div>
                )}
              </div>

              <div className="mt-5 flex items-baseline justify-between gap-4">
                <span className="text-2xl">{w.title}</span>
                <span className="label shrink-0">{w.role}</span>
              </div>
              {w.note && <p className="mt-2 max-w-[46ch] text-text-dim">{w.note}</p>}
              <span className="label mt-3 inline-block text-text">
                {w.href ? `Open ${w.title} →` : 'Archived · no public URL'}
              </span>
            </>
          )

          return (
            <li key={w.title} data-reveal>
              {w.href ? (
                <a
                  href={w.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group block rounded-panel transition-opacity hover:opacity-95"
                >
                  {body}
                </a>
              ) : (
                // opacity-80 measured (via getComputedStyle + canvas
                // rasterization): .label is already --text-dim, and at
                // opacity-50 the archived row rendered at an actual 2.59:1
                // against the void, failing WCAG AA. 80 is the lowest
                // standard step that still clears 4.5:1 (4.92:1) while
                // keeping the card visibly muted.
                <div className="opacity-80">{body}</div>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
