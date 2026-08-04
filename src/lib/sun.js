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
