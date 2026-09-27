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
pdf_pages: 37
lead_image: slide-09-start-on-today.webp
lead_alt: Deck slide, See it in action 1 of 6, Start on Today. Log in as Oscar with one tap and no password, see Martí's day at a glance with the glucose trend, time in range and care plan, and log a reading with its value, time and a note. Three phone screens from the live v2 app show Log in, Today and Add reading.
lead_caption: The live v2 app, from the deck's walkthrough. Log in as Oscar with one tap, see Martí's day, log a reading.
summary_problem: Caregivers lose the thread between appointments. Information is scattered, jargon goes unexplained, and children are told nothing they understand.
summary_role: I built the working prototype (Flutter, TypeScript on Supabase, GPT-4o-mini, Whisper) and ran its iteration cycles. Also data analysis, journey mapping, and the UX of the flows.
summary_output: Three additions inside Fujitsu Healthcare Suite, tested as a running app: plain-language visit summaries, follow-up instructions, and sharing tools including a child's story.
summary_status: 14 caregivers, 5 flows. Features scored 4.0 to 4.8 out of 5, overall experience 3.8. Time saved and comprehension gained were not measured.
featured: true
order: 1
---

## Context
- **Brief:** Fujitsu, through IED Barcelona. Their platform is FHS, Fujitsu Healthcare Suite.
- **For:** families managing chronic paediatric conditions.
- **Team:** four designers in Barcelona, with local caregivers and pharmacies for fieldwork.

### My role
- Built the working prototype: Flutter app, TypeScript backend on Supabase, GPT-4o-mini and Whisper.
- Ran the iteration cycles on it.
- Data analysis, journey mapping, and the UX of the flows.
- Wrote the framing that turned scattered findings into one problem statement.

Not mine: recruitment, interviews and outreach were mostly run by my
teammates. I contributed to testing and interface design without leading
either.

## Problem
Caring for a medically complex child is not only hard on the child.

- **62%** of those children are readmitted within 90 days of discharge.
- **49%** of their caregivers report a very severe burden.
- **249 hours a year** go to scheduling and admin. Mental load runs at about **32 hours a week**. Two separate measures, not one converted into the other.

## Research
Six stages, from community outreach to a tested prototype.

![Deck slide, Research Process. Six stages along one path: community outreach with surveys and posters, interviews for qualitative depth, data analysis and journey mapping, sacrificial concepts, prototype and user testing with 14 participants and 5 flows, and prototype iteration. A side card reads: cognitive load is the core stressor, and it shaped every design decision.](slide-03-research-process.webp "Six stages, from broad signals to a tested prototype. Cognitive load came out as the lead insight.")

My part started at the analysis: working through what the interviews
returned, mapping it, and building the prototype the last two stages tested.

![Deck slide, current customer journey from check-in to follow-up. The emotion line goes from confused at check-in, to relieved in the waiting room, to frustrated when the doctor explains results in Spanish with no interpreter, to confused at home, unclear on what to do next. Below: research shows patients forget 40% to 80% of medical information right after a consultation, and about 50% of what is remembered can be inaccurate.](slide-28-journey-now.webp "Where the visit breaks down today. The low point is results explained in a language the parent does not speak, and the confusion follows them home.")

### What kept recurring
- **40%+** of the week goes to managing care, across **11 to 15** visits a year.
- **49%** of appointment information is recalled afterwards.
- **80%** of visits leave medical terms unexplained. 1 in 4 parents has low health literacy, 1 in 3 in emergency settings.
- **67%** said they needed help coordinating care, and **15.8%** forgo care once coordinating passes five hours a week.

![Deck slide, The Insights. Six statistics across three insights. Reduce cognitive load: 40%+ of the week spent managing care, and 11 to 15 doctor visits a year. Speak their language: 49% of appointment information roughly remembered, 80% of visits leave medical terms unexplained, and 1 in 4 parents has low health literacy. Centralize information: 67% of parents need coordination help, and 15.8% forgo care past 5 hours a week of coordinating.](slide-05-insights.webp "Six numbers, three insights, one overloaded caregiver. The sources are linked below.")

### The two caregivers who anchored it
- **Jesse, 30.** Graphic designer, two children under three. Health information scattered across apps, chats, paper and calendars. Nothing in one place.
- **Oscar, 35.** Project manager raising a son with diabetes alone. No guidance between appointments, every escalation a solo call. "The hardest part is not knowing if it's a bad day or an emergency."

![Deck slide, Meet the Caregivers. Juggling Jesse, 30, a graphic designer in Barcelona and mom of two under three: health info scattered across apps, chats, paper and calendars. Overwhelmed Oscar, 35, a project manager in Barcelona and single dad of a son with diabetes: no guidance between appointments. Each card lists pain points and a quote. Footer: managing a chronic disease costs caregivers about 32 hours a week of mental load.](slide-04-caregivers.webp "Jesse and Oscar, the two personas the interviews came down to.")

### Sources
Time managing care and visits a year: [A National Profile of Caregiver
Challenges of More-Complex Children with Special Health Care Needs](https://pmc.ncbi.nlm.nih.gov/articles/PMC3923457/)
(2011). Unexplained jargon: [Surgeon Use of Medical Jargon with Parents in the
Outpatient Setting](https://pmc.ncbi.nlm.nih.gov/articles/PMC6525640/) (2019).
Coordination help and forgone care: [Inequities in Time Spent Coordinating Care
for Children and Youth with Special Health Care Needs](https://pmc.ncbi.nlm.nih.gov/articles/PMC10495536/)
(2023). Recall after a consultation: [Patients' memory for medical
information](https://pmc.ncbi.nlm.nih.gov/articles/PMC539473/) (2003).

## Insight
Access to care is not the problem. The gap is between appointments:

- information nobody holds in one place
- jargon parents cannot act on
- children who are told nothing they understand

**Cognitive load is the core stressor.** Naming it that way decided every
decision after it. Not more features. Less to hold in your head.

## Solution
Three additions inside FHS, built around one question: what if every
caregiver left the appointment with a clear plan and the confidence to act
on it?

![Deck slide, Our solution. An AI-powered care assistant embedded within FHS, asking what if every caregiver left each appointment with a clear plan and the confidence to act on it. Three additions: 01 appointment management with booking that integrates with caregivers' calendars, 02 follow-up instructions as a clear, jargon-free record of every visit, and 03 sharing tools, including a children's story.](slide-07-solution.webp "Three additions inside a platform families already have.")

It runs. Flutter app, TypeScript backend on Supabase, GPT-4o-mini behind the
plain-language summaries, Whisper behind voice input. Not a Figma prototype.

That changed what we could learn. The 14 participants judged whether the
summaries were understandable, not whether they could imagine them being
understandable.

### The live app is v2
Same three features, tidied information architecture, reworked interface.
The ratings below come from the version the 14 participants used.

![Deck slide, See it in action 2 of 6, Ask Care before you worry. Start from a suggestion drafted from Martí's own readings, describe what you see by typing or speaking while the assistant asks one question at a time, and learn whether to book a visit. Phone screens show Suggestions, First question and Follow-up.](slide-10-ask-care.webp "The Care chat runs on GPT-4o-mini, with Whisper behind the microphone for questions spoken instead of typed.")

![Deck slide, to-be journey for the appointment and follow-up. During the visit, the FHS app and an AI translator interpret the doctor's explanation, and the parent is sent a transcript with action items. At home, the app notifies them with the diagnosis and gives clear next steps. The emotion line stays positive: happy, relieved, confident, secure, guided.](slide-31-journey-target.webp "The same stretch with FHS carrying the load. Nothing new to adopt: the point was to remove steps from a platform families already have, not to add a fourth app to the pile.")

### Summaries and structured notes
A jargon-free record of every visit, structured so the whole care circle can
act on it. Aimed at the 49% recall gap.

![Deck slide, See it in action 3 of 6, Understand the visit. Open the latest visit from Visits and read the summary, tap an underlined medical term for a plain-language explanation, and scan the structured notes: red flags, decisions, next steps and medication. Phone screens show Summary, Term explained and Structured notes.](slide-11-understand-the-visit.webp "One visit at three depths: the summary, a term explained in plain words, and the structured notes.")

![Deck slide, test results for Appointment Summary and Structured Notes. 4.6 out of 5 for summary clarity and 4.6 for info completeness, with what's working, what needs fixing and recommendations, beside the Structured Notes and Care Plan screens.](slide-35-summary-notes-results.webp "Problem: the full summary read as overwhelming, jargon went unexplained, and users confused 'recent history' with 'follow-up'. Recommendation: structured notes first with the summary collapsed, ordered red flags, next steps, medications, notes, plus a glossary on every medical term. Scored 4.6 out of 5 on both clarity and completeness.")

### Sharing with the care circle
A profile per person, so a partner and a grandparent do not get the same
level of detail. Aimed at the 67% who asked for coordination help.

![Deck slide, See it in action 5 of 6, Share with the care circle. Choose a visit, choose what to include with each section showing its real content before sending, then send and keep a record in Share history of who got it and when. Phone screens show Choose a visit, Share with and Share history.](slide-13-share.webp "In v2 sharing starts from a visit. The parent ticks exactly which sections go out, and Share history shows who got what, and when.")

![Deck slide, test results for the Sharing Feature. 4.8 out of 5, the number one rated feature, with what's working and what needs fixing, beside the Sharing Menu and Sharing Landing Page screens.](slide-36-sharing-results.webp "Problem: 7 of 14 users looked for sharing on the summary screen instead of its own tab, nothing confirmed a send, and Send To sat below the content. Recommendation, from the deck's action list: an inline share button per section and a confirmation after sending.")

### A story for the child
Not in the brief. It came out of interviews, where parents kept describing
having to explain a diagnosis twice: once to themselves, then again to
their child.

![Deck slide, See it in action 4 of 6, Explain it to Martí. See what's next, the follow-up appointment and what it will check, then Talk to Martí, a short story that explains the visit in words a child understands. Phone screens show What's next and Talk to Martí.](slide-12-explain-to-marti.webp "In v2 the story sits under What's next on each visit, renamed Talk to Martí.")

![Deck slide, test results for The Story Feature. 4.0 out of 5 average, with what's working, what needs fixing and recommendations, beside the Defining Medical Terms and Story for Martí screens.](slide-37-story-results.webp "Problem: the name 'Simple Story' did not say what the feature was for, it only covered today's visit, and it sat in the wrong place. Recommendation: rename it 'Talk to [child's name]' and move it to the follow-up screen.")

### Appointment management
Booking tied to the caregiver's own calendar, aimed at the hours lost to
scheduling and admin.

![Deck slide, See it in action 6 of 6, Book and record the next visit. Book in plain words by typing or saying something like a pediatrician next week, after 4 pm, then start the visit to record it and get the summary in your language. Phone screens show Book and Live visit.](slide-14-book-and-record.webp "Book in plain words, then record the visit to get the summary in your language.")

## Outcome
- **14 caregivers, 5 flows.** 7 in-person think-aloud sessions in homes and cafés, 7 virtual run-throughs, 2 expert reviews. Ages 24 to 62.
- **Sharing 4.8 / 5**, the most useful addition. All 14 scored it 4 or 5.
- **Summary clarity 4.6 / 5.** Children's story 4.0 / 5. Every feature landed at 4.0 or higher.
- **Overall experience 3.8 / 5**, lower than any single feature. People liked the parts and were less sure about the whole.

![Deck slide, How We Tested. 7 in-person interviews with face-to-face think-aloud walkthroughs in homes and public places, 7 virtual run-throughs on the working Flutter prototype used live over screen share, 2 expert consultations, and 14 total participants aged 24 to 62. Five core journeys: open notification and log in, find the appointment summary, find follow-up tasks, share with a partner, create the child's story.](slide-33-how-we-tested.webp "Every run-through used the working prototype, in person or over a screen share.")

### What this does not yet prove
The demo validated usability and the feature concept. It did not measure
time saved or comprehension gained.

Those need pre/post time-tracking and a comprehension quiz against a
control. That is the next study, not a claim from this one.

![Deck slide, what the team will measure next. Initial demo results: sharing 4.8 out of 5, summary clarity and completeness 4.6, story 4.0. Future targets: fewer of the 249 hours a year spent on scheduling and admin, measured with pre and post time-tracking; an 80%+ comprehension score after AI translation, measured with a pre and post quiz; better follow-through on medication and next steps, measured through app engagement and outcomes.](slide-16-next-measures.webp "What the demo showed, and what the next study has to measure.")
