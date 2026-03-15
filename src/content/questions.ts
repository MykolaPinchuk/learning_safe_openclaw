import type { DecisionQuestion } from "../lib/types/content";

export const questions: DecisionQuestion[] = [
  {
    id: "host",
    prompt: "Where are you thinking of running OpenClaw?",
    hint: "This sets the blast radius of everything that follows.",
    options: [
      {
        id: "main-pc",
        title: "On my main personal machine",
        description:
          "Fastest to start, but personal files, browser state, and daily-use accounts stay directly in scope.",
      },
      {
        id: "dedicated-vm",
        title: "In a dedicated VM or spare machine",
        description:
          "Lower convenience, but much better isolation if the agent is compromised or misconfigured.",
      },
      {
        id: "cloud-box",
        title: "On a dedicated cloud box",
        description:
          "Separates the runtime from your laptop, but remote access and credential scope still need care.",
      },
    ],
  },
  {
    id: "browser",
    prompt: "Do you need the agent to browse the web or use browser-driven workflows?",
    hint: "Web access expands prompt-injection and SSRF exposure.",
    options: [
      {
        id: "none",
        title: "No browser or web automation",
        description: "Narrowest exposure and the easiest posture to harden.",
      },
      {
        id: "read-only",
        title: "Limited web access for research",
        description:
          "Still risky, but more defensible if isolated and kept away from your normal browser state.",
      },
      {
        id: "full-browser",
        title: "Full browser-driven tasks",
        description:
          "Highest utility and one of the fastest ways to widen the attack surface.",
      },
    ],
  },
  {
    id: "skills",
    prompt: "How much do you expect to rely on community skills or plugins?",
    hint: "Supply-chain risk is one of the clearest documented failure modes.",
    options: [
      {
        id: "none",
        title: "No third-party skills",
        description:
          "Safest baseline. Limits extensibility, but avoids a major malware and prompt-manipulation path.",
      },
      {
        id: "reviewed",
        title: "Only a few manually reviewed skills",
        description:
          "Usable if you treat every skill as untrusted code and keep the allowlist very small.",
      },
      {
        id: "marketplace",
        title: "Broad marketplace access",
        description:
          "Very convenient, but the reports consistently treat this as one of the highest-risk areas.",
      },
    ],
  },
  {
    id: "channels",
    prompt: "How exposed do you want inbound access to be?",
    hint: "Who can reach the agent matters as much as what the agent can do.",
    options: [
      {
        id: "none",
        title: "No inbound channels yet",
        description:
          "Good for learning and early evaluation. Shrinks the prompt-ingestion surface substantially.",
      },
      {
        id: "paired",
        title: "Paired or allowlisted channels only",
        description:
          "Reasonable for cautious use if tied to dedicated accounts and strict policies.",
      },
      {
        id: "broad",
        title: "Broad messaging access",
        description:
          "Useful, but difficult to defend because untrusted content reaches the agent continuously.",
      },
    ],
  },
  {
    id: "agency",
    prompt: "How much autonomy do you want to give the agent?",
    hint: "More autonomy reduces friction and increases the consequence of mistakes.",
    options: [
      {
        id: "guarded",
        title: "Guarded and approval-heavy",
        description:
          "Slower, but most aligned with learning where the real risk sits before trusting the setup.",
      },
      {
        id: "balanced",
        title: "Balanced",
        description:
          "Keeps some guardrails while allowing more autonomous behavior in lower-risk areas.",
      },
      {
        id: "aggressive",
        title: "As autonomous as possible",
        description:
          "Most productive when it works and easiest to regret when the boundaries are weak.",
      },
    ],
  },
];
