import { useEffect } from 'react'
import { sunFromScroll } from '../lib/sun'

/**
 * Writes the page's single light source to CSS custom properties,
 * at most once per animation frame. Every shadow on the page — CSS and
 * WebGL alike — reads these two values, so there is only ever one sun.
 */
export function useSun() {
  useEffect(() => {
    const root = document.documentElement
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0

    const apply = () => {
      frame = 0
      const { x, y } = sunFromScroll(
        window.scrollY,
        document.documentElement.scrollHeight,
        window.innerHeight,
      )
      root.style.setProperty('--sun-x', x.toFixed(4))
      root.style.setProperty('--sun-y', y.toFixed(4))
    }

    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(apply)
    }

    if (reduced.matches) {
      // Static midday light. Shadows still exist and still agree with the
      // 3D scene; they just stop moving.
      root.style.setProperty('--sun-x', '-0.35')
      root.style.setProperty('--sun-y', '0.92')
      return
    }

    apply()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])
}
