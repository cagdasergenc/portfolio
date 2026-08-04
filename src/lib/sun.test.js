import { describe, it, expect } from 'vitest'
import { sunFromScroll, sunFromPointer, blendSun } from './sun'

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

describe('sunFromPointer', () => {
  it('puts the light on the left when the cursor is on the left', () => {
    expect(sunFromPointer(0, 500, 1000, 1000).x).toBe(-1)
  })

  it('puts the light on the right when the cursor is on the right', () => {
    expect(sunFromPointer(1000, 500, 1000, 1000).x).toBe(1)
  })

  it('puts the light overhead when the cursor is at the top', () => {
    expect(sunFromPointer(500, 0, 1000, 1000).y).toBe(1)
  })

  it('rakes the light low when the cursor is at the bottom', () => {
    expect(sunFromPointer(500, 1000, 1000, 1000).y).toBeCloseTo(0.55)
  })

  it('clamps a pointer dragged outside the viewport', () => {
    expect(sunFromPointer(-400, -400, 1000, 1000).x).toBe(-1)
    expect(sunFromPointer(9999, 9999, 1000, 1000).x).toBe(1)
    expect(sunFromPointer(9999, 9999, 1000, 1000).y).toBeCloseTo(0.55)
  })

  it('does not divide by zero on a zero-sized viewport', () => {
    const { x, y } = sunFromPointer(10, 10, 0, 0)
    expect(Number.isFinite(x)).toBe(true)
    expect(Number.isFinite(y)).toBe(true)
  })
})

describe('blendSun', () => {
  const scroll = { x: -1, y: 1 }

  it('returns the scroll arc untouched when there is no pointer', () => {
    expect(blendSun(scroll, null)).toEqual({ x: -1, y: 1 })
  })

  it('lets the pointer lead at the default weight', () => {
    // pointer hard right, scroll hard left: 0.7 pointer weight wins
    expect(blendSun(scroll, { x: 1, y: 1 }).x).toBeCloseTo(0.4)
  })

  it('honours a custom weight', () => {
    expect(blendSun(scroll, { x: 1, y: 1 }, 0).x).toBe(-1)
    expect(blendSun(scroll, { x: 1, y: 1 }, 1).x).toBe(1)
  })

  it('keeps x within [-1, 1] and y within [0.55, 1]', () => {
    const out = blendSun({ x: -5, y: 9 }, { x: 5, y: -9 })
    expect(out.x).toBeGreaterThanOrEqual(-1)
    expect(out.x).toBeLessThanOrEqual(1)
    expect(out.y).toBeGreaterThanOrEqual(0.55)
    expect(out.y).toBeLessThanOrEqual(1)
  })
})
