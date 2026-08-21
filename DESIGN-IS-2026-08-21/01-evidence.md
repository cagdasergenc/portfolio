# Evidence

All evidence below was gathered directly (the four parallel evidence subagents hit
a session-limit API error before returning anything and are not represented here —
this is a single-pass direct audit, not a subagent consolidation). Every finding
is cited to a file:line, a live-DOM measurement, or a `npm run build` output line.

---

## Headline finding — read this first

**The WebGL refraction shader is not reachable from the page that ships.**

- `src/gl/refract.js` (the real WebGL2 shader, verified working via `readPixels`
  earlier in this session) is imported by exactly one file: `src/components/GlassCard.jsx:2`.
- `GlassCard.jsx` is imported by exactly one file: `src/components/WorkIndex.jsx`.
- `WorkIndex.jsx` is **not imported by `src/routes/Home.jsx`** (confirmed by
  grep — `Home.jsx` imports `Rail`, `Stage`, `WebBand`, `About`, `Contact` only).
- Live DOM check on `http://localhost:5173/`: `document.querySelectorAll('canvas').length === 0`.

`Stage.jsx` (what `Home.jsx` actually renders for the work section) uses a plain
`<img>` for the cover and `.glass` for chrome. `.glass` itself, `src/index.css:154-171`,
resolves to `backdrop-filter: blur(12px)` (`src/index.css:168`) — the exact
technique the design spec explicitly disqualifies:

> "Not `backdrop-filter: blur`. A WebGL layer samples the actual cover images
> and displaces them through a shader... If either is dropped, this becomes
> generic and should not ship." — `docs/superpowers/specs/2026-08-07-behind-glass-design.md` §2.1

This is not a case of the concept never being built — it WAS built, tested, and
visually verified (readPixels evidence from earlier this session showed real UV
displacement). It was then orphaned when `Stage.jsx` replaced `WorkIndex.jsx` in
`Home.jsx` as part of the "give it its own DNA" pivot, and nothing re-wired the
shader into the new component. `GlassCard.jsx` and `src/gl/` are dead code today,
280 lines of tested, working, unreachable shader integration.

`.glass` does still read the pointer displacement field (`--push-x/y/force`) for
a CSS radial-gradient sheen and a 3px parallax shift (`src/index.css:154-171`) —
so the pointer-reactivity fix from earlier this session is real and live. What is
missing specifically is the WebGL layer underneath it.

---

## 1. Structural evidence

**Interactive elements, live DOM, home page (`/`):** 13 total
(`document.querySelectorAll('a, button, [onclick], input, [tabindex]')`), 12
visible-or-focusable (one is inside the `sr-only` keyboard-only duplicate grid,
counted separately below).

**Max DOM nesting depth, home page:** 10 (measured live via recursive
`el.children` walk from `document.body`).

**Canvas elements on the live page:** 0. See headline finding.

**Dead components (imported by nothing reachable from `App.jsx`):**
- `src/components/Hero.jsx` (55 lines) — superseded by `Stage.jsx`'s inline
  positioning-line annotation. Not imported anywhere (`grep -rn "from '.*Hero'" src/`
  returns nothing).
- `src/components/WorkIndex.jsx` (51 lines) — superseded by `Stage.jsx`. Not
  imported by any route.
- `src/components/GlassCard.jsx` (129 lines) — only consumer is the dead
  `WorkIndex.jsx`.
- Total: 235 lines of dead component code, none of it caught by `npm run lint`
  or `npm run build` because both still compile cleanly with unreachable files
  present.

**Repeated pattern, intentional and correctly justified:** the work-navigation
link exists twice simultaneously — once inside `Stage.jsx`'s sticky visual stage
(`src/components/Stage.jsx:175-180`, the `<Glass><Link>` capsule) and once inside
the `sr-only focus-within:not-sr-only` wrapped `<WorkGridFlat>`
(`src/components/Stage.jsx:190-192`). This is deliberate and documented
(`Stage.jsx:188-189`): the sticky stage only shows the *active* project, so
keyboard/screen-reader users get a parallel always-present list of all three
instead. Not a duplication defect — a considered accessibility fallback.

**Repeated pattern, NOT reused where it plausibly should be:** `Band.jsx` is
documented as "the section header for this world" (`Band.jsx:2`) and used by
`WorkIndex.jsx` (dead) but never by `CaseStudy.jsx`, which hand-rolls its own
eyebrow+heading markup (`src/routes/CaseStudy.jsx:19-20`) instead. Similarly,
`CaseStudy.jsx:18` hand-rolls `max-w-[1400px] px-6 ... md:px-12` instead of the
`.shell` class every other section uses (`Nav.jsx`, `Stage.jsx`, `WebBand.jsx`,
`About.jsx`, `Contact.jsx` all use `className="shell ..."`).

**Naming drift:** `--text-hero` (`src/index.css:33`) is live in exactly one
place today — `Stage.jsx:118`, the 8%-opacity ghost-title shown when a project
has no cover image (i.e., barely-visible decoration). The actual visible
headline (the positioning-line `<h1>`, `Stage.jsx:159`) uses `text-display`,
the same token as the case-study `<h1>`, the 404 `<h1>`, and the Contact `<h2>`.
The token named for "hero" no longer serves a hero.

**Dead-prop / dead-class check:** zero matches for the previously-known Lit
Paper class leakage (`bg-paper`, `text-ink`, `text-muted`, `shadow-sun`,
`paper-lit`) — this was found and fixed in an earlier session pass and remains
clean (`grep -rnE 'bg-paper|text-ink|text-muted|shadow-sun|paper-lit' src/` →
no output).

---

## 2. Visual evidence

**Type scale, live computed values (1440×900 viewport):**

| Role | Computed `font-size` |
| --- | --- |
| Nav links | 12px |
| Stage metadata (`.label`) | 12px |
| Nav logo | 18px |
| Stage capsule title (`h3.text-card`) | 29.6px |
| Stage h1 (positioning line, `.text-display`) | 64px |

Three effective steps in live use (12 / 18–29.6 / 64) with `--text-hero`
(intended as a fourth, largest step) present in tokens but not in active
headline use — see naming-drift finding above.

**Spacing sample (2 elements, live computed):** nav pill `padding: 12px 24px,
gap: 32px`; `#work` section `padding: 96px 48px, margin: 0px 20px`. Both are
multiples of 4, consistent with a deliberate 4px-base scale.

**Distinct rendered colours, live DOM walk (all elements, `color` +
`background-color`, transparent excluded):** 7 —
`rgb(255,255,255)`, `rgb(244,244,246)` (`--text`), `rgb(10,10,12)` (`--void`),
`rgba(12,12,14,0.65)` (`--glass`), `rgb(155,155,166)` (`--text-dim`), plus two
`oklab(...)` browser-resolved values from Tailwind's `white/12` and `white/5`
utilities. A genuinely tight palette — no rogue hex values found.

**Contrast — the load-bearing measurements:**

Static token pairs, from the codebase's own `src/lib/contrast.js` (already
verified correct with 13 passing unit tests):
- `--text` on `--void`: 18.01:1
- `--text-dim` on `--void`: 7.19:1
- Metadata scrim floor on the Stage (measured this session, `Stage.jsx:126-149`):
  0.91 effective void-alpha at the metadata row, versus a required 0.84 — passes
  with margin, verified live via `getBoundingClientRect` geometry against the
  gradient stop math.

**New finding, not previously checked:** `.glass`'s pointer-reactive sheen
(`src/index.css:160-167`, added this session to fix "cursor does nothing") sits
on top of the smoked fill whose contrast was measured *before* the sheen
existed. Recomputing with the sheen at its hottest point (`--push-force: 1`,
cursor centred on the capsule):

| Cover behind the glass | Title text contrast, sheen at rest | Title text contrast, sheen at max force |
| --- | --- | --- |
| Worst case: pure white | 5.63:1 (previously measured, still correct at rest) | **4.30:1 — fails AA (4.5:1 floor)** |
| Pocket Pediatrics' actual cream cover | 6.28:1 | 4.72:1 — passes, narrowly |

The sheen and the contrast floor were fixed in two different, unconnected
passes this session; nobody re-verified the composite. Real, but narrow: it
only fails against a hypothetical bright-white cover at the single instant the
pointer sits directly over a capsule at full velocity, and passes against the
one real cover currently in the codebase.

**States checklist (home page):**
- Focus: implemented and correct. `src/index.css:216-220`, a 2px `--color-text`
  outline via `:focus-visible`, applies globally, not overridden by any
  component checked.
- Empty/loading/error/success: **N/A** — no forms, no async data-fetching UI on
  this surface. Not a gap; there is nothing to have these states.
- Disabled: N/A, same reason.
- Reduced motion: implemented (`src/index.css:226-256`) — pre-hide CSS scoped
  to `no-preference` only, `usePush` short-circuits to a static value under
  `reduce` (`src/hooks/usePush.js:20-25`), and a 1.6s failsafe watchdog
  disarms the GSAP pre-hide entirely if animation never fires
  (`src/hooks/useReveal.js:20-31`) — this last one is a genuinely careful
  detail most sites do not have.

---

## 3. Copy & honesty evidence

**Positioning line (byte-identical across both branches, owner's own words,
per prior session record):** "I work from research through to something
people can actually click." — `Stage.jsx:160`.

**Pocket Pediatrics case study, role claim vs. tools list (internal
consistency only):** `content/pocket-pediatrics/index.md` frontmatter states
`role: AI Prototyping & Build, UX Design, Data Analysis` and `tools: Figma,
React Native, Expo, Supabase, GPT-4o-mini, Whisper`. The body's "My role"
paragraph states the owner built "the React Native app, the Supabase backend,
and the GPT-4o-mini and Whisper integration" and explicitly disclaims leading
research or UI design: "Primary field research... was mostly run by my
teammates." Internally consistent — the prose scope matches the tools list,
and the disclaimer prevents the tools list from implying more than the prose
claims. This was corrected mid-session at the owner's explicit instruction
after an earlier draft overstated it; the corrected version is what ships.

**Live-app disclosure:** `content/pocket-pediatrics/index.md` sets
`live_hint: log in as oscar`, and `CaseStudy.jsx:49` renders it directly next
to the "Open the app" link (`CaseStudy.jsx:29-42`), not after the click. The
login requirement is disclosed before the visitor leaves the site — no
mismatch.

**Label check — "Open →" (`Stage.jsx:178`):** this is `aria-hidden="true"`
and sits inside a `<Link to={.../work/:slug}>` whose accessible name comes
from the visible title text beside it (`Stage.jsx:177`), not from "Open →"
itself. So the arrow is decorative reinforcement, not the accessible label —
correct, not a mismatch.

**No dark patterns found:** no forced continuity, hidden cost, fake scarcity,
or confirmshaming anywhere in the copy inventory. Not applicable to this
surface type, and none were manufactured to fill the category.

**Banned-word grep** (project's own standing list): clean except one
deliberate, justified exception already on record — "journey" in "journey
mapping," a named UX research method in `content/pocket-pediatrics/index.md`,
not marketing language.

**Unfinished content, disclosed honestly rather than hidden:**
`content/pocket-pediatrics/index.md` still has one `FILL IN` (`duration`).
`content/exe/index.md` and `content/sustainability-report/index.md` remain
mostly placeholder. These render as literal "FILL IN" text if visited today —
see `content/CONTENT-NEEDED.md`, a real punch-list, not a cover-up.

---

## 4. Weight & friction evidence

**Real `npm run build` output, this session, this commit:**

| Asset | Size |
| --- | --- |
| `index-*.js` (entry, only JS chunk — no code-splitting present) | 414.68 kB raw / **140.93 kB gzip** |
| `index-*.css` | 34.95 kB raw / 7.61 kB gzip |
| `Switzer-Variable-*.woff2` | 43.22 kB |
| `cover-*.jpg` (Pocket Pediatrics) | 220.13 kB |
| `resume-*.pdf` | 270.63 kB |
| **`case-study-*.pdf`** | **35,064.90 kB — 35 MB** |

**The 35 MB PDF is a known, previously-flagged, still-unresolved issue.** The
Lit Paper spec (`docs/superpowers/specs/2026-08-04-portfolio-redesign-design.md`,
per the section-4 deferred list from that session) named the source file
`pocket_pediatrics.pdf` at 33 MB as "a launch blocker... re-export under 8 MB
before ship." It was never re-exported. It is not loaded on initial page view
(it is a `download` link, `CaseStudy.jsx:107-118`) but it IS what a recruiter
receives if they click "Read the PDF," and it ships in `dist/`.

**No code-splitting anywhere in the app** (`grep -rn "lazy(" src/` → zero
matches). This is a direct consequence of the dead-shader finding: the plan's
own Task 4/5 required the WebGL/refraction bundle to be `lazy()`-imported so
phones and reduced-motion visitors never paid for it. Since `GlassCard.jsx` is
now unreachable from any route, there is nothing left to lazy-load — the
entry bundle is a single 140.93 kB gzip chunk, which is small on its own
merits, but the absence of splitting is not a deliberate simplicity win here;
it is a side effect of orphaned code.

**Idle-tab animation — the one item worth flagging on principle #9:**
`usePush` (`src/hooks/usePush.js:41-52`) runs an unconditional
`requestAnimationFrame` loop from mount until the whole app unmounts (i.e., for
the entire session, on every route), regardless of whether the pointer has
moved recently or whether any `.glass` element is even on screen. Each frame
calls `root.style.setProperty` three times (`usePush.js:48-50`), forcing a
style recalculation on `documentElement` at up to 60fps continuously. This is
gated off correctly under `prefers-reduced-motion: reduce`
(`usePush.js:20-25`, returns immediately, no loop). `Rail.jsx`'s loop, by
contrast, is scroll-driven only (`Rail.jsx:32-40`, schedules on `scroll`/
`resize` events, idles otherwise) — a real difference in discipline between
the two hooks that both claim the same "single field, minimal footprint"
design intent.

**Notifications/modals on load:** none. Confirmed by reading `App.jsx` and
`Home.jsx` in full — no toast, banner, or modal component exists in the tree.

**Time-to-interactive:** NOT measured. This sandbox's browser pane has shown
intermittent rAF throttling across this session (documented in the project's
own plan file as a known environment limitation) and cannot run Lighthouse
reliably. Reporting a TTI number here would be a guess dressed as a
measurement — declining to do so rather than fabricate one.
