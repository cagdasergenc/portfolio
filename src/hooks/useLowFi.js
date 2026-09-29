/**
 * Decides whether the page runs the shader or the plain fallback.
 *
 * Used by: components/Stage.jsx
 * Uses: nothing
 *
 * How it works: returns true for reduced motion, screens under 900px, or no
 * WebGL context. It starts true and only turns false once the checks pass, so
 * the first paint is never the heavy path. True is not a failure state, it is
 * the other supported path.
 */
import { useEffect, useState } from 'react'

/** True when the 3D path should be skipped: reduced motion, a small
 *  screen, or no WebGL. The CSS fallback is a first-class path, so this
 *  returning true is not a failure state. */
export function useLowFi() {
  const [lowFi, setLowFi] = useState(true)

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const small = window.matchMedia('(max-width: 900px)')

    const hasWebGL = () => {
      try {
        const ctx = document.createElement('canvas').getContext('webgl2')
        ctx?.getExtension('WEBGL_lose_context')?.loseContext()
        return !!ctx
      } catch {
        return false
      }
    }

    const evaluate = () => setLowFi(motion.matches || small.matches || !hasWebGL())
    evaluate()
    motion.addEventListener('change', evaluate)
    small.addEventListener('change', evaluate)
    return () => {
      motion.removeEventListener('change', evaluate)
      small.removeEventListener('change', evaluate)
    }
  }, [])

  return lowFi
}
