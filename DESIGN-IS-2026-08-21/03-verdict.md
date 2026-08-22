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
