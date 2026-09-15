---
title: Pocket Pediatrics
tagline: Cognitive load is the real stressor for caregivers of medically complex children
role: AI Prototyping & Build, UX Design, Data Analysis
context: IED Barcelona with Fujitsu
year: 2026
team: 4 designers (Larsen, Bommakanti, Moraschi, Ergenç)
tools: Figma, Flutter, TypeScript, Supabase, GPT-4o-mini, Whisper
live_url: https://pocpedv2.netlify.app
live_hint: tap the Oscar demo account
pdf_pages: 31
lead_image: v2-overview.webp
lead_alt: Pocket Pediatrics, built with Flutter, Supabase and OpenAI. Three iPhone screens from the live v2 app: sign-in with a one-tap Oscar demo account, Martí's Today view with a glucose chart and care plan, and a detailed visit summary with structured notes.
lead_caption: The live v2 app. Sign in with the Oscar demo account, see Martí's day, and read any visit as a plain summary with structured notes.
summary_problem: Caregivers of medically complex children lose the thread between appointments. Information is scattered, jargon goes unexplained, and children are told nothing they can understand.
summary_role: I built the working prototype (Flutter, TypeScript on Supabase, GPT-4o-mini and Whisper) and ran its iteration cycles. I also did data analysis, journey mapping, and the UX of the flows.
summary_output: Three additions inside Fujitsu Healthcare Suite, tested as a running app: appointment summaries in plain language, follow-up instructions, and sharing tools including a child's story.
summary_status: Tested with 14 caregivers across 5 flows. Features scored 4.0 to 4.8 out of 5, overall experience 3.8. Time saved and comprehension gained were not measured.
featured: true
order: 1
---

## Context
A brief from Fujitsu at IED Barcelona, working on FHS (Fujitsu Healthcare
Suite) for families managing chronic paediatric conditions.

Four of us, based in Barcelona, with access to local caregivers and pharmacies
for fieldwork.

### My role
I built the working prototype: the Flutter app, the TypeScript backend on
Supabase, and the GPT-4o-mini and Whisper integration behind the summaries and
the children's story. I ran the iteration cycles on it.

I also worked on data analysis, journey mapping, the framing that got us from
scattered findings to a single problem statement, and the UX design of the
flows.

I contributed to user testing and to the interface design without leading
either. Primary field research (recruitment, interviews, outreach) was mostly
run by my teammates. My work started with what came back from it.

## Problem
Caring for a medically complex child is not only hard on the child.

62% of those children are readmitted within 90 days of discharge, and 49% of
their caregivers report a very severe burden.

Two separate numbers describe the load, and they measure different things.
Scheduling and admin tasks alone take about 249 hours a year. Overall mental
load, which is the wider job of holding the whole thing in your head, runs at
roughly 32 hours a week.

## Research
The team ran six stages, from broad signals to a validated prototype: community
outreach with surveys and posters in local pharmacies; qualitative interviews;
data analysis and journey mapping; sacrificial concepts to test ideas early;
prototype and user testing with 14 participants across 5 flows; and a final
iteration pass.

My part sat on the analysis side and after it. Working through what the
interviews returned, mapping it, and building the prototype the last two stages
tested.

![Current-state customer journey for a caregiver, from booking through follow-up, with the emotional low points marked in red](05-journey-now.webp "Mapping the current journey is where the design problem stopped being 'build a health app'. The lows cluster after the visit, not during it, which is the part no one was designing for.")

### What kept recurring
Caregivers spend 40%+ of their week managing care across a typical 11 to 15
visits a year.

Only 49% of appointment information is recalled afterwards. 80% of visits leave
medical terms unexplained, and 1 in 4 parents has low health literacy, rising to
1 in 3 in emergency settings.

67% of parents said they needed help coordinating care at all, and 15.8% forgo
medical care outright once coordination passes five hours a week.

### The two caregivers who anchored it
Jesse, 30, a graphic designer with two children under three, whose health
information was scattered across apps, chats, paper and calendars. Nothing in
one place.

Oscar, 35, a project manager raising a son with diabetes alone, who had no
guidance between appointments and treated every escalation as a solo decision
with no safety net. "The hardest part is not knowing if it's a bad day or an
emergency."

### Sources
Caregiver burden and admin hours: PubMed, National Profile of Caregiver
Challenges. Unexplained jargon: Surgeon Use of Medical Jargon with Parents in
the Outpatient Setting (PMC6525640). Coordination help and forgone care:
Inequities in Care Coordination. Recall after a consultation: Patients' Memory
for Medical Information.

## Insight
The barrier is not access to care. Access already exists. What is missing is
everything that happens *between* appointments: fragmented information, jargon
parents cannot act on, and children who do not understand what is happening to
them.

**Cognitive load is the core stressor.** Once we named it that way, it decided
every subsequent design decision. Not more features. Less to hold in your head.

## Solution
An AI-powered care assistant embedded inside FHS, built around one question:
what if every caregiver left each appointment with a clear plan and the
confidence to act on it?

This one runs. It is not a Figma prototype. It is a Flutter app with a
TypeScript backend on Supabase, with GPT-4o-mini generating the plain-language
summaries and Whisper handling voice input, deployed and testable.

Building it rather than mocking it changed what we could learn. The 14
participants used a working product, so their feedback was about whether the
summaries were actually understandable, not whether they could imagine them
being understandable.

### The live app is v2
Same three features, with a tidied information architecture and a reworked
interface. The screens in the test results below are from the version the 14
participants used, so the live app will not match them screen for screen.

![Daily diabetes care. A glucose trend with time in range, a care plan checklist, and a care circle of family and school staff. Two phones show Martí's Today view and the Profile screen listing a school nurse and his grandmother in his care circle.](v2-daily-care.webp "Martí's day at a glance, and the people it gets shared with. The care circle is set by the parent, one person at a time.")

![AI symptom check. Suggested questions come from the child's own data, and the assistant asks one clarifying question a turn. Two phones show the Care chat's suggested questions and a reply asking about Martí's recent symptoms.](v2-ai-symptom-check.webp "The Care chat runs on GPT-4o-mini, with Whisper behind the microphone for questions spoken instead of typed.")

![Target-state journey showing scheduling, translation and structured follow-up absorbed into the platform](06-journey-target.webp "The same journey with the three additions in place. Nothing new to adopt: the point was to remove steps from a platform families already have, not to add a fourth app to the pile.")

### Appointment summaries and structured notes
A jargon-free record of every visit, structured so the whole care circle can
read and act on it. Aimed at the 49% recall gap.

![Test results for the summary and notes screens, scoring 4.6 for clarity and 4.6 for completeness, with the app screens beside them](02-summary-notes.webp "Problem: the full summary read as overwhelming and users confused 'recent history' with 'follow-up'. Decision: flip the hierarchy so structured notes come first and the long summary collapses, ordered red flags, next steps, medications, notes. Scored 4.6 out of 5 on both clarity and completeness.")

![Visit notes, shared. Every visit has a detailed and a simple summary, and parents choose exactly what the care team gets. Two phones show a visit summary with structured notes and the Share screen with care plan tasks and notes selected to send.](v2-visit-notes.webp "The same summary and notes in v2. Sharing now starts from a visit, then lets the parent tick exactly which sections go out.")

### Sharing with the care circle
Custom profiles for the people around the child, so a partner and a grandparent
do not need the same level of detail. Aimed at the 67% who asked for
coordination help.

![Test results for the sharing feature, rated 4.8 out of 5, with the sharing menu and landing screens](03-sharing.webp "Problem: 7 of 14 users looked for the share button on the summary screen, not on its own tab, and nothing confirmed that anything had sent. Decision: move 'Send To' above the content and add a confirmation. The confirmation was fixed before the next test round; role presets are still open.")

### Appointment management
Integration with a caregiver's own calendar, aimed at the hours lost to
scheduling and admin.

The story feature was not in the original brief. It came out of interviews,
where parents kept describing having to explain a diagnosis twice: once to
themselves, then again to their child.

## Outcome
Tested with 14 caregivers across 5 user flows: 7 in-person think-aloud sessions
in homes and cafés, 7 virtual run-throughs, and 2 expert reviews. Ages 24 to 62,
varying digital literacy.

Every feature scored 4.0 out of 5 or higher. Sharing was rated the single most
useful addition at 4.8, with all 14 participants scoring it 4 or 5. Summary
clarity came in at 4.6, and the children's story at 4.0.

Overall experience, averaged across clarity, completeness and trust, scored
3.8 out of 5. That number is lower than any individual feature, and it is the
honest one: people liked the parts and were less sure about the whole.

![Test results for the children's story feature, scoring 4.0 out of 5, with the story and medical-term screens](04-story.webp "Problem: 'Story' read as fiction, so parents did not expect a real explanation of a real diagnosis behind it. Decision: rename it to 'Talk to [child's name]'. That rename went in before the next test round.")

### What this does not yet prove
The demo validated usability and the feature concept. It did not measure time
saved or comprehension gained.

Those are the numbers that would actually justify the work, and they need
pre/post time-tracking and a comprehension quiz against a control. That is the
next study, not a claim we can make from this one.
