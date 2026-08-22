import { useEffect, useRef, useState } from 'react'
import { createRefractor } from '../gl/refract'
import { hexToRgbFloat } from '../lib/color'

// Same three-stop values Stage.jsx's CSS gradients used before the scrims
// moved into the shader (Task 2). Keep these two in sync by hand if the
// visual design changes — there is exactly one rendering path now, so
// there is exactly one place to change it.
const SCRIMS = {
  topHeight: 0.52, topStart: 0.86, topMid: 0.60,
  botHeight: 0.56, botStart: 0.96, botMid: 0.88,
}

/**
 * One project's background layer on the stage. Renders an <img>
 * immediately and unconditionally — that is what a visitor sees at first
 * paint regardless of what happens next. Only once WebGL2 initialises AND
 * the cover texture has loaded does a <canvas> mount on top and take over;
 * at that exact moment the canvas is showing the same pixels the <img>
 * was already showing (push is centred, force is 0 until the pointer
 * moves), so the swap is invisible and never delays LCP.
 *
 * Only the ACTIVE project holds a live refractor — inactive projects stay
 * plain <img> and never pay for a WebGL context at all.
 */
export default function StageCanvas({ project, active, capsule, onCanvasReady }) {
  const containerRef = useRef(null)
  const refractorRef = useRef(null)
  const rafRef = useRef(0)
  const [canvasLive, setCanvasLive] = useState(false)

  // Mount/tear down the refractor as `active` and `project.cover` change.
  useEffect(() => {
    if (!active || !project.cover) return

    const container = containerRef.current
    if (!container) return

    // Created and appended imperatively, not via a React-rendered <canvas
    // ref>: a canvas whose WebGL context has been explicitly lost
    // (destroy(), below) can never produce a working context again. React
    // StrictMode's dev-only mount->cleanup->mount would otherwise hand the
    // second setup the same poisoned DOM node -- creating a fresh element
    // here guarantees setup always gets a canvas that has never had a
    // context. It also isn't appended until the texture is actually ready
    // (see the frame() loop below), so the <img> genuinely stays what's
    // visible until there's real content to swap to.
    const canvas = document.createElement('canvas')
    canvas.className = 'absolute inset-0 h-full w-full'
    canvas.setAttribute('aria-hidden', 'true')

    const refractor = createRefractor(canvas, project.cover)
    if (!refractor) {
      // WebGL2 unavailable or the shader failed to compile on this GPU.
      // The <img> underneath is already showing — nothing to fall back
      // FROM, there is simply no enhancement this time. canvasLive already
      // defaults false, so this is a no-op in practice, but the lint rule
      // flags the pattern regardless of that.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCanvasLive(false)
      onCanvasReady?.(false)
      return
    }

    refractorRef.current = refractor

    const root = document.documentElement
    const voidHex = getComputedStyle(root).getPropertyValue('--color-void').trim() || '#0A0A0C'
    refractor.setVoidColor(...hexToRgbFloat(voidHex))
    refractor.setScrims(SCRIMS)

    const resize = () => {
      const rect = containerRef.current?.getBoundingClientRect()
      if (rect) refractor.resize(rect.width, rect.height)
    }
    resize()
    window.addEventListener('resize', resize, { passive: true })

    let announced = false
    const frame = () => {
      const style = getComputedStyle(root)
      refractor.setPush(
        parseFloat(style.getPropertyValue('--push-x')) || 0.5,
        parseFloat(style.getPropertyValue('--push-y')) || 0.5,
        parseFloat(style.getPropertyValue('--push-force')) || 0,
      )
      refractor.render()
      if (!announced && refractor.isReady()) {
        announced = true
        container.appendChild(canvas)
        setCanvasLive(true)
        onCanvasReady?.(true)
      }
      rafRef.current = requestAnimationFrame(frame)
    }
    rafRef.current = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
      refractor.destroy()
      refractorRef.current = null
      if (canvas.isConnected) container.removeChild(canvas)
      setCanvasLive(false)
      onCanvasReady?.(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, project.cover])

  // Push the measured DOM capsule into the shader whenever it changes.
  useEffect(() => {
    if (capsule && refractorRef.current) {
      refractorRef.current.setCapsule(capsule.x, capsule.y, capsule.hw, capsule.hh)
    }
  }, [capsule])

  return (
    <div ref={containerRef} className="absolute inset-0">
      {project.cover ? (
        <img
          src={project.cover}
          alt={`Cover of the ${project.title} case study`}
          className="h-full w-full object-cover"
          style={{ visibility: canvasLive ? 'hidden' : 'visible' }}
          loading={active ? 'eager' : 'lazy'}
          decoding="async"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center px-8">
          <span className="max-w-[16ch] text-center text-display leading-[0.95] text-white/8">
            {project.title}
          </span>
        </div>
      )}
    </div>
  )
}
