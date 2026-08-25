---
title: EXE
tagline: A life-admin agent for freelancers that executes instead of just suggesting
role: Concept, AI Safety Design, Interaction Design
context: IED Barcelona, MA design brief
year: 2026
tools: Figma
featured: true
order: 2
---

## Context
A design brief for the IED Barcelona MA program. Framed as an AI Trust &
Safety brief for Runtime Labs, a fictional product team building EXE: a
personal life-admin agent for freelancers. The premise sits in its own
subtitle, *execute, don't suggest*. An agent that only suggests is safe and
mostly useless. One that acts on your behalf is useful and genuinely risky.
This 21-page brief works through what it takes to make that trade-off
responsibly.

## The tension
Most AI agent concepts stop at the demo: drafting an email, filling a form,
booking a slot with a human still watching. EXE goes past that. It has
standing permission to act, unsupervised, on things that cost real money or
carry real consequences if it gets them wrong. Capability and safety aren't
sequential steps here. They're the same design decision, worked through
together from the start.

## Frameworks applied
Three existing standards, applied to one product: the EU AI Act, NIST's AI
Risk Management Framework, and the OWASP LLM Top 10.

**Autonomy tiers** are the structural decision they drive: what EXE can do
without asking, what it can do with standing but revocable permission, and
what always needs a human to confirm. Plus a set of hard behavioral limits
the agent can't be prompted or argued out of.

## Threat modeling
Two risk scenarios, three attacker profiles: prompt injection, delegate
misuse, and account takeover. Each modeled against a named user persona,
working through what the attack actually looks like against an agent with
real permissions, not a hypothetical one.

## Design response
Each threat gets a specific response, not a generic "add more guardrails."

**Confirmation** for actions that need it. **Transparency** so the user can
see what the agent is about to do or already did. **Accountability** so any
action traces back to a decision and a reason.

The autonomy tiers decide which one applies: silent execution, a
confirmation prompt, or blocked outright.

## Status
A completed design brief. Not a built or user-tested product, unlike the
rest of the work on this site.

21 pages of applied framework, threat modeling, and interaction design for
the confirmation, transparency, and accountability layer. It hasn't been
prototyped. None of its assumptions about how a freelancer would respond to
a confirmation prompt mid-task have been tested on a real person. That's the
obvious next step.
