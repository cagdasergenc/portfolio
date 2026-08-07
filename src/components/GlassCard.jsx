import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { createRefractor } from '../gl/refract'
import Glass from './Glass'
import { CAPSULE_CLASS, Meta, FlatCard } from './WorkGridFlat'

/**
 * One refracting card: a canvas sized to fill the card, the title capsule
 * positioned over it in the DOM, metadata below on the void ground.
 *
 * StrictMode double-invokes effects in dev — mount, cleanup, mount again —
 * and `destroy()` (Task 4) always calls `WEBGL_lose_context.loseContext()`
 * on whatever canvas it was given. A canvas whose context has been lost
 * that way can never produce a working context again: a second
 * `getContext('webgl2')` call on it returns the same dead context object,
 * not a fresh one. Reusing a React-rendered `<canvas ref>` across that
 * second setup call is exactly what renders nothing.
 *
 * The fix is to never hand `createRefractor` a canvas that might already
 * have been through this: the canvas is created with `document.createElement`
 * *inside* the effect and appended imperatively, so every setup call —
 * including the second StrictMode one — gets a canvas element that has
 * never been used before. The old one is removed in cleanup alongside
 * `destroy()`. No React key or ref-reuse is involved, so there is nothing
 * for the double-invoke to catch.
 */
export default function GlassCard({ project }) {
  const wrapRef = useRef(null)
  const [failed, setFailed] = useState(false)
  // Knowable from props alone, so it's a render-time branch below rather
  // than a state update from inside the effect.
  const noCover = !project.cover

  useEffect(() => {
    if (noCover) return
    const wrap = wrapRef.current
    if (!wrap) return

    const canvas = document.createElement('canvas')
    canvas.className = 'absolute inset-0 h-full w-full'
    wrap.appendChild(canvas)

    const refractor = createRefractor(canvas, project.cover)
    if (!refractor) {
      canvas.remove()
      // Deferred: this is an external system (WebGL) reporting its result
      // back, not a value derivable during render, so it belongs in a
      // callback rather than synchronously in the effect body.
      queueMicrotask(() => setFailed(true))
      return
    }

    const root = document.documentElement
    let raf = 0
    let visible = false

    const tick = () => {
      raf = 0
      if (!visible) return
      const style = getComputedStyle(root)
      refractor.setPush(
        parseFloat(style.getPropertyValue('--push-x')) || 0.5,
        parseFloat(style.getPropertyValue('--push-y')) || 0.5,
        parseFloat(style.getPropertyValue('--push-force')) || 0,
      )
      refractor.render()
      raf = requestAnimationFrame(tick)
    }

    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      refractor.resize(width, height)
      refractor.render()
    })
    ro.observe(wrap)

    // Off-screen cards stop driving the shader entirely rather than just
    // skipping renders, so a page with several of these never runs more
    // than the visible ones through requestAnimationFrame.
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible && !raf) raf = requestAnimationFrame(tick)
    })
    io.observe(wrap)

    return () => {
      io.disconnect()
      ro.disconnect()
      cancelAnimationFrame(raf)
      refractor.destroy()
      canvas.remove()
    }
  }, [project.cover, noCover])

  if (noCover || failed) return <FlatCard project={project} hidden />

  return (
    <Link to={`/work/${project.slug}`} className="group block" tabIndex={-1} aria-hidden="true">
      <div
        ref={wrapRef}
        className="relative aspect-[4/5] w-full overflow-hidden rounded-panel bg-white/5 transition-transform duration-500 ease-out group-hover:-translate-y-1"
      >
        <Glass as="div" className={CAPSULE_CLASS}>
          <h3 className="truncate text-card text-text">{project.title}</h3>
        </Glass>
      </div>
      <Meta project={project} />
    </Link>
  )
}
