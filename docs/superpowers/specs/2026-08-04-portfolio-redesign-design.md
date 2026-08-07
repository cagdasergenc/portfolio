# Portfolio Redesign — Design Spec

**Date:** 2026-08-04
**Owner:** Çağdaş Ergenç
**Branch:** `claude/portfolio-redesign-a17340`
**Status:** Approved, pending implementation plan

---

## 1. Goal

Replace the current single-page portfolio with a site that survives a 90-second
skim by a design hiring manager and still sells a freelance client who lands on
it by accident.

Primary audience: design hiring managers at product companies.
Secondary: founders hiring for web and brand work.

The current site fails the primary audience for one structural reason: the case
studies are locked inside PDF modals. Hiring managers do not open PDFs. That is
the problem this redesign exists to fix. Visual ambition is secondary to it.

## 2. Scope

**In:**

- Real case-study pages at real URLs, replacing the PDF modal
- New visual direction ("Lit Paper", §4)
- One 3D set piece: the work index (§6)
- About + photo, Contact, E-commerce band, Resume download
- Content pipeline so new PDFs and photos drop in without re-layout (§8)

**Out (this phase):**

- Remotion project trailers. Named by the user up front, deliberately deferred.
  They are MP4 files dropped into an index that will already exist; nothing
  built here blocks them.
- Product Renderings section. Deleted. `src/assets/products/` is removed.
- Yes Chef. `src/assets/logos/yes_chef_logo.png` is removed — it was
  unreferenced and no case study exists for it.
- **The D&B DTF case study.** The user has confirmed it was fabricated, so it
  ships nowhere on the site and its PDF is deleted. The `dabdtf.com` shop is
  real client work and stays in the E-commerce band.
- The UNICEF project. Too early to show.
- PPTX viewing. Still deferred from the previous build.

The site ships **three** case studies: Pocket Pediatrics, EXE, and a
sustainability report. Pocket Pediatrics is a deployed app
(`pocpedv2.netlify.app`, log in as `oscar`); its case study leads with "Open
the app" and offers the PDF second.

## 3. Architecture

### 3.1 Stack

Keep: React 19, Vite 8, Tailwind 4, `three`, `@react-three/fiber`.

Remove:

| Package | Reason |
| --- | --- |
| `@shadergradient/react` | Source of the generic look being replaced. |
| `react-pdf`, `pdfjs-dist` | ~1.2MB to render PDFs in-page. Case studies are now real pages; the PDF is a download only. |
| `yet-another-react-lightbox` | Native `<dialog>` covers the remaining need. |

Add:

| Package | Reason |
| --- | --- |
| `react-router-dom` | Real, shareable case-study URLs. |
| `gsap` (+ ScrollTrigger, SplitText) | Scroll choreography and type reveals. Free since 3.13. |
| `@react-three/drei` | Contact shadows, loaders, `Html` overlay. |
| `marked` | Markdown rendering (§8). |

Net bundle is smaller than the current build despite adding 3D.

`netlify.toml` already contains the SPA fallback redirect. No deploy config
changes needed.

### 3.2 Routes

```
/                    Home
/work/:slug          Case study
```

Home sections, in order: Hero → Work index → Web & E-commerce → About →
Contact.

### 3.3 Data model

Case studies are markdown files (§8). E-commerce entries stay as a small array
in code, with one addition:

```js
{ title, subtitle, href, logo, status: 'live' | 'archived' }
```

`archived` renders the entry without an outbound link. MesfenoWear is
`archived` — the site is down and must not ship as a dead link.

## 4. Visual direction — "Lit Paper"

A hybrid of warm editorial and cinematic volumetrics, resolved by **inverting
the key**. The reference is raking sunlight across paper on a desk, not a dark
room. Godrays, falloff, and long soft shadows staged in warm daylight.

This matters because the crowded, generated-looking version of volumetric light
is always dark-key. Light-key volumetrics are rare because they are harder to
control.

Rules:

1. **The ground is lit, not flat.** A soft light field across the paper,
   shifting on scroll, held to roughly a 5% luminance range. It must read as
   "this paper is lit", never as "there is a gradient here."
2. **Grain is mandatory.** Paper-fibre noise under everything. Without a
   surface for light to land on, light-key volumetrics look like a dirty
   screen.
3. **Shadow carries the weight colour usually carries.** One light source,
   page-wide, every shadow falling the same way.
4. **Dark is punctuation, not ground.** Roughly 85% light. Full-bleed dark
   appears at the work index set piece and at the Insight turn of each case
   study. Because dark is rare, it lands harder than it would on an all-dark
   site.
5. **The sun travels.** Light angle moves with scroll; shadows lengthen and
   swing down the page. This is the surviving good idea from the rejected
   day→night arc, without its fragility.

### 4.1 The single light source

`--sun-x` and `--sun-y` are CSS custom properties on `:root`, updated at most
once per animation frame via `requestAnimationFrame`.

**The pointer leads; scroll provides the arc underneath it** (70/30). This was
a correction made during implementation, not the original design. Scroll alone
was built first and failed in practice: the sun crosses the whole document, so
over a 780px scroll the shadow moved about 5px per 100px scrolled and the
effect read as nothing happening at all. The pointer supplies the immediate,
legible response — move the mouse, the light moves — which is what makes the
surface read as *lit* rather than as a flat background with a gradient on it.
Scroll still carries the slow arc, so the page still gets longer, lower
shadows toward the bottom.

Shadow magnitudes were raised for the same reason: `--shadow-x` spans ±38px
and `--shadow-y` runs 10→50px, roughly 2.5× the original values. Raking light
across paper throws long shadows; timid ones read as a default CSS card.

With no pointer (touch, or before the first move) the scroll arc is used
unchanged, so the effect degrades cleanly rather than disappearing.

Every shadow derives from them: CSS box-shadows on cards, drop shadows under
type, and the `directionalLight` position in the Three.js scene.

This is the load-bearing technical idea. The paper sheets inside the canvas are
lit from the same angle as the shadows in the HTML around them, which is what
makes the 3D read as part of the page rather than an embed sitting on top of
it.

Implementation note: the R3F scene reads the same values rather than keeping
its own copy, so the two can never drift.

## 5. Design system

### 5.1 Colour

| Token | Value | Use |
| --- | --- | --- |
| `--paper` | `#F2EEE6` | Ground |
| `--paper-lit` | `#FAF7F0` | Where light falls |
| `--ink` | `#17150F` | Primary text |
| `--muted` | `#6B6459` | Secondary text, metadata |
| `--accent` | `#B54B2B` | One signal colour, used sparingly |
| `--dark` | `#12100C` | Punctuation sections |

All text pairs must clear WCAG AA (4.5:1). Verified numerically:

| Pair | Ratio |
| --- | --- |
| `--ink` on `--paper` | 15.77:1 |
| `--muted` on `--paper` | 5.05:1 |
| `--accent` on `--paper` | 4.53:1 |
| `--paper` on `--dark` | 16.42:1 |

`--accent` reaches only **3.62:1 on `--dark`**. That clears the 3:1 bar for
non-text UI (a focus ring on a dark section is fine) but fails as text.
**Never use `--accent` for text on a dark background.** If a later surface
needs that, add a separate lighter `--accent-on-dark` token rather than
weakening this one — a single mid-tone terracotta cannot clear 4.5:1 against
both `#F2EEE6` and `#12100C`.

### 5.2 Type

- **Display:** Quilon (self-hosted variable, 400–700, Fontshare Free Licence)
- **Body / UI:** Geist Sans
- **Labels / metadata:** Geist Mono

Instrument Serif was the original choice and was replaced: it had become the
default "tasteful free serif" and read as anonymous rather than chosen. Quilon
is chunkier and more printed-feeling, which suits paper, and it carries a
weight range so hierarchy runs on **weight as well as size** — h1/h2 at 700,
card titles at 400.

Type scale is defined by role, not by value, in `@theme`:

| Token | Clamp | Used by |
| --- | --- | --- |
| `--text-hero` | `clamp(2.2rem, 8.5vw, 7.5rem)` | Home h1 |
| `--text-display` | `clamp(2rem, 5.5vw, 4rem)` | Case-study h1, 404, Contact |
| `--text-title` | `clamp(1.75rem, 4vw, 2.75rem)` | Section h2 |
| `--text-card` | `clamp(1.35rem, 2.6vw, 1.85rem)` | Card titles |

This replaced six one-off clamps, three of which started at the same `2.5rem`
and differed only in their maximum — a collection of values, not a system.

All three are free and self-hosted. No Google Fonts CDN — self-host as woff2
with `font-display: swap` and preload the display face.

Extreme scale contrast. Display runs large, body sits at 17–18px, mono labels
at 12px with tracking. Nothing occupies the mushy middle.

### 5.3 Layout

12-column grid. Content sits on a 6-column editorial rhythm, deliberately
asymmetric. Generous margins.

## 6. Set piece — work-as-objects index

The only 3D in the build. It replaces the current project grid on the home
page.

Each case study is a physical printed sheet in 3D space: real thickness, a
slight curl at one corner, matte paper material, casting a soft shadow onto the
ground plane.

| Interaction | Behaviour |
| --- | --- |
| Scroll | Sheets spread from an overlapping stack into a readable arrangement. |
| Hover | Sheet lifts; shadow separates and softens. Real shadow physics — this detail is what sells it. |
| Click | Sheet flies toward camera, transitions into `/work/:slug`. |

### 6.1 Fallback

Mobile and `prefers-reduced-motion` get a static CSS grid of the same paper
cards with the same CSS shadows. Identical design language, zero WebGL. This is
a first-class path, not a degraded one — most recruiters will be on desktop,
but the mobile experience must not read as an afterthought.

### 6.2 Performance budget

- Canvas mounts lazily, below the fold, behind `<Suspense>`.
- Must never contribute to LCP.
- DPR clamped (max 2).
- Baked contact shadows (`<ContactShadows>`), not a live shadow map.
- Target: 60fps on a 2021 MacBook Air; graceful degradation below.

## 7. Case-study page

Magazine article layout over the six fixed sections from §8.

- Sticky mono metadata rail (role, year, team, tools) on the left at desktop
  widths; collapses above the content on mobile.
- Full-bleed images break the text column.
- One dark punctuation section at the **Insight** turn.
- "Download PDF" in the page footer.

## 8. Content pipeline

One folder per project:

```
content/<slug>/
  index.md        Copy + frontmatter
  case-study.pdf  Downloadable
  cover.jpg       Index image, 2000px wide
  01-*.jpg        In-page visuals, numbered in display order
  02-*.jpg
```

Frontmatter:

```yaml
---
title:     Pocket Pediatrics
tagline:   one sharp line, max 12 words
role:      UX Research, Product Design
context:   IED Barcelona
year:      2025
duration:  12 weeks
team:      4 designers
tools:     Figma, Miro
featured:  true
order:     1
---
```

Body: six fixed `##` sections, in this order, for every project.

| Section | Contains |
| --- | --- |
| Context | Where, for whom, why it existed. 2–3 sentences. |
| Problem | One sharp statement. Not a paragraph. |
| Research | What was done, what was found. |
| Insight | The turn — what changed the design. |
| Solution | What was made, and why those decisions. |
| Outcome | Result, metric, or an honest learning. |

Fixed sections are what make one layout serve every project.

`content/` sits at the project root, not in `public/`, so images are
fingerprinted and optimised by the build.

Two globs, joined by slug:

```js
// markdown source
import.meta.glob('/content/*/index.md', {
  query: '?raw', import: 'default', eager: true,
})
// sibling assets → hashed URLs
import.meta.glob('/content/*/*.{jpg,png,webp,pdf}', {
  query: '?url', import: 'default', eager: true,
})
```

Markdown references images by bare filename (`01-research.jpg`). A custom
`marked` renderer rewrites those to the hashed URL from the asset glob, scoped
to the project's own folder. Authors never write paths.

Frontmatter is parsed by a local ~20-line parser, not `gray-matter`.
`gray-matter` depends on Node's `Buffer` and needs a polyfill to run in a
browser bundle. The frontmatter format here is deliberately flat — one
`key: value` per line, no nesting, no lists — so a local parser is both
smaller and fully under test. Values may contain colons; split on the first
one only.

Vite 8 removed the `as:` glob option; use `query` + `import` as shown.

### 8.1 Asset requirements

- Images: 2000px wide, JPG or WebP, ≤500KB each.
- Export fresh from Figma. Do **not** extract from the PDFs — they will be
  soft.
- `pocket_pediatrics.pdf` is currently 33MB and fully rasterised (no text
  layer). It must be re-exported under 8MB before ship.

### 8.2 Build order

Blank `index.md` templates with prompts written inline are generated as step
one, so content can be written in parallel with layout work. Layout does not
block on content; content does not block on layout.

## 9. Copy rules — no AI slop

Binding on every word that ships in the interface. This is a hard requirement,
not a preference.

**Banned outright:**

- Vague value words: seamless, intuitive, innovative, cutting-edge, elevate,
  empower, leverage, robust, delve, landscape, realm, testament, journey,
  passionate, curated
- Opening throat-clearing: "In today's fast-paced world", "In an era where"
- The negation-flip cadence: "not just X, but Y" / "It's not about X. It's
  about Y."
- Decorative tricolons: "simple, elegant, effective"
- Meta-labels as section headers: "SECTION 01", "OUR PROCESS", "QUESTION 05"
- Generic CTAs: "Let's create something amazing together", "Get in touch to
  start your journey"
- Em-dash-driven rhythm used as a default sentence shape

**Required instead:**

- Specifics over adjectives. Numbers, names, constraints, what actually
  happened, what did not work.
- Section headers that name their contents in plain words.
- CTA copy built on a real verb with a real object.
- The About section states what the work is and what is being looked for, in
  the user's own register. It is not a personality statement.

Applies to headings, body, labels, buttons, alt text, empty states, and meta
description.

**Enforcement:** every string that ships passes through the `humanizer` and
`stop-slop` skills before it lands in a component. Not a final polish pass —
copy is written through them, then re-checked against the banned list in this
section as a build gate. Any copy that cannot survive that check is rewritten,
not softened.

## 10. Accessibility and quality floor

- WCAG AA contrast on all text, verified against the lit paper background at
  its lightest and darkest points.
- Full keyboard navigation, including the 3D index — sheets are reachable and
  activatable via keyboard, or the keyboard path routes through the CSS
  fallback grid.
- Visible focus rings. Never removed.
- `prefers-reduced-motion` honoured throughout: sun travel, GSAP reveals, and
  the 3D scene all stop.
- Real alt text on every image.
- Semantic landmarks and heading order.
- No horizontal scroll at any width.

## 11. Risks

| Risk | Mitigation |
| --- | --- |
| Light-key volumetrics look like a render bug | Tight luminance tolerances, mandatory grain, visual review before proceeding past the hero. |
| 3D index hurts load performance | Lazy mount below fold, hard LCP exclusion, measured before ship. |
| Content never arrives, site ships empty | Templates generated first; layout built against real structure with placeholder copy. |
| Two visual worlds (2D/3D) drift apart | Shared `--sun-x`/`--sun-y` as single source of truth. |
| Scope creep back toward Remotion / more set pieces | One set piece. Explicit in §2. |

## 12. Success criteria

1. A hiring manager reaches a full case study in one click from the home page.
2. No PDF is required to understand any project.
3. LCP under 2.5s on a mid-tier connection.
4. The site works, and looks intentional, with WebGL disabled.
5. No banned phrase from §9 appears anywhere in the shipped interface.
