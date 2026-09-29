/**
 * Measures where the title capsule really sits, in the coordinates the shader
 * uses.
 *
 * Used by: components/Stage.jsx
 * Uses: nothing
 *
 * How it works: reads the capsule's DOM rect and the stage's rect, converts to
 * 0..1 centre and half size, and flips the y axis, because the shader counts
 * from the bottom and CSS counts from the top. This is the only place that
 * flip happens. It re-measures on resize and whenever the active project or
 * the render path changes.
 */
import { useEffect, useState } from 'react'

/**
 * DOM rect -> shader-space capsule. Shader y is 1 at the top of the frame,
 * 0 at the bottom (established when the capsule position was first tuned,
 * see src/gl/refract.js), the opposite of CSS's top-down convention, so
 * this is the one place that flip happens.
 */
export function rectToCapsule(capRect, stageRect) {
  const sw = Math.max(1, stageRect.width)
  const sh = Math.max(1, stageRect.height)
  const cx = (capRect.left + capRect.width / 2 - stageRect.left) / sw
  const cyTopDown = (capRect.top + capRect.height / 2 - stageRect.top) / sh
  return {
    x: cx,
    y: 1 - cyTopDown,
    hw: capRect.width / 2 / sw,
    hh: capRect.height / 2 / sh,
  }
}

/**
 * Tracks a capsule element's position relative to its stage container, in
 * shader UV space. Follows this codebase's established rAF-throttled
 * resize/scroll pattern (Rail.jsx, usePush.js) rather than introducing
 * ResizeObserver as a new primitive for one hook. Re-measures whenever
 * anything in `deps` changes (e.g. the active project's title, which
 * changes the capsule's width).
 */
export function useCapsuleRect(capsuleRef, containerRef, deps = []) {
  const [rect, setRect] = useState(null)

  useEffect(() => {
    let frame = 0
    const measure = () => {
      frame = 0
      const cap = capsuleRef.current
      const stage = containerRef.current
      if (!cap || !stage) return
      setRect(rectToCapsule(cap.getBoundingClientRect(), stage.getBoundingClientRect()))
    }
    const schedule = () => {
      if (frame) return
      frame = requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener('resize', schedule, { passive: true })
    window.addEventListener('scroll', schedule, { passive: true })
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('resize', schedule)
      window.removeEventListener('scroll', schedule)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return rect
}
