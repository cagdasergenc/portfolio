import { useEffect, useRef } from 'react'

/**
 * The index rail — a fixed tick scale down the right edge marking scroll
 * position in the plate's own notation.
 *
 * This is one of the four things that make this world structurally distinct
 * from the sibling branch rather than a re-skin of it: Lit Paper is a centred
 * editorial column and has no rail at all.
 *
 * Decorative by design. It duplicates no navigation and carries no
 * information a sighted visitor cannot get from the page itself, so it is
 * aria-hidden and out of the tab order. Adding it as a second nav would mean
 * two competing ways to reach the same sections.
 */
const TICKS = 48

export default function Rail() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')

    let frame = 0
    const apply = () => {
      frame = 0
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      el.style.setProperty('--rail-p', (window.scrollY / max).toFixed(4))
    }
    const schedule = () => {
      if (frame) return
      frame = requestAnimationFrame(apply)
    }

    apply()
    if (reduced.matches) return
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule, { passive: true })
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [])

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="rail pointer-events-none fixed right-0 top-0 z-40 hidden h-screen w-16 select-none lg:block"
    >
      <div className="flex h-full flex-col items-end justify-center gap-[6px] pr-5">
        {Array.from({ length: TICKS }, (_, i) => (
          <span
            key={i}
            className="rail-tick block h-px origin-right bg-text"
            style={{ '--i': i / (TICKS - 1) }}
          />
        ))}
      </div>
    </div>
  )
}
