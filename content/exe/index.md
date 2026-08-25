---
title: EXE
tagline: A life-admin agent for freelancers, built to execute — within hard limits
role: Concept, AI Safety Design, Interaction Design
context: IED Barcelona, MA design brief
year: 2026
tools: Figma
featured: true
order: 2
---

## Context
A design brief for the IED Barcelona MA program, framed as an AI Trust &
Safety brief for a fictional product team, Runtime Labs, building EXE — a
personal life-admin agent for freelancers. The brief's premise sits in its
own subtitle: *execute, don't suggest*. An agent that only suggests is safe
and mostly useless; one that acts on your behalf is useful and genuinely
risky. The 21-page brief works through what it would take to make that
trade-off responsibly.

## The tension
Most AI agent concepts stop at the demo stage — drafting an email, filling a
form, booking a slot with a human still watching. EXE is framed past that
point: an agent with standing permission to act, unsupervised, on things
that cost real money or carry real consequences if it gets them wrong.
Making the agent capable and making it safe aren't sequential steps here —
the brief treats them as the same design decision, worked through together.

## Frameworks applied
Rather than inventing a safety approach from scratch, the brief applies
three existing standards to one product: the EU AI Act, NIST's AI Risk
Management Framework, and the OWASP LLM Top 10. Together they drive the
brief's core structural decision — autonomy tiers: what EXE can do without
asking, what it can do with standing but revocable permission, and what
always requires a human to confirm — plus a set of hard behavioral limits
the agent cannot be prompted or argued out of.

## Threat modeling
The brief models two risk scenarios and three attacker profiles — prompt
injection, delegate misuse, and account takeover — against a named user
persona, working through what each attack would actually look like against
an agent that holds real permissions, not a hypothetical one.

## Design response
For each threat, the brief designs a specific response rather than a
general "add more guardrails" answer: confirmation mechanisms for the
actions that need one, transparency so the user can see what the agent is
about to do or has already done, and accountability so any action traces
back to a decision and a reason. The autonomy tiers are what these
mechanisms attach to — a tier decides whether a given action gets silent
execution, a confirmation prompt, or is blocked outright.

## Status
This is a completed design brief, not a built or user-tested product —
worth saying plainly, since the rest of the work on this site is. EXE is 21
pages of applied framework, threat modeling, and interaction design for the
confirmation, transparency, and accountability layer. It hasn't been
prototyped, and none of its assumptions about how a freelancer would
actually respond to a confirmation prompt mid-task have been tested against
a real person. That's the obvious next step if it went further.
