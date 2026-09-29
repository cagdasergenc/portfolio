// Guards lib/activeIndex.js: the dead zone that stops the stage flickering
// between two projects at a boundary.
import { describe, it, expect } from 'vitest'
import { nextActiveIndex } from './activeIndex'

describe('nextActiveIndex', () => {
  const COUNT = 3
  const H = 0.06

  it('stays put on raw values still inside the current index', () => {
    expect(nextActiveIndex(1, 1.5, COUNT, H)).toBe(1)
  })

  it('does not flip forward on jitter that barely touches the next boundary', () => {
    expect(nextActiveIndex(1, 2.0, COUNT, H)).toBe(1)
    expect(nextActiveIndex(1, 2.02, COUNT, H)).toBe(1)
  })

  it('does not flip backward on jitter that barely dips below the current boundary', () => {
    expect(nextActiveIndex(2, 1.98, COUNT, H)).toBe(2)
  })

  it('advances once raw clears the hysteresis band past the boundary', () => {
    expect(nextActiveIndex(1, 2.07, COUNT, H)).toBe(2)
  })

  it('retreats once raw clears the hysteresis band on the way back', () => {
    expect(nextActiveIndex(2, 1.93, COUNT, H)).toBe(1)
  })

  it('jumps directly to the target on a large scroll movement, not just one step', () => {
    expect(nextActiveIndex(0, 2.5, COUNT, H)).toBe(2)
    expect(nextActiveIndex(2, 0.1, COUNT, H)).toBe(0)
  })

  it('clamps to the last index even if raw exceeds the project count', () => {
    // raw is always pre-clamped to [0, count] by the caller (p is clamped
    // to [0,1] before multiplying) -- this only guards the exact-count
    // edge, not arbitrary out-of-range input.
    expect(nextActiveIndex(1, 5, COUNT, H)).toBe(2)
  })
})
