# Behind Glass — Design Spec

**Date:** 2026-08-07
**Owner:** Çağdaş Ergenç
**Branch:** `design/behind-glass` (to be created from `design/lit-paper`)
**Status:** Concept approved, pending implementation plan

---

## 1. Goal

A second, **shippable** visual world for the same portfolio. The owner chooses
between this and Lit Paper; whichever wins becomes the site.

Same product truth as `2026-08-04-portfolio-redesign-design.md`: the primary
audience is design hiring managers, the site must survive a 90-second skim,
and case studies must be readable as web pages without opening a PDF. None of
that changes. Only the visual world does.

## 2. The concept

**The work is clear. The chrome is glass.**

Cover images render large and unobstructed — the site reads as a gallery. The
interface *around* them is glass.

An earlier concept put the work *behind* the glass, submerged and distorted
until the cursor resolved it. The owner rejected it, correctly: making a
hiring manager work to see the projects is a cost with no return, and it
repeats the failure the PDF modals were removed for. **Never obstruct the
work.**

### 2.0 Scope of refraction — corrected after audit

The original draft of this section claimed "nav, buttons, metadata pills...
capsules floating above the work and genuinely refracting it as they pass
over" — implying every glass surface on the site refracts. That claim was
never fully built, and a `/design-is` Dieter Rams audit against the shipped
branch (`DESIGN-IS-2026-08-21/`) scored principle #6 (honest) at **0/3**
partly because of it: the site's one shader-backed surface had gone
unreachable, and the spec's language never scoped down to match what could
realistically ship.

**The claim is now scoped deliberately, not accidentally:**

- **The stage — where a project's own image is directly on screen — genuinely
  refracts.** This is the surface making the "glass over the work" claim, so
  it is the one that has to be true.
- **Nav, and any other chrome that floats over the void ground rather than
  over artwork, stays CSS-only smoked glass** (`backdrop-filter: blur` plus
  the pointer-reactive sheen from §3). There is usually nothing under Nav
  worth bending, and building a second live canvas to refract the void would
  cost real GPU time to bend nothing. Scoping the claim to where it is true
  is part of the honesty fix, not a compromise of it.

A later pass may give Nav (or other secondary chrome) a subtle animated
background of its own — parked as a distinct idea, not part of this fix, and
not something that would need real refraction to be worth doing.

### 2.1 Why this survives the cliché problem

Glassmorphism is the most generated look in software right now, and Apple's
Liquid Glass made it the most imitated. Shipping frosted panels on a dark
gradient would read as generated — the exact failure this project has spent
its whole life avoiding.

Two things separate this from that:

1. **The refraction is real.** Not `backdrop-filter: blur`. A WebGL layer
   samples the actual cover images and displaces them through a shader. Almost
   nobody does this, because blur is cheap and refraction is not.
2. **It has a physical rule.** The glass has viscosity and responds to one
   pointer-driven displacement field. It behaves like a material, not like a
   CSS effect.

If either is dropped, this becomes generic and should not ship.

## 3. The one technical idea

Lit Paper had `--sun-x` / `--sun-y`: one light source shared by CSS and WebGL.
This is the same discipline with different physics.

**`--push-x`, `--push-y`, `--push-force`** — a single pointer-driven
displacement field on `documentElement`, updated at most once per animation
frame.

- The WebGL refraction shader samples it to bend the covers.
- The DOM reads it too: glass capsules shift a few pixels, edge highlights
  track the pointer, radii breathe.

One source of truth. The glass and the chrome can never disagree.

**The scrims live in the shader, not as separate CSS layers.** The stage
darkens its top and bottom bands so overlay text clears contrast against
whatever cover is showing (§6.1). That darkening is computed by the same
fragment shader doing the refraction, not by stacked `<div>` gradients on top
of it — one material producing both effects is the more honest answer to
"is this actually one thing," and it is cheaper: the GPU already has the
pixel in hand. CSS-only scrims were the interim state after the display work
in §2.0 above went unwired; folding them into the shader is part of
reconnecting it properly rather than reconnecting it as two separate systems
doing related jobs.

**Viscosity is mandatory.** Displacement must lag the cursor and settle, not
snap to it. Damped, not linear. Snapping reads as a hover state; lag reads as
a material. This is the single detail that decides whether the effect works.

## 4. Architecture

This is a new visual world over the existing machine, not a rebuild.

| Reused unchanged | Restyled | New |
| --- | --- | --- |
| `src/lib/content.js` + its 19 tests | Case-study page | `src/hooks/usePush.js` |
| `content/` folders and all authored copy | Nav, About, Contact, WebBand | WebGL refraction layer (`src/gl/`) |
| Router, routes, `<main>`, skip link | `useReveal` motion (retuned) | Persistent stage (`Stage.jsx`), shader-backed |
| `src/lib/sun.js` + its 17 tests (Lit Paper only) | | Dark token set |

**A structural pivot happened mid-build, in response to direct feedback that
this branch "looks a lot better but still has the same DNA" as Lit Paper.**
The original plan below (§6, pre-audit) built the work index as a grid of
glass cards — visually different from Lit Paper, structurally identical
(same stacked-sections document, same card grid, just recoloured). It was
replaced with `Stage.jsx`: the page opens directly on a project, a
viewport-filling stage stays `position: sticky` while the page scrolls, and
scrolling swaps which project occupies it. `Rail.jsx` and `Band.jsx` were
added alongside it for the same reason — an index rail and measurement-plate
section headers that Lit Paper has no equivalent of.

That pivot fixed the "same DNA" problem but **orphaned the shader**:
`GlassCard.jsx` (the grid-card shader integration) was never re-wired into
`Stage.jsx`, so the branch shipped with a genuinely working, tested
refraction shader that nothing on the live page could reach. Confirmed via
`/design-is` audit (`DESIGN-IS-2026-08-21/`, principle #6 scored 0/3) and via
live DOM check: `document.querySelectorAll('canvas').length === 0` on the
shipped home page. §6 below is rewritten to describe the corrected
architecture — the stage as the shader surface — rather than the abandoned
grid.

**Content does not move.** Anything written in `content/` serves both worlds.
That is the payoff for having built the pipeline before the visuals.

Estimated **7–8 tasks**, versus 13 for Lit Paper.

### 4.1 Branching

`design/behind-glass` branches from `design/lit-paper`. Both are kept until
the owner picks one. Neither merges to `main` until then.

## 5. Design system

### 5.1 Colour

| Token | Value | Use |
| --- | --- | --- |
| `--void` | `#0A0A0C` | Ground. Near-black, faintly blue. |
| `--glass` | `rgb(12 12 14 / 0.65)` | Panel fill — **smoked, not frosted** (see §5.2) |
| `--edge` | `rgb(255 255 255 / 0.18)` | Lit rim — this is what sells the material |
| `--text` | `#F4F4F6` | Primary |
| `--text-dim` | `#9B9BA6` | Secondary, metadata |
| `--accent-glass` | TBD at build, must clear 4.5:1 on `--void` | One signal colour |

**Every pair must be computed, not eyeballed.** Lit Paper's first accent
failed AA at 4.07:1 and was only caught by computing it. Do the same here
before any of it ships.

### 5.2 Contrast over glass — the hard problem

Text sitting on a translucent panel over a moving image has **no fixed
background**, so no single contrast figure describes it. This is the nav
`mix-blend-multiply` bug from Lit Paper at larger scale — there, ink over the
dark Insight band measured 1.10:1 and nobody noticed until the final review.

**Resolved by measurement.** The original white glass at 0.06 was tested with
`minGlassAlpha` and returned **`null` for both text tokens**: white glass
composited over a white cover is white at every alpha, so no opacity rescues
light text. The fill is therefore **smoked** — `rgb(12 12 14 / 0.65)` — because
a dark tint always darkens what sits behind it, so contrast holds over a
blown-out cover and over the void alike.

Measured at 0.65 against the worst case (a cover containing pure white):

| Text token | On glass | Verdict |
| --- | --- | --- |
| `--text` | 5.63:1 | passes — titles may sit on glass |
| `--text-dim` | 2.25:1 | fails — metadata must not |

`--text-dim` would need alpha **0.90** to pass, at which point the surface
stops being glass. So:

> **Glass carries titles. The ground carries metadata.**

Metadata sits on the void, where `--text-dim` measures 7.19:1. This is a rule,
not a guideline — there is no combination where dim text on glass over a
bright cover is legible while the glass still reads as glass.

Smoked also serves the anti-cliché condition in §2.1: frosted white is the
Apple/glassmorphism default. Smoked glass is a different, far less copied
material.

**General rule:** every glass surface carrying text must have an opacity floor that
guarantees AA against the *worst-case* content behind it, computed against
both the lightest and darkest pixel a cover can present. Where that floor
would make the glass too opaque to read as glass, the text moves off the glass
instead. Text legibility wins over material fidelity, every time.

### 5.3 Type

- **Display:** Switzer ExtraBold (800), self-hosted from Fontshare
- **Body / UI:** Geist Sans (unchanged)
- **Labels / metadata:** Geist Mono (unchanged)

Switzer is the most neutral of the candidates considered — a clean
neo-grotesque. That is deliberate: the glass carries the personality here, so
the type stays out of its way. It also gives the fully-rounded chrome
something structurally hard to sit against.

**Light-on-dark compensation is required**, not optional: slightly more
line-height, a touch more tracking, and one weight step up versus the same
type on light ground. Skipping this is why most dark sites read as thin and
grey.

Type scale carries over as role tokens — `--text-hero`, `--text-display`,
`--text-title`, `--text-card` — retuned for the darker ground.

### 5.4 Shape

**Fully rounded**: pills and capsules, large radii on every surface.

The owner chose this knowing it is the most familiar shape language in
software today. It is countered by tight tracking, extrabold display type, and
a hard editorial grid — soft containers, hard content. If the build starts
reading like a default component library, the counterweight is not working and
the type/grid gets harder, not the radii smaller.

## 6. Set piece — the persistent stage

The stage is where the concept is legible. This section describes the
corrected architecture — the pre-audit version described a grid of glass
cards that no longer exists on this branch (see §4).

**The stage is the shader surface**, not a small tile floating inside one.
The sticky, viewport-filling stage (`Stage.jsx`) renders the active project's
cover through the WebGL refraction layer — one canvas, sized to the sticky
area, re-textured when the active project changes as the visitor scrolls.
The title capsule and the top/bottom scrims (§3) are composited by that same
shader, not by separate DOM layers sitting on top of a plain `<img>`.

- The cover renders large, clear, unobstructed — refracted, but never
  obscured; the shader bends the image, it does not hide it.
- The title capsule carries the project's name and an "Open →" affordance,
  genuinely refracting the cover directly beneath it.
- Role, year, and any other dim metadata render on the void ground below the
  stage, never on the capsule — the §5.2 contrast rule, unchanged.
- The pointer displaces the glass; the refraction, and now the scrim
  darkening, shift and settle together with viscosity.
- Clicking the capsule opens that project's case study.
- Scrolling advances the stage to the next project. `Rail.jsx` reflects
  position in its own notation alongside it (§4).

### 6.1 LCP — progressive canvas, not a delayed one

The stage is the first thing on screen, which means the cover is very likely
the LCP element — a real change from the pre-pivot plan, where the shader
lived in a small below-fold grid tile and could be excluded from LCP by
simply not mounting yet.

**Resolution: the `<img>` paints first and the canvas replaces it once WebGL
and the texture are ready**, not the other way around. At the moment of
replacement the canvas shows the same pixels the `<img>` was already
showing — force is 0 at load, so there is no distortion until the pointer
actually moves — so the swap costs nothing visible and LCP timing is not
meaningfully different from an `<img>`-only page. If WebGL is unavailable or
the swap is slow, the `<img>` simply keeps showing; nothing blocks on the
shader. This protects the spirit of "canvas must never delay first paint"
without pretending the canvas doesn't exist on the surface a visitor sees
first.

### 6.2 Fallback — and this remains the common case

Mobile, `prefers-reduced-motion`, and no-WebGL get flat translucent capsules
with no refraction (`WorkGridFlat.jsx`, driven by `useLowFi()` in
`Stage.jsx`) — the stacked specimen plate, not the sticky stage at all. A
sticky full-viewport stage on a phone would eat the whole screen and make
the work harder to reach, which the site may not do; a full-screen shader
sampling a texture every frame is also real GPU work that does not belong on
a mid-range phone regardless. **On phones this is what most visitors see**,
so it stays a first-class design, not a degradation.

### 6.3 Performance budget

- The canvas replaces an eagerly-rendered `<img>` once ready (§6.1) — it does
  not block first paint, even though it is no longer literally lazy or
  below-fold the way the pre-pivot grid version was.
- DPR clamped to 2.
- Only the active project's canvas renders; inactive projects behind it stay
  as plain images until they become active.
- Target 60fps on a 2021 MacBook Air.

## 7. Copy

Unchanged and binding, from §9 of the Lit Paper spec: the same banned words,
the same banned cadences, the same `humanizer` / `stop-slop` gate. The hero
`h1`, eyebrow, and standfirst are the owner's own confirmed words and ship
byte-identical.

## 8. Accessibility

Everything in §10 of the Lit Paper spec carries over, plus:

- Contrast computed against worst-case glass backgrounds (§5.2).
- The glass index must be fully keyboard-navigable without WebGL.
- `prefers-reduced-motion` stops all displacement; glass becomes static.
- Light-on-dark type compensation (§5.3).

## 9. Risks

| Risk | Mitigation |
| --- | --- |
| Reads as generic glassmorphism | Real refraction + viscosity. If either is cut, do not ship. |
| Text over glass fails AA | Opacity floor computed against worst-case content; text moves off glass rather than glass becoming opaque. |
| Shader cost on mobile | Fallback is the common path, built first. |
| Fully-rounded reads as a component library | Countered by hard type and grid; escalate the counterweight, not the radii. |
| Two branches diverge and both rot | Content and pipeline stay shared; only the visual layer forks. |

## 10. Success criteria

1. A hiring manager reaches a full case study in one click, and the work is
   never obstructed by the interface.
2. The refraction is real — verifiably sampling and displacing cover pixels,
   not a blur filter.
3. The site works, and looks intentional, with WebGL disabled.
4. All text clears AA against worst-case backgrounds.
5. LCP under 2.5s.
6. No banned phrase from the copy rules appears anywhere.
