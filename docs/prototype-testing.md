# Prototype Testing Guide

## Purpose

This guide exists to make the first round of product feedback concrete.

The current prototype is not meant to prove final architecture. It is meant to answer whether the core teaching format is right:

- guided setup decisions
- visible security versus capability tradeoffs
- a personalized final setup plan

## How To Run The Prototype

Open [`prototype/index.html`](/home/mykola/repos/learning_safe_openclaw/prototype/index.html) in a browser.

No backend or build step is required for this version.

## What To Evaluate

Focus on these questions when using it:

1. Are the decisions the right ones?
2. Does the flow help you think more clearly about safe setup before installation?
3. Do the tradeoffs feel concrete, or still too vague and generic?
4. Does the final plan feel like something you would actually use later?
5. Do the inline sources increase trust, or just add clutter?

## Suggested Test Paths

Try at least these two paths:

1. A convenience-first path:
   - main personal machine
   - full browser access
   - marketplace skills
   - broad channels
   - aggressive autonomy
2. A cautious path:
   - dedicated VM or spare machine
   - no browser or limited web access
   - no third-party skills or a tiny reviewed allowlist
   - no channels or paired channels only
   - guarded autonomy

The contrast between those two paths should make it obvious whether the recommendation logic and explanation style are working.

## What Feedback Is Most Useful

The highest-value feedback is specific reaction, not general approval.

Good examples:

- "The first question should be about what I want OpenClaw to do, not where I run it."
- "The browser risk explanation was too abstract. I want one concrete example of what can go wrong."
- "The final plan was useful, but it needs a sharper yes or no recommendation."
- "The source cards helped on the recommendation screen but would be noisy on every question."

Lower-value feedback:

- "Looks good."
- "Seems fine."

## Next Step After Testing

After one or two rounds of prototype feedback, the project should either:

- keep this overall learning pattern and write the engineering spec for the real app
- or change the core interaction model before deeper implementation starts
