# Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current shader-gradient single-page portfolio with a "Lit Paper" site whose case studies are real, readable pages at real URLs.

**Architecture:** A React Router SPA on Vite. Case-study content lives as markdown in `content/<slug>/`, globbed at build time and rendered into one reusable article layout. A single pair of CSS custom properties (`--sun-x`, `--sun-y`), updated once per scroll frame, is the only light source on the page — every CSS shadow and the R3F `directionalLight` both read from it, which is what keeps the 2D and 3D halves in one world. The one 3D set piece (the work index) always ships alongside a CSS-grid fallback that is a first-class path, not a degradation.

**Tech Stack:** React 19, Vite 8, Tailwind 4, React Router 7, GSAP 3 (+ScrollTrigger, SplitText), three + @react-three/fiber + @react-three/drei, marked, Vitest.

## Global Constraints

Every task's requirements implicitly include this section. Values are copied verbatim from `docs/superpowers/specs/2026-08-04-portfolio-redesign-design.md`.

- **Colour tokens:** `--paper: #F2EEE6`, `--paper-lit: #FAF7F0`, `--ink: #17150F`, `--muted: #6B6459`, `--accent: #B54B2B`, `--dark: #12100C`.
- **Type:** Instrument Serif (display), Geist Sans (body/UI), Geist Mono (labels). Self-hosted woff2 only. **No Google Fonts CDN.**
- **One light source.** No component may hardcode a shadow direction. Every shadow derives from `--sun-x` / `--sun-y`.
- **Light-dominant.** ~85% paper. Dark (`--dark`) appears only at the work index set piece and at the Insight section of a case study.
- **Grain is mandatory** anywhere `--paper` is the ground.
- **Copy rules (§9 of spec) are binding on every shipped string** — headings, body, labels, buttons, alt text, empty states, meta description.
  - Banned words: seamless, intuitive, innovative, cutting-edge, elevate, empower, leverage, robust, delve, landscape, realm, testament, journey, passionate, curated.
  - Banned cadences: "In today's fast-paced world", "not just X, but Y", "It's not about X. It's about Y.", decorative tricolons, em-dash-driven default rhythm.
  - Banned labels: "SECTION 01", "OUR PROCESS", "QUESTION 05".
  - Banned CTAs: "Let's create something amazing together", "Get in touch to start your journey".
  - Copy is written *through* the `humanizer` and `stop-slop` skills, then re-checked against the banned list as a gate.
- **`--accent` is never text on a dark background.** It is 4.53:1 on `--paper` (passes) but only 3.62:1 on `--dark` (fails as text, passes as a focus ring). If a dark surface needs an accent word, add an `--accent-on-dark` token — do not lighten this one.
- **Accessibility:** WCAG AA (4.5:1) on all text. Full keyboard nav. Visible focus rings, never removed. `prefers-reduced-motion` honoured by sun travel, GSAP, and WebGL. Real alt text. No horizontal scroll at any width.
- **Performance:** the 3D canvas must never contribute to LCP. Target LCP < 2.5s.
- **Three case studies ship:** Pocket Pediatrics, EXE, and a sustainability report. **No D&B DTF case study** — the user has confirmed it was fabricated and it must not appear as a case study anywhere. The `dabdtf.com` shop stays in the E-commerce band as real client work.
- **Contact email is `cagdasergencc@gmail.com`.** Not the address on the Claude account.
- **Commit after every task.** Co-author trailer: `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`

---

## File Structure

| Path | Responsibility |
| --- | --- |
| `content/<slug>/index.md` | Case-study copy + frontmatter. Authored by the user. |
| `src/index.css` | Tailwind import, `@property` sun vars, tokens, fonts, grain, base type. |
| `src/lib/sun.js` | Pure scroll→sun math. No DOM. Tested. |
| `src/lib/content.js` | Glob, frontmatter parse, section split, image URL rewrite. Tested. |
| `src/lib/sun.test.js` | Tests for sun math. |
| `src/lib/content.test.js` | Tests for parser + renderer. |
| `src/hooks/useSun.js` | rAF scroll listener writing the CSS vars. |
| `src/hooks/useLowFi.js` | Reduced-motion / small-screen / no-WebGL detection. |
| `src/data/web.js` | E-commerce entries with `status: 'live' \| 'archived'`. |
| `src/routes/Home.jsx` | Home composition. |
| `src/routes/CaseStudy.jsx` | Case-study article layout. |
| `src/routes/NotFound.jsx` | 404. |
| `src/components/Nav.jsx` | Fixed nav. |
| `src/components/Hero.jsx` | Name + positioning line. |
| `src/components/WorkIndex.jsx` | Picks 3D vs fallback. |
| `src/components/WorkGrid.jsx` | CSS-grid fallback. Also the mobile path. |
| `src/components/WebBand.jsx` | Live/archived web work. |
| `src/components/About.jsx` | Bio + photo. |
| `src/components/Contact.jsx` | Email, LinkedIn, resume. |
| `src/components/Prose.jsx` | Renders one markdown section. |
| `src/three/WorkScene.jsx` | Canvas, lights, contact shadows, layout. |
| `src/three/Sheet.jsx` | One paper sheet mesh. |

---

## Task 1: Clean slate and dependency swap

Removes the generated-looking foundation before anything is built on it. Ends with a site that builds and runs but renders almost nothing — that is the intended state.

**Files:**
- Modify: `package.json`
- Delete: `src/App.jsx`, `src/App.css`, `src/components/Hero.jsx`, `src/components/Navbar.jsx`, `src/components/ProjectGrid.jsx`, `src/components/ProjectCard.jsx`, `src/components/Footer.jsx`, `src/components/viewers/` (whole dir), `src/assets/products/` (whole dir), `src/assets/logos/yes_chef_logo.png`, `src/assets/react.svg`, `src/assets/vite.svg`, `src/assets/hero.png`
- Modify: `src/main.jsx`

**Interfaces:**
- Consumes: nothing.
- Produces: a buildable app with `src/main.jsx` mounting a placeholder, and the dependency set every later task assumes.

- [ ] **Step 1: Remove dead dependencies**

```bash
npm remove @shadergradient/react react-pdf pdfjs-dist yet-another-react-lightbox
```

- [ ] **Step 2: Add new dependencies**

```bash
npm i react-router-dom gsap @react-three/drei marked
npm i @fontsource/instrument-serif @fontsource-variable/geist @fontsource-variable/geist-mono
npm i -D vitest jsdom
```

If `@fontsource-variable/geist` does not resolve, fall back to downloading Geist and Geist Mono woff2 from `https://vercel.com/font` into `src/fonts/` and declaring `@font-face` by hand in `src/index.css`. Do **not** substitute a Google Fonts CDN link — that violates a global constraint.

- [ ] **Step 3: Delete the old surface**

```bash
git rm -r src/components/viewers src/assets/products
git rm src/App.jsx src/App.css
git rm src/components/Hero.jsx src/components/Navbar.jsx src/components/ProjectGrid.jsx src/components/ProjectCard.jsx src/components/Footer.jsx
git rm src/assets/logos/yes_chef_logo.png src/assets/react.svg src/assets/vite.svg src/assets/hero.png
```

- [ ] **Step 4: Reduce `src/main.jsx` to a placeholder**

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <main style={{ padding: 48 }}>Rebuilding.</main>
  </StrictMode>,
)
```

- [ ] **Step 5: Add the Vitest config to `vite.config.js`**

Read the existing file first, then add the `test` key alongside the existing config:

```js
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.js'],
  },
```

Add `"test": "vitest run"` to `scripts` in `package.json`.

- [ ] **Step 6: Verify the build is clean**

Run: `npm run build`
Expected: succeeds with no unresolved imports. Bundle should be visibly smaller than before (pdfjs alone was ~1MB).

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "Strip shader-gradient surface, swap dependencies

Removes @shadergradient/react, react-pdf, pdfjs-dist and the lightbox.
Adds router, gsap, drei, marked, self-hosted fonts, vitest.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

## Task 2: Sun engine

The load-bearing idea, built first because everything visual depends on it. Pure math, fully tested, no DOM.

**Files:**
- Create: `src/lib/sun.js`
- Create: `src/lib/sun.test.js`
- Create: `src/hooks/useSun.js`

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `sunFromScroll(scrollY: number, docHeight: number, viewportHeight: number) => { x: number, y: number, progress: number }` where `x ∈ [-1, 1]`, `y ∈ [0.55, 1]`, `progress ∈ [0, 1]`.
  - `useSun(): void` — React hook, writes `--sun-x` / `--sun-y` onto `document.documentElement`.

- [ ] **Step 1: Write the failing tests**

Create `src/lib/sun.test.js`:

```js
import { describe, it, expect } from 'vitest'
import { sunFromScroll } from './sun'

describe('sunFromScroll', () => {
  it('starts the sun on the left at the top of the page', () => {
    const { x, progress } = sunFromScroll(0, 5000, 1000)
    expect(progress).toBe(0)
    expect(x).toBe(-1)
  })

  it('ends the sun on the right at the bottom of the page', () => {
    const { x, progress } = sunFromScroll(4000, 5000, 1000)
    expect(progress).toBe(1)
    expect(x).toBe(1)
  })

  it('puts the sun overhead at the midpoint', () => {
    const { x } = sunFromScroll(2000, 5000, 1000)
    expect(x).toBeCloseTo(0)
  })

  it('lowers the sun as the page progresses, never below the horizon', () => {
    const top = sunFromScroll(0, 5000, 1000)
    const bottom = sunFromScroll(4000, 5000, 1000)
    expect(bottom.y).toBeLessThan(top.y)
    expect(bottom.y).toBeGreaterThan(0)
  })

  it('clamps negative scroll (rubber-band overscroll)', () => {
    expect(sunFromScroll(-200, 5000, 1000).progress).toBe(0)
  })

  it('clamps scroll past the end', () => {
    expect(sunFromScroll(99999, 5000, 1000).progress).toBe(1)
  })

  it('does not divide by zero when the page is shorter than the viewport', () => {
    const { x, y, progress } = sunFromScroll(0, 500, 1000)
    expect(Number.isFinite(x)).toBe(true)
    expect(Number.isFinite(y)).toBe(true)
    expect(progress).toBe(0)
  })
})
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run src/lib/sun.test.js`
Expected: FAIL — `Failed to resolve import "./sun"`.

- [ ] **Step 3: Implement `src/lib/sun.js`**

```js
/**
 * Maps scroll position to a light direction.
 * The sun travels left → right across the page and sinks as it goes,
 * so shadows lengthen and swing as the visitor scrolls.
 * Returns a unit-ish vector: x ∈ [-1, 1], y ∈ [0.55, 1].
 */
export function sunFromScroll(scrollY, docHeight, viewportHeight) {
  const scrollable = Math.max(1, docHeight - viewportHeight)
  const progress = Math.min(1, Math.max(0, scrollY / scrollable))
  return {
    x: -1 + progress * 2,
    y: 1 - progress * 0.45,
    progress,
  }
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run src/lib/sun.test.js`
Expected: 7 passed.

- [ ] **Step 5: Implement `src/hooks/useSun.js`**

```js
import { useEffect } from 'react'
import { sunFromScroll } from '../lib/sun'

/**
 * Writes the page's single light source to CSS custom properties,
 * at most once per animation frame. Every shadow on the page — CSS and
 * WebGL alike — reads these two values, so there is only ever one sun.
 */
export function useSun() {
  useEffect(() => {
    const root = document.documentElement
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0

    const apply = () => {
      frame = 0
      const { x, y } = sunFromScroll(
        window.scrollY,
        document.documentElement.scrollHeight,
        window.innerHeight,
      )
      root.style.setProperty('--sun-x', x.toFixed(4))
      root.style.setProperty('--sun-y', y.toFixed(4))
    }

    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(apply)
    }

    if (reduced.matches) {
      // Static midday light. Shadows still exist and still agree with the
      // 3D scene; they just stop moving.
      root.style.setProperty('--sun-x', '-0.35')
      root.style.setProperty('--sun-y', '0.92')
      return
    }

    apply()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])
}
```

- [ ] **Step 6: Commit**

```bash
git add src/lib/sun.js src/lib/sun.test.js src/hooks/useSun.js
git commit -m "Add sun engine: single scroll-driven light source

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

## Task 3: Design tokens, fonts, grain

Turns the sun values into visible light. After this task the page is warm lit paper with correct type, even though it has no content.

**Files:**
- Modify: `src/index.css`
- Modify: `index.html`

**Interfaces:**
- Consumes: `--sun-x` / `--sun-y` from Task 2.
- Produces: CSS custom properties `--paper`, `--paper-lit`, `--ink`, `--muted`, `--accent`, `--dark`, `--shadow-x`, `--shadow-y`, `--shadow-blur`, and utility classes `.backdrop` (lit ground + grain, fixed, behind content), `.shell`, `.grid12`, `.col-read`, `.label`, `.shadow-sun`, `.shadow-sun-lg`.

- [ ] **Step 1: Replace `src/index.css`**

```css
@import "tailwindcss";

@import "@fontsource/instrument-serif/400.css";
@import "@fontsource/instrument-serif/400-italic.css";
@import "@fontsource-variable/geist";
@import "@fontsource-variable/geist-mono";

/* Registered so they interpolate and so calc() can rely on <number>. */
@property --sun-x { syntax: '<number>'; inherits: true; initial-value: -0.35; }
@property --sun-y { syntax: '<number>'; inherits: true; initial-value: 0.92; }

@theme {
  --color-paper:     #F2EEE6;
  --color-paper-lit: #FAF7F0;
  --color-ink:       #17150F;
  --color-muted:     #6B6459;
  --color-accent:    #B54B2B;
  --color-dark:      #12100C;

  --font-display: "Instrument Serif", ui-serif, Georgia, serif;
  --font-sans:    "Geist Variable", ui-sans-serif, system-ui, sans-serif;
  --font-mono:    "Geist Mono Variable", ui-monospace, monospace;
}

:root {
  /* Shadows fall opposite the sun, and lengthen as it sinks. */
  --shadow-x:    calc(var(--sun-x) * -14px);
  --shadow-y:    calc((1 - var(--sun-y)) * 40px + 6px);
  --shadow-blur: calc((1 - var(--sun-y)) * 48px + 14px);
}

*, *::before, *::after { box-sizing: border-box; }

html {
  scroll-behavior: smooth;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  margin: 0;
  background: var(--color-paper);
  color: var(--color-ink);
  font-family: var(--font-sans);
  font-size: 17px;
  line-height: 1.6;
  overflow-x: hidden;
}

@media (min-width: 768px) { body { font-size: 18px; } }

h1, h2, h3 { font-family: var(--font-display); font-weight: 400; line-height: 1.02; }

/* The lit ground and the paper fibre share one fixed layer BEHIND the
   content. Fixed rather than scrolling, because the sun is already
   scroll-driven — the light moves without the layer having to. Keeping
   both out of the content's stacking context is what stops the grain
   painting over text: an absolutely-positioned ::after paints above all
   in-flow siblings whatever its z-index, and multiply-blended noise over
   every glyph wrecks the type. */
.backdrop {
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  /* Held to a narrow luminance range on purpose: this must read as
     "the paper is lit", never as "there is a gradient here". */
  background:
    radial-gradient(
      120% 90% at calc(50% + var(--sun-x) * 42%) calc(6% + (1 - var(--sun-y)) * 30%),
      var(--color-paper-lit) 0%,
      var(--color-paper) 62%
    );
}

/* Paper fibre. Without a surface for light to land on, light-key
   volumetrics read as a dirty screen rather than as lit paper. */
.backdrop::after {
  content: '';
  position: absolute;
  inset: 0;
  opacity: 0.32;
  mix-blend-mode: multiply;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E");
}

.shadow-sun {
  box-shadow: var(--shadow-x) var(--shadow-y) var(--shadow-blur) rgb(23 21 15 / 0.14);
}

.shadow-sun-lg {
  box-shadow:
    calc(var(--shadow-x) * 1.6) calc(var(--shadow-y) * 1.6) calc(var(--shadow-blur) * 1.5) rgb(23 21 15 / 0.18),
    var(--shadow-x) var(--shadow-y) var(--shadow-blur) rgb(23 21 15 / 0.10);
}

/* The 12-column grid. Content sits on a 6-column editorial rhythm,
   deliberately off-centre rather than symmetrically boxed. */
.shell { margin-inline: auto; max-width: 1400px; padding-inline: 1.5rem; }
@media (min-width: 768px) { .shell { padding-inline: 3rem; } }

.grid12 { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); gap: 2rem; }
.col-read { grid-column: 1 / -1; }
@media (min-width: 900px) { .col-read { grid-column: 3 / 10; } }

.label {
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-muted);
}

:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 3px;
  border-radius: 2px;
}

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 2: Delete the Google Fonts CDN links from `index.html`**

`index.html` has carried these since the initial commit. They violate the self-hosted-fonts constraint and load three typefaces the new design does not use. Remove all three lines:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Epilogue:wght@400;600&family=Inter:wght@400;700&family=Karla:wght@400;500&display=swap" rel="stylesheet" />
```

Then confirm nothing else in the repo references `fonts.googleapis.com` or `fonts.gstatic.com`:

```bash
grep -rn "fonts.googleapis\|fonts.gstatic" . --exclude-dir=node_modules --exclude-dir=.git
```

Expected: no matches.

- [ ] **Step 3: Wire the hook into `src/main.jsx` and render a probe**

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { useSun } from './hooks/useSun'

function Probe() {
  useSun()
  return (
    <>
      <div className="backdrop" aria-hidden="true" />
      <main className="min-h-[300vh] p-16">
        <p className="label">Sun probe</p>
        <h1 className="text-[12vw]">Lit paper</h1>
        <div className="shadow-sun-lg mt-16 h-64 w-80 bg-paper-lit" />
      </main>
    </>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode><Probe /></StrictMode>,
)
```

- [ ] **Step 4: Verify the light behaves**

Run: `npm run dev`, open the page, scroll.
Expected: the card's shadow swings from right to left and lengthens as you scroll. The background's bright spot tracks with it. Contrast between `--paper` and `--paper-lit` must be *barely* perceptible — if it reads as a visible gradient band, lower the `62%` stop or move `--paper-lit` closer to `--paper`.

Then verify contrast: sample `--muted` (`#6B6459`) on `--paper` (`#F2EEE6`) in DevTools. Must be ≥ 4.5:1. If it fails, darken `--muted` until it passes and update the token in both this file and the spec.

- [ ] **Step 5: Verify reduced motion**

In DevTools → Rendering → emulate `prefers-reduced-motion: reduce`, reload, scroll.
Expected: shadows are present and static. No movement.

- [ ] **Step 6: Commit**

```bash
git add src/index.css src/main.jsx
git commit -m "Add Lit Paper tokens, self-hosted type, grain, sun-derived shadows

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

## Task 4: Content pipeline

**Files:**
- Create: `src/lib/content.js`
- Create: `src/lib/content.test.js`

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `parseFrontmatter(raw: string) => { data: Record<string,string>, body: string }`
  - `splitSections(body: string) => Array<{ heading: string, markdown: string }>`
  - `renderMarkdown(markdown: string, assets: Record<string,string>) => string` (HTML)
  - `getProjects() => Project[]` sorted by `order`, where
    `Project = { slug, title, tagline, role, context, year, duration, team, tools, featured: boolean, order: number, cover: string|undefined, pdf: string|undefined, sections: Array<{heading, html}> }`
  - `getProject(slug) => Project | undefined`

- [ ] **Step 1: Write the failing tests**

Create `src/lib/content.test.js`:

```js
import { describe, it, expect } from 'vitest'
import { parseFrontmatter, splitSections, renderMarkdown } from './content'

describe('parseFrontmatter', () => {
  it('reads flat key/value pairs', () => {
    const { data } = parseFrontmatter('---\ntitle: Pocket Pediatrics\nyear: 2025\n---\nbody here')
    expect(data.title).toBe('Pocket Pediatrics')
    expect(data.year).toBe('2025')
  })

  it('returns the body without the frontmatter block', () => {
    const { body } = parseFrontmatter('---\ntitle: X\n---\n## Context\ntext')
    expect(body.trim()).toBe('## Context\ntext')
  })

  it('splits on the first colon only, so values may contain colons', () => {
    const { data } = parseFrontmatter('---\ntagline: Care for kids: a study\n---\n')
    expect(data.tagline).toBe('Care for kids: a study')
  })

  it('strips surrounding quotes from values', () => {
    const { data } = parseFrontmatter('---\ntitle: "D&B DTF"\n---\n')
    expect(data.title).toBe('D&B DTF')
  })

  it('ignores blank lines and comments inside the block', () => {
    const { data } = parseFrontmatter('---\n\n# a comment\ntitle: X\n---\n')
    expect(data.title).toBe('X')
    expect(Object.keys(data)).toEqual(['title'])
  })

  it('handles a file with no frontmatter', () => {
    const { data, body } = parseFrontmatter('just text')
    expect(data).toEqual({})
    expect(body).toBe('just text')
  })
})

describe('splitSections', () => {
  it('splits on level-2 headings and keeps their order', () => {
    const s = splitSections('## Context\nc\n\n## Problem\np\n\n## Outcome\no')
    expect(s.map((x) => x.heading)).toEqual(['Context', 'Problem', 'Outcome'])
  })

  it('keeps section body markdown intact', () => {
    const s = splitSections('## Context\nline one\nline two')
    expect(s[0].markdown.trim()).toBe('line one\nline two')
  })

  it('ignores level-3 headings as section boundaries', () => {
    const s = splitSections('## Context\n### Sub\ntext')
    expect(s).toHaveLength(1)
    expect(s[0].markdown).toContain('### Sub')
  })

  it('returns an empty array for empty content', () => {
    expect(splitSections('')).toEqual([])
  })
})

describe('renderMarkdown', () => {
  const assets = { 'cover.jpg': '/assets/cover.abc123.jpg' }

  it('rewrites bare image filenames to hashed build URLs', () => {
    const html = renderMarkdown('![A ward round](cover.jpg)', assets)
    expect(html).toContain('src="/assets/cover.abc123.jpg"')
  })

  it('carries alt text through', () => {
    const html = renderMarkdown('![A ward round](cover.jpg)', assets)
    expect(html).toContain('alt="A ward round"')
  })

  it('lazy-loads images', () => {
    const html = renderMarkdown('![x](cover.jpg)', assets)
    expect(html).toContain('loading="lazy"')
  })

  it('leaves an unknown filename alone rather than emitting a broken hash', () => {
    const html = renderMarkdown('![x](missing.jpg)', assets)
    expect(html).toContain('src="missing.jpg"')
  })

  it('still renders ordinary markdown', () => {
    expect(renderMarkdown('**bold**', assets)).toContain('<strong>bold</strong>')
  })
})
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run src/lib/content.test.js`
Expected: FAIL — `Failed to resolve import "./content"`.

- [ ] **Step 3: Implement `src/lib/content.js`**

```js
import { marked } from 'marked'

/**
 * Flat `key: value` frontmatter. Deliberately not YAML: the format is fixed
 * and documented, and gray-matter needs a Buffer polyfill in the browser.
 */
export function parseFrontmatter(raw) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(raw)
  if (!match) return { data: {}, body: raw }

  const data = {}
  for (const line of match[1].split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const colon = trimmed.indexOf(':')
    if (colon === -1) continue
    const key = trimmed.slice(0, colon).trim()
    const value = trimmed.slice(colon + 1).trim().replace(/^["']|["']$/g, '')
    data[key] = value
  }
  return { data, body: raw.slice(match[0].length) }
}

/** Splits a body into its `## ` sections, preserving order. */
export function splitSections(body) {
  const sections = []
  const re = /^## +(.+)$/gm
  let match
  const starts = []
  while ((match = re.exec(body)) !== null) {
    starts.push({ heading: match[1].trim(), from: match.index + match[0].length })
  }
  starts.forEach((s, i) => {
    const to = i + 1 < starts.length ? body.lastIndexOf('\n## ', starts[i + 1].from) : body.length
    sections.push({ heading: s.heading, markdown: body.slice(s.from, to) })
  })
  return sections
}

/** Renders markdown, rewriting bare image filenames to hashed build URLs. */
export function renderMarkdown(markdown, assets) {
  const renderer = new marked.Renderer()
  renderer.image = ({ href, text }) => {
    const src = assets[href] ?? href
    const alt = (text ?? '').replace(/"/g, '&quot;')
    return `<figure><img src="${src}" alt="${alt}" loading="lazy" decoding="async"></figure>`
  }
  return marked.parse(markdown, { renderer, async: false })
}

const RAW = import.meta.glob('/content/*/index.md', {
  query: '?raw', import: 'default', eager: true,
})
const ASSETS = import.meta.glob('/content/*/*.{jpg,jpeg,png,webp,pdf}', {
  query: '?url', import: 'default', eager: true,
})

function slugOf(path) {
  return path.split('/')[2]
}

function assetsFor(slug) {
  const out = {}
  for (const [path, url] of Object.entries(ASSETS)) {
    if (slugOf(path) === slug) out[path.split('/').pop()] = url
  }
  return out
}

function build(path, raw) {
  const slug = slugOf(path)
  const assets = assetsFor(slug)
  const { data, body } = parseFrontmatter(raw)
  return {
    slug,
    ...data,
    featured: data.featured === 'true',
    order: Number(data.order ?? 99),
    cover: assets['cover.jpg'] ?? assets['cover.webp'] ?? assets['cover.png'],
    pdf: assets['case-study.pdf'],
    sections: splitSections(body).map((s) => ({
      heading: s.heading,
      html: renderMarkdown(s.markdown, assets),
    })),
  }
}

const PROJECTS = Object.entries(RAW)
  .map(([path, raw]) => build(path, raw))
  .sort((a, b) => a.order - b.order)

export function getProjects() { return PROJECTS }
export function getProject(slug) { return PROJECTS.find((p) => p.slug === slug) }
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run src/lib/content.test.js`
Expected: 15 passed.

If `renderer.image` receives positional arguments instead of an object, the installed `marked` is older than v12. Run `npm i marked@^15` and re-run.

- [ ] **Step 5: Commit**

```bash
git add src/lib/content.js src/lib/content.test.js
git commit -m "Add markdown content pipeline with hashed asset resolution

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

## Task 5: Content templates

Ships the authoring contract so content can be written in parallel with the rest of the build.

**Files:**
- Create: `content/pocket-pediatrics/index.md`
- Create: `content/exe/index.md`
- Create: `content/sustainability-report/index.md`
- Create: `content/README.md`
- Move: `public/files/pocket_pediatrics.pdf` → `content/pocket-pediatrics/case-study.pdf`
- Delete: `public/files/DAB_DTF_UX_Case_Study.pdf`

**The D&B DTF case study is deleted, not moved.** The user has confirmed it was fabricated. It must not appear as a case study anywhere on the site. The `dabdtf.com` shop remains in the E-commerce band (Task 10) as real client work — that is a different thing and it stays.

**Interfaces:**
- Consumes: the frontmatter keys and six section headings that `getProjects()` (Task 4) reads.
- Produces: two globbable projects with real frontmatter and placeholder bodies.

- [ ] **Step 1: Move the PDFs into their project folders**

```bash
mkdir -p content/pocket-pediatrics content/exe content/sustainability-report
git mv public/files/pocket_pediatrics.pdf content/pocket-pediatrics/case-study.pdf
git rm public/files/DAB_DTF_UX_Case_Study.pdf
rmdir public/files 2>/dev/null || true
```

- [ ] **Step 2: Create `content/pocket-pediatrics/index.md`**

```markdown
---
title: Pocket Pediatrics
tagline: Voice-first AI care coordination, because typing while your child is ill is the wrong interaction model
role: UX Research, Product Design
context: IED Barcelona with Fujitsu
year: 2025
duration: FILL IN
team: 4 designers
tools: Figma, React Native, Expo, Supabase, GPT-4o-mini, Whisper
live_url: https://pocpedv2.netlify.app
live_hint: log in as oscar
featured: true
order: 1
---

## Context
Where this happened, who it was for, and why it existed. Two or three
sentences. Name the institution and the constraint you were working inside.

## Problem
One sharp statement. Not a paragraph. What was actually broken, for whom.

## Research
What you did, and what you found. Name the methods and the number of people.
"Six interviews with paediatric nurses" beats "extensive user research".

## Insight
The turn. The one thing you learned that changed the design. This is the
section a hiring manager reads to find out how you think — it matters more
than the screens.

## Solution
What you made, and why those decisions and not the obvious ones. Reference
images by bare filename: ![Triage flow, second round](01-triage.jpg)

## Outcome
The result, a number, or an honest learning. "We never tested it with
children" is a stronger ending than a fabricated metric.
```

- [ ] **Step 3: Create `content/exe/index.md` and `content/sustainability-report/index.md`**

Both get the same six headings and the same inline prompts as Step 2. Only the frontmatter differs. Neither has a `live_url`.

`content/exe/index.md`:

```markdown
---
title: EXE
tagline: WRITE ONE SHARP LINE, MAX 12 WORDS
role: Concept, Interaction Design
context: IED Barcelona, MA brief
year: 2026
duration: FILL IN
team: FILL IN
tools: Figma
featured: true
order: 2
---
```

`content/sustainability-report/index.md`:

```markdown
---
title: FILL IN
tagline: WRITE ONE SHARP LINE, MAX 12 WORDS
role: FILL IN
context: FILL IN
year: FILL IN
duration: FILL IN
team: FILL IN
tools: FILL IN
featured: false
order: 3
---
```

The user supplies this project's material later. Leave `title` as `FILL IN` — do not invent a name for it.

- [ ] **Step 4: Create `content/README.md`**

```markdown
# Content

One folder per project. The folder name is the URL slug:
`content/pocket-pediatrics/` serves `/work/pocket-pediatrics`.

    content/<slug>/
      index.md        copy + frontmatter
      case-study.pdf  the download
      cover.jpg       index image, 2000px wide
      01-*.jpg        in-page visuals, numbered in display order

## Rules

- Frontmatter is flat `key: value`. No nesting, no lists. Values may
  contain colons.
- `live_url` is optional. Add it when the project is deployed somewhere
  people can use it, and the case study will lead with "Open the app"
  instead of the PDF download. Pair it with `live_hint` for any login or
  access note (for example `log in as oscar`).
- The six `##` headings are fixed and required, in this order: Context,
  Problem, Research, Insight, Solution, Outcome. One layout serves every
  project because of this.
- Reference images by bare filename — `![alt](01-triage.jpg)`. Never write
  a path. The build resolves and fingerprints them.
- Every image needs real alt text describing what is in it.

## Assets

- 2000px wide, JPG or WebP, 500KB or less each.
- Export fresh from Figma. Do not pull images out of the PDFs; they will be
  soft.
- Keep `case-study.pdf` under 8MB.

## Copy

Banned: seamless, intuitive, innovative, cutting-edge, elevate, empower,
leverage, robust, delve, landscape, realm, testament, journey, passionate,
curated. Also banned: "not just X, but Y", and any sentence that opens with
"In today's...".

Write what happened. Numbers and names beat adjectives.
```

- [ ] **Step 5: Verify the pipeline sees both projects**

Add a temporary probe to `src/main.jsx`: `import { getProjects } from './lib/content'` then `console.log(getProjects())`. Run `npm run dev` and check the console.
Expected: an array of three objects ordered `pocket-pediatrics`, `exe`, `sustainability-report`, each with six `sections`. Only `pocket-pediatrics` has a `pdf` URL and a `live_url`. Remove the probe afterwards.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "Add content folders, authoring templates, and content README

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

## Task 6: Router shell, nav, footer

**Files:**
- Modify: `src/main.jsx`
- Create: `src/routes/Home.jsx`, `src/routes/CaseStudy.jsx`, `src/routes/NotFound.jsx`
- Create: `src/components/Nav.jsx`, `src/components/Contact.jsx`
- Create: `src/hooks/useLowFi.js`

**Interfaces:**
- Consumes: `useSun()` (Task 2), `getProject()` / `getProjects()` (Task 4).
- Produces:
  - `useLowFi() => boolean` — true when WebGL should not be used.
  - Routes `/`, `/work/:slug`, `*`.

- [ ] **Step 1: Create `src/hooks/useLowFi.js`**

```js
import { useEffect, useState } from 'react'

/** True when the 3D path should be skipped: reduced motion, a small
 *  screen, or no WebGL. The CSS fallback is a first-class path, so this
 *  returning true is not a failure state. */
export function useLowFi() {
  const [lowFi, setLowFi] = useState(true)

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const small = window.matchMedia('(max-width: 900px)')

    const hasWebGL = () => {
      try {
        return !!document.createElement('canvas').getContext('webgl2')
      } catch {
        return false
      }
    }

    const evaluate = () => setLowFi(motion.matches || small.matches || !hasWebGL())
    evaluate()
    motion.addEventListener('change', evaluate)
    small.addEventListener('change', evaluate)
    return () => {
      motion.removeEventListener('change', evaluate)
      small.removeEventListener('change', evaluate)
    }
  }, [])

  return lowFi
}
```

- [ ] **Step 2: Create `src/components/Nav.jsx`**

Copy is deliberately plain. No "Let's talk", no "Say hello".

```jsx
import { Link } from 'react-router-dom'

export default function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 mix-blend-multiply">
      <nav className="mx-auto flex max-w-[1400px] items-baseline justify-between px-6 py-6 md:px-12">
        <Link to="/" className="font-display text-xl">Çağdaş Ergenç</Link>
        <ul className="label flex gap-6">
          <li><a href="/#work">Work</a></li>
          <li><a href="/#about">About</a></li>
          <li><a href="/#contact">Contact</a></li>
        </ul>
      </nav>
    </header>
  )
}
```

- [ ] **Step 3: Create `src/components/Contact.jsx`**

```jsx
import resume from '../assets/resume.pdf?url'

export default function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-[1400px] px-6 py-32 md:px-12">
      <p className="label">Contact</p>
      <h2 className="mt-4 max-w-[16ch] text-[clamp(2.5rem,7vw,5.5rem)]">
        Barcelona. Available now, remote across the EU.
      </h2>
      <ul className="mt-12 flex flex-wrap gap-x-10 gap-y-4 text-lg">
        <li><a className="underline underline-offset-4 decoration-1" href="mailto:cagdasergencc@gmail.com">cagdasergencc@gmail.com</a></li>
        <li><a className="underline underline-offset-4 decoration-1" href="https://www.linkedin.com/in/cagdas-ergenc" target="_blank" rel="noreferrer">LinkedIn</a></li>
        <li><a className="underline underline-offset-4 decoration-1" href={resume} download>Resume (PDF)</a></li>
      </ul>
    </section>
  )
}
```

The LinkedIn slug is confirmed: `cagdas-ergenc`.

- [ ] **Step 4: Create the three route files**

`src/routes/Home.jsx` — placeholder for now, filled in Tasks 7–10:

```jsx
import Contact from '../components/Contact'

export default function Home() {
  return (
    <>
      <Contact />
    </>
  )
}
```

`src/routes/NotFound.jsx`:

```jsx
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="mx-auto max-w-[1400px] px-6 py-40 md:px-12">
      <p className="label">404</p>
      <h1 className="mt-4 text-[clamp(2.5rem,8vw,6rem)]">This page moved or never existed.</h1>
      <Link className="mt-8 inline-block underline underline-offset-4" to="/">Back to the work</Link>
    </section>
  )
}
```

`src/routes/CaseStudy.jsx` — minimal for now, built out in Task 9:

```jsx
import { useParams } from 'react-router-dom'
import { getProject } from '../lib/content'
import NotFound from './NotFound'

export default function CaseStudy() {
  const { slug } = useParams()
  const project = getProject(slug)
  if (!project) return <NotFound />
  return <article className="px-6 py-40 md:px-12"><h1>{project.title}</h1></article>
}
```

- [ ] **Step 5: Wire `src/main.jsx`**

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import './index.css'
import { useSun } from './hooks/useSun'
import Nav from './components/Nav'
import Home from './routes/Home'
import CaseStudy from './routes/CaseStudy'
import NotFound from './routes/NotFound'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function App() {
  useSun()
  return (
    <div className="min-h-screen">
      <div className="backdrop" aria-hidden="true" />
      <ScrollToTop />
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/work/:slug" element={<CaseStudy />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode><BrowserRouter><App /></BrowserRouter></StrictMode>,
)
```

- [ ] **Step 6: Verify routing**

Run `npm run dev`. Visit `/`, `/work/pocket-pediatrics`, `/work/nope`.
Expected: contact section, the project title, the 404 respectively. Tab through the nav — every link shows a visible terracotta focus ring.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "Add router shell, nav, contact, low-fi detection

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

## Task 7: Hero

**Files:**
- Create: `src/components/Hero.jsx`
- Modify: `src/routes/Home.jsx`

**Interfaces:**
- Consumes: tokens and `.backdrop` from Task 3 (already mounted in the app shell by Task 6 — the hero does not mount its own).
- Produces: `<Hero />`, the LCP element. No WebGL, no blocking assets.

- [ ] **Step 1: Create `src/components/Hero.jsx`**

The positioning line states what the work is. It does not describe a personality, and it contains no banned vocabulary.

```jsx
export default function Hero() {
  return (
    <section className="relative mx-auto flex min-h-[92vh] max-w-[1400px] flex-col justify-end px-6 pb-24 pt-40 md:px-12">
      <p className="label">Çağdaş Ergenç — Product and UX Design</p>
      <h1 className="mt-6 max-w-[19ch] text-[clamp(2.6rem,9.5vw,9rem)] tracking-[-0.02em]">
        I work from research through to something people can actually click.
      </h1>
      <p className="mt-10 max-w-[48ch] text-lg text-muted">
        Five years across industrial, digital, and AI-assisted design.
        Turkey, Poland, Germany, now Barcelona.
      </p>
    </section>
  )
}
```

The h1 is the user's own line, taken from their CV and confirmed. It is not a draft — do not "improve" it. It is the site's positioning statement and it has already passed the copy gate.

- [ ] **Step 2: Add it to `src/routes/Home.jsx`**

```jsx
import Hero from '../components/Hero'
import Contact from '../components/Contact'

export default function Home() {
  return (
    <>
      <Hero />
      <Contact />
    </>
  )
}
```

- [ ] **Step 3: Verify at three widths**

Run `npm run dev`, check at 375px, 768px, 1440px.
Expected: no horizontal scroll at any width. The h1 never wraps to more than three lines. If it does, tighten the `max-w-[16ch]`.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "Add hero

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

## Task 8: Work index — CSS grid path

Built before the 3D version on purpose. This is the mobile and reduced-motion experience, and it must stand on its own.

**Files:**
- Create: `src/components/WorkGrid.jsx`
- Create: `src/components/WorkIndex.jsx`
- Modify: `src/routes/Home.jsx`

**Interfaces:**
- Consumes: `getProjects()` (Task 4), `useLowFi()` (Task 6), `.shadow-sun-lg` (Task 3).
- Produces:
  - `<WorkGrid projects={Project[]} />`
  - `<WorkIndex />` — selects grid or scene.

- [ ] **Step 1: Create `src/components/WorkGrid.jsx`**

```jsx
import { Link } from 'react-router-dom'

export default function WorkGrid({ projects }) {
  return (
    <ul className="grid gap-x-8 gap-y-16 md:grid-cols-2">
      {projects.map((p) => (
        <li key={p.slug}>
          <Link to={`/work/${p.slug}`} className="group block">
            <div className="shadow-sun-lg overflow-hidden bg-paper-lit transition-transform duration-500 ease-out group-hover:-translate-y-1">
              {p.cover ? (
                <img
                  src={p.cover}
                  alt={`Cover of the ${p.title} case study`}
                  className="aspect-[4/5] w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <div className="aspect-[4/5] w-full" />
              )}
            </div>
            <div className="mt-5 flex items-baseline justify-between gap-4">
              <h3 className="text-3xl">
                {p.title}
                {p.live_url && (
                  <span className="label ml-3 align-middle text-accent">Live</span>
                )}
              </h3>
              <span className="label shrink-0">{p.year}</span>
            </div>
            <p className="mt-1 text-muted">{p.tagline}</p>
            <p className="label mt-3">{p.role}</p>
          </Link>
        </li>
      ))}
    </ul>
  )
}
```

- [ ] **Step 2: Create `src/components/WorkIndex.jsx`**

```jsx
import { Suspense, lazy } from 'react'
import { getProjects } from '../lib/content'
import { useLowFi } from '../hooks/useLowFi'
import WorkGrid from './WorkGrid'

const WorkScene = lazy(() => import('../three/WorkScene'))

export default function WorkIndex() {
  const projects = getProjects()
  const lowFi = useLowFi()

  return (
    <section id="work" className="mx-auto max-w-[1400px] px-6 py-24 md:px-12">
      <p className="label">Case studies</p>
      <h2 className="mb-16 mt-4 text-[clamp(2rem,5vw,3.5rem)]">
        Two projects, start to finish.
      </h2>
      {lowFi ? (
        <WorkGrid projects={projects} />
      ) : (
        <Suspense fallback={<WorkGrid projects={projects} />}>
          <WorkScene projects={projects} />
        </Suspense>
      )}
    </section>
  )
}
```

`WorkScene` does not exist until Task 9. Until then, temporarily force the grid by replacing the ternary with `<WorkGrid projects={projects} />` so this task is independently verifiable.

- [ ] **Step 3: Add to `src/routes/Home.jsx`**

```jsx
import Hero from '../components/Hero'
import WorkIndex from '../components/WorkIndex'
import Contact from '../components/Contact'

export default function Home() {
  return (
    <>
      <Hero />
      <WorkIndex />
      <Contact />
    </>
  )
}
```

- [ ] **Step 4: Verify**

Run `npm run dev`.
Expected: two cards with sun-derived shadows that swing as you scroll. Cards lift on hover. Tab reaches each card and shows a focus ring. Clicking navigates to the case study. Covers are missing until the user supplies them — the empty `aspect-[4/5]` box is the correct interim state, not a bug.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Add work index with CSS grid path

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

## Task 9: Work index — 3D set piece

**Files:**
- Create: `src/three/WorkScene.jsx`
- Create: `src/three/Sheet.jsx`
- Modify: `src/components/WorkIndex.jsx` (restore the ternary from Task 8 Step 2)

**Interfaces:**
- Consumes: `Project[]` from Task 4, `--sun-x` / `--sun-y` from Task 2.
- Produces: default export `WorkScene({ projects })`.

- [ ] **Step 1: Create `src/three/Sheet.jsx`**

```jsx
import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

/** One printed sheet. Matte paper, real thickness, lit by the page's sun. */
export default function Sheet({ cover, position, rotation, onOpen }) {
  const ref = useRef()
  const [hovered, setHovered] = useState(false)
  const texture = useTexture(cover)
  texture.colorSpace = THREE.SRGBColorSpace

  useFrame((_, delta) => {
    if (!ref.current) return
    const targetY = position[1] + (hovered ? 0.22 : 0)
    const targetZ = position[2] + (hovered ? 0.18 : 0)
    ref.current.position.y = THREE.MathUtils.damp(ref.current.position.y, targetY, 5, delta)
    ref.current.position.z = THREE.MathUtils.damp(ref.current.position.z, targetZ, 5, delta)
  })

  return (
    <mesh
      ref={ref}
      position={position}
      rotation={rotation}
      castShadow
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer' }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = '' }}
      onClick={onOpen}
    >
      <boxGeometry args={[1.5, 1.9, 0.008]} />
      <meshStandardMaterial map={texture} roughness={0.94} metalness={0} />
    </mesh>
  )
}
```

The corner curl described in the spec is deliberately omitted. It needs displaced plane geometry with a custom vertex shader, which is a meaningful risk for a small visual gain. Add a comment recording that:

```js
// ponytail: flat sheets, no corner curl. Upgrade path is a segmented
// PlaneGeometry with an onBeforeCompile vertex displacement if the flat
// version reads too CG once real covers are in.
```

- [ ] **Step 2: Create `src/three/WorkScene.jsx`**

```jsx
import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows } from '@react-three/drei'
import { useNavigate } from 'react-router-dom'
import Sheet from './Sheet'

/** Reads the page's sun from CSS so the scene can never disagree with
 *  the shadows in the HTML around it. */
function SunLight() {
  const ref = useRef()
  useFrame(() => {
    if (!ref.current) return
    const style = getComputedStyle(document.documentElement)
    const x = parseFloat(style.getPropertyValue('--sun-x')) || -0.35
    const y = parseFloat(style.getPropertyValue('--sun-y')) || 0.92
    ref.current.position.set(x * 6, y * 6, 4)
  })
  return <directionalLight ref={ref} intensity={2.4} castShadow shadow-mapSize={[1024, 1024]} />
}

export default function WorkScene({ projects }) {
  const navigate = useNavigate()
  const withCovers = projects.filter((p) => p.cover)

  // No covers supplied yet — the caller's Suspense fallback grid is better
  // than an empty canvas.
  if (withCovers.length === 0) return null

  return (
    <div className="h-[70vh] w-full">
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 0.4, 5], fov: 38 }}
        gl={{ antialias: true }}
      >
        <ambientLight intensity={1.1} />
        <SunLight />
        <Suspense fallback={null}>
          {withCovers.map((p, i) => (
            <Sheet
              key={p.slug}
              cover={p.cover}
              position={[(i - (withCovers.length - 1) / 2) * 1.9, 0, 0]}
              rotation={[0, (i - (withCovers.length - 1) / 2) * -0.12, 0]}
              onOpen={() => navigate(`/work/${p.slug}`)}
            />
          ))}
        </Suspense>
        <ContactShadows position={[0, -1.15, 0]} opacity={0.42} scale={12} blur={2.6} far={3} />
      </Canvas>
    </div>
  )
}
```

- [ ] **Step 3: Restore the ternary in `WorkIndex.jsx`**

Undo the temporary forcing from Task 8 Step 2 so the real selection logic runs.

- [ ] **Step 4: Add the keyboard path**

The canvas is not keyboard-reachable. Render the grid's links visually hidden but focusable beneath the canvas so the keyboard path never depends on WebGL. In `WorkIndex.jsx`, inside the non-lowFi branch:

```jsx
<>
  <Suspense fallback={<WorkGrid projects={projects} />}>
    <WorkScene projects={projects} />
  </Suspense>
  <div className="sr-only focus-within:not-sr-only">
    <WorkGrid projects={projects} />
  </div>
</>
```

- [ ] **Step 5: Verify**

Run `npm run dev` on a desktop viewport wider than 900px. Covers must exist for this to render — drop any 2000px JPG into `content/<slug>/cover.jpg` to test.

Expected:
- Sheets are lit from the same side as the CSS shadows on the hero. Scroll and confirm both swing together. **If they disagree, the scene is reading stale values — fix before continuing, this is the whole idea.**
- Hover lifts a sheet and its contact shadow separates.
- Click navigates.
- Tab from the heading reaches the hidden grid links, which become visible on focus.
- Shrink below 900px: the canvas is replaced by the grid.
- Emulate reduced motion: the grid, no canvas.

- [ ] **Step 6: Measure LCP**

Run `npm run build && npm run preview`, then a Lighthouse run on the preview URL.
Expected: LCP under 2.5s, and the LCP element is the hero h1, **not** the canvas. If the canvas is the LCP element, the lazy boundary is wrong.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "Add work-as-objects 3D index sharing the page's light source

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

## Task 10: Case study page, web band, about

**Files:**
- Create: `src/components/Prose.jsx`, `src/components/WebBand.jsx`, `src/components/About.jsx`
- Create: `src/data/web.js`
- Modify: `src/routes/CaseStudy.jsx`, `src/routes/Home.jsx`

**Interfaces:**
- Consumes: `Project` shape from Task 4.
- Produces: `<Prose html />`, `<WebBand />`, `<About />`, the full case-study layout.

- [ ] **Step 1: Create `src/data/web.js`**

```js
import logoDnbDtf from '../assets/logos/dabdtf_logo.png'
import logoMesfeno from '../assets/logos/mesfeno_logo.png'
import logoShirtPrint from '../assets/logos/shirt_printing_logo.png'

export const webWork = [
  { title: 'D&B DTF',            role: 'UI, web design', href: 'https://dabdtf.com',             logo: logoDnbDtf,     status: 'live' },
  { title: 'ShirtPrintCenter',   role: 'UI, web design', href: 'https://shirtprintingcenter.com', logo: logoShirtPrint, status: 'live' },
  { title: 'MesfenoWear',        role: 'UI, web design', href: null,                              logo: logoMesfeno,    status: 'archived' },
]
```

- [ ] **Step 2: Create `src/components/WebBand.jsx`**

Archived entries render as plain text, never as a dead link.

```jsx
import { webWork } from '../data/web'

export default function WebBand() {
  return (
    <section id="web" className="mx-auto max-w-[1400px] px-6 py-24 md:px-12">
      <p className="label">Web and e-commerce</p>
      <h2 className="mb-12 mt-4 text-[clamp(2rem,5vw,3.5rem)]">Shops I designed and built.</h2>
      <ul className="divide-y divide-ink/10 border-y border-ink/10">
        {webWork.map((w) => {
          const inner = (
            <div className="flex items-baseline justify-between gap-6 py-6">
              <span className="text-2xl">{w.title}</span>
              <span className="label">{w.status === 'archived' ? 'Offline' : w.role}</span>
            </div>
          )
          return (
            <li key={w.title}>
              {w.href ? (
                <a href={w.href} target="_blank" rel="noreferrer" className="block transition-opacity hover:opacity-60">{inner}</a>
              ) : (
                <div className="opacity-50">{inner}</div>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
```

- [ ] **Step 3: Create `src/components/About.jsx`**

Leave the bio as a marked placeholder — it must be written by the user and pass the copy gate. Do not invent biographical facts.

```jsx
export default function About() {
  return (
    <section id="about" className="mx-auto max-w-[1400px] px-6 py-24 md:px-12">
      <p className="label">About</p>
      <div className="mt-4 grid gap-12 md:grid-cols-[1fr_1.2fr]">
        <img
          src={portrait}
          alt="Çağdaş Ergenç, photographed against a warm wall in afternoon light"
          className="shadow-sun-lg aspect-[4/5] w-full object-cover"
          loading="lazy"
          decoding="async"
        />
        <div className="max-w-[52ch] space-y-6 text-lg">
          <p>Five years of design across industrial, digital, and AI-assisted work. Turkey, Poland, Germany, now Barcelona.</p>
          <p>I work from research through to something people can actually click. Interviews and usability tests at one end; a functioning React Native build at the other, when static screens stop being enough. I read frontend and backend well enough to push back on engineers, and to explain what they built to people who weren&rsquo;t in the room.</p>
          <p>Finishing an MA in Strategic Design Management at IED Barcelona, graduating December 2026. Based here, available now, open to remote across the EU.</p>
        </div>
      </div>
    </section>
  )
}
```

With `import portrait from '../assets/about.jpg'` at the top.

**Keep the photo in the left column.** It is lit from frame-right, and About sits far enough down the page that `--sun-x` has travelled right too — so on the left, the portrait's light falls into the page in the same direction as every shadow around it. Moving it to the right column puts its light source in direct contradiction with the rest of the page, which is exactly the incoherence the single-sun rule exists to prevent.

If `src/assets/about.jpg` is not present yet, render the placeholder `<div className="shadow-sun-lg aspect-[4/5] bg-paper-lit" aria-hidden="true" />` instead and leave a note — do not ship a broken image import.

- [ ] **Step 4: Create `src/components/Prose.jsx`**

```jsx
export default function Prose({ html }) {
  return (
    <div
      className="[&_p]:mb-6 [&_p]:max-w-[62ch] [&_li]:max-w-[62ch] [&_ul]:mb-6 [&_ul]:list-disc [&_ul]:pl-5 [&_figure]:my-12 [&_figure]:-mx-6 md:[&_figure]:mx-0 [&_img]:w-full [&_h3]:mt-10 [&_h3]:mb-3 [&_h3]:text-2xl [&_strong]:font-semibold [&_a]:underline [&_a]:underline-offset-4"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
```

`dangerouslySetInnerHTML` is safe here: the markdown is authored by the site owner and compiled at build time. It is never user input at runtime.

- [ ] **Step 5: Build out `src/routes/CaseStudy.jsx`**

```jsx
import { useParams, Link } from 'react-router-dom'
import { getProject } from '../lib/content'
import Prose from '../components/Prose'
import NotFound from './NotFound'

const META = ['role', 'context', 'year', 'duration', 'team', 'tools']

export default function CaseStudy() {
  const { slug } = useParams()
  const project = getProject(slug)
  if (!project) return <NotFound />

  return (
    <article className="mx-auto max-w-[1400px] px-6 pb-32 pt-40 md:px-12">
      <p className="label">Case study</p>
      <h1 className="mt-4 max-w-[18ch] text-[clamp(2.5rem,8vw,7rem)] tracking-[-0.02em]">{project.title}</h1>
      <p className="mt-6 max-w-[46ch] text-xl text-muted">{project.tagline}</p>

      <div className="mt-20 grid gap-16 md:grid-cols-[200px_1fr]">
        <dl className="label h-fit space-y-4 md:sticky md:top-28">
          {META.filter((k) => project[k]).map((k) => (
            <div key={k}>
              <dt className="opacity-60">{k}</dt>
              <dd className="mt-1 text-ink normal-case tracking-normal">{project[k]}</dd>
            </div>
          ))}
        </dl>

        <div>
          {project.sections.map((s) => {
            const dark = s.heading === 'Insight'
            return (
              <section
                key={s.heading}
                className={dark
                  ? 'my-16 -mx-6 bg-dark px-6 py-16 text-paper md:-mx-12 md:px-12'
                  : 'mb-16'}
              >
                <h2 className={dark ? 'label mb-6 text-paper/60' : 'label mb-6'}>{s.heading}</h2>
                <Prose html={s.html} />
              </section>
            )
          })}

          <div className="flex flex-wrap items-center gap-4">
            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noreferrer"
                className="label inline-block bg-ink px-6 py-4 text-paper transition-opacity hover:opacity-80"
              >
                Open the app
              </a>
            )}
            {project.pdf && (
              <a href={project.pdf} download className="label inline-block border border-ink/20 px-6 py-4 transition-colors hover:bg-ink hover:text-paper">
                Read the PDF
              </a>
            )}
            {project.live_hint && (
              <span className="label opacity-60">{project.live_hint}</span>
            )}
          </div>
        </div>
      </div>

      <Link to="/#work" className="label mt-24 inline-block underline underline-offset-4">All work</Link>
    </article>
  )
}
```

- [ ] **Step 6: Add the new sections to `src/routes/Home.jsx`**

```jsx
import Hero from '../components/Hero'
import WorkIndex from '../components/WorkIndex'
import WebBand from '../components/WebBand'
import About from '../components/About'
import Contact from '../components/Contact'

export default function Home() {
  return (
    <>
      <Hero />
      <WorkIndex />
      <WebBand />
      <About />
      <Contact />
    </>
  )
}
```

- [ ] **Step 7: Verify**

Run `npm run dev`, visit `/work/pocket-pediatrics`.
Expected: six sections in order, the Insight section full-bleed dark, the metadata rail sticky on desktop and stacked on mobile, PDF download working, MesfenoWear rendered greyed with "Offline" and no link. No horizontal scroll at 375px — check the `-mx-6` bleed specifically, it is the likely offender.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "Add case study layout, web band, about section

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

## Task 11: Motion

GSAP, used sparingly. Spec §6: type sets in on entry, images reveal on a mask, sheets choreograph. **No scroll-jacking and no whole-page pinning** — someone skimming in 90 seconds must never feel trapped.

**Files:**
- Create: `src/hooks/useReveal.js`
- Modify: `src/components/Hero.jsx`, `src/components/WorkIndex.jsx`, `src/components/WebBand.jsx`, `src/components/About.jsx`, `src/components/Contact.jsx`, `src/routes/CaseStudy.jsx`
- Modify: `src/index.css`

**Interfaces:**
- Consumes: nothing from earlier tasks beyond the existing components.
- Produces: `useReveal(ref: RefObject<HTMLElement>) => void` — animates `[data-reveal]` descendants of `ref` on scroll entry, and no-ops under reduced motion.

No `@gsap/react` dependency. `gsap.context()` inside `useLayoutEffect` is six lines and does the same job.

- [ ] **Step 1: Add the pre-reveal state to `src/index.css`**

Elements start hidden only when motion is allowed, so a reduced-motion or JS-failed visitor never sees a blank page:

```css
@media (prefers-reduced-motion: no-preference) {
  [data-reveal] { opacity: 0; transform: translateY(18px); }
  [data-reveal-mask] { clip-path: inset(0 0 100% 0); }
}
```

- [ ] **Step 2: Create `src/hooks/useReveal.js`**

```js
import { useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Reveals [data-reveal] and [data-reveal-mask] descendants as they enter.
 * Entry only — nothing pins, nothing scrubs, nothing hijacks the scroll.
 */
export function useReveal(scope) {
  useLayoutEffect(() => {
    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const ctx = gsap.context(() => {
        gsap.utils.toArray('[data-reveal]').forEach((el) => {
          gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          })
        })

        gsap.utils.toArray('[data-reveal-mask]').forEach((el) => {
          gsap.to(el, {
            clipPath: 'inset(0 0 0% 0)',
            duration: 1.1,
            ease: 'power3.inOut',
            scrollTrigger: { trigger: el, start: 'top 85%', once: true },
          })
        })
      }, scope)
      return () => ctx.revert()
    })

    return () => mm.revert()
  }, [scope])
}
```

- [ ] **Step 3: Mark up the reveal targets**

Add `data-reveal` to: the hero label, h1 and standfirst; each section's `.label` and `h2`; each `WorkGrid` list item; each `WebBand` list item; the About paragraphs; the Contact h2 and link list.

Add `data-reveal-mask` to: the `WorkGrid` cover wrapper div, and the `[&_figure]` images inside `Prose` (add it in the `renderMarkdown` renderer in `src/lib/content.js` — put the attribute on the `<figure>`, then re-run `npx vitest run src/lib/content.test.js` and update the assertion if it breaks).

Stagger the hero by adding a small delay per element rather than a timeline — three elements do not justify one.

- [ ] **Step 4: Call the hook**

In `Hero.jsx`, `WorkIndex.jsx`, `WebBand.jsx`, `About.jsx`, `Contact.jsx` and `CaseStudy.jsx`, add a `useRef` on the section root and call `useReveal(ref)`.

- [ ] **Step 5: Verify**

Run `npm run dev`.
Expected: content rises in once as it enters, images wipe up from the bottom, nothing replays on scroll-back, the page never resists the scrollbar.

Then emulate `prefers-reduced-motion: reduce` and reload.
Expected: **everything is immediately visible.** Nothing is stuck at `opacity: 0`. This is the failure mode that ships broken sites — check it specifically.

Then disable JavaScript and reload.
Expected: content is visible (the CSS pre-state is inside a `no-preference` media query, but confirm nothing else hides it).

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "Add GSAP scroll reveals with reduced-motion and no-JS safety

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

## Task 12: Copy gate

Every shipped string is written through `humanizer` and `stop-slop`, then checked against the banned list. Drafts from earlier tasks are inputs, not final copy.

**Files:**
- Modify: `src/components/Hero.jsx`, `src/components/Nav.jsx`, `src/components/Contact.jsx`, `src/components/WorkIndex.jsx`, `src/components/WebBand.jsx`, `src/routes/NotFound.jsx`, `src/routes/CaseStudy.jsx`, `index.html`

**Interfaces:**
- Consumes: all component copy from Tasks 6–11.
- Produces: final interface copy, and a `<title>` / meta description in `index.html`.

- [ ] **Step 1: Collect every shipped string**

```bash
grep -rn --include=*.jsx -E '>[A-Za-z][^<>{}]{3,}<' src/ | tee /tmp/copy-audit.txt
```

Add `alt=`, `aria-label=`, and `placeholder=` values, plus `index.html`.

- [ ] **Step 2: Run the banned-list check**

```bash
grep -rniE 'seamless|intuitive|innovative|cutting-edge|elevate|empower|leverage|robust|delve|landscape|realm|testament|journey|passionate|curated|not just .* but|in today' src/ index.html
```

Expected: no matches. Any match is rewritten, not softened.

- [ ] **Step 3: Rewrite the collected copy through the skills**

Invoke `anthropic-skills:humanizer` and `stop-slop` on the collected strings. Rewrite in place.

**Do NOT rewrite these — they are the user's own words, already confirmed:**
- The hero `h1` ("I work from research through to something people can actually click").
- The three About paragraphs.
- Any `tagline` or section copy inside `content/*/index.md`.

Everything else — nav labels, button text, section headings, the 404, alt text, metadata — is yours to check and fix.

- [ ] **Step 4: Write `index.html` head**

```html
<title>Çağdaş Ergenç — UX and Product Design</title>
<meta name="description" content="Two UX case studies, written out in full, plus the e-commerce sites I designed and built." />
```

Set `<html lang="en">`. Remove any leftover Vite boilerplate title or favicon reference to deleted assets.

- [ ] **Step 5: Re-run the banned-list check**

Run the Step 2 grep again. Expected: no matches.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "Rewrite interface copy through humanizer and stop-slop

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

## Task 13: Accessibility and performance verification

**Files:**
- Modify: whichever files the audit implicates.

**Interfaces:**
- Consumes: the finished site.
- Produces: a site meeting the §10 and §12 criteria of the spec.

- [ ] **Step 1: Run the test suite**

Run: `npm test`
Expected: all sun and content tests pass.

- [ ] **Step 2: Build and preview**

```bash
npm run build && npm run preview
```

- [ ] **Step 3: Lighthouse**

Run a Lighthouse audit against the preview URL for both mobile and desktop.
Expected: Accessibility 100. LCP under 2.5s. CLS under 0.1. Fix anything below that before continuing.

- [ ] **Step 4: Keyboard pass**

Tab through the whole page, both routes, without touching the mouse.
Expected: every link and control is reachable in a sensible order with a visible focus ring. The work index is reachable even when the canvas is rendering.

- [ ] **Step 5: Contrast pass**

Check `--muted` on `--paper`, `--muted` on `--paper-lit`, and `--paper` on `--dark` with a contrast checker.
Expected: every pair ≥ 4.5:1. Sample the lit background at both its brightest and darkest points — the gradient means one value is not enough.

- [ ] **Step 6: Width pass**

Check 320px, 375px, 768px, 1024px, 1440px, 2560px.
Expected: no horizontal scroll at any width.

- [ ] **Step 7: WebGL-off pass**

Disable WebGL in the browser and reload.
Expected: the grid renders, the site looks intentional, nothing is broken or empty.

- [ ] **Step 8: Reduced-motion pass**

Emulate `prefers-reduced-motion: reduce` and reload both routes.
Expected: all content visible, sun static, no canvas, no element stranded at `opacity: 0`.

- [ ] **Step 9: Run the guidelines review**

Invoke the `web-design-guidelines` skill against `src/`. Fix what it reports.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "Fix accessibility and performance findings

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

## Deferred

Recorded so they are not rediscovered as bugs:

- **Remotion trailers.** Phase 2. MP4s drop into `WorkGrid` / `Sheet` as hover media.
- **Sheet corner curl.** Task 9 ships flat sheets. Upgrade path is in the code comment.
- **`pocket_pediatrics.pdf` is 33MB.** The user re-exports it under 8MB before ship. This is a blocker for launch, not for the build.
- **Covers and in-page images.** Supplied by the user. Empty aspect-ratio boxes are the correct interim state.
- **About photo.** The user must save it to `src/assets/about.jpg` (1600px wide, under 400KB). The bio itself is written and in the plan.
- **The sustainability report.** Slug and folder exist; the user supplies title, copy, and assets.
- **EXE content.** Folder exists; the user supplies copy and the slides as images.
