import { useRef } from 'react'
import { webWork } from '../data/web'
import { useReveal } from '../hooks/useReveal'

export default function WebBand() {
  const ref = useRef(null)
  useReveal(ref)

  return (
    <section ref={ref} id="web" className="shell py-24">
      <p className="label" data-reveal>Web and e-commerce</p>
      <h2 className="mb-12 mt-4 text-title" data-reveal>Shops I designed and built.</h2>
      <ul className="divide-y divide-white/10 border-y border-white/10">
        {webWork.map((w) => {
          const inner = (
            <div className="flex items-baseline justify-between gap-6 py-6">
              <span className="text-2xl">{w.title}</span>
              <span className="label">{w.status === 'archived' ? 'Offline' : w.role}</span>
            </div>
          )
          return (
            <li key={w.title} data-reveal>
              {w.href ? (
                <a href={w.href} target="_blank" rel="noreferrer" className="block transition-opacity hover:opacity-60">{inner}</a>
              ) : (
                // opacity-50 measured (via getComputedStyle + canvas
                // rasterization) at rendering the "Offline" label — .label,
                // already --text-dim — at an actual 2.59:1 against the void,
                // failing WCAG AA. opacity-80 is the lowest standard Tailwind
                // step that still clears 4.5:1 for that label (4.92:1) while
                // keeping a visibly muted "archived" row.
                <div className="opacity-80">{inner}</div>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
