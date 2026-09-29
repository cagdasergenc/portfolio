import { useEffect, useRef } from 'react'

/**
 * The rail: a fixed tick scale down the right edge showing scroll position.
 *
 * Used by: routes/Home.jsx
 * Uses: nothing
 *
 * How it works: 48 ticks, and a scroll listener brightens the ones near the
 * current position. It is decorative, so it is aria-hidden and out of the tab
 * order. It repeats no navigation, because a second way to reach the same
 * sections would just compete with the nav.
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
