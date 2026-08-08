# MASTER — Behind Glass

Single source of truth for the dark world. Every token below exists in
`src/index.css`. Nothing in a component may invent a value.

Sibling world: `design/lit-paper` (warm editorial). Different bones, not a theme
switch — see §4.

---

## 1. Visual thesis

> Near-black instrument ground with smoked-glass chrome at 0.65 and lit rims
> doing the work of fills; Switzer ExtraBold display against Geist Mono clinical
> annotation at extreme scale contrast; spacing built from vast silent zones
> punctuated by dense measurement fields; components as fully-rounded capsules
> described by their perimeter, never their interior.

## 2. Interaction thesis

> One damped displacement field leads and everything follows it: pointer drives
> `--push` at λ=5.5 with a ~700ms settle, which shifts capsules, tracks rim
> highlights, and bends the refraction shader; hover lifts and separates shadow
> rather than tinting; scroll reveals once with a mask wipe.
>
> **Forbidden:** bounce, elastic, snap-to-cursor, scroll-jacking, parallax that
> fights the scrollbar.

---

## 3. Tokens

### 3.1 Colour

| Token | Value | Use |
| --- | --- | --- |
| `--color-void` | `#0A0A0C` | Ground |
| `--color-text` | `#F4F4F6` | Primary text |
| `--color-text-dim` | `#9B9BA6` | Metadata, annotation |
| glass fill | `rgb(12 12 14 / 0.65)` | Smoked, **never frosted** |
| rim | `rgb(255 255 255 / 0.18)` | The lit edge |
| spectral | `#5CA4AC` / `#C49248` / `#96526C` | Dispersion only, never UI |

**Binding contrast rule** (measured, §5.2 of the spec):
`--text` on glass over a blown-out cover = **5.63:1** (passes).
`--text-dim` on the same = **2.25:1** (fails; needs 0.90 alpha, which stops
being glass).

> **Glass carries titles. The ground carries metadata.** No exceptions.

### 3.2 Type

| Role | Face | Notes |
| --- | --- | --- |
| Display | Switzer 800 | self-hosted, Fontshare |
| Body / UI | Geist Sans | |
| Annotation | Geist Mono 12px, `0.08em` | the plate's voice |

Scale: `--text-hero` · `--text-display` · `--text-title` · `--text-card`.
Light-on-dark compensation is mandatory: `line-height: 1.7`,
`letter-spacing: 0.006em`, one weight step up versus light ground.

### 3.3 Motion

| Token | Value | Use |
| --- | --- | --- |
| `--dur-fast` | 140ms | state flips |
| `--dur-base` | 260ms | hover lift |
| `--dur-slow` | 900ms | scroll reveal |
| `--ease-out` | `cubic-bezier(.22,1,.36,1)` | everything |
| `--push` λ | 5.5 | ~700ms settle |
| stagger | 60ms | reveal groups |

### 3.4 Shape

`--radius-pill: 999px` · `--radius-panel: 28px`. Fully rounded, countered by
tight tracking and extrabold display so it does not read as a component library.

---

## 4. Layout language — what makes this NOT Lit Paper

Lit Paper is a centred editorial column. Behind Glass is an instrument plate.
Four structural rules, taken from the Index of Refraction plates:

1. **Index rail.** A fixed tick rail down the right edge, marking scroll
   position in the plate's own notation. Lit Paper has no rail.
2. **Specimens, not cards.** Work is numbered `I / II / III`, framed in 4:5
   perimeters, annotated below in mono — catalogued, not merchandised.
3. **Measurement bands.** Sections are divided by dense tick fields, not
   whitespace alone.
4. **Bottom-anchored display.** Section titles sit under a hairline rule at the
   foot of their band, not above their content.

`src/routes/Home.jsx` must not be byte-identical to the sibling branch. If it
is, this section has not been implemented.

---

## 5. The displacement contract

`--push-x`, `--push-y` (0..1) and `--push-force` (0..1) are written to
`documentElement` by `usePush`, damped, once per frame.

**Every reactive surface derives from them. No component attaches its own
pointer listener.**

Consumers:

| Surface | Reads | Effect |
| --- | --- | --- |
| `.glass` | x, y, force | rim highlight tracks; 3px parallax shift |
| `.rail` | y | active tick brightens |
| WebGL capsule | x, y, force | UV displacement (real refraction) |

Under `prefers-reduced-motion` the field is set once and never animates; all
derived effects become static. Nothing is left invisible.
