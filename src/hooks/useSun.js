import { useEffect } from 'react'
import { sunFromScroll, sunFromPointer, blendSun } from '../lib/sun'

/**
 * Writes the page's single light source to CSS custom properties,
 * at most once per animation frame. Every shadow on the page — CSS and
 * WebGL alike — reads these two values, so there is only ever one sun.
 *
 * The pointer leads; scroll provides the slow arc underneath it. Scroll
 * alone is imperceptible: the sun crosses the whole document, so it moves a
 * few pixels per screenful and reads as nothing happening at all.
 */
export function useSun() {
  useEffect(() => {
    const root = document.documentElement
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    let pointer = null

    const apply = () => {
      frame = 0
      const scrollSun = sunFromScroll(
        window.scrollY,
        document.documentElement.scrollHeight,
        window.innerHeight,
      )
      const pointerSun = pointer
        ? sunFromPointer(pointer.x, pointer.y, window.innerWidth, window.innerHeight)
        : null
      const { x, y } = blendSun(scrollSun, pointerSun)
      root.style.setProperty('--sun-x', x.toFixed(4))
      root.style.setProperty('--sun-y', y.toFixed(4))
    }

    const schedule = () => {
      if (frame) return
      frame = requestAnimationFrame(apply)
    }

    const onPointer = (e) => {
      pointer = { x: e.clientX, y: e.clientY }
      schedule()
    }

    if (reduced.matches) {
      // Static midday light. Shadows still exist and still agree with the
      // 3D scene; they just stop moving.
      root.style.setProperty('--sun-x', '-0.35')
      root.style.setProperty('--sun-y', '0.92')
      return
    }

    apply()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule, { passive: true })
    window.addEventListener('pointermove', onPointer, { passive: true })
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      window.removeEventListener('pointermove', onPointer)
    }
  }, [])
}
