/**
 * Maps scroll position to a light direction.
 * The sun travels left → right across the page and sinks as it goes,
 * so shadows lengthen and swing as the visitor scrolls.
 * Returns a unit-ish vector: x ∈ [-1, 1], y ∈ [0.55, 1].
 */
export function sunFromScroll(scrollY, docHeight, viewportHeight) {
  const scrollable = Math.max(1, docHeight - viewportHeight)
  const progress = Math.min(1, Math.max(0, scrollY / scrollable))
  return {
    x: -1 + progress * 2,
    y: 1 - progress * 0.45,
    progress,
  }
}

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v))

/**
 * Maps a pointer position to a light direction, as if the light source sat
 * where the cursor is: left of frame throws shadows right, a cursor near the
 * top puts the sun overhead, near the bottom it rakes low.
 * Same output contract as sunFromScroll: x ∈ [-1, 1], y ∈ [0.55, 1].
 */
export function sunFromPointer(pointerX, pointerY, viewportWidth, viewportHeight) {
  const px = clamp(pointerX / Math.max(1, viewportWidth), 0, 1)
  const py = clamp(pointerY / Math.max(1, viewportHeight), 0, 1)
  return {
    x: px * 2 - 1,
    y: 1 - py * 0.45,
  }
}

/**
 * Blends the scroll arc with the pointer.
 *
 * Scroll alone is too slow to read: the sun crosses the page over the whole
 * document, so at any moment nothing appears to move. The pointer supplies
 * the immediate, legible response — you move the mouse, the light moves —
 * while scroll keeps the slow arc underneath it. `weight` is how much of the
 * result the pointer owns.
 *
 * With no pointer (touch devices, before first move), pass null and this
 * returns the scroll arc unchanged.
 */
export function blendSun(scrollSun, pointerSun, weight = 0.7) {
  if (!pointerSun) return { x: scrollSun.x, y: scrollSun.y }
  const w = clamp(weight, 0, 1)
  return {
    x: clamp(scrollSun.x * (1 - w) + pointerSun.x * w, -1, 1),
    y: clamp(scrollSun.y * (1 - w) + pointerSun.y * w, 0.55, 1),
  }
}
