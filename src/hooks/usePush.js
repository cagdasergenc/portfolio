import { useEffect } from 'react'
import { pointerToField, damp, forceFromVelocity } from '../lib/push'

const LAMBDA = 5.5   // viscosity — lower is thicker
const CAP = 45       // px/frame at which force saturates

/**
 * The page's single displacement field. Both the refraction shader and the
 * DOM read --push-x / --push-y / --push-force, so the glass and the chrome
 * can never disagree.
 *
 * The damped chase is the whole effect: a value that snaps to the cursor
 * reads as a hover state, one that lags and settles reads as a material.
 */
export function usePush() {
  useEffect(() => {
    const root = document.documentElement
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')

    if (reduced.matches) {
      root.style.setProperty('--push-x', '0.5')
      root.style.setProperty('--push-y', '0.5')
      root.style.setProperty('--push-force', '0')
      return
    }

    let target = { x: 0.5, y: 0.5 }
    let current = { x: 0.5, y: 0.5 }
    let force = 0, targetForce = 0
    let last = { x: 0, y: 0 }, seen = false
    let raf = 0, prev = 0

    const onPointer = (e) => {
      const f = pointerToField(e.clientX, e.clientY, window.innerWidth, window.innerHeight)
      target = f
      if (seen) targetForce = forceFromVelocity(e.clientX - last.x, e.clientY - last.y, CAP)
      last = { x: e.clientX, y: e.clientY }
      seen = true
    }

    const frame = (t) => {
      const dt = prev ? Math.min(0.05, (t - prev) / 1000) : 1 / 60
      prev = t
      current.x = damp(current.x, target.x, LAMBDA, dt)
      current.y = damp(current.y, target.y, LAMBDA, dt)
      targetForce = damp(targetForce, 0, 2.2, dt)   // force bleeds off when still
      force = damp(force, targetForce, LAMBDA, dt)
      root.style.setProperty('--push-x', current.x.toFixed(4))
      root.style.setProperty('--push-y', current.y.toFixed(4))
      root.style.setProperty('--push-force', force.toFixed(4))
      raf = requestAnimationFrame(frame)
    }

    window.addEventListener('pointermove', onPointer, { passive: true })
    raf = requestAnimationFrame(frame)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onPointer)
    }
  }, [])
}
