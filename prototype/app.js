const STORAGE_KEY = "safe-openclaw-prototype-state";

const questions = [
  {
    id: "host",
    prompt: "Where are you thinking of running OpenClaw?",
    hint: "This decision dominates the blast radius of everything else.",
    options: [
      {
        id: "main-pc",
        title: "On my main personal machine",
        description:
          "Most convenient, but it puts personal files, browser sessions, and daily-use accounts directly in scope.",
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
          "Good separation from your personal machine, but remote exposure and credential scope still need careful handling.",
      },
    ],
  },
  {
    id: "browser",
    prompt: "Do you need the agent to browse the web or use browser-driven workflows?",
    hint: "Web access expands prompt injection and SSRF exposure.",
    options: [
      {
        id: "none",
        title: "No browser or web automation",
        description:
          "Narrowest exposure and easiest to harden.",
      },
      {
        id: "read-only",
        title: "Limited web access for research",
        description:
          "Still risky, but more defensible if isolated and kept away from host browser state.",
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
          "Safer baseline. Limits extensibility, but avoids a major malware and prompt-injection path.",
      },
      {
        id: "reviewed",
        title: "Only a few manually reviewed skills",
        description:
          "Usable if you treat every skill as untrusted code and keep the allowlist small.",
      },
      {
        id: "marketplace",
        title: "I want broad marketplace access",
        description:
          "High convenience, but the reports describe this as one of the worst-risk areas.",
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
          "Good for learning and early evaluation. Shrinks the prompt-injection surface.",
      },
      {
        id: "paired",
        title: "A small set of paired or allowlisted channels",
        description:
          "Reasonable for cautious use if tied to dedicated accounts and strict policies.",
      },
      {
        id: "broad",
        title: "Broad messaging access",
        description:
          "Useful, but hard to defend because untrusted content reaches the agent continuously.",
      },
    ],
  },
  {
    id: "agency",
    prompt: "How much autonomy do you want to give the agent?",
    hint: "Higher autonomy usually means fewer friction points and a larger blast radius.",
    options: [
      {
        id: "guarded",
        title: "Guarded and approval-heavy",
        description:
          "Slower, but most aligned with the product goal of safe setup judgment.",
      },
      {
        id: "balanced",
        title: "Balanced",
        description:
          "Keeps some guardrails while allowing more autonomous behavior in low-risk areas.",
      },
      {
        id: "aggressive",
        title: "As autonomous as possible",
        description:
          "Most productive when it works, but easiest to regret if your controls are weak.",
      },
    ],
  },
];

const knowledgeCheck = {
  prompt: "Which choice does the most to reduce the blast radius before any other hardening step?",
  options: [
    "Using a frontier model instead of a smaller model",
    "Running on a dedicated VM or spare machine",
    "Installing only high-rated marketplace skills",
  ],
  answer: 1,
  explanation:
    "Isolation changes the consequence of failure. Model choice and skill quality matter, but separating the runtime from your main machine is the bigger boundary.",
};

const sources = {
  "anthropic-1": {
    label: "Anthropic report 1",
    href: "../input_reports/anthropic_report1.md",
    note:
      "Frames dedicated isolation, sandboxing, credential hygiene, and skill distrust as baseline controls.",
  },
  "anthropic-2": {
    label: "Anthropic report 2",
    href: "../input_reports/anthropic_report2.md",
    note:
      "Emphasizes the tradeoff between agent capability and stronger security boundaries.",
  },
  "openai-1": {
    label: "OpenAI report 1",
    href: "../input_reports/openai_report1.pdf",
    note:
      "Treats OpenClaw as a privileged control plane and highlights browser-to-agent and patch-lag risks.",
  },
  "openai-2": {
    label: "OpenAI report 2",
    href: "../input_reports/openai_report2.pdf",
    note:
      "Focuses on safe usage patterns, loopback assumptions, channel controls, and conservative deployment posture.",
  },
  gemini: {
    label: "Gemini report",
    href: "../input_reports/gemini_openclaw_report.md",
    note:
      "Maps architecture and deployment risks, especially around skills, channels, memory, and elevated access.",
  },
};

const citationMap = {
  hostIsolation: ["anthropic-1", "anthropic-2", "openai-2"],
  browserRisk: ["openai-1", "openai-2", "gemini"],
  skillRisk: ["anthropic-1", "anthropic-2", "gemini"],
  channelRisk: ["openai-2", "gemini"],
  autonomyTradeoff: ["anthropic-2", "gemini"],
  updates: ["openai-1", "anthropic-2"],
};

const introCards = [
  {
    title: "Why this app exists",
    body:
      "OpenClaw is closer to a high-privilege automation runtime than a normal chatbot. The reports repeatedly describe setup choices as the main driver of risk.",
  },
  {
    title: "What this prototype tests",
    body:
      "Whether guided decisions, visible tradeoffs, and a personalized final plan are the right way to teach the topic before any real deployment.",
  },
];

const feedbackChecklist = [
  "Did the flow ask the right setup questions, or did it miss the decisions you actually care about?",
  "Did the tradeoff framing feel concrete enough to change your judgment, or still too abstract?",
  "Did the final plan feel useful enough that you would keep it for a real setup later?",
];

const state = loadState();

const app = document.getElementById("app");
const summary = document.getElementById("summary");

render();

function loadState() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    return {
      stage: parsed.stage || "intro",
      currentQuestion: Number.isInteger(parsed.currentQuestion) ? parsed.currentQuestion : 0,
      answers: parsed.answers || {},
      knowledgeAnswer:
        Number.isInteger(parsed.knowledgeAnswer) ? parsed.knowledgeAnswer : null,
      knowledgeSubmitted: Boolean(parsed.knowledgeSubmitted),
    };
  } catch {
    return {
      stage: "intro",
      currentQuestion: 0,
      answers: {},
      knowledgeAnswer: null,
      knowledgeSubmitted: false,
    };
  }
}

function persistState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function render() {
  renderMain();
  renderSummary();
  persistState();
}

function renderMain() {
  if (state.stage === "intro") {
    renderIntro();
    return;
  }

  if (state.stage === "questions") {
    renderQuestion();
    return;
  }

  renderPlan();
}

function renderIntro() {
  app.innerHTML = `
    <div class="screen">
      <p class="section-label">Orientation</p>
      <h2>Start by assuming convenience is not the goal.</h2>
      <p>
        The product we want to build should help someone avoid the usual mistake:
        installing OpenClaw first and reasoning about the security consequences later.
        This prototype makes the learner choose what they want, then shows the cost.
      </p>
      <div class="summary-stack">
        ${introCards
          .map(
            (card) => `
              <article class="summary-card">
                <strong>${card.title}</strong>
                <span>${card.body}</span>
              </article>
            `,
          )
          .join("")}
      </div>
      <div class="callout">
        Strong default assumption: if OpenClaw touches your personal machine, browser state,
        or everyday accounts, a mistake stops being academic.
      </div>
      <div class="source-strip">
        <strong>Current evidence base</strong>
        <span>This prototype pulls its recommendations from the local reports in <code>input_reports/</code>.</span>
      </div>
      ${renderKnowledgeCheck()}
      <div class="button-row">
        <button class="button-primary" id="start-flow">Start the guided setup flow</button>
        <button class="button-secondary" id="jump-plan">Skip to current recommendation</button>
      </div>
    </div>
  `;

  document.getElementById("start-flow").addEventListener("click", () => {
    state.stage = "questions";
    render();
  });

  document.getElementById("jump-plan").addEventListener("click", () => {
    state.stage = "plan";
    render();
  });

  bindKnowledgeCheck();
}

function renderKnowledgeCheck() {
  const options = knowledgeCheck.options
    .map(
      (option, index) => `
        <button class="option-card ${state.knowledgeAnswer === index ? "selected" : ""}" data-check-index="${index}">
          <strong>${option}</strong>
        </button>
      `,
    )
    .join("");

  let feedback = "";
  if (state.knowledgeSubmitted) {
    const isCorrect = state.knowledgeAnswer === knowledgeCheck.answer;
    feedback = `
      <div class="feedback ${isCorrect ? "safe" : "warn"}">
        ${isCorrect ? "Correct." : "Not quite."} ${knowledgeCheck.explanation}
      </div>
    `;
  } else {
    feedback = `<div class="feedback"></div>`;
  }

  return `
    <section class="knowledge-check">
      <h3>Quick check</h3>
      <p>${knowledgeCheck.prompt}</p>
      <div class="grid">${options}</div>
      <div class="button-row">
        <button class="button-secondary" id="check-answer">Check answer</button>
      </div>
      ${feedback}
    </section>
  `;
}

function bindKnowledgeCheck() {
  app.querySelectorAll("[data-check-index]").forEach((button) => {
    button.addEventListener("click", () => {
      state.knowledgeAnswer = Number(button.getAttribute("data-check-index"));
      state.knowledgeSubmitted = false;
      render();
    });
  });

  document.getElementById("check-answer").addEventListener("click", () => {
    state.knowledgeSubmitted = true;
    render();
  });
}

function renderQuestion() {
  const question = questions[state.currentQuestion];
  const selected = state.answers[question.id];
  const progress = ((state.currentQuestion + 1) / questions.length) * 100;

  app.innerHTML = `
    <div class="screen">
      <div class="question-meta">
        <span>Decision ${state.currentQuestion + 1} of ${questions.length}</span>
        <span>${question.hint}</span>
      </div>
      <div class="progress"><span style="width: ${progress}%"></span></div>
      <p class="section-label">Guided Decision</p>
      <h2>${question.prompt}</h2>
      <div class="grid">
        ${question.options
          .map(
            (option) => `
              <button class="option-card ${selected === option.id ? "selected" : ""}" data-option-id="${option.id}">
                <strong>${option.title}</strong>
                <span>${option.description}</span>
              </button>
            `,
          )
          .join("")}
      </div>
      <div class="button-row">
        <button class="button-secondary" id="back-button" ${state.currentQuestion === 0 ? "disabled" : ""}>Back</button>
        <button class="button-primary" id="next-button" ${selected ? "" : "disabled"}>
          ${state.currentQuestion === questions.length - 1 ? "Build recommendation" : "Continue"}
        </button>
      </div>
    </div>
  `;

  app.querySelectorAll("[data-option-id]").forEach((button) => {
    button.addEventListener("click", () => {
      state.answers[question.id] = button.getAttribute("data-option-id");
      render();
    });
  });

  document.getElementById("back-button").addEventListener("click", () => {
    if (state.currentQuestion > 0) {
      state.currentQuestion -= 1;
      render();
    }
  });

  document.getElementById("next-button").addEventListener("click", () => {
    if (!selected) {
      return;
    }

    if (state.currentQuestion === questions.length - 1) {
      state.stage = "plan";
    } else {
      state.currentQuestion += 1;
    }

    render();
  });
}

function renderPlan() {
  const plan = buildPlan(state.answers);

  app.innerHTML = `
    <div class="screen">
      <p class="section-label">Recommendation</p>
      <h2>${plan.title}</h2>
      <p>${plan.summary}</p>
      <div class="risk-pill ${plan.riskLevel.toLowerCase()}">${plan.riskLabel}</div>

      <section class="plan-section">
        <h3>Recommended posture</h3>
        <div class="plan-stack">
          ${plan.recommendations
            .map(
              (item) => `
                <article class="plan-card">
                  <strong>${item.title}</strong>
                  <span>${item.body}</span>
                  ${renderCitations(item.citations)}
                </article>
              `,
            )
            .join("")}
        </div>
      </section>

      <section class="plan-section">
        <h3>Accepted tradeoffs</h3>
        <div class="plan-stack">
          ${plan.tradeoffs
            .map(
              (item) => `
                <article class="plan-card">
                  <strong>${item.title}</strong>
                  <span>${item.body}</span>
                </article>
              `,
            )
            .join("")}
        </div>
      </section>

      <section class="plan-section">
        <h3>Before you install anything</h3>
        <div class="plan-stack">
          <article class="plan-card">
            <strong>Use this prototype to decide whether your intended setup is acceptable at all</strong>
            <span>
              If the plan still depends on your main machine, broad skills, real personal accounts, or
              aggressive autonomy, the right next action is usually to redesign the setup rather than
              proceed with installation.
            </span>
          </article>
        </div>
      </section>

      <div class="button-row">
        <button class="button-primary" id="download-plan">Export Markdown plan</button>
        <button class="button-secondary" id="edit-answers">Edit answers</button>
        <button class="button-secondary" id="reset-flow">Reset prototype</button>
      </div>
    </div>
  `;

  document.getElementById("download-plan").addEventListener("click", () => {
    downloadPlan(plan);
  });

  document.getElementById("edit-answers").addEventListener("click", () => {
    state.stage = "questions";
    state.currentQuestion = 0;
    render();
  });

  document.getElementById("reset-flow").addEventListener("click", () => {
    state.stage = "intro";
    state.currentQuestion = 0;
    state.answers = {};
    state.knowledgeAnswer = null;
    state.knowledgeSubmitted = false;
    render();
  });
}

function renderSummary() {
  const answeredCount = Object.keys(state.answers).length;
  const plan = buildPlan(state.answers);
  const answerMarkup = questions
    .map((question) => {
      const selected = question.options.find((option) => option.id === state.answers[question.id]);
      return `
        <article class="summary-card">
          <h3>${question.prompt}</h3>
          <span>${selected ? selected.title : "Not answered yet"}</span>
        </article>
      `;
    })
    .join("");

  summary.innerHTML = `
    <p class="section-label">Live Snapshot</p>
    <h2 style="font-size: 2rem; margin: 0 0 8px;">Prototype Summary</h2>
    <p class="muted">
      ${answeredCount} of ${questions.length} decisions answered. The recommendation updates as your choices change.
    </p>
    <div class="summary-stack">
      <article class="summary-card">
        <strong>Current posture</strong>
        <span>${plan.summary}</span>
        <div class="risk-pill ${plan.riskLevel.toLowerCase()}">${plan.riskLabel}</div>
      </article>
      <article class="summary-card">
        <strong>What I need from your first test</strong>
        <ul class="summary-list">
          ${feedbackChecklist.map((item) => `<li>${item}</li>`).join("")}
        </ul>
      </article>
      ${answerMarkup}
    </div>
  `;
}

function buildPlan(answers) {
  const recommendations = [];
  const tradeoffs = [];
  let riskScore = 0;

  const host = answers.host;
  const browser = answers.browser;
  const skills = answers.skills;
  const channels = answers.channels;
  const agency = answers.agency;

  if (host === "main-pc") {
    riskScore += 4;
    recommendations.push({
      title: "Do not make your main personal machine the default deployment target",
      body:
        "If you want to learn OpenClaw safely, move the runtime into a dedicated VM, spare machine, or isolated cloud box before you optimize for convenience.",
      citations: citationMap.hostIsolation,
    });
    tradeoffs.push({
      title: "You lose convenience",
      body:
        "A dedicated environment adds setup friction and makes host-level automation less seamless, but it sharply reduces the consequence of a bad prompt, unsafe skill, or configuration mistake.",
    });
  } else if (host === "cloud-box") {
    riskScore += 2;
    recommendations.push({
      title: "Keep the cloud box isolated and private",
      body:
        "Use loopback-only bindings where possible, avoid public exposure, and treat the gateway like a privileged control plane rather than a casual remote utility.",
      citations: citationMap.hostIsolation,
    });
    tradeoffs.push({
      title: "You gain separation but inherit remote-access risk",
      body:
        "A cloud box is better than your main machine, but it shifts attention to network exposure, remote access patterns, and credential scope.",
    });
  } else if (host === "dedicated-vm") {
    recommendations.push({
      title: "A dedicated VM or spare machine is the best starting posture",
      body:
        "Keep it isolated from your daily environment, use dedicated accounts, and assume compromise is possible even when the setup looks careful.",
      citations: citationMap.hostIsolation,
    });
    tradeoffs.push({
      title: "Some local convenience disappears",
      body:
        "You will not get the same direct access to your personal browser sessions, files, and daily accounts, and that is the point.",
    });
  }

  if (browser === "read-only" || browser === "full-browser") {
    riskScore += browser === "full-browser" ? 3 : 1;
    recommendations.push({
      title: "Treat browser capability as a major attack-surface increase",
      body:
        "Keep browser actions sandboxed, avoid reusing your normal browser state, and restrict outbound access wherever possible.",
      citations: citationMap.browserRisk,
    });
    tradeoffs.push({
      title: "Safer browsing feels less capable",
      body:
        "Isolated browser workflows are slower and less convenient than using your real browser state, but they reduce prompt-injection and web-to-agent damage.",
    });
  } else {
    recommendations.push({
      title: "Skipping browser automation is a strong early safety choice",
      body:
        "This removes one of the biggest paths for prompt injection and web-originated compromise while you learn the rest of the system.",
      citations: citationMap.browserRisk,
    });
  }

  if (skills === "marketplace") {
    riskScore += 3;
    recommendations.push({
      title: "Do not trust marketplace skills by default",
      body:
        "If you need third-party skills, keep the allowlist small, review them manually, and treat every skill as untrusted code rather than a harmless extension.",
      citations: citationMap.skillRisk,
    });
    tradeoffs.push({
      title: "Curating skills slows you down",
      body:
        "Manual review and an allowlist reduce the convenience of a large skill ecosystem, but broad marketplace trust is one of the worst documented risks.",
    });
  } else if (skills === "reviewed") {
    riskScore += 1;
    recommendations.push({
      title: "Use a narrow reviewed allowlist",
      body:
        "Only enable a few skills that you have read and understood. Prefer less capability over a large plugin surface.",
      citations: citationMap.skillRisk,
    });
  } else {
    recommendations.push({
      title: "Staying skill-free is a defensible v1 learning posture",
      body:
        "It limits what the system can do, but it avoids a major source of supply-chain and instruction-manipulation risk.",
      citations: citationMap.skillRisk,
    });
  }

  if (channels === "broad") {
    riskScore += 2;
    recommendations.push({
      title: "Reduce inbound reach before you increase tool access",
      body:
        "Use allowlists or pairing, separate service accounts from personal accounts, and avoid broad message ingress while the environment is still immature.",
      citations: citationMap.channelRisk,
    });
    tradeoffs.push({
      title: "You limit autonomy across real channels",
      body:
        "Broad inbound messaging gives the agent more utility, but it also means more untrusted content can reach a privileged system continuously.",
    });
  } else if (channels === "paired") {
    riskScore += 1;
    recommendations.push({
      title: "Pair or allowlist channels and use dedicated accounts",
      body:
        "Limit who can reach the agent and do not connect it directly to high-value personal accounts at the start.",
      citations: citationMap.channelRisk,
    });
  } else {
    recommendations.push({
      title: "No inbound channels is the cleanest learning baseline",
      body:
        "This keeps the focus on hardening the runtime before adding messaging exposure.",
      citations: citationMap.channelRisk,
    });
  }

  if (agency === "aggressive") {
    riskScore += 2;
    recommendations.push({
      title: "Aggressive autonomy requires stronger boundaries than convenience-first setups provide",
      body:
        "If you want high autonomy, do it only after isolation, skill governance, channel restrictions, credential separation, and update discipline are already in place.",
      citations: citationMap.autonomyTradeoff,
    });
    tradeoffs.push({
      title: "Approval-heavy flows feel worse, but that friction is intentional",
      body:
        "Reducing human checkpoints makes the system more fluid and more dangerous. The reports consistently frame this as a core tradeoff, not a bug to wish away.",
    });
  } else if (agency === "balanced") {
    riskScore += 1;
    recommendations.push({
      title: "Keep autonomy scoped to low-risk areas first",
      body:
        "Let the agent help where errors are recoverable. Delay high-consequence actions until you trust your environment more than your curiosity.",
      citations: citationMap.autonomyTradeoff,
    });
  } else {
    recommendations.push({
      title: "Guarded mode is the right starting point",
      body:
        "Require approvals for consequential actions and use that friction to learn where the real risk sits in your setup.",
      citations: citationMap.autonomyTradeoff,
    });
  }

  recommendations.push({
    title: "Stay current and assume patch lag is a real risk",
    body:
      "Rapid change and frequent advisories mean running stale builds or drifting configs is itself part of the threat model.",
    citations: citationMap.updates,
  });

  const riskLevel = riskScore >= 8 ? "High" : riskScore >= 4 ? "Medium" : "Low";
  const title =
    riskLevel === "High"
      ? "Your current answers point to a convenience-first posture that needs correction"
      : riskLevel === "Medium"
        ? "Your current answers are workable, but only with disciplined controls"
        : "Your current answers align with a cautious learning-first posture";

  const summary =
    riskLevel === "High"
      ? "Right now the prototype would steer you away from a direct install path. Too many of your choices widen exposure before the hard boundaries are in place."
      : riskLevel === "Medium"
        ? "You are making some safer choices, but several capabilities still require tighter isolation and stricter guardrails than a casual setup normally gets."
        : "You are choosing boundaries before convenience, which is the right way to approach OpenClaw as a first-time deployer.";

  return {
    title,
    summary,
    riskLevel,
    riskLabel: `${riskLevel} exposure`,
    recommendations,
    tradeoffs,
  };
}

function renderCitations(citations) {
  return `
    <div class="citation-stack">
      ${citations
        .map((citationId) => {
          const source = sources[citationId];
          return `
            <article class="citation-card">
              <strong>${source.label}</strong>
              <span>${source.note}</span>
              <a class="citation-link" href="${source.href}" target="_blank" rel="noreferrer">Open source file</a>
            </article>
          `;
        })
        .join("")}
    </div>
  `;
}

function downloadPlan(plan) {
  const markdown = buildMarkdown(plan);
  const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "safe-openclaw-setup-plan.md";
  link.click();
  URL.revokeObjectURL(url);
}

function buildMarkdown(plan) {
  const answerLines = questions.map((question) => {
    const option = question.options.find((item) => item.id === state.answers[question.id]);
    return `- ${question.prompt}: ${option ? option.title : "Not answered"}`;
  });

  const recommendationLines = plan.recommendations.map((item) => {
    const sourceLabels = item.citations.map((citationId) => sources[citationId].label);
    return [
      `### ${item.title}`,
      "",
      item.body,
      "",
      `Sources: ${sourceLabels.join(", ")}`,
    ].join("\n");
  });

  const tradeoffLines = plan.tradeoffs.map((item) => {
    return [`### ${item.title}`, "", item.body].join("\n");
  });

  return [
    "# Safe OpenClaw Setup Plan",
    "",
    `Risk posture: ${plan.riskLabel}`,
    "",
    plan.summary,
    "",
    "## Your answers",
    ...answerLines,
    "",
    "## Recommended posture",
    ...recommendationLines,
    "",
    "## Accepted tradeoffs",
    ...(tradeoffLines.length ? tradeoffLines : ["- No explicit tradeoffs captured yet."]),
    "",
    "## Note",
    "This prototype uses the project reports as the current source of truth and is meant to validate the learning flow, not finalize production implementation.",
    "",
  ].join("\n");
}
