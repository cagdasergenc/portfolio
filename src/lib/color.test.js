import { describe, it, expect } from 'vitest'
import { hexToRgbFloat } from './color'

describe('hexToRgbFloat', () => {
  it('converts a 6-digit hex with a leading #', () => {
    const [r, g, b] = hexToRgbFloat('#0A0A0C')
    expect(r).toBeCloseTo(10 / 255, 5)
    expect(g).toBeCloseTo(10 / 255, 5)
    expect(b).toBeCloseTo(12 / 255, 5)
  })

  it('accepts a hex with no leading #', () => {
    const [r] = hexToRgbFloat('0A0A0C')
    expect(r).toBeCloseTo(10 / 255, 5)
  })

  it('accepts leading/trailing whitespace, as getComputedStyle sometimes returns', () => {
    const [r] = hexToRgbFloat('  #0A0A0C  ')
    expect(r).toBeCloseTo(10 / 255, 5)
  })

  it('is case-insensitive', () => {
    const a = hexToRgbFloat('#0a0a0c')
    const b = hexToRgbFloat('#0A0A0C')
    expect(a).toEqual(b)
  })

  it('white maps to [1, 1, 1]', () => {
    expect(hexToRgbFloat('#FFFFFF')).toEqual([1, 1, 1])
  })

  it('black maps to [0, 0, 0]', () => {
    expect(hexToRgbFloat('#000000')).toEqual([0, 0, 0])
  })

  it('throws on a malformed value rather than silently returning black', () => {
    expect(() => hexToRgbFloat('not-a-color')).toThrow()
    expect(() => hexToRgbFloat('')).toThrow()
  })
})
