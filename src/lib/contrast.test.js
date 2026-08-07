import { describe, it, expect } from 'vitest'
import { relativeLuminance, contrastRatio, composite, minGlassAlpha } from './contrast'

const WHITE = [255, 255, 255], BLACK = [0, 0, 0]
const TEXT = [244, 244, 246]   // --text
const GLASS = [255, 255, 255]  // glass tint
const VOID = [10, 10, 12]      // --void

describe('relativeLuminance', () => {
  it('is 1 for white and 0 for black', () => {
    expect(relativeLuminance(WHITE)).toBeCloseTo(1, 5)
    expect(relativeLuminance(BLACK)).toBeCloseTo(0, 5)
  })
})

describe('contrastRatio', () => {
  it('is 21:1 for black on white', () => {
    expect(contrastRatio(BLACK, WHITE)).toBeCloseTo(21, 1)
  })
  it('is 1:1 for a colour against itself', () => {
    expect(contrastRatio(TEXT, TEXT)).toBeCloseTo(1, 5)
  })
  it('is symmetric', () => {
    expect(contrastRatio(TEXT, VOID)).toBeCloseTo(contrastRatio(VOID, TEXT), 5)
  })
})

describe('composite', () => {
  it('returns the foreground at alpha 1', () => {
    expect(composite(WHITE, BLACK, 1)).toEqual(WHITE)
  })
  it('returns the background at alpha 0', () => {
    expect(composite(WHITE, BLACK, 0)).toEqual(BLACK)
  })
  it('blends halfway at alpha 0.5', () => {
    expect(composite(WHITE, BLACK, 0.5)).toEqual([128, 128, 128])
  })
})

describe('minGlassAlpha', () => {
  it('needs no glass when the worst background is already dark enough', () => {
    // light text over the void itself already passes
    expect(minGlassAlpha(TEXT, GLASS, VOID)).toBe(0)
  })

  it('returns null when white text can never clear 4.5:1 over a white cover', () => {
    // a fully white cover with a white-tinted glass can never rescue white text
    expect(minGlassAlpha(TEXT, WHITE, WHITE)).toBeNull()
  })

  it('finds a workable alpha for a dark glass over a bright cover', () => {
    const a = minGlassAlpha(TEXT, [12, 12, 14], WHITE)
    expect(a).toBeGreaterThan(0)
    expect(a).toBeLessThanOrEqual(1)
  })

  it('the returned alpha actually achieves the target', () => {
    const glass = [12, 12, 14]
    const a = minGlassAlpha(TEXT, glass, WHITE)
    expect(contrastRatio(TEXT, composite(glass, WHITE, a))).toBeGreaterThanOrEqual(4.5)
  })

  it('one step below the returned alpha does NOT achieve it', () => {
    const glass = [12, 12, 14]
    const a = minGlassAlpha(TEXT, glass, WHITE)
    expect(contrastRatio(TEXT, composite(glass, WHITE, a - 0.02))).toBeLessThan(4.5)
  })

  it('honours a custom target', () => {
    const glass = [12, 12, 14]
    const strict = minGlassAlpha(TEXT, glass, WHITE, 7)
    const loose = minGlassAlpha(TEXT, glass, WHITE, 4.5)
    expect(strict).toBeGreaterThan(loose)
  })
})
