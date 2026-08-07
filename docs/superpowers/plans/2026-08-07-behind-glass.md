# Behind Glass Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A second shippable visual world — dark ground, glass chrome that genuinely refracts the work beneath it, driven by one pointer displacement field with viscosity.

**Architecture:** Branches from `design/lit-paper` and reuses its entire content machine unchanged: `src/lib/content.js` and its 19 tests, the `content/` folders, the router, the case-study structure. Only the visual layer forks. Refraction is a raw WebGL2 fragment shader on a fullscreen quad — no three.js — so this branch drops `three`, `@react-three/fiber`, `@react-three/drei` and `src/three/` entirely and ships a smaller bundle than Lit Paper.

**Tech Stack:** React 19, Vite 8, Tailwind 4, React Router 7, GSAP 3, raw WebGL2, marked, Vitest.

## Global Constraints

Values copied verbatim from `docs/superpowers/specs/2026-08-07-behind-glass-design.md`.

- **Colour tokens:** `--void: #0A0A0C`, `--glass: rgb(255 255 255 / 0.06)`, `--edge: rgb(255 255 255 / 0.18)`, `--text: #F4F4F6`, `--text-dim: #9B9BA6`.
- **Type:** Switzer ExtraBold (800) display, self-hosted from Fontshare. Geist Sans body, Geist Mono labels — unchanged.
- **One displacement field.** `--push-x`, `--push-y`, `--push-force` on `documentElement`, updated at most once per rAF. The shader and the DOM both read them. No component computes its own pointer offset.
- **Viscosity is mandatory.** Displacement lags the cursor and settles — damped, never linear. Snapping reads as a hover state; lag reads as a material. This is the detail the whole concept rests on.
- **The refraction must be real.** A shader sampling and displacing cover pixels. If it degrades to `backdrop-filter: blur`, the concept is dead and the task fails.
- **Never obstruct the work.** Covers render large, clear, unobstructed. Glass is chrome around them, never over the subject.
- **Text over glass must clear AA against worst-case content behind it.** Computed, not eyeballed. Where the required opacity floor makes glass stop reading as glass, the text moves off the glass. Legibility wins.
- **Light-on-dark compensation:** more line-height, more tracking, one weight step up versus light ground.
- **Copy rules unchanged.** Banned: seamless, intuitive, innovative, cutting-edge, elevate, empower, leverage, robust, delve, landscape, realm, testament, journey, passionate, curated. Also "not just X, but Y", "In today's...", "SECTION 01", generic CTAs. Hero h1/eyebrow/standfirst are the owner's own words — ship byte-identical.
- **Accessibility:** WCAG AA, full keyboard nav, visible focus rings, `prefers-reduced-motion` honoured, real alt text, no horizontal scroll at any width.
- **Performance:** canvas lazy, below fold, own chunk, never LCP. DPR clamped to 2.
- **Commit after every task.** Trailer: `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`
- **Sandbox limitation:** the browser pane runs backgrounded — `document.hidden = true`, zero rAF frames. Shaders will not paint, GSAP will not run, screenshots may be blank, and a Lighthouse run would be fiction. Verify by build output, `getComputedStyle`/`getBoundingClientRect` via `javascript_tool`, and computed values in scripts. Never report a number you did not legitimately obtain.

---

## File Structure

| Path | Responsibility |
| --- | --- |
| `src/lib/push.js` | Pure displacement math. No DOM. Tested. |
| `src/lib/push.test.js` | Tests for the above. |
| `src/lib/contrast.js` | Worst-case contrast solver for glass. Tested. |
| `src/lib/contrast.test.js` | Tests for the above. |
| `src/hooks/usePush.js` | rAF loop writing `--push-*`, with viscosity. |
| `src/gl/refract.js` | Raw WebGL2 setup, shader, render loop. No React. |
| `src/gl/shader.glsl.js` | Vertex + fragment source as template strings. |
| `src/components/GlassCard.jsx` | One project: canvas + DOM overlay. |
| `src/components/Glass.jsx` | Reusable glass capsule primitive. |
| `src/components/WorkIndex.jsx` | Rewritten: glass cards + fallback. |
| `src/components/WorkGridFlat.jsx` | No-WebGL / mobile / reduced-motion path. |
| `src/fonts/Switzer-Variable.woff2` | Self-hosted display face. |

---

## Task 1: Branch, dark foundation, Switzer

**Files:**
- Create branch `design/behind-glass`
- Modify: `package.json`, `src/index.css`, `index.html`
- Create: `src/fonts/Switzer-Variable.woff2`, `src/fonts/Switzer-LICENSE.txt`
- Delete: `src/three/` (whole dir), `src/fonts/Quilon-Variable.woff2`, `src/fonts/FFL.txt`

**Interfaces:**
- Consumes: nothing.
- Produces: dark token set, Switzer as `--font-display`, `--push-*` registered via `@property`.

- [ ] **Step 1: Branch from the Lit Paper head**

```bash
git checkout -b design/behind-glass
git rev-parse --short HEAD   # record; this is the shared ancestor
```

- [ ] **Step 2: Remove the 3D stack this world does not use**

```bash
git rm -r src/three
npm remove three @react-three/fiber @react-three/drei
```

Refraction here is a 2D fragment shader on a quad. three.js would add ~885kB to render a textured rectangle.

- [ ] **Step 3: Install Switzer, remove Quilon**

```bash
mkdir -p /tmp/sw && curl -sL "https://api.fontshare.com/v2/fonts/download/switzer" -o /tmp/sw/s.zip
cd /tmp/sw && unzip -o -q s.zip && find . -name "Switzer-Variable.woff2"
```

Copy `Switzer-Variable.woff2` into `src/fonts/`, copy the licence file alongside it as `Switzer-LICENSE.txt`, then `git rm src/fonts/Quilon-Variable.woff2 src/fonts/FFL.txt`.

Do **not** add a Google Fonts or Fontshare CDN link. Self-hosted only.

- [ ] **Step 4: Replace the token block in `src/index.css`**

Keep the Geist imports and the Tailwind import. Replace the Quilon `@font-face`, the `@theme` block, the `:root` shadow block, `.backdrop`, `.shadow-sun*` and the `h1,h2,h3` rules with:

```css
@font-face {
  font-family: 'Switzer';
  src: url('./fonts/Switzer-Variable.woff2') format('woff2-variations');
  font-weight: 400 800;
  font-style: normal;
  font-display: swap;
}

@property --push-x     { syntax: '<number>'; inherits: true; initial-value: 0.5; }
@property --push-y     { syntax: '<number>'; inherits: true; initial-value: 0.5; }
@property --push-force { syntax: '<number>'; inherits: true; initial-value: 0; }

@theme {
  --color-void:     #0A0A0C;
  --color-text:     #F4F4F6;
  --color-text-dim: #9B9BA6;

  --font-display: "Switzer", ui-sans-serif, system-ui, sans-serif;
  --font-sans:    "Geist Variable", ui-sans-serif, system-ui, sans-serif;
  --font-mono:    "Geist Mono Variable", ui-monospace, monospace;

  --text-hero:    clamp(2.2rem, 8.5vw, 7.5rem);
  --text-display: clamp(2rem, 5.5vw, 4rem);
  --text-title:   clamp(1.75rem, 4vw, 2.75rem);
  --text-card:    clamp(1.35rem, 2.6vw, 1.85rem);

  --radius-pill: 999px;
  --radius-panel: 28px;
}

body {
  margin: 0;
  background: var(--color-void);
  color: var(--color-text);
  font-family: var(--font-sans);
  /* Light-on-dark compensation: the same metrics that read correctly on
     paper read thin and grey inverted. */
  font-size: 17px;
  line-height: 1.7;
  letter-spacing: 0.006em;
  overflow-x: hidden;
}

@media (min-width: 768px) { body { font-size: 18px; } }

h1, h2, h3 { font-family: var(--font-display); line-height: 1.06; letter-spacing: -0.02em; }
h1, h2 { font-weight: 800; }
h3 { font-weight: 600; }

.glass {
  background: rgb(255 255 255 / 0.06);
  border: 1px solid rgb(255 255 255 / 0.18);
  border-radius: var(--radius-pill);
  backdrop-filter: blur(12px);
}

:focus-visible {
  outline: 2px solid var(--color-text);
  outline-offset: 3px;
  border-radius: var(--radius-pill);
}
```

Keep `.shell`, `.grid12`, `.col-read`, `.label` and the reduced-motion block from Lit Paper — retune `.label` colour to `var(--color-text-dim)`.

- [ ] **Step 5: Verify the build is clean and smaller**

Run: `npm run build`
Expected: succeeds, no unresolved imports from the deleted `src/three/`, and the `WorkScene` 885kB chunk is gone. Record the new entry size.

If `WorkIndex.jsx` still imports `WorkScene`, comment the import and force the flat path — Task 5 rebuilds it properly. Note it in the report.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "Branch Behind Glass: dark tokens, Switzer, drop the 3D stack

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

## Task 2: Displacement engine

The equivalent of Lit Paper's sun, and the load-bearing idea. Built first, pure, fully tested.

**Files:**
- Create: `src/lib/push.js`, `src/lib/push.test.js`, `src/hooks/usePush.js`
- Delete: `src/lib/sun.js`, `src/lib/sun.test.js`, `src/hooks/useSun.js`

**Interfaces:**
- Produces:
  - `pointerToField(x, y, w, h) => { x: number, y: number }` — normalised 0..1, clamped.
  - `damp(current, target, lambda, dt) => number` — frame-rate independent exponential decay.
  - `forceFromVelocity(dx, dy, cap) => number` — 0..1 push strength from pointer speed.
  - `usePush(): void` — writes `--push-x`, `--push-y`, `--push-force`.

- [ ] **Step 1: Write the failing tests**

Create `src/lib/push.test.js`:

```js
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
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run src/lib/push.test.js`
Expected: FAIL — cannot resolve `./push`.

- [ ] **Step 3: Implement `src/lib/push.js`**

```js
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v))

/** Pointer position as a normalised 0..1 field coordinate. */
export function pointerToField(x, y, w, h) {
  return {
    x: clamp(x / Math.max(1, w), 0, 1),
    y: clamp(y / Math.max(1, h), 0, 1),
  }
}

/**
 * Frame-rate independent exponential decay. This is what gives the glass
 * viscosity: the value chases the target instead of snapping to it, and it
 * settles at the same rate whether the display runs at 30fps or 120fps.
 * A naive `current + (target - current) * 0.1` would move at different real
 * speeds on different machines.
 */
export function damp(current, target, lambda, dt) {
  if (!(dt > 0)) return current
  return target + (current - target) * Math.exp(-lambda * dt)
}

/** Push strength from pointer speed, saturating at 1. */
export function forceFromVelocity(dx, dy, cap) {
  const speed = Math.hypot(dx, dy)
  return clamp(speed / Math.max(1, cap), 0, 1)
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run src/lib/push.test.js`
Expected: 13 passed.

- [ ] **Step 5: Implement `src/hooks/usePush.js`**

```js
import { useEffect } from 'react'
import { pointerToField, damp, forceFromVelocity } from '../lib/push'

const LAMBDA = 5.5   // viscosity — lower is thicker
const CAP = 45       // px/frame at which force saturates

/**
 * The page's single displacement field. Both the refraction shader and the
 * DOM read --push-x / --push-y / --push-force, so the glass and the chrome
 * can never disagree.
 *
 * The damped chase is the whole effect: a value that snaps to the cursor
 * reads as a hover state, one that lags and settles reads as a material.
 */
export function usePush() {
  useEffect(() => {
    const root = document.documentElement
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')

    if (reduced.matches) {
      root.style.setProperty('--push-x', '0.5')
      root.style.setProperty('--push-y', '0.5')
      root.style.setProperty('--push-force', '0')
      return
    }

    let target = { x: 0.5, y: 0.5 }
    let current = { x: 0.5, y: 0.5 }
    let force = 0, targetForce = 0
    let last = { x: 0, y: 0 }, seen = false
    let raf = 0, prev = 0

    const onPointer = (e) => {
      const f = pointerToField(e.clientX, e.clientY, window.innerWidth, window.innerHeight)
      target = f
      if (seen) targetForce = forceFromVelocity(e.clientX - last.x, e.clientY - last.y, CAP)
      last = { x: e.clientX, y: e.clientY }
      seen = true
    }

    const frame = (t) => {
      const dt = prev ? Math.min(0.05, (t - prev) / 1000) : 1 / 60
      prev = t
      current.x = damp(current.x, target.x, LAMBDA, dt)
      current.y = damp(current.y, target.y, LAMBDA, dt)
      targetForce = damp(targetForce, 0, 2.2, dt)   // force bleeds off when still
      force = damp(force, targetForce, LAMBDA, dt)
      root.style.setProperty('--push-x', current.x.toFixed(4))
      root.style.setProperty('--push-y', current.y.toFixed(4))
      root.style.setProperty('--push-force', force.toFixed(4))
      raf = requestAnimationFrame(frame)
    }

    window.addEventListener('pointermove', onPointer, { passive: true })
    raf = requestAnimationFrame(frame)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onPointer)
    }
  }, [])
}
```

Unlike `useSun`, this runs a continuous rAF loop rather than scheduling on events — the settle animation has to keep running after the pointer stops.

- [ ] **Step 6: Wire into `src/App.jsx`**

Replace `useSun()` with `usePush()`, and delete the `.backdrop` div (Lit Paper's lit-paper layer). Delete `src/lib/sun.js`, `src/lib/sun.test.js`, `src/hooks/useSun.js`.

- [ ] **Step 7: Verify and commit**

Run `npm test` (expect 19 content + 13 push = 32; Task 3 adds 13 more for 45), `npm run lint` (0), `npm run build`.

In the browser, confirm the custom properties update:
```js
getComputedStyle(document.documentElement).getPropertyValue('--push-x')
```
Note: the sandbox delivers no rAF frames, so the value will sit at its initial `0.5`. Confirm the listener is attached and the hook does not throw; real motion needs a foreground browser.

```bash
git add -A
git commit -m "Add pointer displacement field with viscosity

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

## Task 3: Contrast solver for glass

Spec §5.2 is the hardest correctness problem in this build. Text on a translucent panel over a moving image has no fixed background. Solve it once, numerically, and make it a build-time constant rather than a guess.

**Files:**
- Create: `src/lib/contrast.js`, `src/lib/contrast.test.js`

**Interfaces:**
- Produces:
  - `relativeLuminance([r,g,b]) => number`
  - `contrastRatio(rgbA, rgbB) => number`
  - `composite(fg, bg, alpha) => [r,g,b]`
  - `minGlassAlpha(textRgb, glassRgb, worstBgRgb, target = 4.5) => number` — the smallest glass opacity at which `textRgb` clears `target` over `worstBgRgb`, or `null` if no alpha ≤ 1 achieves it.

- [ ] **Step 1: Write the failing tests**

```js
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
```

- [ ] **Step 2: Run to verify failure**

Run: `npx vitest run src/lib/contrast.test.js`
Expected: FAIL — cannot resolve `./contrast`.

- [ ] **Step 3: Implement `src/lib/contrast.js`**

```js
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
 * background a cover can present. Scans in 0.02 steps — fine enough to be
 * useful, coarse enough to stay a readable constant in CSS.
 *
 * Returns null when no opacity works. That is not a failure to handle
 * silently: per spec §5.2 the text moves off the glass instead of the glass
 * becoming opaque enough to stop being glass.
 */
export function minGlassAlpha(textRgb, glassRgb, worstBgRgb, target = 4.5) {
  for (let a = 0; a <= 1.0001; a += 0.02) {
    const bg = composite(glassRgb, worstBgRgb, a)
    if (contrastRatio(textRgb, bg) >= target) return Math.round(a * 100) / 100
  }
  return null
}
```

- [ ] **Step 4: Run to verify pass**

Run: `npx vitest run src/lib/contrast.test.js`
Expected: 13 passed.

- [ ] **Step 5: Derive the shipped constants**

Write a scratch script that runs `minGlassAlpha` for `--text` and `--text-dim` against `[255,255,255]` (a fully blown-out cover) using the glass tint, and record both numbers **in the report and as a comment in `src/index.css`**.

If either returns `null`, that is the spec's escape hatch firing: report it, and Task 5 must place that text off the glass rather than on it.

- [ ] **Step 6: Commit**

```bash
git add src/lib/contrast.js src/lib/contrast.test.js src/index.css
git commit -m "Add worst-case contrast solver for glass surfaces

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

## Task 4: WebGL refraction layer

The set piece's engine. Raw WebGL2, no dependency.

**Files:**
- Create: `src/gl/shader.glsl.js`, `src/gl/refract.js`

**Interfaces:**
- Produces: `createRefractor(canvas, imageUrl) => { setPush(x, y, force), resize(w, h), render(), destroy() } | null` — returns `null` when WebGL2 is unavailable so callers can fall back.

- [ ] **Step 1: Create `src/gl/shader.glsl.js`**

```js
export const VERT = `#version 300 es
in vec2 aPos;
out vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`

/**
 * Real refraction: the glass region resamples the cover texture with
 * displaced UVs, so cover pixels genuinely bend. This is not a blur.
 *
 * The capsule is an SDF rounded box. Refraction strength rises sharply near
 * its edge — that edge gradient is what reads as thickness, the same way a
 * real lens distorts most at its rim.
 */
export const FRAG = `#version 300 es
precision highp float;

in vec2 vUv;
out vec4 outColor;

uniform sampler2D uCover;
uniform vec2  uRes;
uniform vec2  uPush;      // 0..1 pointer field
uniform float uForce;     // 0..1 pointer speed
uniform vec4  uCapsule;   // xy = centre (0..1), zw = half-size (0..1)
uniform float uRadius;    // corner radius, normalised to width

float sdRoundBox(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;
}

void main() {
  float aspect = uRes.x / max(uRes.y, 1.0);
  vec2 p = (vUv - uCapsule.xy) * vec2(aspect, 1.0);
  vec2 b = uCapsule.zw * vec2(aspect, 1.0);

  float d = sdRoundBox(p, b, uRadius);

  // Inside the capsule only. edge = 0 at the rim, 1 deep inside.
  float inside = step(d, 0.0);
  float edge = smoothstep(0.0, -0.06, d);

  // Lens: push UVs outward from the capsule centre, hardest at the rim.
  vec2 dir = normalize(p + 1e-6);
  float lens = (1.0 - edge) * inside * 0.045;

  // Pointer displacement, strongest near the cursor and scaled by speed.
  vec2 toCursor = vUv - uPush;
  float prox = exp(-dot(toCursor, toCursor) * 14.0);
  vec2 drag = toCursor * prox * uForce * 0.05 * inside;

  vec2 uv = vUv + dir * lens + drag;
  vec3 col = texture(uCover, clamp(uv, 0.0, 1.0)).rgb;

  // Chromatic split at the rim — subtle, and only where refraction is strong.
  float ca = (1.0 - edge) * inside * 0.006;
  col.r = texture(uCover, clamp(uv + dir * ca, 0.0, 1.0)).r;
  col.b = texture(uCover, clamp(uv - dir * ca, 0.0, 1.0)).b;

  // Glass tint and lit rim.
  col = mix(col, col * 0.55 + 0.06, inside * 0.55);
  float rim = smoothstep(0.004, 0.0, abs(d));
  col += rim * 0.22;

  outColor = vec4(col, 1.0);
}`
```

- [ ] **Step 2: Create `src/gl/refract.js`**

```js
import { VERT, FRAG } from './shader.glsl'

function compile(gl, type, src) {
  const s = gl.createShader(type)
  gl.shaderSource(s, src)
  gl.compileShader(s)
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(s)
    gl.deleteShader(s)
    throw new Error(`shader compile failed: ${log}`)
  }
  return s
}

/**
 * Returns null when WebGL2 is unavailable, so the caller renders the flat
 * fallback instead of an empty canvas.
 */
export function createRefractor(canvas, imageUrl) {
  let gl
  try {
    gl = canvas.getContext('webgl2', { antialias: true, alpha: false })
  } catch {
    return null
  }
  if (!gl) return null

  let program
  try {
    program = gl.createProgram()
    gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERT))
    gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAG))
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(program))
    }
  } catch (err) {
    console.warn('[refract]', err.message)
    return null
  }

  const buf = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buf)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
  const loc = gl.getAttribLocation(program, 'aPos')
  gl.enableVertexAttribArray(loc)
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

  const u = (n) => gl.getUniformLocation(program, n)
  const U = {
    cover: u('uCover'), res: u('uRes'), push: u('uPush'),
    force: u('uForce'), capsule: u('uCapsule'), radius: u('uRadius'),
  }

  const tex = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, tex)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
    new Uint8Array([16, 16, 20, 255]))
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)

  let destroyed = false
  const img = new Image()
  img.crossOrigin = 'anonymous'
  img.onload = () => {
    if (destroyed) return
    gl.bindTexture(gl.TEXTURE_2D, tex)
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
  }
  img.src = imageUrl

  let push = [0.5, 0.5], force = 0

  return {
    setPush(x, y, f) { push = [x, y]; force = f },
    resize(w, h) {
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      canvas.width = Math.max(1, Math.round(w * dpr))
      canvas.height = Math.max(1, Math.round(h * dpr))
      gl.viewport(0, 0, canvas.width, canvas.height)
    },
    render() {
      if (destroyed) return
      gl.useProgram(program)
      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, tex)
      gl.uniform1i(U.cover, 0)
      gl.uniform2f(U.res, canvas.width, canvas.height)
      gl.uniform2f(U.push, push[0], push[1])
      gl.uniform1f(U.force, force)
      // Capsule sits low-left in the card; CSS positions the text to match
      // using the same fractions. Keep these two in sync by hand.
      gl.uniform4f(U.capsule, 0.5, 0.82, 0.42, 0.085)
      gl.uniform1f(U.radius, 0.08)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    },
    destroy() {
      destroyed = true
      gl.deleteTexture(tex)
      gl.deleteBuffer(buf)
      gl.deleteProgram(program)
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    },
  }
}
```

- [ ] **Step 3: Verify it compiles and links**

There is no unit test for a shader; verify by running it. Add a temporary route or probe that mounts a canvas, calls `createRefractor` with any local JPG, calls `resize` and `render`, and logs whether it returned null and whether `gl.getError()` is 0.

Expected: not null, `getError() === 0`, no shader-compile warning in the console.

**The sandbox browser paints nothing (zero rAF frames), so you will not see the image.** That is expected. What you are verifying here is that the program compiles, links, and draws without error — not that it looks right. Say so plainly in the report; the visual check belongs to the owner in a real browser.

Remove the probe before committing.

- [ ] **Step 4: Commit**

```bash
git add src/gl
git commit -m "Add raw WebGL2 refraction shader

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

## Task 5: Glass work index

**Files:**
- Create: `src/components/GlassCard.jsx`, `src/components/WorkGridFlat.jsx`, `src/components/Glass.jsx`
- Rewrite: `src/components/WorkIndex.jsx`
- Delete: `src/components/WorkGrid.jsx`

**Interfaces:**
- Consumes: `getProjects()` (unchanged), `useLowFi()` (unchanged), `createRefractor` (Task 4), the alpha constants from Task 3.
- Produces: `<WorkIndex />`, `<GlassCard project />`, `<WorkGridFlat projects />`, `<Glass as="div" className>` capsule primitive.

- [ ] **Step 1: Build `Glass.jsx`, the capsule primitive**

A single component so every glass surface in the site shares one definition — the same discipline that made `--sun-x` work. It applies the `.glass` class, accepts `as` for the element type, and takes the Task 3 alpha as its floor.

- [ ] **Step 2: Build `WorkGridFlat.jsx` FIRST**

This is the mobile, reduced-motion and no-WebGL path — and per spec §6.1 it is what **most** visitors see. Build it before the shader path so it is a real design, not a leftover.

Cover image large and unobstructed, glass capsule beneath carrying title / role / year / Live pill, no refraction. Same layout and proportions as the refracting version so the two read as one design.

Reuse the no-cover typographic treatment from Lit Paper's `WorkGrid` — covers still do not exist, so this is the state that ships today.

- [ ] **Step 3: Build `GlassCard.jsx`**

A `<canvas>` sized to the card via `ResizeObserver`, plus DOM text absolutely positioned over the capsule region. On mount: `createRefractor(canvas, project.cover)`. If it returns `null`, render the flat card instead.

Drive it from one rAF loop that reads `--push-x/-y/-force` off `documentElement` and calls `setPush` then `render`. Do not add a second pointer listener — the field is the single source of truth.

Stop the loop when the card is off-screen (`IntersectionObserver`) and on unmount. Call `destroy()` in cleanup.

- [ ] **Step 4: Rewrite `WorkIndex.jsx`**

```jsx
const showGlass = !lowFi && projects.some((p) => p.cover)
```

Same reasoning as Lit Paper: Suspense does not fire for a component that returns null, so decide here. When `showGlass` is false, render `<WorkGridFlat />`. When true, render the glass cards plus a visually-hidden-but-focusable `WorkGridFlat` so the keyboard path never depends on WebGL.

- [ ] **Step 5: Verify**

- No cover images exist, so the flat path is what renders today. Confirm all three projects appear, are keyboard reachable, and link correctly.
- Drop a temporary 1600×2000 JPG into each `content/<slug>/` to exercise the glass path, confirm `createRefractor` does not return null and `gl.getError()` is 0, **then delete all three before committing** and verify with `find content -name "cover.*"`.
- No horizontal scroll at 320/375/768/1440.

- [ ] **Step 6: Commit**

---

## Task 6: Restyle the shell

**Files:**
- Modify: `src/components/Nav.jsx`, `Hero.jsx`, `About.jsx`, `Contact.jsx`, `WebBand.jsx`

**Interfaces:** consumes `Glass`, the dark tokens, `--push-*`.

- [ ] **Step 1: Nav becomes a floating glass pill**

Centred or left-aligned capsule rather than a full-width bar. **Carry over the Lit Paper lesson:** the previous nav used `mix-blend-multiply` and became invisible over dark sections at 1.10:1. Here the ground is uniformly dark, so the risk inverts — verify the nav against the *brightest* thing that can pass under it (a blown-out cover), using the Task 3 solver.

- [ ] **Step 2: Hero**

Copy is unchanged and ships byte-identical. Switzer ExtraBold at `--text-hero`. Verify the h1 never exceeds three lines from 320 to 2560 — Switzer is wider than Quilon at the same size, so the clamp may need retuning. Adjust the clamp, never the words.

- [ ] **Step 3: About, Contact, WebBand**

Restyle to dark. Keep the About portrait in the left column and keep the `import.meta.glob` pattern so a missing `about.jpg` cannot break the build. Keep MesfenoWear `archived` with no `<a>`.

- [ ] **Step 4: Verify and commit**

Contrast for every text/background pair, computed. No horizontal scroll at six widths.

---

## Task 7: Restyle the case study

**Files:**
- Modify: `src/routes/CaseStudy.jsx`, `src/components/Prose.jsx`, `src/routes/NotFound.jsx`

- [ ] **Step 1: Invert the Insight punctuation**

In Lit Paper the ground is light and Insight goes dark. Here the ground is dark, so the same section must invert the other way — a lighter or glass-panelled band — or the punctuation disappears entirely. This is the single most likely thing to be missed in a dark port.

- [ ] **Step 2: Keep the structure**

Six fixed sections in order, sticky metadata rail on desktop, "Open the app" block where `live_url` exists, PDF download. `dangerouslySetInnerHTML` in `Prose` stays — build-time authored content, never runtime input.

- [ ] **Step 3: Verify full-bleed margins at 320/375**

The `-mx-6` / `md:-mx-12` bleed was the likeliest overflow source in Lit Paper. Re-check it here.

- [ ] **Step 4: Commit**

---

## Task 8: Copy gate, accessibility, performance

- [ ] **Step 1: Banned-list grep**

```bash
grep -rniE 'seamless|intuitive|innovative|cutting-edge|elevate|empower|leverage|robust|delve|landscape|realm|testament|journey|passionate|curated|not just .* but|in today' src/ index.html
```
Expected: no matches. Rewrite anything that hits, through `humanizer` and `stop-slop`.

- [ ] **Step 2: `index.html` head**

Update `<title>`, description and OG tags for this world. `og:url` is `https://cagdasergenc.netlify.app/`. Keep them static — the site is client-rendered and preview bots do not run JS.

- [ ] **Step 3: Contrast pass**

Every pair, computed with `src/lib/contrast.js`, including text over glass against a blown-out cover. Record the table in the report.

- [ ] **Step 4: Keyboard, landmarks, reduced motion**

Skip link first focusable, `<main id="content">` present, one h1 per route, no skipped heading levels. Glass index reachable without WebGL. `prefers-reduced-motion` freezes displacement and leaves nothing invisible.

- [ ] **Step 5: Widths**

320, 375, 768, 1024, 1440, 2560 on both routes. `scrollWidth` vs `innerWidth`.

- [ ] **Step 6: Bundle**

Report real chunk sizes. Confirm the refraction layer is in its own lazy chunk and the entry bundle is smaller than Lit Paper's 353kB — dropping three.js should make this comfortable.

- [ ] **Step 7: Run the guidelines review**

Invoke `web-design-guidelines` against `src/`. Fix what it legitimately reports.

- [ ] **Step 8: Commit**

---

## Deferred

- **Covers and in-page images.** Owner-supplied. The flat path is what ships until they exist, and the glass path cannot be visually verified without them.
- **Visual confirmation of the refraction.** Impossible in this sandbox (zero rAF frames). The owner must look at it in a real browser; nothing in this plan may claim otherwise.
- **Remotion trailers.** Still phase 2, and still unblocked by anything here.
- **Choosing between the two worlds.** Both branches stay alive until the owner picks.
