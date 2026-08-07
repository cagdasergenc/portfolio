import { describe, it, expect } from 'vitest'
import { pointerToField, damp, forceFromVelocity } from './push'

describe('pointerToField', () => {
  it('maps the centre to 0.5, 0.5', () => {
    expect(pointerToField(500, 400, 1000, 800)).toEqual({ x: 0.5, y: 0.5 })
  })
  it('maps corners to 0 and 1', () => {
    expect(pointerToField(0, 0, 1000, 800)).toEqual({ x: 0, y: 0 })
    expect(pointerToField(1000, 800, 1000, 800)).toEqual({ x: 1, y: 1 })
  })
  it('clamps a pointer dragged outside the viewport', () => {
    expect(pointerToField(-50, 9999, 1000, 800)).toEqual({ x: 0, y: 1 })
  })
  it('does not divide by zero on a zero-sized viewport', () => {
    const { x, y } = pointerToField(10, 10, 0, 0)
    expect(Number.isFinite(x)).toBe(true)
    expect(Number.isFinite(y)).toBe(true)
  })
})

describe('damp', () => {
  it('moves toward the target without overshooting', () => {
    const next = damp(0, 1, 6, 1 / 60)
    expect(next).toBeGreaterThan(0)
    expect(next).toBeLessThan(1)
  })
  it('converges to the target over many frames', () => {
    let v = 0
    for (let i = 0; i < 240; i++) v = damp(v, 1, 6, 1 / 60)
    expect(v).toBeCloseTo(1, 2)
  })
  it('is frame-rate independent: 30fps and 60fps land in the same place', () => {
    let a = 0
    for (let i = 0; i < 60; i++) a = damp(a, 1, 6, 1 / 60)
    let b = 0
    for (let i = 0; i < 30; i++) b = damp(b, 1, 6, 1 / 30)
    expect(Math.abs(a - b)).toBeLessThan(0.01)
  })
  it('returns the target exactly when already there', () => {
    expect(damp(1, 1, 6, 1 / 60)).toBe(1)
  })
  it('survives a zero or negative delta without NaN', () => {
    expect(Number.isFinite(damp(0, 1, 6, 0))).toBe(true)
    expect(Number.isFinite(damp(0, 1, 6, -1))).toBe(true)
  })
})

describe('forceFromVelocity', () => {
  it('is 0 when the pointer is still', () => {
    expect(forceFromVelocity(0, 0, 40)).toBe(0)
  })
  it('rises with speed', () => {
    expect(forceFromVelocity(20, 0, 40)).toBeGreaterThan(forceFromVelocity(5, 0, 40))
  })
  it('never exceeds 1 however fast the pointer moves', () => {
    expect(forceFromVelocity(99999, 99999, 40)).toBe(1)
  })
  it('uses distance, not just one axis', () => {
    expect(forceFromVelocity(0, 20, 40)).toBeCloseTo(forceFromVelocity(20, 0, 40))
  })
})
