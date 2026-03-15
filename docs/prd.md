# Pre-Install OpenClaw Safety Learning App PRD

## Overview

This project will be a local web app that teaches users how to think about OpenClaw security before they install or deploy it. The core problem is not just understanding a list of risks. Users need to understand the tradeoffs between capability and security well enough to make safer deployment decisions, especially before considering OpenClaw on a main personal machine that contains personal data, credentials, and daily-use accounts.

The product should help a learner build sound setup judgment first, then leave with a concrete personalized setup plan. It should be product-facing and focused on the learning experience, not on implementation internals.

Recommendations in the app are derived from the reports in `input_reports/`.

## Audience

The primary audience is developers who are new to OpenClaw and want to understand how to approach deployment safely.

These users are technical enough to evaluate tradeoffs and follow setup guidance, but they should not be expected to already understand OpenClaw's trust boundaries, threat model, or common security failure modes.

## Goals

The product goal is to teach safe setup judgment for single-user OpenClaw deployments.

V1 should enable a learner to:

- understand why OpenClaw is a high-risk tool by default
- identify the major categories of security risk involved in setup and usage
- evaluate security controls against the capability they limit
- receive a conservative recommended deployment posture
- leave with a personalized setup checklist and plan

The recommendation philosophy is conservative by default. The app should begin from the safest posture and only relax controls when the user explicitly opts into additional risk for a capability they actually need.

## Experience

The v1 product form is a local web app with guided decisions, light knowledge checks, inline citations, browser-local persistence, and a personalized setup plan with Markdown export.

The core user flow is:

1. Learn what OpenClaw is and why it is high risk by default.
2. Answer guided questions about intended use and required capabilities.
3. See the tradeoffs between security controls and reduced agency.
4. Receive a conservative recommended deployment posture.
5. Export a personalized setup checklist and plan.

The experience should stay focused on pre-install decision-making. It should not assume the user already has a running OpenClaw instance. It should also make the consequence of risky choices legible in plain language rather than relying on raw advisories or dense source material alone.

Inline citations are a product requirement. Claims and recommendations should be visibly tied back to the report corpus, but the app should not become a heavy research reader. Evidence should support the lesson without overwhelming it.

Light knowledge checks should reinforce understanding at key points, but the product should not feel like a formal certification or exam.

## Scope

### In Scope

- pre-install education
- single-user setup decisions
- report-backed recommendations
- local-first experience
- browser-local progress persistence
- personalized setup plan generation
- Markdown export of the final setup plan

### Out of Scope

- live OpenClaw integration
- importing or validating a real OpenClaw config
- team or shared deployment flows
- backend services or user accounts
- implementation-level architecture detail in this document

## Success Criteria

V1 is successful if a learner can:

- explain the main OpenClaw risk categories
- distinguish safer and less safe deployment choices
- understand the consequences of enabling additional capabilities
- finish the experience with a concrete personalized setup plan

This PRD should also be strong enough to support a later engineering spec without reopening product scope, audience, or the basic shape of the learning experience.

## Source Material

This product direction is grounded in the source reports stored in `input_reports/`, which emphasize:

- OpenClaw as a high-privilege automation runtime rather than a simple chatbot
- deployment risk on personal machines with broad access to files, credentials, and connected services
- the central tradeoff between stronger controls and reduced agent capability
- the need for hardening decisions before deployment rather than after an unsafe setup is already in place

These reports are the source of truth for the initial version of the learning experience.

## Open Questions

The following should be decided in a later engineering spec, not in this PRD:

- exact frontend stack
- content schema format
- recommendation rule representation
- testing framework and test strategy details
- citation storage mechanics
