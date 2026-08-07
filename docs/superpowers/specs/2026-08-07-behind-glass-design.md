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
interface *around* them is glass: nav, buttons, metadata pills, section
labels, capsules floating above the work and genuinely refracting it as they
pass over.

An earlier concept put the work *behind* the glass, submerged and distorted
until the cursor resolved it. The owner rejected it, correctly: making a
hiring manager work to see the projects is a cost with no return, and it
repeats the failure the PDF modals were removed for. **Never obstruct the
work.**

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

**Viscosity is mandatory.** Displacement must lag the cursor and settle, not
snap to it. Damped, not linear. Snapping reads as a hover state; lag reads as
a material. This is the single detail that decides whether the effect works.

## 4. Architecture

This is a new visual world over the existing machine, not a rebuild.

| Reused unchanged | Restyled | New |
| --- | --- | --- |
| `src/lib/content.js` + its 19 tests | Case-study page | `src/hooks/usePush.js` |
| `content/` folders and all authored copy | Nav, About, Contact, WebBand | WebGL refraction layer |
| Router, routes, `<main>`, skip link | `useReveal` motion (retuned) | Glass work index |
| `src/lib/sun.js` + its 17 tests (Lit Paper only) | | Dark token set |

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
| `--glass` | `rgb(255 255 255 / 0.06)` | Panel fill |
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

**Rule:** every glass surface carrying text must have an opacity floor that
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

## 6. Set piece — the glass index

The work index is where the concept is legible.

- Cover images render large, clear, unobstructed.
- Glass capsules float above them carrying metadata: title, role, year, a
  "Live" pill where `live_url` exists.
- Those capsules genuinely refract the cover beneath them via the WebGL layer.
- The pointer displaces the glass; the refraction shifts and settles with
  viscosity.
- Clicking opens the case study.

### 6.1 Fallback — and this time it is the common case

Mobile, `prefers-reduced-motion`, and no-WebGL get flat translucent capsules
with no refraction. **On phones this is what most visitors see**, so it is a
first-class design, not a degradation. A full-screen shader sampling a texture
every frame is real GPU work and does not belong on a mid-range phone.

### 6.2 Performance budget

- Canvas mounts lazily, below the fold, behind `<Suspense>`, in its own chunk.
- Must never contribute to LCP.
- DPR clamped to 2.
- The refraction layer renders only the region actually under glass, not the
  full viewport, where that is achievable.
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
