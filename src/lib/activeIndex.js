/**
 * Which project should be active, given continuous scroll progress. A
 * boundary crossed by a hair (ordinary scroll jitter, not real intent)
 * must not flip the result -- doing so retriggers the crossfade before the
 * last one finishes, ghosting two projects together instead of ever
 * completing one clean transition. `hysteresis` is a dead zone, in project
 * units, the current index must be pushed past before giving up its slot.
 */
export function nextActiveIndex(prev, raw, count, hysteresis) {
  const target = Math.min(count - 1, Math.floor(raw + 0.0001))
  if (target === prev) return prev
  const crossedForward = target > prev && raw >= prev + 1 + hysteresis
  const crossedBack = target < prev && raw <= prev - hysteresis
  return crossedForward || crossedBack ? target : prev
}
