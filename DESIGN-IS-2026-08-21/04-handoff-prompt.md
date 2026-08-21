```
/make-plan Redesign the "Behind Glass" portfolio design world (design/behind-glass branch). Current design failed audit at 17/30 with critical gaps in principles #1 (innovative), #3 (aesthetic), #6 (honest), #7 (long-lasting), #10 (as little design as possible).

Verdict paragraph (quoted from 03-verdict.md):
> Total score 17/30 (below the 20 threshold) and principle #6 (honest) scored 0, a load-bearing dimension the Phase-3 rule names explicitly. Either condition alone triggers REDESIGN; both are present. One sentence: the design world's own stated identity — real WebGL refraction distinguishing it from ordinary glassmorphism — is not what ships, and that gap, plus a self-documented pair of dated visual-trend markers and a cluster of orphaned/duplicated implementation, is not a polish problem.

Why redesign and not refine: Principle #6 (honest) scored 0/3. The design's own spec states as a shipping condition: "Not backdrop-filter: blur... A WebGL layer samples the actual cover images and displaces them through a shader... If either is dropped, this becomes generic and should not ship." What ships today is `backdrop-filter: blur(12px)` (src/index.css:168) — the real shader (src/gl/refract.js) is unreachable from any route. A design whose own stated identity claim is false about itself fails the load-bearing honesty test regardless of how cheap the individual fixes are.

Preserve from current design (this is unusually large for a REDESIGN handoff — most of the underlying work is sound and should NOT be rebuilt):
- The persistent-stage scroll structure itself (src/components/Stage.jsx) — the sticky-handoff information architecture that makes this branch structurally distinct from the sibling design/lit-paper branch. Scored well under #2 (useful, 3/3) and #5 (unobtrusive, 3/3).
- src/lib/push.js, src/lib/contrast.js and their test suites — the damped-viscosity pointer field and the worst-case contrast solver are correct, tested, and should not be touched except to feed the fixed sheen math (see Discard/Fix below).
- src/gl/refract.js and src/gl/shader.glsl.js — the real WebGL2 refraction shader. Previously verified working (real UV displacement confirmed via readPixels sampling in a prior session pass). This is not being discarded — it needs to be RE-CONNECTED, not rebuilt. See move 1.
- The colour and spacing discipline (7 distinct rendered colours system-wide, 4px-multiple spacing scale — 01-evidence.md §2). Keep the token set as-is except the one orphaned token named below.
- The accessibility work already in place: the reduced-motion failsafe watchdog (src/hooks/useReveal.js:20-31), the sr-only keyboard-parallel work grid (Stage.jsx:190-192), the corrected archived-link contrast (WebBand.jsx:26-32), and the focus-visible ring (src/index.css:216-220). All measured and correct — do not regress any of them while fixing the items below.
- The Pocket Pediatrics case study content (content/pocket-pediatrics/index.md) — role attribution was corrected and verified for internal consistency this session. Not in scope for this redesign pass.

Discard (structural patterns causing the failures):
- The current live "show the projects" path via plain <img> + CSS-only .glass with no shader backing. Evidence: src/index.css:154-171, backdrop-filter: blur(12px) at line 168. Caused failure on principle #1 and #6.
- src/components/Hero.jsx (55 lines) — unreachable from any route, superseded by Stage.jsx's inline annotation. Evidence: not imported by src/routes/Home.jsx. Caused failure on principle #10.
- src/components/WorkIndex.jsx (51 lines) — unreachable from any route, superseded by Stage.jsx. Evidence: not imported by Home.jsx. Caused failure on principle #10 (duplicated "show the projects" affordance alongside the live Stage.jsx implementation).
- The un-reverified pointer sheen on .glass (src/index.css:160-167) as currently tuned — not discarded wholesale, but its peak alpha must be recomputed against src/lib/contrast.js's minGlassAlpha before it ships again. Evidence: recomputed this session, drops title-text contrast to 4.30:1 (below the 4.5:1 AA floor) at --push-force:1 over a worst-case bright cover. Caused failure on principle #8.
- CaseStudy.jsx's hand-rolled layout/eyebrow markup (src/routes/CaseStudy.jsx:18-20) in place of the existing .shell class and Band.jsx component. Caused failure on principle #3.
- The orphaned --text-hero token (src/index.css:33), live in exactly one 8%-opacity decorative location (Stage.jsx:118) while the real headline uses a differently-named token (--text-display). Caused failure on principle #3.

Top 3-5 moves from the audit (verbatim):
1. #6 honest / #1 innovative — Re-wire GlassCard.jsx into Stage.jsx, or retire the claim. Evidence: src/gl/refract.js unreachable from any route; .glass ships as backdrop-filter: blur(12px) (src/index.css:168). Either make the shader load-bearing again on the live page, or rewrite the spec and every "not backdrop-filter: blur" claim to describe what's actually shipping. Shipping the mismatch silently is the one option ruled out.
2. #8 thorough — Fix the sheen/contrast interaction. Evidence: .glass's pointer sheen (src/index.css:160-167) drops title-text contrast to 4.30:1 (below AA) at peak force over a worst-case bright cover, unnoticed because it was added after the contrast floor was last verified. Recompute minGlassAlpha with the sheen included, or cap the sheen's peak alpha so the composite can never cross 4.5:1 regardless of cover brightness.
3. #10 as little design as possible — Delete or resurrect three dead files. Evidence: Hero.jsx, WorkIndex.jsx unreachable from any route; GlassCard.jsx reachable only by the dead WorkIndex.jsx. If move 1 resurrects GlassCard.jsx, delete Hero.jsx and WorkIndex.jsx outright rather than leaving three competing "show the projects" implementations in the tree.
4. #7 long-lasting — Name and own the trend exposure, or reduce it. Evidence: the spec self-identifies dark glassmorphism and fully-rounded shapes as the two most imitated patterns in current software (docs/superpowers/specs/2026-08-07-behind-glass-design.md §2.1, §5.4). The mitigation the spec already proposes — tight tracking, extrabold display type, a hard editorial grid countering the soft shapes — should be checked against what's actually shipping (move 5's Band.jsx/.shell reuse is part of this), not left as intent.
5. #3 aesthetic — Retire the orphaned --text-hero token and reuse Band.jsx in CaseStudy.jsx. Evidence: --text-hero used in exactly one place, an 8%-opacity fallback (Stage.jsx:118), while the real headline uses --text-display under a different name; CaseStudy.jsx:18-20 hand-rolls layout and eyebrow markup instead of .shell and Band.jsx. Small, mechanical, removes two of three inconsistencies driving the #3 score.

Redesign principles in priority order:
1. #6 Honest — every claim the design world makes about itself (in its spec, in its naming, in what "Behind Glass" implies) maps 1:1 to what actually renders. If the shader can't be re-connected in scope, the DESIGN'S OWN DOCUMENTATION changes to match reality — the mismatch is what fails, not either state alone.
2. #1 Innovative — the shipped visual surface should carry the same real differentiation the interaction structure already has. A genuinely working refraction shader, back on the live page, is what separates this from the glassmorphism it currently, accidentally, is.
3. #10 As little design as possible — one live implementation of "show the projects," not three. Every file in the tree should be reachable from a route or deleted.

Deliverables for the plan:
- A decision, made explicitly and early, on move 1: re-wire the shader, or rewrite the spec to drop the refraction claim. Both are legitimate outcomes of a REDESIGN pass; silently doing neither is not.
- New information architecture is NOT required — Stage.jsx's structure is in the Preserve list and scored well. This redesign is about closing the gap between what the design claims and what it ships, not about a new primary flow.
- A verification step for move 2 that re-runs src/lib/contrast.js's minGlassAlpha against the FINAL sheen values, not the pre-sheen values, before calling contrast done.
- A dead-code sweep: confirm via grep that nothing imports Hero.jsx or WorkIndex.jsx before deleting them (or confirm GlassCard.jsx IS imported by something live if move 1 resurrects it).
- States checklist: re-verify focus, reduced-motion, and the no-cover fallback still work after Stage.jsx is modified to carry the shader again (these are all currently correct and easy to regress while re-wiring canvas rendering into a component that didn't have it).
- Cutover criteria: this branch (design/behind-glass) does not merge to main, and does not get presented as "the" design to the owner for a final choice against design/lit-paper, until principle #6 re-scores at least 2/3 on a re-audit — i.e., until the shader claim and the shipped behavior agree.

Anti-patterns to guard against (specific to REDESIGN):
- Porting Stage.jsx's current image+CSS-scrim structure forward under new styling instead of actually re-connecting the canvas — that would keep #6 at 0 while looking like progress.
- Treating this as license to rebuild the persistent-stage concept from scratch — it is explicitly in the Preserve list and did not fail the audit. Rebuilding it would be scope creep, not redesign.
- Fixing the sheen contrast by lowering the sheen's visual impact so much it stops reading as pointer-reactive at all — the pointer-reactivity itself was a deliberate, user-requested fix earlier this session and should survive, just within the contrast floor.
- Declaring victory once GlassCard.jsx is merely importable again without confirming canvasElementsOnPage > 0 on the live page — the original failure was invisible at the source-reading level and only caught by checking the live DOM; the fix needs the same live check, not just a clean import graph.
```
