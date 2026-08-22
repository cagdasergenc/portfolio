# Verdict

## REDESIGN

Total score 17/30 (below the 20 threshold) **and** principle #6 (honest) scored
0, a load-bearing dimension the Phase-3 rule names explicitly. Either
condition alone triggers REDESIGN; both are present.

**One sentence:** the design world's own stated identity — real WebGL
refraction distinguishing it from ordinary glassmorphism — is not what ships,
and that gap, plus a self-documented pair of dated visual-trend markers and a
cluster of orphaned/duplicated implementation, is not a polish problem.

## The honest tension, stated plainly

The *numbers* say REDESIGN. The *substance* of what's needed is unusually
cheap for that verdict: re-wire an existing, tested, working shader
(`src/gl/refract.js`, `GlassCard.jsx`) into an existing, working page
(`Stage.jsx`); fix one contrast regression that two good-faith fixes left
uncaught; delete ~235 lines of dead code; rename or retire one orphaned
token; reuse one existing component (`Band.jsx`) in one place it currently
isn't. None of that is "start over from purpose." It is closer to a REFINE
in scope and a REDESIGN in stakes — the anti-cliché condition this design
world's spec sets for itself ("if either is dropped, this becomes generic
and should not ship") is currently violated, and that's not a detail, it's
the premise.

This is reported honestly rather than softened toward whichever verdict is
more comfortable. The scorecard rule is mechanical for a reason: a taste
judgment could talk itself into REFINE ("it's basically fine, just wire one
thing back up"), but the evidence says the product's central, self-stated
claim about itself is false today, on the branch the owner is looking at
right now. That is exactly the situation principle #6 exists to catch.

## Top 5 highest-leverage moves

1. **#6 honest / #1 innovative — Re-wire `GlassCard.jsx` into `Stage.jsx`, or retire the claim.** Evidence: `src/gl/refract.js` unreachable from any route; `.glass` ships as `backdrop-filter: blur(12px)` (`src/index.css:168`). Either make the shader load-bearing again on the live page, or rewrite the spec and every "not backdrop-filter: blur" claim to describe what's actually shipping. Shipping the mismatch silently is the one option ruled out.

2. **#8 thorough — Fix the sheen/contrast interaction.** Evidence: `.glass`'s pointer sheen (`src/index.css:160-167`) drops title-text contrast to 4.30:1 (below AA) at peak force over a worst-case bright cover, unnoticed because it was added after the contrast floor was last verified. Recompute `minGlassAlpha` with the sheen included, or cap the sheen's peak alpha so the composite can never cross 4.5:1 regardless of cover brightness.

3. **#10 as little design as possible — Delete or resurrect three dead files.** Evidence: `Hero.jsx`, `WorkIndex.jsx` unreachable from any route; `GlassCard.jsx` reachable only by the dead `WorkIndex.jsx`. If move 1 resurrects `GlassCard.jsx`, delete `Hero.jsx` and `WorkIndex.jsx` outright rather than leaving three competing "show the projects" implementations in the tree.

4. **#7 long-lasting — Name and own the trend exposure, or reduce it.** Evidence: the spec self-identifies dark glassmorphism and fully-rounded shapes as the two most imitated patterns in current software (`docs/superpowers/specs/2026-08-07-behind-glass-design.md` §2.1, §5.4). The mitigation the spec already proposes — tight tracking, extrabold display type, a hard editorial grid countering the soft shapes — should be checked against what's actually shipping (move 3's `Band.jsx`/`.shell` reuse is part of this), not left as intent.

5. **#3 aesthetic — Retire the orphaned `--text-hero` token and reuse `Band.jsx` in `CaseStudy.jsx`.** Evidence: `--text-hero` used in exactly one place, an 8%-opacity fallback (`Stage.jsx:118`), while the real headline uses `--text-display` under a different name; `CaseStudy.jsx:18-20` hand-rolls layout and eyebrow markup instead of `.shell` and `Band.jsx`. Small, mechanical, and removes two of the three inconsistencies driving the #3 score.

## Redesign response: complete (2026-08-22)

The `docs/superpowers/sdd/2026-08-21-behind-glass-redesign/` plan (9 tasks)
is the redesign response to this REDESIGN verdict. Commits `1727246..f56897d`
carry the five top-leverage moves above: move 1 (re-wire the shader — Tasks
2, 4, 5), move 2 (sheen/contrast fix — Task 7), move 3 (delete the three dead
files — Task 6), move 4 (trend exposure — addressed structurally by move 5's
`Band` reuse, per the plan's self-review; no separate task), move 5
(`--text-hero` retirement / `Band` reuse in `CaseStudy.jsx` — Task 8). This
note is added by Task 9 (full verification pass), the commit immediately
following `f56897d` on this branch, which re-ran every check in this
document against the shipped code rather than trusting the individual
tasks' own reports:

- **Canvas count on `/`**: confirmed **1** (was 0 at audit time) — live in
  a real browser, both dev (Vite dev server, React StrictMode) and a
  production `vite build` + `vite preview`. In the production build the
  WebGL2 context stayed live (not lost) and the shader visibly took over
  compositing from the `<img>` fallback once `requestAnimationFrame`
  started delivering frames in the verification sandbox.
- **Peak-sheen contrast**: re-verified numerically against the exact
  shipped `src/index.css` value (peak alpha 0.095) at **4.5035:1** —
  clears the 4.5:1 AA floor.
- **Dead-code / orphan-token findings**: `Hero.jsx`, `WorkIndex.jsx`,
  `GlassCard.jsx` have no remaining imports and no longer exist on disk;
  `text-hero` has no remaining references. Both closed.
- **Gate sweep**: `npm run lint` clean, `npm test` 58/58 passing across 5
  files (confirmed Task 1's 7 `color.test.js` cases and Task 3's 6
  `useCapsuleRect.test.js` cases both landed), `npm run build` succeeds.
- **Widths / keyboard / reduced motion**: no horizontal overflow at
  320/375/768/1024/1440/2560 on `/` or `/work/pocket-pediatrics`; the
  keyboard path (skip link → Nav → stage capsule → `sr-only` fallback
  grid) walked and confirmed live with real Tab key presses; `usePush.js`
  has zero diff across the whole plan (confirmed via `git diff`), and
  `StageCanvas`'s render loop was confirmed, live, to read
  `--push-x/-y/-force` off `documentElement` correctly under a frozen
  static value (the WebGL context stayed alive and kept rendering with no
  console errors) — the same code path the reduced-motion branch exercises.

Full detail, including which checks were live versus static and the real
shipped bundle sizes, is in
`.superpowers/sdd/2026-08-21-behind-glass-redesign/task-9-report.md`.

## Correction (2026-08-22, same day): the checks above were true but insufficient

The final whole-plan review (dispatched on the most capable available model,
after all 9 tasks individually passed) found that "canvas count = 1" and "GL
context alive" — the checks above — do not prove the shader was actually
*working*, only that it existed and hadn't crashed. Two real bugs slipped
past every per-task review because each was scoped to its own task's diff,
not the integration between tasks:

- **The capsule-lens position was wrong.** `Stage.jsx` fed the shader's
  DOM-measurement hook the tall scroll-track section instead of the actual
  sticky viewport div, so the capsule position drifted continuously with
  scroll instead of staying constant. Root cause was a factual error in the
  plan's own Task 5 text ("`trackRef`... already points at the sticky
  container" — it does not), which the implementer followed faithfully.
- **The shader was dead in local development.** `refract.js`'s `destroy()`
  permanently disables a canvas element's ability to ever get a working
  WebGL context again; `StageCanvas.jsx` reused a single React-rendered
  canvas node across effect re-runs, so React StrictMode's dev-only
  mount→cleanup→mount cycle handed the second setup an already-poisoned
  node. Confirmed live: a console error, `isContextLost() === true`. This
  also means Task 9's own dev-server verification pass was compromised
  without knowing it — production doesn't run StrictMode, so the shader
  did work in the `vite build` + `vite preview` check, but "confirmed live
  in dev" for the parts that only ran in dev was not actually a clean
  signal.

Both are fixed as of commit `0722790` (one commit after the Task 9 record
above), along with a related gap the same review found: the canvas was
announcing itself ready — and painting over the `<img>` — before its cover
texture had actually finished loading, contradicting `StageCanvas.jsx`'s
own documented contract. All three fixes were independently re-verified
live: the capsule's `getBoundingClientRect().top` now stays constant across
multiple scroll positions within the same active project (confirming the
lens tracks the real sticky element, not a drifting proxy for it), the
canvas context stays alive with no console errors, and the canvas is
observably absent from the DOM until its texture has loaded.

The general lesson, not specific to this plan: a DOM-existence check
(`canvas count > 0`) and a not-crashed check (`isContextLost() === false`)
are necessary but not sufficient evidence that a visual feature is
*correct*. Verifying the actual measured behavior (here: does the tracked
position hold still when it should) is what caught what those two checks
missed.
