import type {
  CitationRef,
  RecommendationItem,
  SetupPlan,
  TradeoffItem,
  UserAnswers,
} from "../types/content";

function citations(...sourceIds: CitationRef["sourceId"][]): CitationRef[] {
  return sourceIds.map((sourceId) => ({ sourceId }));
}

function recommendation(
  id: string,
  title: string,
  body: string,
  refs: CitationRef[],
): RecommendationItem {
  return { id, title, body, citations: refs };
}

function tradeoff(id: string, title: string, body: string): TradeoffItem {
  return { id, title, body };
}

export function buildSetupPlan(answers: UserAnswers): SetupPlan {
  const recommendations: RecommendationItem[] = [];
  const tradeoffs: TradeoffItem[] = [];
  let riskScore = 0;

  if (answers.host === "main-pc") {
    riskScore += 4;
    recommendations.push(
      recommendation(
        "host-main-pc",
        "Do not use your main personal machine as the default deployment target",
        "Move the runtime into a dedicated VM, spare machine, or isolated cloud box before optimizing for convenience.",
        citations("anthropic-1", "anthropic-2", "openai-2"),
      ),
    );
    tradeoffs.push(
      tradeoff(
        "host-main-pc-convenience",
        "You lose convenience in exchange for a real boundary",
        "A dedicated environment adds friction and weakens host-level automation, but it sharply reduces the consequence of a bad prompt, unsafe skill, or configuration mistake.",
      ),
    );
  } else if (answers.host === "cloud-box") {
    riskScore += 2;
    recommendations.push(
      recommendation(
        "host-cloud-box",
        "Keep the cloud box private and intentionally narrow",
        "Use loopback-only bindings where possible, avoid public exposure, and treat the gateway like a privileged control plane rather than a casual remote utility.",
        citations("anthropic-1", "openai-2"),
      ),
    );
    tradeoffs.push(
      tradeoff(
        "host-cloud-box-remote-risk",
        "You gain separation but inherit remote-access risk",
        "A cloud box is better than your main machine, but it shifts attention toward network exposure, remote access patterns, and credential scope.",
      ),
    );
  } else if (answers.host === "dedicated-vm") {
    recommendations.push(
      recommendation(
        "host-dedicated-vm",
        "A dedicated VM or spare machine is the best starting posture",
        "Keep it isolated from your daily environment, use dedicated accounts, and assume compromise is still possible even when the setup looks careful.",
        citations("anthropic-1", "anthropic-2", "openai-2"),
      ),
    );
    tradeoffs.push(
      tradeoff(
        "host-dedicated-vm-lost-convenience",
        "Some host convenience disappears and that is intentional",
        "You do not get the same direct access to your personal browser sessions, files, and daily accounts, which is exactly why this is a safer starting point.",
      ),
    );
  }

  if (answers.browser === "read-only") {
    riskScore += 1;
  }

  if (answers.browser === "full-browser") {
    riskScore += 3;
  }

  if (answers.browser === "read-only" || answers.browser === "full-browser") {
    recommendations.push(
      recommendation(
        "browser-enabled",
        "Treat browser capability as a major attack-surface increase",
        "Keep browser actions sandboxed, avoid reusing your normal browser state, and restrict outbound access wherever possible.",
        citations("openai-1", "openai-2", "gemini"),
      ),
    );
    tradeoffs.push(
      tradeoff(
        "browser-capability",
        "Safer browsing feels less capable",
        "Isolated browser workflows are slower and less convenient than using your real browser state, but they reduce prompt-injection and web-to-agent damage.",
      ),
    );
  } else if (answers.browser === "none") {
    recommendations.push(
      recommendation(
        "browser-none",
        "Skipping browser automation is a strong early safety choice",
        "This removes one of the biggest paths for prompt injection and web-originated compromise while you learn the rest of the system.",
        citations("openai-1", "openai-2", "gemini"),
      ),
    );
  }

  if (answers.skills === "reviewed") {
    riskScore += 1;
    recommendations.push(
      recommendation(
        "skills-reviewed",
        "Use a very small manually reviewed allowlist",
        "Only enable skills that you have read and understood. Prefer less capability over a large plugin surface.",
        citations("anthropic-1", "anthropic-2", "gemini"),
      ),
    );
  } else if (answers.skills === "marketplace") {
    riskScore += 3;
    recommendations.push(
      recommendation(
        "skills-marketplace",
        "Do not trust marketplace skills by default",
        "If you need third-party skills, keep the allowlist tiny, review them manually, and treat every skill as untrusted code rather than a harmless extension.",
        citations("anthropic-1", "anthropic-2", "gemini"),
      ),
    );
    tradeoffs.push(
      tradeoff(
        "skills-marketplace-convenience",
        "Curating skills slows you down",
        "Manual review and an allowlist reduce the convenience of a large skill ecosystem, but broad marketplace trust is one of the worst documented risks.",
      ),
    );
  } else if (answers.skills === "none") {
    recommendations.push(
      recommendation(
        "skills-none",
        "Staying skill-free is a defensible first deployment posture",
        "It limits what the system can do, but it avoids a major source of supply-chain and instruction-manipulation risk.",
        citations("anthropic-1", "anthropic-2", "gemini"),
      ),
    );
  }

  if (answers.channels === "paired") {
    riskScore += 1;
    recommendations.push(
      recommendation(
        "channels-paired",
        "Pair or allowlist channels and use dedicated accounts",
        "Limit who can reach the agent and do not connect it directly to high-value personal accounts at the start.",
        citations("openai-2", "gemini"),
      ),
    );
  } else if (answers.channels === "broad") {
    riskScore += 2;
    recommendations.push(
      recommendation(
        "channels-broad",
        "Reduce inbound reach before you increase tool access",
        "Use allowlists or pairing, separate service accounts from personal accounts, and avoid broad message ingress while the environment is still immature.",
        citations("openai-2", "gemini"),
      ),
    );
    tradeoffs.push(
      tradeoff(
        "channels-broad-autonomy",
        "You limit autonomy across real channels",
        "Broad inbound messaging gives the agent more utility, but it also means more untrusted content can reach a privileged system continuously.",
      ),
    );
  } else if (answers.channels === "none") {
    recommendations.push(
      recommendation(
        "channels-none",
        "No inbound channels is the cleanest learning baseline",
        "This keeps the focus on hardening the runtime before adding messaging exposure.",
        citations("openai-2", "gemini"),
      ),
    );
  }

  if (answers.agency === "balanced") {
    riskScore += 1;
    recommendations.push(
      recommendation(
        "agency-balanced",
        "Keep autonomy scoped to low-risk areas first",
        "Let the agent help where errors are recoverable. Delay high-consequence actions until you trust your environment more than your curiosity.",
        citations("anthropic-2", "gemini"),
      ),
    );
  } else if (answers.agency === "aggressive") {
    riskScore += 2;
    recommendations.push(
      recommendation(
        "agency-aggressive",
        "Aggressive autonomy requires stronger boundaries than convenience-first setups provide",
        "If you want high autonomy, do it only after isolation, skill governance, channel restrictions, credential separation, and update discipline are already in place.",
        citations("anthropic-2", "gemini"),
      ),
    );
    tradeoffs.push(
      tradeoff(
        "agency-aggressive-friction",
        "Approval-heavy workflows feel worse, but that friction is protective",
        "Reducing human checkpoints makes the system more fluid and more dangerous. The core tradeoff here is structural, not cosmetic.",
      ),
    );
  } else if (answers.agency === "guarded") {
    recommendations.push(
      recommendation(
        "agency-guarded",
        "Guarded mode is the right starting point",
        "Require approvals for consequential actions and use that friction to learn where the real risk sits in your setup.",
        citations("anthropic-2", "gemini"),
      ),
    );
  }

  recommendations.push(
    recommendation(
      "updates",
      "Stay current and assume patch lag is part of the threat model",
      "Rapid change and frequent advisories mean running stale builds or drifting configs is itself a real source of risk.",
      citations("openai-1", "anthropic-2"),
    ),
  );

  const riskLevel = riskScore >= 8 ? "high" : riskScore >= 4 ? "medium" : "low";

  const title =
    riskLevel === "high"
      ? "Your current answers point to a convenience-first posture that needs correction"
      : riskLevel === "medium"
        ? "Your current answers are workable, but only with disciplined controls"
        : "Your current answers align with a cautious learning-first posture";

  const summary =
    riskLevel === "high"
      ? "Too many choices widen exposure before the hard boundaries are in place. The app would steer you away from a direct install path in this form."
      : riskLevel === "medium"
        ? "Some boundaries are in place, but several capabilities still require tighter isolation and stricter guardrails than a casual setup normally gets."
        : "You are choosing boundaries before convenience, which is the right way to approach OpenClaw as a first-time deployer.";

  return {
    title,
    summary,
    riskLevel,
    recommendations,
    tradeoffs,
  };
}
