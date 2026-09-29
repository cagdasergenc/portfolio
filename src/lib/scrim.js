/**
 * How dark the shading over a cover has to be, measured per cover.
 *
 * Used by: components/StageCanvas.jsx
 * Uses: lib/contrast.js
 *
 * How it works: it samples the pixels of the cover where the headline and the
 * metadata sit, takes a high percentile rather than the average so a bright
 * patch cannot hide under a dark mean, and asks contrast.js what alpha that
 * needs. BOUNDS then clamps the answer, so a dark cover is never painted
 * black and a bright one is never left unreadable.
 */
import { minGlassAlpha } from './contrast'

/**
 * How dark the stage scrim has to be for THIS cover, rather than for the
 * worst cover imaginable.
 *
 * The fixed constants this replaces were derived against a blown-out white
 * cover, which is genuinely what Pocket Pediatrics' old cream illustration
 * needs. EXE's cover is near-black, and the same constants painted 96%
 * void over an image that was already dark, leaving a black rectangle where
 * the project should have been recognisable.
 *
 * Each band is measured against the dimmest text it actually carries: the
 * top holds only near-white type, the bottom also holds --text-dim, which
 * has a far higher floor. Measuring them separately is the difference
 * between a light top band and one darkened for text that isn't there.
 */

/** 98th percentile, so one specular pixel cannot darken the whole band. */
const PERCENTILE = 0.98

/**
 * Contrast is the floor's lower bound, but not its only job. Both covers
 * here are full slides carrying their own headline and footer type, and
 * EXE's is dark enough that a purely contrast-driven scrim came out near
 * zero -- which left the slide's own footer credit sitting in the same
 * corner as the stage's tagline, two texts competing in one place. These
 * bounds keep a cover's lettering subordinate to the site's own without
 * going back to painting a dark cover black.
 */
const BOUNDS = {
  top: { min: 0.45, max: 0.90 },
  // 0.84 is not a taste value: it is the alpha at which --text-dim clears
  // 4.5:1 over a blown-out cover (src/lib/contrast.js), already the
  // documented floor for this band. Holding the bottom there regardless of
  // measurement is what stops a dark cover's own footer credit sharing the
  // corner with the stage's tagline. The top band, which no cover prints
  // into as heavily, is where the real lightening happens.
  bottom: { min: 0.84, max: 0.96 },
}

const clamp = (v, { min, max }) => Math.min(max, Math.max(min, v))

/**
 * @param pixels flat RGBA bytes, as returned by getImageData
 * @param textRgb [r,g,b] 0..255 of the text that must stay readable
 * @param voidRgb [r,g,b] 0..255 of the scrim colour
 */
export function requiredAlpha(pixels, textRgb, voidRgb) {
  const needed = []
  for (let i = 0; i < pixels.length; i += 4) {
    const alpha = minGlassAlpha(textRgb, voidRgb, [pixels[i], pixels[i + 1], pixels[i + 2]])
    // null means no opacity of this scrim can rescue the text, which for an
    // opaque void scrim cannot happen; treat it as "fully opaque" anyway
    // rather than silently dropping the sample.
    needed.push(alpha === null ? 1 : alpha)
  }
  if (needed.length === 0) return 1
  needed.sort((a, b) => a - b)
  return needed[Math.min(needed.length - 1, Math.floor(needed.length * PERCENTILE))]
}

/**
 * Measures a loaded, same-origin image element and returns values in the shape
 * refractor.setScrims expects. Band heights are unchanged: they are sized to
 * the text blocks that sit in them, and it is the opacity, not the extent,
 * that was wrong.
 */
export function measureScrims(img, { textTop, textBottom, voidRgb, heights }) {
  const W = 32, H = 18
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')
  if (!ctx) return null
  ctx.drawImage(img, 0, 0, W, H)

  const topRows = Math.max(1, Math.round(H * heights.topHeight))
  const botRows = Math.max(1, Math.round(H * heights.botHeight))

  let top, bot
  try {
    top = ctx.getImageData(0, 0, W, topRows).data
    bot = ctx.getImageData(0, H - botRows, W, botRows).data
  } catch {
    // Tainted canvas. Covers are bundled same-origin assets so this should
    // not happen, but a null return keeps the safe constants in place.
    return null
  }

  const topStart = clamp(requiredAlpha(top, textTop, voidRgb), BOUNDS.top)
  const botStart = clamp(requiredAlpha(bot, textBottom, voidRgb), BOUNDS.bottom)

  return {
    topHeight: heights.topHeight,
    topStart,
    // The midpoint stays above the floor too: text occupies the half of the
    // band nearest the edge, and only past the midpoint does it decay away.
    topMid: topStart * 0.92,
    botHeight: heights.botHeight,
    botStart,
    botMid: botStart * 0.92,
  }
}
