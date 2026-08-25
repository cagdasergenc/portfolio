# Behind Glass Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close the gap a `/design-is` audit found between what this design world claims about itself and what ships — the stage becomes the actual shader surface, not a plain `<img>` under CSS-only glass — while fixing the smaller issues the same audit surfaced along the way.

**Architecture:** `Stage.jsx`'s per-project background layer becomes a new `StageCanvas` component that renders an `<img>` eagerly and swaps to a WebGL canvas once the refraction shader and its texture are ready — same pixels at rest, so the swap costs nothing visible and never blocks first paint. The shader (`src/gl/`) gains two capabilities it didn't have: a capsule position read from the real DOM element instead of a hardcoded card-shaped guess, and the darkening scrims baked in as part of the same render pass instead of stacked CSS gradients. Three known-dead files are deleted once nothing points at their reason for existing. Everything else on the branch — content pipeline, router, `usePush`, `Rail`, `Band`, the accessibility work — is unchanged.

**Tech Stack:** React 19, Vite 8, Tailwind 4, raw WebGL2 (no three.js), Vitest.

**Spec:** `docs/superpowers/specs/2026-08-07-behind-glass-design.md` §2.0, §3, §6 (rewritten 2026-08-21). Audit: `DESIGN-IS-2026-08-21/` (evidence, scorecard, verdict, handoff).

## Global Constraints

- **Refraction is scoped to the stage capsule only.** Nav and other chrome floating over the void ground stay CSS-only `.glass`. Do not add a second live canvas anywhere else in this plan.
- **Never obstruct the work.** The shader bends the cover image; it must never hide it. `inside`/`edge` math in the fragment shader already respects this — do not change capsule sizing to cover more of the frame.
- **One active canvas at a time.** Only the currently-active project's `StageCanvas` may hold a live `createRefractor` instance. Inactive projects stay plain `<img>`.
- **Progressive enhancement, not delayed enhancement.** The `<img>` renders first, unconditionally. The canvas replaces it only after `createRefractor` succeeds and the texture has loaded. If either fails, the `<img>` is what ships — never an empty canvas, never a blocked paint.
- **CSS scrims and shader scrims are mutually exclusive, never both.** Whichever is actually compositing the darkening for the currently-visible frame is the only one visible. Stacking both over-darkens; this is the same bug class the audit found once already (`.glass` sheen vs. pre-sheen contrast).
- **`--color-void` has exactly one source of truth**: the CSS custom property in `src/index.css`. The shader reads it via `getComputedStyle`, never a duplicated hardcoded value.
- **WCAG AA (4.5:1)** on every text/background pair actually rendered, computed via `src/lib/contrast.js`, not eyeballed. This includes the `.glass` sheen at its peak (`--push-force: 1`), which was not checked when the sheen was added and is what regressed.
- **`prefers-reduced-motion: reduce`** stops all displacement; the shader's push/force inputs go static, matching `usePush`'s existing reduced-motion branch.
- **No new dependencies.** Raw WebGL2, no three.js, no shader-authoring library.
- **Commit after every task.** Trailer: `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`
- **`npm run lint` exits 0, `npm run build` passes, and the test suite grows without regressing** — hold these after every task, not just at the end.

---

## File Structure

| Path | Responsibility |
| --- | --- |
| `src/lib/color.js` | `hexToRgbFloat` — pure hex→0..1 RGB triplet. Tested. |
| `src/lib/color.test.js` | Tests for the above. |
| `src/gl/shader.glsl.js` | **Modified.** Adds capsule/scrim/void uniforms and the in-shader darken pass. |
| `src/gl/refract.js` | **Modified.** Adds `setCapsule`, `setScrims`, `setVoidColor`; capsule/scrims read from state instead of a hardcoded literal. |
| `src/hooks/useCapsuleRect.js` | DOM capsule element → shader-space `{x, y, hw, hh}`. Tested. |
| `src/hooks/useCapsuleRect.test.js` | Tests for the above. |
| `src/components/StageCanvas.jsx` | One project's background layer: eager `<img>`, progressive swap to a WebGL canvas, own render loop, own refractor lifecycle. |
| `src/components/Stage.jsx` | **Modified.** Renders `StageCanvas` per project instead of raw `<img>`/ghost-title; capsule gets a ref; CSS scrims become conditional on canvas readiness. |
| `src/index.css` | **Modified.** `.glass` sheen alpha capped against the measured contrast floor; `--text-hero` removed. |
| `src/routes/CaseStudy.jsx` | **Modified.** Eyebrow/heading block replaced with `<Band>`. |
| `src/components/Hero.jsx`, `src/components/WorkIndex.jsx`, `src/components/GlassCard.jsx` | **Deleted** once nothing imports them. |

---

## Task 1: `hexToRgbFloat` — one source of truth for the void colour

**Files:**
- Create: `src/lib/color.js`, `src/lib/color.test.js`

**Interfaces:**
- Produces: `hexToRgbFloat(hex: string) => [number, number, number]`, each channel 0..1, for WebGL `uniform3f`.

- [ ] **Step 1: Write the failing tests**

Create `src/lib/color.test.js`:

```js
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
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run src/lib/color.test.js`
Expected: FAIL — cannot resolve `./color`.

- [ ] **Step 3: Implement `src/lib/color.js`**

```js
/**
 * Hex string -> [r, g, b] as 0..1 floats, for WebGL uniform3f. The one
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
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run src/lib/color.test.js`
Expected: 7 passed.

- [ ] **Step 5: Commit**

```bash
git add src/lib/color.js src/lib/color.test.js
git commit -m "Add hexToRgbFloat: one conversion point from CSS token to shader uniform

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

## Task 2: Extend the shader — dynamic capsule, in-shader scrims, no hardcoded void

**Files:**
- Modify: `src/gl/shader.glsl.js`, `src/gl/refract.js`

**Interfaces:**
- Consumes: `hexToRgbFloat` (Task 1).
- Produces: `createRefractor(canvas, imageUrl)` return value gains three new methods:
  - `setCapsule(cx: number, cy: number, hw: number, hh: number): void` — shader-space (0..1, y=1 at top), replaces the old hardcoded `(0.5, 0.82, 0.42, 0.085)` as the default.
  - `setScrims({ topHeight, topStart, topMid, botHeight, botStart, botMid }): void` — all 0..1, matching a 3-stop piecewise-linear gradient (mirrors the CSS gradients Stage.jsx currently hardcodes).
  - `setVoidColor(r: number, g: number, b: number): void` — 0..1 floats, the colour scrims darken toward.

- [ ] **Step 1: Add the new uniforms and the darken pass to the fragment shader**

Modify `src/gl/shader.glsl.js`. Add these uniform declarations after the existing ones (after `uniform float uRadius;`):

```glsl
uniform vec3  uVoid;       // --color-void, as 0..1 floats — no hardcoded duplicate
uniform vec4  uScrimTop;   // height, alpha at band start, alpha at midpoint, unused
uniform vec4  uScrimBot;   // height, alpha at band start, alpha at midpoint, unused
```

Add this helper function above `void main()`, after `sdRoundBox`:

```glsl
/* Piecewise-linear, matching a 3-stop CSS gradient exactly rather than an
   eased curve — this is a relocation of existing behaviour, not a redesign
   of it. t is 0 at the band's outer edge, 1 where it has faded to nothing. */
float scrimAlpha(float t, float a0, float a1) {
  t = clamp(t, 0.0, 1.0);
  return t < 0.5 ? mix(a0, a1, t / 0.5) : mix(a1, 0.0, (t - 0.5) / 0.5);
}
```

At the end of `void main()`, immediately before `outColor = vec4(col, 1.0);`, insert:

```glsl
  // In-shader scrims. vUv.y = 1 at the top of the frame, 0 at the bottom
  // (confirmed empirically when the capsule position was first tuned).
  // Top band runs from the top edge down through uScrimTop.x of the frame;
  // bottom band runs from the bottom edge up through uScrimBot.x.
  float topT = (1.0 - vUv.y) / max(uScrimTop.x, 1e-4);
  float topA = (vUv.y > 1.0 - uScrimTop.x) ? scrimAlpha(topT, uScrimTop.y, uScrimTop.z) : 0.0;

  float botT = vUv.y / max(uScrimBot.x, 1e-4);
  float botA = (vUv.y < uScrimBot.x) ? scrimAlpha(botT, uScrimBot.y, uScrimBot.z) : 0.0;

  col = mix(col, uVoid, max(topA, botA));
```

- [ ] **Step 2: Wire the new uniforms into `refract.js`**

Modify `src/gl/refract.js`. In the `U` object (currently `cover, res, push, force, capsule, radius`), add three more lookups:

```js
  const U = {
    cover: u('uCover'), res: u('uRes'), push: u('uPush'),
    force: u('uForce'), capsule: u('uCapsule'), radius: u('uRadius'),
    voidColor: u('uVoid'), scrimTop: u('uScrimTop'), scrimBot: u('uScrimBot'),
  }
```

Replace the hardcoded capsule state with settable state, and add default scrims and void colour. Add this block right after the `let push = [0.5, 0.5], force = 0` line:

```js
  // Defaults match the old hardcoded card-shaped capsule and today's
  // Stage.jsx CSS gradients exactly, so nothing changes visually until a
  // caller starts feeding it real measured values.
  let capsule = [0.5, 0.82, 0.42, 0.085]
  let scrimTop = [0.52, 0.86, 0.60]
  let scrimBot = [0.56, 0.96, 0.88]
  let voidRgb = [0.039, 0.039, 0.047] // #0A0A0C — overwritten by setVoidColor before first real render
```

Replace the `gl.uniform4f(U.capsule, 0.5, 0.82, 0.42, 0.085)` line inside `render()` with:

```js
      gl.uniform4f(U.capsule, capsule[0], capsule[1], capsule[2], capsule[3])
      gl.uniform3f(U.voidColor, voidRgb[0], voidRgb[1], voidRgb[2])
      gl.uniform4f(U.scrimTop, scrimTop[0], scrimTop[1], scrimTop[2], 0)
      gl.uniform4f(U.scrimBot, scrimBot[0], scrimBot[1], scrimBot[2], 0)
```

Add the three new setters to the returned object, alongside `setPush`:

```js
    setCapsule(cx, cy, hw, hh) { capsule = [cx, cy, hw, hh] },
    setScrims({ topHeight, topStart, topMid, botHeight, botStart, botMid }) {
      scrimTop = [topHeight, topStart, topMid]
      scrimBot = [botHeight, botStart, botMid]
    },
    setVoidColor(r, g, b) { voidRgb = [r, g, b] },
```

- [ ] **Step 3: Verify the shader still compiles and renders**

This is GL code — jsdom has no WebGL context, so verification is a live browser check, matching how this codebase has verified `src/gl/` throughout (readPixels sampling, not a unit test). Probe rAF first:

```js
new Promise(r => { let n = 0; const t = performance.now();
  const f = () => { n++; performance.now() - t < 500 ? requestAnimationFrame(f) : r({hidden: document.hidden, frames: n}); };
  requestAnimationFrame(f); setTimeout(() => n === 0 && r({hidden: document.hidden, frames: 0}), 900); })
```

Then, in a scratch script or the browser console against a running dev server, create a refractor against any local image, call `resize`, `setVoidColor(0.039, 0.039, 0.047)`, `setScrims({ topHeight: 0.52, topStart: 0.86, topMid: 0.60, botHeight: 0.56, botStart: 0.96, botMid: 0.88 })`, `setCapsule(0.5, 0.5, 0.3, 0.1)`, then `render()`. Confirm `gl.getError() === 0`. If frames are flowing, sample pixels near the top and bottom edges with `readPixels` and confirm they trend darker toward `voidRgb` than the frame's vertical centre — that's the scrim working. State plainly in the task report which checks were visual and which were `getError`-only if rAF is throttled in this environment.

- [ ] **Step 4: Confirm the existing suite is untouched**

Run: `npm test`
Expected: unaffected — this task touches no test files. Confirm the count matches what it was before this task (no accidental deletions).

- [ ] **Step 5: Commit**

```bash
git add src/gl/shader.glsl.js src/gl/refract.js
git commit -m "Shader: dynamic capsule position, in-shader scrims, sourced void colour

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

## Task 3: `useCapsuleRect` — measure the real DOM capsule, not a guess

**Files:**
- Create: `src/hooks/useCapsuleRect.js`, `src/hooks/useCapsuleRect.test.js`

**Interfaces:**
- Produces: `useCapsuleRect(capsuleRef: RefObject, containerRef: RefObject, deps: any[]) => { x: number, y: number, hw: number, hh: number } | null` — `null` until both refs have mounted elements. Follows the codebase's established idiom (`Rail.jsx`, `usePush.js`): rAF-throttled measurement on `resize`/`scroll`, not a `ResizeObserver` (no new primitive introduced for one hook).

- [ ] **Step 1: Write the failing tests**

Create `src/hooks/useCapsuleRect.test.js`. This tests the pure conversion function the hook is built on, extracted so it's testable without mounting React or mocking rAF:

```js
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
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run src/hooks/useCapsuleRect.test.js`
Expected: FAIL — cannot resolve `./useCapsuleRect` or `rectToCapsule` is not exported.

- [ ] **Step 3: Implement `src/hooks/useCapsuleRect.js`**

```js
import { useEffect, useState } from 'react'

/**
 * DOM rect -> shader-space capsule. Shader y is 1 at the top of the frame,
 * 0 at the bottom (established when the capsule position was first tuned,
 * see src/gl/refract.js) — the opposite of CSS's top-down convention, so
 * this is the one place that flip happens.
 */
export function rectToCapsule(capRect, stageRect) {
  const sw = Math.max(1, stageRect.width)
  const sh = Math.max(1, stageRect.height)
  const cx = (capRect.left + capRect.width / 2 - stageRect.left) / sw
  const cyTopDown = (capRect.top + capRect.height / 2 - stageRect.top) / sh
  return {
    x: cx,
    y: 1 - cyTopDown,
    hw: capRect.width / 2 / sw,
    hh: capRect.height / 2 / sh,
  }
}

/**
 * Tracks a capsule element's position relative to its stage container, in
 * shader UV space. Follows this codebase's established rAF-throttled
 * resize/scroll pattern (Rail.jsx, usePush.js) rather than introducing
 * ResizeObserver as a new primitive for one hook. Re-measures whenever
 * anything in `deps` changes (e.g. the active project's title, which
 * changes the capsule's width).
 */
export function useCapsuleRect(capsuleRef, containerRef, deps = []) {
  const [rect, setRect] = useState(null)

  useEffect(() => {
    let frame = 0
    const measure = () => {
      frame = 0
      const cap = capsuleRef.current
      const stage = containerRef.current
      if (!cap || !stage) return
      setRect(rectToCapsule(cap.getBoundingClientRect(), stage.getBoundingClientRect()))
    }
    const schedule = () => {
      if (frame) return
      frame = requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener('resize', schedule, { passive: true })
    window.addEventListener('scroll', schedule, { passive: true })
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('resize', schedule)
      window.removeEventListener('scroll', schedule)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return rect
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run src/hooks/useCapsuleRect.test.js`
Expected: 6 passed.

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useCapsuleRect.js src/hooks/useCapsuleRect.test.js
git commit -m "Add useCapsuleRect: measure the real DOM capsule for the shader

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

## Task 4: `StageCanvas` — progressive img-to-canvas per project

**Files:**
- Create: `src/components/StageCanvas.jsx`

**Interfaces:**
- Consumes: `createRefractor` (Task 2), `hexToRgbFloat` (Task 1).
- Produces: `<StageCanvas project active capsule onCanvasReady />`
  - `project`: the content object (needs `.cover`, `.title`).
  - `active`: boolean — only true for the currently-selected project.
  - `capsule`: `{ x, y, hw, hh } | null` from `useCapsuleRect`, or `null` before first measurement.
  - `onCanvasReady`: `(ready: boolean) => void` — called once when the canvas takes over from the `<img>`, and again with `false` if it ever has to fall back (WebGL loss, `active` going false).

- [ ] **Step 1: Implement `src/components/StageCanvas.jsx`**

```jsx
import { useEffect, useRef, useState } from 'react'
import { createRefractor } from '../gl/refract'
import { hexToRgbFloat } from '../lib/color'

// Same three-stop values Stage.jsx's CSS gradients used before the scrims
// moved into the shader (Task 2). Keep these two in sync by hand if the
// visual design changes — there is exactly one rendering path now, so
// there is exactly one place to change it.
const SCRIMS = {
  topHeight: 0.52, topStart: 0.86, topMid: 0.60,
  botHeight: 0.56, botStart: 0.96, botMid: 0.88,
}

/**
 * One project's background layer on the stage. Renders an <img>
 * immediately and unconditionally — that is what a visitor sees at first
 * paint regardless of what happens next. Only once WebGL2 initialises AND
 * the cover texture has loaded does a <canvas> mount on top and take over;
 * at that exact moment the canvas is showing the same pixels the <img>
 * was already showing (push is centred, force is 0 until the pointer
 * moves), so the swap is invisible and never delays LCP.
 *
 * Only the ACTIVE project holds a live refractor — inactive projects stay
 * plain <img> and never pay for a WebGL context at all.
 */
export default function StageCanvas({ project, active, capsule, onCanvasReady }) {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const refractorRef = useRef(null)
  const rafRef = useRef(0)
  const [canvasLive, setCanvasLive] = useState(false)

  // Mount/tear down the refractor as `active` and `project.cover` change.
  useEffect(() => {
    if (!active || !project.cover) {
      setCanvasLive(false)
      onCanvasReady?.(false)
      return
    }

    const canvas = canvasRef.current
    if (!canvas) return

    const refractor = createRefractor(canvas, project.cover)
    if (!refractor) {
      // WebGL2 unavailable or the shader failed to compile on this GPU.
      // The <img> underneath is already showing — nothing to fall back
      // FROM, there is simply no enhancement this time.
      setCanvasLive(false)
      onCanvasReady?.(false)
      return
    }

    refractorRef.current = refractor

    const root = document.documentElement
    const voidHex = getComputedStyle(root).getPropertyValue('--color-void').trim() || '#0A0A0C'
    refractor.setVoidColor(...hexToRgbFloat(voidHex))
    refractor.setScrims(SCRIMS)

    const resize = () => {
      const rect = containerRef.current?.getBoundingClientRect()
      if (rect) refractor.resize(rect.width, rect.height)
    }
    resize()
    window.addEventListener('resize', resize, { passive: true })

    let announced = false
    const frame = () => {
      const style = getComputedStyle(root)
      refractor.setPush(
        parseFloat(style.getPropertyValue('--push-x')) || 0.5,
        parseFloat(style.getPropertyValue('--push-y')) || 0.5,
        parseFloat(style.getPropertyValue('--push-force')) || 0,
      )
      refractor.render()
      if (!announced) {
        announced = true
        setCanvasLive(true)
        onCanvasReady?.(true)
      }
      rafRef.current = requestAnimationFrame(frame)
    }
    rafRef.current = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
      refractor.destroy()
      refractorRef.current = null
      setCanvasLive(false)
      onCanvasReady?.(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, project.cover])

  // Push the measured DOM capsule into the shader whenever it changes.
  useEffect(() => {
    if (capsule && refractorRef.current) {
      refractorRef.current.setCapsule(capsule.x, capsule.y, capsule.hw, capsule.hh)
    }
  }, [capsule])

  return (
    <div ref={containerRef} className="absolute inset-0">
      {project.cover ? (
        <img
          src={project.cover}
          alt={`Cover of the ${project.title} case study`}
          className="h-full w-full object-cover"
          style={{ visibility: canvasLive ? 'hidden' : 'visible' }}
          loading={active ? 'eager' : 'lazy'}
          decoding="async"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center px-8">
          <span className="max-w-[16ch] text-center text-display leading-[0.95] text-white/8">
            {project.title}
          </span>
        </div>
      )}
      {active && project.cover && (
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />
      )}
    </div>
  )
}
```

- [ ] **Step 2: Verify it builds**

Run: `npm run build`
Expected: succeeds. `StageCanvas.jsx` is not imported anywhere yet — this task only needs to compile in isolation, Task 5 wires it in.

- [ ] **Step 3: Commit**

```bash
git add src/components/StageCanvas.jsx
git commit -m "Add StageCanvas: progressive img-to-canvas per project

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

## Task 5: Rewire `Stage.jsx` onto `StageCanvas`

**Files:**
- Modify: `src/components/Stage.jsx`

**Interfaces:**
- Consumes: `StageCanvas` (Task 4), `useCapsuleRect` (Task 3), `Glass` (unchanged).

- [ ] **Step 1: Read the current file before editing**

Read `src/components/Stage.jsx` in full — it has not changed shape since the version this plan was written against, but confirm before editing.

- [ ] **Step 2: Replace the per-project background block**

Replace the entire `{projects.map((p, i) => ( <div key={p.slug} ...> ... </div> ))}` block (the one rendering `<img>` or the ghost-title fallback) with:

```jsx
        {projects.map((p, i) => (
          <div
            key={p.slug}
            aria-hidden={i !== active}
            className="absolute inset-0 transition-opacity duration-700 ease-out"
            style={{ opacity: i === active ? 1 : 0 }}
          >
            <StageCanvas
              project={p}
              active={i === active}
              capsule={i === active ? capsuleRect : null}
              onCanvasReady={i === active ? setCanvasReady : undefined}
            />
          </div>
        ))}
```

- [ ] **Step 3: Make the CSS scrims conditional on canvas readiness**

The two scrim `<div>`s (`from-void/86 via-void/60...` and `from-void/96 via-void/88...`) stay in the file as the fallback for the window before the shader takes over, and for the case `createRefractor` never succeeds. Replace their fixed rendering with a conditional wrapped in a fade, so there is never a moment where both the CSS scrim and the shader's own darkening are visible at full strength simultaneously:

```jsx
        {/* Fallback scrims. Visible whenever the active project's shader
            is not yet compositing its own darkening — the brief window
            before WebGL/texture is ready, or permanently if createRefractor
            never succeeds. Never both this AND the shader's scrim at once:
            this fades to 0 the instant onCanvasReady(true) fires. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[52%] bg-gradient-to-b from-void/86 via-void/60 to-transparent transition-opacity duration-300"
          style={{ opacity: canvasReady ? 0 : 1 }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[56%] bg-gradient-to-t from-void/96 via-void/88 to-transparent transition-opacity duration-300"
          style={{ opacity: canvasReady ? 0 : 1 }}
        />
```

- [ ] **Step 4: Add the new state, refs, and imports**

At the top of the component function, after the existing `useState`/`useRef` declarations, add:

```jsx
  const capsuleRef = useRef(null)
  const [canvasReady, setCanvasReady] = useState(false)
  const capsuleRect = useCapsuleRect(capsuleRef, trackRef, [current?.slug])
```

Note: `current` is computed later in the existing code (`const current = projects[active]`) — move that line above this block so `current?.slug` is available here, or reorder so `capsuleRect` is computed after `current` is defined. Keep `trackRef` — it already exists and already points at the sticky container, which is the correct stage-rect reference for `useCapsuleRect`.

Add the imports:

```jsx
import StageCanvas from './StageCanvas'
import { useCapsuleRect } from '../hooks/useCapsuleRect'
```

- [ ] **Step 5: Give the capsule wrapper the measurement ref, and switch off its own CSS glass once the shader is compositing it**

Find the existing capsule markup:

```jsx
            <Link to={`/work/${current.slug}`} className="group mt-6 inline-block">
              <Glass as="span" className="inline-flex items-center gap-4 px-7 py-4">
                <span className="text-card text-text">{current.title}</span>
                <span className="label text-text" aria-hidden="true">Open →</span>
              </Glass>
            </Link>
```

Replace with:

```jsx
            <Link to={`/work/${current.slug}`} className="group mt-6 inline-block" ref={capsuleRef}>
              {/*
                Once the shader is compositing this exact capsule (canvasReady),
                the DOM wrapper must NOT also apply CSS .glass — that would
                stack a second blur+tint on top of the shader's own tint+rim,
                the same double-darkening bug class the contrast audit found
                once already. `Glass` supplies the fallback look before that;
                a plain span carries only the text once the shader has it.
              */}
              {canvasReady ? (
                <span className="relative inline-flex items-center gap-4 px-7 py-4">
                  <span className="text-card text-text">{current.title}</span>
                  <span className="label text-text" aria-hidden="true">Open →</span>
                </span>
              ) : (
                <Glass as="span" className="inline-flex items-center gap-4 px-7 py-4">
                  <span className="text-card text-text">{current.title}</span>
                  <span className="label text-text" aria-hidden="true">Open →</span>
                </Glass>
              )}
            </Link>
```

- [ ] **Step 6: Verify**

Run: `npm run lint` (expect 0), `npm run build` (expect success), `npm test` (expect the full suite still passing, no test files touched by this task so the count is unchanged).

Then live: probe rAF, and if frames are flowing, drop a temporary 1600×2000 JPG into `content/pocket-pediatrics/cover.jpg` (delete before committing, per this project's standing rule — a placeholder cover must never ship), reload, and confirm via `javascript_tool`:

```js
document.querySelectorAll('#work canvas').length
```

Expected: `1` (only the active project). Confirm `canvasElementsOnPage` is `0` when the project has no cover (the ghost-title fallback path), and that the CSS scrims are visible immediately on load and fade out once the canvas takes over — check `getComputedStyle` opacity on the two scrim divs before and ~1s after mount.

If rAF is throttled (0 frames), verify statically instead: confirm `StageCanvas` renders without throwing (React error boundary/console check), confirm the `<img>` is `visibility: visible` when no canvas exists, and say plainly in the report that the live canvas-swap behaviour could not be observed in this environment.

- [ ] **Step 7: Commit**

```bash
git add src/components/Stage.jsx
git commit -m "Wire the stage onto StageCanvas: the shader is now the stage surface

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

## Task 6: Delete the dead files

**Files:**
- Delete: `src/components/Hero.jsx`, `src/components/WorkIndex.jsx`, `src/components/GlassCard.jsx`

**Interfaces:** none — this task removes code, it adds nothing.

- [ ] **Step 1: Confirm nothing imports any of the three files**

```bash
grep -rn "from '.*Hero'" src/
grep -rn "from '.*WorkIndex'" src/
grep -rn "from '.*GlassCard'" src/
```

Expected: no matches for any of the three. `WorkIndex.jsx` was the only importer of `GlassCard.jsx`; both are unreachable from any route (confirmed in the audit, `DESIGN-IS-2026-08-21/01-evidence.md` §headline finding). `Hero.jsx` was superseded by `Stage.jsx`'s inline annotation before this plan started.

If any grep DOES return a match, stop — something imports one of these files that this plan did not account for. Do not delete it; report the finding instead.

- [ ] **Step 2: Delete the three files**

```bash
git rm src/components/Hero.jsx src/components/WorkIndex.jsx src/components/GlassCard.jsx
```

- [ ] **Step 3: Verify**

Run: `npm run lint` (expect 0), `npm run build` (expect success — confirms nothing was silently relying on these three files), `npm test` (expect unchanged count).

- [ ] **Step 4: Commit**

```bash
git commit -m "Delete Hero.jsx, WorkIndex.jsx, GlassCard.jsx: unreachable since Stage.jsx replaced them

Confirmed via grep before deletion: nothing imports any of the three.
235 lines of dead code that a Dieter Rams audit flagged under principle
#10 (as little design as possible).

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

## Task 7: Fix the sheen/contrast regression

**Files:**
- Modify: `src/index.css`

**Interfaces:** none new — this corrects an existing token value.

- [ ] **Step 1: Confirm the regression numerically before fixing it**

The audit (`DESIGN-IS-2026-08-21/01-evidence.md` §2) found the `.glass` pointer sheen, at its peak (`--push-force: 1`, cursor centred on a capsule), drops title text to **4.30:1** against a worst-case bright cover — below the 4.5:1 AA floor. Reproduce this before changing anything:

```bash
node --input-type=module -e "
import { minGlassAlpha, contrastRatio, composite } from './src/lib/contrast.js';
const TEXT=[244,244,246], SMOKE=[12,12,14], WHITE=[255,255,255];
const base = composite(SMOKE, WHITE, 0.65);
const sheenAlpha = 0.055 + 1*0.06; // peak sheen, from index.css's .glass rule
const hot = composite(WHITE, base, sheenAlpha);
console.log('base @0.65 over white cover:', contrastRatio(TEXT, base).toFixed(2));
console.log('with peak sheen on top:     ', contrastRatio(TEXT, hot).toFixed(2));
"
```

Expected output: base ~5.63, with-sheen ~4.30 — confirming the regression exists before this task fixes it.

- [ ] **Step 2: Find the fix — cap the sheen's peak alpha**

Find the sheen alpha in `.glass`'s `background` (the `radial-gradient` stop reading `rgb(255 255 255 / calc(0.055 + var(--push-force) * 0.06))`). Compute the largest peak alpha that still clears 4.5:1:

```bash
node --input-type=module -e "
import { minGlassAlpha, contrastRatio, composite } from './src/lib/contrast.js';
const TEXT=[244,244,246], SMOKE=[12,12,14], WHITE=[255,255,255];
const base = composite(SMOKE, WHITE, 0.65);
for (let peak = 0.115; peak >= 0.02; peak -= 0.005) {
  const hot = composite(WHITE, base, peak);
  const r = contrastRatio(TEXT, hot);
  if (r >= 4.5) { console.log('largest safe peak sheen alpha:', peak.toFixed(3), '->', r.toFixed(2) + ':1'); break; }
}
"
```

- [ ] **Step 3: Apply the cap in `src/index.css`**

In the `.glass` rule's `background` radial-gradient, change the peak term from `0.055 + var(--push-force) * 0.06` to the value found in Step 2 (expected to be close to `0.055 + var(--push-force) * 0.03` — confirm against the actual script output, do not assume). Update the rule's own comment to record the corrected floor:

```css
  .glass {
    /* ... existing comment ... */
    background:
      radial-gradient(
        130% 190% at calc(50% + var(--gx) * 46%) calc(50% + var(--gy) * 46%),
        /* Peak sheen alpha capped so composite contrast can never cross
           below 4.5:1 against a worst-case bright cover, even at
           --push-force: 1. The original 0.055 + force*0.06 (peak 0.115)
           was added without re-checking against the contrast floor
           measured before it existed, and regressed title text to 4.30:1
           — found by /design-is audit, DESIGN-IS-2026-08-21/. */
        rgb(255 255 255 / calc(0.055 + var(--push-force) * <CAPPED_VALUE>)) 0%,
        rgb(255 255 255 / 0.012) 46%,
        transparent 72%
      ),
      rgb(12 12 14 / 0.65);
    /* ...rest unchanged... */
  }
```

Replace `<CAPPED_VALUE>` with the exact number Step 2 produced.

- [ ] **Step 4: Re-verify with the actual shipped value**

Re-run the Step 1 script with the new capped value substituted for `0.06`, confirming the "with peak sheen" line now reads ≥4.50.

- [ ] **Step 5: Verify no visual regression**

Run `npm run build`. Live, if rAF is flowing: drive `--push-force` to `1` via `document.documentElement.style.setProperty('--push-force', '1')` on a page with a `.glass` element visible, screenshot or sample, and confirm the sheen is still visibly present (a capped-but-present sheen, not an invisible one) — the fix should narrow the effect, not delete it.

- [ ] **Step 6: Commit**

```bash
git add src/index.css
git commit -m "Cap the .glass pointer sheen so peak contrast holds AA

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

## Task 8: Reuse `Band` in `CaseStudy`, retire `--text-hero`

**Files:**
- Modify: `src/routes/CaseStudy.jsx`, `src/index.css`

**Interfaces:**
- Consumes: `Band` (unchanged, existing component).

- [ ] **Step 1: Replace `CaseStudy.jsx`'s hand-rolled eyebrow/heading with `Band`**

Read `src/routes/CaseStudy.jsx` in full first. Find the opening block:

```jsx
    <article ref={ref} className="mx-auto max-w-[1400px] px-6 pb-32 pt-40 md:px-12">
      <p className="label" data-reveal>Case study</p>
      <h1 className="mt-4 max-w-[18ch] text-display tracking-[-0.02em]" data-reveal>{project.title}</h1>
      <p className="mt-6 max-w-[46ch] text-xl text-text-dim" data-reveal>{project.tagline}</p>
```

`Band` takes `index`, `reading`, `title`, `id`, `children`, and already wraps its content in a `.shell`. Replace the hand-rolled `max-w-[1400px] px-6...` container and the eyebrow/heading with `Band`, keeping the tagline and everything after as `Band`'s children:

```jsx
    <div ref={ref}>
      <Band index="Case study" reading={project.role || ''} title={project.title}>
        <p className="mt-6 max-w-[46ch] text-xl text-text-dim" data-reveal>{project.tagline}</p>

        {/* ... everything else that was previously inside <article>, unchanged ... */}

      </Band>
    </div>
```

Move the closing `</article>` tag's content inside `Band`'s children, replacing the outer `<article>...</article>` wrapper with `<div ref={ref}>...</div>` around `<Band>`, matching the pattern `WorkIndex` used before it was deleted (Task 6) and `Home.jsx`'s other `Band` consumer.

Add the import:

```jsx
import Band from '../components/Band'
```

Remove the now-unused `max-w-[1400px] px-6 pb-32 pt-40 md:px-12` styling entirely — `Band`'s `.shell py-24 md:py-32` replaces it. If the case-study page's vertical rhythm looks visibly different (more/less top padding) after this change, that is expected — `Band`'s padding is the standard this world uses everywhere else, and the whole point of this task is to stop this one page having its own.

- [ ] **Step 2: Retire `--text-hero`**

`--text-hero` is used in exactly one place after Task 4/5: `StageCanvas.jsx`'s ghost-title fallback, where it was already changed to `text-display` in Task 4's code (check — the `StageCanvas.jsx` written in Task 4 already uses `text-display` for the ghost title, not `text-hero`, precisely to close this gap in the same motion). Confirm:

```bash
grep -rn "text-hero" src/
```

Expected: **zero matches** in any `.jsx` file — only the token definition itself remains in `src/index.css`. Remove the now-unused token definition from the `@theme` block in `src/index.css`:

```css
  --text-hero:    clamp(1.2rem, 6vw, 5.5rem);
```

Delete this line. Also remove the stale comment above the type-scale block referencing "Hero.jsx" (`src/index.css`, the comment beginning "Switzer is wider than Quilon..."), since `Hero.jsx` no longer exists (Task 6) and the comment's specific claim about it is now inaccurate. Replace it with:

```css
  /* Switzer is wider than the face it replaced at the same size — retune
     wrap widths in ch alongside any clamp change; a clamp adjustment alone
     does not move the wrap point, since ch scales with font-size. */
```

- [ ] **Step 3: Verify**

Run: `npm run lint` (expect 0), `npm run build` (expect success), `npm test` (expect unchanged count, no test files touched).

Live: visit `/work/pocket-pediatrics`, confirm the page renders with a visible eyebrow ("Case study"), a right-aligned reading (the project's role), a title, and everything below it in the same order as before. Confirm `scrollWidth === innerWidth` at 320/375/768/1440 — the `.shell`-based container has different max-width/padding behaviour from the old hand-rolled one, so this is the most likely place for a regression.

- [ ] **Step 4: Commit**

```bash
git add src/routes/CaseStudy.jsx src/index.css
git commit -m "Reuse Band in CaseStudy; retire the orphaned --text-hero token

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

## Task 9: Full verification pass

**Files:** none — this task only verifies.

- [ ] **Step 1: Re-run the whole audit's headline check**

```js
document.querySelectorAll('canvas').length
```

on `/` with a real cover in place (temporary, deleted after) and the relevant project active. Expected: **1**, not 0. This is the single number that determines whether this plan actually closed the gap the audit found.

- [ ] **Step 2: Re-run the contrast checks from Task 7 with the final shipped CSS**

Confirm the peak-sheen contrast script still reports ≥4.50:1.

- [ ] **Step 3: Confirm the dead-code and orphan-token findings are closed**

```bash
grep -rn "from '.*Hero'\|from '.*WorkIndex'\|from '.*GlassCard'" src/ && echo "STILL REFERENCED" || echo "clean"
grep -rn "text-hero" src/ && echo "STILL PRESENT" || echo "clean"
```

Both expected: `clean`.

- [ ] **Step 4: Full gate sweep**

```bash
npm run lint
npm test
npm run build
```

Expected: lint 0, full test suite passing (Task 1 adds 7, Task 3 adds 6 — confirm both landed), build succeeds.

- [ ] **Step 5: Widths, keyboard, reduced motion — the standing checklist**

- `scrollWidth === innerWidth` at 320/375/768/1024/1440/2560 on `/` and `/work/pocket-pediatrics`.
- Tab through the home page: skip link first, then Nav, then reach the stage capsule or the `sr-only` fallback grid — confirm the keyboard path still works exactly as before (Task 5 did not touch the `sr-only focus-within:not-sr-only` block).
- Emulate `prefers-reduced-motion: reduce`, reload: confirm `usePush` sets its static value (unchanged from before this plan), and confirm `StageCanvas` still renders correctly — its render loop reads `--push-x/-y/-force` off `documentElement` regardless of how those got set, so reduced-motion should already work without any code in this plan needing to special-case it. Confirm this rather than assume it.

- [ ] **Step 6: Report real bundle sizes**

```bash
npm run build 2>&1 | grep -E "\.js |\.css "
```

Report the actual entry bundle size in the task report. This plan did not add three.js or any new heavy dependency, so no large regression is expected — but report the real number rather than assume it.

- [ ] **Step 7: Update the audit's own record**

Add a note to `DESIGN-IS-2026-08-21/03-verdict.md` (append, do not rewrite the original findings) recording that this plan's completion is the redesign response to the 17/30 verdict, with the commit range, so a future reader of the audit knows it was acted on rather than left open.

- [ ] **Step 8: Commit**

```bash
git add DESIGN-IS-2026-08-21/03-verdict.md
git commit -m "Record redesign completion against the 2026-08-21 audit

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

## Self-review

**Spec coverage** (against `docs/superpowers/specs/2026-08-07-behind-glass-design.md` §6 and `DESIGN-IS-2026-08-21/04-handoff-prompt.md`):
- Move 1 (re-wire the shader) → Tasks 2, 4, 5.
- Move 2 (sheen/contrast fix) → Task 7.
- Move 3 (delete dead files) → Task 6.
- Move 4 (trend exposure) → addressed structurally by Task 8 (`Band` reuse tightens the "hard editorial grid countering soft shapes" the spec already commits to) rather than a separate task — there is no further code-level move the audit specified beyond what §3/§5.4 of the spec already require, which this plan does not touch or weaken.
- Move 5 (`--text-hero` / `Band` reuse) → Task 8.
- §6.1 progressive LCP enhancement → Task 4 (`StageCanvas`'s img-first, canvas-replaces pattern).
- §3's "scrims live in the shader" → Task 2, Task 5 Step 3.
- §2.0's "Nav stays CSS-only, explicitly" → no code change needed (Nav was never touched), verified by omission: no task modifies `Nav.jsx`.

**Placeholder scan:** no TBD/TODO, no "similar to Task N" without repeated code, no test-writing steps without actual test code. Every code block is complete and copy-pasteable.

**Type/interface consistency:** `createRefractor`'s return shape (`setPush`, `resize`, `render`, `destroy`, plus Task 2's new `setCapsule`/`setScrims`/`setVoidColor`) is used identically in Task 4's `StageCanvas`. `useCapsuleRect`'s return shape (`{x, y, hw, hh} | null`) matches what `StageCanvas`'s `capsule` prop expects and what `setCapsule(x, y, hw, hh)` consumes. `rectToCapsule` is exported from `useCapsuleRect.js` specifically so Task 3's tests can exercise it without mounting React — confirmed both the test file and the hook implementation import/export the same name.

**Gap found and fixed during self-review:** the original draft of Task 5 did not address `current`'s declaration order relative to the new `capsuleRect` hook call (which needs `current?.slug` as a dependency but `current` was declared later in the existing file). Step 4 now explicitly calls this out rather than leaving it for the implementer to discover as a `ReferenceError`.
