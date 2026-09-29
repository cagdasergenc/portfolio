/**
 * WCAG contrast maths.
 *
 * Used by: lib/scrim.js, and the tests
 * Uses: nothing
 *
 * How it works: relativeLuminance and contrastRatio are the WCAG formulas.
 * composite blends a translucent fill over a background. minGlassAlpha answers
 * the question the design actually asks: how opaque does the glass have to be
 * for this text to stay readable over the worst pixel behind it. That is how
 * the glass level was chosen, rather than by eye.
 */
const srgbToLinear = (c) => {
  const v = c / 255
  return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
}

export function relativeLuminance([r, g, b]) {
  return 0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b)
}

export function contrastRatio(a, b) {
  const la = relativeLuminance(a), lb = relativeLuminance(b)
  const hi = Math.max(la, lb), lo = Math.min(la, lb)
  return (hi + 0.05) / (lo + 0.05)
}

/** `fg` painted at `alpha` over `bg`. */
export function composite(fg, bg, alpha) {
  return fg.map((f, i) => Math.round(alpha * f + (1 - alpha) * bg[i]))
}

/**
 * Smallest glass opacity at which text clears `target` over the WORST
 * background a cover can present. Scans in 0.02 steps, fine enough to be
 * useful, coarse enough to stay a readable constant in CSS.
 *
 * Returns null when no opacity works. That is not a failure to handle
 * silently: the text moves off the glass instead of the glass
 * becoming opaque enough to stop being glass.
 */
export function minGlassAlpha(textRgb, glassRgb, worstBgRgb, target = 4.5) {
  for (let a = 0; a <= 1.0001; a += 0.02) {
    const bg = composite(glassRgb, worstBgRgb, a)
    if (contrastRatio(textRgb, bg) >= target) return Math.round(a * 100) / 100
  }
  return null
}
