import { describe, it, expect } from 'vitest'
import { rectToCapsule } from './useCapsuleRect'

describe('rectToCapsule', () => {
  const stage = { left: 0, top: 0, width: 1000, height: 800 }

  it('centres a capsule dead-centre of the stage at (0.5, 0.5)', () => {
    const cap = { left: 450, top: 380, width: 100, height: 40 }
    const r = rectToCapsule(cap, stage)
    expect(r.x).toBeCloseTo(0.5, 2)
    expect(r.y).toBeCloseTo(0.5, 2)
  })

  it('flips y: a capsule near the CSS top reads as shader-y near 1', () => {
    const cap = { left: 450, top: 0, width: 100, height: 40 }
    const r = rectToCapsule(cap, stage)
    expect(r.y).toBeGreaterThan(0.9)
  })

  it('a capsule near the CSS bottom reads as shader-y near 0', () => {
    const cap = { left: 450, top: 760, width: 100, height: 40 }
    const r = rectToCapsule(cap, stage)
    expect(r.y).toBeLessThan(0.1)
  })

  it('converts capsule size to half-fractions of the stage', () => {
    const cap = { left: 450, top: 380, width: 200, height: 80 }
    const r = rectToCapsule(cap, stage)
    expect(r.hw).toBeCloseTo(0.1, 5)  // 100/1000
    expect(r.hh).toBeCloseTo(0.05, 5) // 40/800
  })

  it('accounts for the stage not starting at the viewport origin', () => {
    const offsetStage = { left: 200, top: 100, width: 1000, height: 800 }
    const cap = { left: 650, top: 480, width: 100, height: 40 }
    const r = rectToCapsule(cap, offsetStage)
    expect(r.x).toBeCloseTo(0.5, 2)
    expect(r.y).toBeCloseTo(0.5, 2)
  })

  it('does not divide by zero on a zero-sized stage', () => {
    const r = rectToCapsule({ left: 0, top: 0, width: 10, height: 10 }, { left: 0, top: 0, width: 0, height: 0 })
    expect(Number.isFinite(r.x)).toBe(true)
    expect(Number.isFinite(r.y)).toBe(true)
    expect(Number.isFinite(r.hw)).toBe(true)
    expect(Number.isFinite(r.hh)).toBe(true)
  })
})
