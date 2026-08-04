import { describe, it, expect } from 'vitest'
import { sunFromScroll } from './sun'

describe('sunFromScroll', () => {
  it('starts the sun on the left at the top of the page', () => {
    const { x, progress } = sunFromScroll(0, 5000, 1000)
    expect(progress).toBe(0)
    expect(x).toBe(-1)
  })

  it('ends the sun on the right at the bottom of the page', () => {
    const { x, progress } = sunFromScroll(4000, 5000, 1000)
    expect(progress).toBe(1)
    expect(x).toBe(1)
  })

  it('puts the sun overhead at the midpoint', () => {
    const { x } = sunFromScroll(2000, 5000, 1000)
    expect(x).toBeCloseTo(0)
  })

  it('lowers the sun as the page progresses, never below the horizon', () => {
    const top = sunFromScroll(0, 5000, 1000)
    const bottom = sunFromScroll(4000, 5000, 1000)
    expect(bottom.y).toBeLessThan(top.y)
    expect(bottom.y).toBeGreaterThan(0)
  })

  it('clamps negative scroll (rubber-band overscroll)', () => {
    expect(sunFromScroll(-200, 5000, 1000).progress).toBe(0)
  })

  it('clamps scroll past the end', () => {
    expect(sunFromScroll(99999, 5000, 1000).progress).toBe(1)
  })

  it('does not divide by zero when the page is shorter than the viewport', () => {
    const { x, y, progress } = sunFromScroll(0, 500, 1000)
    expect(Number.isFinite(x)).toBe(true)
    expect(Number.isFinite(y)).toBe(true)
    expect(progress).toBe(0)
  })
})
