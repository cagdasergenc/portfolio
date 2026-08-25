---
title: Pocket Pediatrics
tagline: Cognitive load is the real stressor for caregivers of medically complex children
role: AI Prototyping & Build, UX Design, Data Analysis
context: IED Barcelona with Fujitsu
year: 2026
team: 4 designers — Larsen, Bommakanti, Moraschi, Ergenç
tools: Figma, React Native, Expo, Supabase, GPT-4o-mini, Whisper
live_url: https://pocpedv2.netlify.app
live_hint: log in as oscar
featured: true
order: 1
---

## Context
A brief from Fujitsu at IED Barcelona, working on the FHS experience for
families managing chronic paediatric conditions. Four of us, based in
Barcelona, with access to local caregivers and pharmacies for fieldwork.

**My role.** I built the working prototype — the React Native app, the
Supabase backend, and the GPT-4o-mini and Whisper integration behind the
summaries and the children's story — and ran the iteration cycles on it. I
also worked on data analysis, journey mapping, the framing that got us from
scattered findings to a single problem statement, and the UX design of the
flows.

I contributed to user testing and to the interface design without leading
either. Primary field research — recruitment, interviews, outreach — was
mostly run by my teammates; my work started with what came back from it.

## Problem
Caring for a medically complex child is not only hard on the child. 62% of
those children are readmitted within 90 days of discharge, 49% of their
caregivers report a very severe burden, and roughly 249 hours a year
disappear into scheduling and admin — about 32 hours a week of mental load
carried by a parent who also has a job.

## Research
The team ran six stages, from broad signals to a validated prototype:
community outreach with surveys and posters in local pharmacies; qualitative
interviews; data analysis and journey mapping; sacrificial concepts to test
ideas early; prototype and user testing with 14 participants across 5 flows;
and a final iteration pass.

My part sat on the analysis side and after it — working through what the
interviews returned, mapping it, and building the prototype the last two
stages tested.

Three findings kept recurring. Caregivers spend 40%+ of their week managing
care across a typical 11–15 visits a year. Only 49% of appointment
information is recalled afterwards, 80% of visits leave medical terms
unexplained, and 1 in 4 parents has low health literacy — rising to 1 in 3 in
emergency settings. And 67% of parents said they needed help coordinating
care at all, with 15.8% forgoing medical care outright once coordination
passed five hours a week.

Two caregivers anchored the work. Jesse, 30, a graphic designer with two
children under three, whose health information was scattered across apps,
chats, paper and calendars — nothing in one place. And Oscar, 35, a project
manager raising a son with diabetes alone, who had no guidance between
appointments and treated every escalation as a solo decision with no safety
net. "The hardest part is not knowing if it's a bad day — or an emergency."

## Insight
The barrier is not access to care. Access already exists. What is missing is
everything that happens *between* appointments: fragmented information,
jargon parents cannot act on, and children who do not understand what is
happening to them.

**Cognitive load is the core stressor** — and once we named it that way, it
decided every subsequent design decision. Not more features. Less to hold in
your head.

## Solution
An AI-powered care assistant embedded inside FHS, built around one question:
what if every caregiver left each appointment with a clear plan and the
confidence to act on it?

This one runs. It is not a Figma prototype — it is a React Native app on
Supabase, with GPT-4o-mini generating the plain-language summaries and
Whisper handling voice input, deployed and testable. Building it rather than
mocking it changed what we could learn: the 14 participants used a working
product, so their feedback was about whether the summaries were actually
understandable, not whether they could imagine them being understandable.

Three parts, each closing one of the gaps above. **Appointment management**
that integrates with a caregiver's own calendar, aimed at the 249 hours a
year. **Follow-up instructions** — a jargon-free record of every visit,
structured so the whole care circle can read and act on it, aimed at the 49%
recall gap. And **sharing tools** with custom profiles for the care circle,
including a children's story that translates a diagnosis into something a
child can understand, aimed at the 67% who asked for coordination help.

The story feature was not in the original brief. It came out of interviews,
where parents kept describing having to explain a diagnosis twice — once to
themselves, then again to their child.

## Outcome
Tested with 14 caregivers across 5 user flows. Every feature scored above
4.0 / 5. Sharing was rated the single most useful addition at 4.8 / 5, with
all 14 participants scoring it 4 or 5. Summary clarity came in at 4.6 / 5,
and the children's story at 4.0 / 5.

**What this does not yet prove.** The demo validated usability and the
feature concept — it did not measure time saved or comprehension gained.
Those are the numbers that would actually justify the work, and they need
pre/post time-tracking and a comprehension quiz against a control. That is
the next study, not a claim we can make from this one.
