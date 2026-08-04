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
        return !!document.createElement('canvas').getContext('webgl2')
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
