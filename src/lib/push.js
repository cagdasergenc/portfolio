/**
 * The maths behind the pointer field.
 *
 * Used by: hooks/usePush.js
 * Uses: nothing
 *
 * How it works: pointerToField normalises the pointer to 0..1. damp is a frame
 * rate independent exponential decay, so the settle feels the same at 30fps
 * and at 120fps. forceFromVelocity turns pointer speed into the 0..1 force the
 * sheen and the shader read. Kept separate from the hook so it can be tested
 * without a browser (see push.test.js).
 */
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v))

/** Pointer position as a normalised 0..1 field coordinate. */
export function pointerToField(x, y, w, h) {
  return {
    x: clamp(x / Math.max(1, w), 0, 1),
    y: clamp(y / Math.max(1, h), 0, 1),
  }
}

/**
 * Frame-rate independent exponential decay. This is what gives the glass
 * viscosity: the value chases the target instead of snapping to it, and it
 * settles at the same rate whether the display runs at 30fps or 120fps.
 * A naive `current + (target - current) * 0.1` would move at different real
 * speeds on different machines.
 */
export function damp(current, target, lambda, dt) {
  if (!(dt > 0)) return current
  return target + (current - target) * Math.exp(-lambda * dt)
}

/** Push strength from pointer speed, saturating at 1. */
export function forceFromVelocity(dx, dy, cap) {
  const speed = Math.hypot(dx, dy)
  return clamp(speed / Math.max(1, cap), 0, 1)
}
