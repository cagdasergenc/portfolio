// Guards lib/scrim.js: a bright cover must get a strong scrim, a dark cover
// must not be painted black, and both stay inside BOUNDS.
import { describe, it, expect } from 'vitest'
import { requiredAlpha } from './scrim'
import { contrastRatio, composite } from './contrast'

const TEXT_DIM = [155, 155, 166]
const VOID = [10, 10, 12]

/** n pixels of one colour, as flat RGBA bytes. */
const band = (rgb, n) => new Uint8ClampedArray(n * 4).map((_, i) => (i % 4 === 3 ? 255 : rgb[i % 4]))

describe('requiredAlpha', () => {
  it('asks for almost no scrim over an already dark cover', () => {
    expect(requiredAlpha(band([12, 14, 20], 64), TEXT_DIM, VOID)).toBeLessThanOrEqual(0.1)
  })

  it('asks for a heavy scrim over a blown-out cover', () => {
    expect(requiredAlpha(band([255, 255, 255], 64), TEXT_DIM, VOID)).toBeGreaterThanOrEqual(0.8)
  })

  it('returns an alpha that actually clears 4.5:1 against that cover', () => {
    const cover = [230, 220, 200]
    const a = requiredAlpha(band(cover, 64), TEXT_DIM, VOID)
    expect(contrastRatio(TEXT_DIM, composite(VOID, cover, a))).toBeGreaterThanOrEqual(4.5)
  })

  it('is not dragged to maximum by a single specular pixel', () => {
    const pixels = new Uint8ClampedArray([...band([10, 10, 12], 99), ...band([255, 255, 255], 1)])
    expect(requiredAlpha(pixels, TEXT_DIM, VOID)).toBeLessThan(0.5)
  })
})
