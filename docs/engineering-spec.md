# Safe OpenClaw Learning App Engineering Spec

## Summary

This spec defines the first real implementation of the pre-install OpenClaw safety learning app described in [`docs/prd.md`](/home/mykola/repos/learning_safe_openclaw/docs/prd.md). It assumes the current prototype direction is valid enough to formalize.

V1 will be a frontend-only local web app that teaches single-user OpenClaw setup judgment through guided decisions, light knowledge checks, inline evidence, and a personalized Markdown-exportable setup plan.

This spec is intentionally decision-complete for v1. The implementer should not need to choose a different stack, a different content model, or a different recommendation strategy.

## Technical Decisions

- Use `React 19 + TypeScript + Vite`.
- Use plain CSS with a small global design system in app-owned stylesheets. Do not introduce Tailwind, a component library, or CSS-in-JS in v1.
- Use `Vitest` for unit tests and `React Testing Library` for component and flow tests.
- Use `Playwright` for one lightweight end-to-end happy path plus one high-risk path.
- Keep the app frontend-only. No backend, no API routes, no auth, no database.
- Persist user progress in `localStorage` only.
- Store all content and recommendation rules in versioned local TypeScript data modules. Do not parse reports dynamically at runtime.

## App Structure

Create the app as a standard Vite SPA under the repo root.

Recommended initial structure:

- `src/main.tsx`
- `src/App.tsx`
- `src/styles/`
- `src/content/`
- `src/components/`
- `src/features/orientation/`
- `src/features/questions/`
- `src/features/plan/`
- `src/lib/recommendation-engine/`
- `src/lib/storage/`
- `src/lib/export/`
- `src/lib/types/`

The app should be organized by feature plus shared libraries, not by page-only folders.

## User Flow

The product flow is fixed for v1:

1. Orientation screen
   - Explain what OpenClaw is in security terms.
   - Explain that the app is for pre-install decision-making.
   - Include one short knowledge check.
   - Offer a clear entry into the guided setup flow.
2. Guided decision flow
   - Present one question at a time.
   - Show progress and a short hint for the current question.
   - Persist the selected answer immediately.
   - Allow moving backward without losing prior selections.
3. Final recommendation screen
   - Show overall posture summary.
   - Show a risk label.
   - Show recommended controls.
   - Show accepted tradeoffs.
   - Show inline citations for each recommendation.
   - Allow Markdown export.
   - Allow editing answers and recomputing the plan.

V1 does not need multiple branches or hidden routes. One linear flow with a final plan is sufficient.

## Decision Set

V1 must include exactly these five setup decisions, because they match both the prototype and the report corpus:

1. Deployment host
   - main personal machine
   - dedicated VM or spare machine
   - dedicated cloud box
2. Browser capability
   - none
   - limited/research-oriented
   - full browser-driven tasks
3. Skills/plugins usage
   - none
   - small reviewed allowlist
   - broad marketplace usage
4. Inbound channel exposure
   - none
   - paired/allowlisted
   - broad messaging access
5. Agent autonomy level
   - guarded
   - balanced
   - aggressive

Do not add more decision questions in v1. The app should stay focused and readable.

## Data Model

Implement these TypeScript types in `src/lib/types/`:

```ts
export type SourceId =
  | "anthropic-1"
  | "anthropic-2"
  | "openai-1"
  | "openai-2"
  | "gemini";

export interface SourceDoc {
  id: SourceId;
  label: string;
  path: string;
  note: string;
}

export interface CitationRef {
  sourceId: SourceId;
}

export interface DecisionOption {
  id: string;
  title: string;
  description: string;
}

export interface DecisionQuestion {
  id: "host" | "browser" | "skills" | "channels" | "agency";
  prompt: string;
  hint: string;
  options: DecisionOption[];
}

export interface KnowledgeCheck {
  id: string;
  prompt: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export interface RecommendationItem {
  id: string;
  title: string;
  body: string;
  citations: CitationRef[];
}

export interface TradeoffItem {
  id: string;
  title: string;
  body: string;
}

export interface UserAnswers {
  host?: string;
  browser?: string;
  skills?: string;
  channels?: string;
  agency?: string;
}

export interface SetupPlan {
  title: string;
  summary: string;
  riskLevel: "low" | "medium" | "high";
  recommendations: RecommendationItem[];
  tradeoffs: TradeoffItem[];
}
```

## Content Strategy

All user-visible learning content must be stored locally in code-backed content modules.

Create:

- `src/content/sources.ts`
- `src/content/questions.ts`
- `src/content/knowledge-checks.ts`

For v1:

- Curate source summaries manually from the files in `input_reports/`.
- Do not build a report parser.
- Do not build search.
- Do not include raw long excerpts.
- Keep citation notes to one sentence each.

The app should cite source documents by label and provide a local file link or source reference label in the UI. V1 does not need a PDF text extraction pipeline.

## Recommendation Engine

Implement a deterministic recommendation engine in `src/lib/recommendation-engine/`.

The engine must follow this exact model:

1. Start from a conservative baseline posture.
2. Apply additive risk scoring based on risky choices.
3. Append recommendation items tied to each chosen answer.
4. Append tradeoff items only when a choice materially increases capability or reduces convenience.
5. Always append one recommendation about patch cadence and stale builds.
6. Return a `SetupPlan` plus the computed risk level.

Risk scoring rules:

- `host=main-pc`: `+4`
- `host=cloud-box`: `+2`
- `host=dedicated-vm`: `+0`
- `browser=read-only`: `+1`
- `browser=full-browser`: `+3`
- `skills=reviewed`: `+1`
- `skills=marketplace`: `+3`
- `channels=paired`: `+1`
- `channels=broad`: `+2`
- `agency=balanced`: `+1`
- `agency=aggressive`: `+2`

Risk labels:

- `0-3`: `low`
- `4-7`: `medium`
- `8+`: `high`

Do not make the engine probabilistic or model-driven. It must be transparent and easy to test.

## Persistence

Persist state in `localStorage` under a versioned key:

- `safe-openclaw:v1:session`

Persist:

- current step
- selected answers
- knowledge check state

Do not persist derived recommendation output; recompute it on load.

On malformed storage data:

- discard invalid state
- fall back to a fresh session

## Markdown Export

Implement export in `src/lib/export/markdown.ts`.

The exported Markdown file must include:

- title
- risk posture
- summary
- user answers
- recommended posture section
- accepted tradeoffs section
- source labels for each recommendation
- note that the app is pre-install guidance, not live configuration validation

Use the filename:

- `safe-openclaw-setup-plan.md`

## UI Requirements

The real app should preserve the prototype’s intent but be cleaner and more structured.

Required UI behaviors:

- one-question-at-a-time flow
- visible progress bar
- readable recommendation cards
- visible risk badge
- inline source cards or compact citation rows on the plan screen
- responsive layout for desktop and mobile
- keyboard-accessible buttons and controls

Do not add accounts, dashboards, filters, tabs, dark mode, or analytics in v1.

## Testing

Unit tests:

- recommendation engine returns the correct risk label for each path
- recommendation engine appends expected recommendation items for each answer
- malformed `localStorage` state resets cleanly
- Markdown export contains selected answers, source labels, and risk posture

Component tests:

- orientation screen renders the knowledge check
- selecting an answer enables forward navigation
- back navigation preserves earlier answers
- plan screen updates when answers change

Playwright tests:

1. cautious path
   - complete the guided flow with low-risk answers
   - verify low-risk posture appears
   - verify export action is available
2. convenience-first path
   - complete the guided flow with high-risk answers
   - verify high-risk posture appears
   - verify main-machine recommendation appears

## Acceptance Criteria

The implementation is complete when:

- the app runs locally with `npm install` and `npm run dev`
- a user can complete the full guided flow without a backend
- progress survives refresh through browser-local persistence
- the plan updates deterministically from saved answers
- Markdown export works
- every recommendation shown on the plan screen has at least one citation
- tests cover the rule engine, export, storage recovery, and the two main flow paths

## Assumptions

- The user’s “seems ok” feedback is treated as enough validation to proceed without another prototype round.
- The current five-question structure is good enough for v1.
- The current prototype’s overall learning pattern is retained.
- Additional report research is not required before implementation; the local report corpus remains the source of truth.
