import { useRef } from 'react'
import { webWork } from '../data/web'
import { useReveal } from '../hooks/useReveal'
import { track } from '../lib/analytics'

/**
 * The shops section on the landing page.
 *
 * Used by: routes/Home.jsx
 * Uses: data/web.js for the shops, hooks/useReveal.js for the entry animation
 *
 * How it works: one preview card per shop, each leading with a real
 * screenshot of the live site. The whole card is a single link, so the tab
 * order is one stop per shop and the entire surface is the tap target.
 * The padding is lopsided on purpose. Evenly padded stacks read as templated.
 */
export default function WebBand() {
  const ref = useRef(null)
  useReveal(ref)

  return (
    <section ref={ref} id="web" className="shell pb-20 pt-32 md:pb-24 md:pt-48">
      <h2 className="mb-10 text-title" data-reveal>Shops I designed.</h2>
      <ul className="grid gap-x-8 gap-y-14 md:grid-cols-2">
        {webWork.map((w) => (
          <li key={w.title} data-reveal>
            <a
              href={w.href}
              target="_blank"
              rel="noreferrer"
              onClick={() => track('shop_visit', { shop: w.title })}
              className="group block rounded-panel transition-opacity hover:opacity-95"
            >
              <div className="specimen relative aspect-[16/9] w-full overflow-hidden bg-white/5">
                <img
                  src={w.shot}
                  alt={w.alt}
                  /* Below the fold on every viewport, so these never
                     compete with the stage cover for first paint. */
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
              </div>
              <div className="mt-5 flex items-baseline justify-between gap-4">
                <span className="text-2xl">{w.title}</span>
                <span className="label shrink-0">{w.role}</span>
              </div>
              <p className="mt-2 max-w-[46ch] text-text-dim">{w.note}</p>
              <span className="label mt-3 inline-block text-text">Open {w.title} →</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
