/**
 * Hex string -> [r, g, b] as 0..1 floats, for WebGL uniform3f.
 *
 * Used by: components/StageCanvas.jsx
 * Uses: nothing
 * The one
 * conversion point between a CSS custom property (--color-void, the single
 * source of truth) and the shader, so the two can never drift independently.
 */
export function hexToRgbFloat(hex) {
  const clean = hex.trim().replace(/^#/, '')
  if (!/^[0-9a-fA-F]{6}$/.test(clean)) {
    throw new Error(`hexToRgbFloat: expected a 6-digit hex, got "${hex}"`)
  }
  const r = parseInt(clean.slice(0, 2), 16) / 255
  const g = parseInt(clean.slice(2, 4), 16) / 255
  const b = parseInt(clean.slice(4, 6), 16) / 255
  return [r, g, b]
}
