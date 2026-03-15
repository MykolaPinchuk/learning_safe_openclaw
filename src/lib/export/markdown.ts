import { sources } from "../../content/sources";
import type { DecisionQuestion, SetupPlan, UserAnswers } from "../types/content";

export const PLAN_EXPORT_FILENAME = "safe-openclaw-setup-plan.md";

export function buildMarkdownPlan(
  plan: SetupPlan,
  answers: UserAnswers,
  questions: DecisionQuestion[],
): string {
  const answerLines = questions.map((question) => {
    const selected = question.options.find((option) => option.id === answers[question.id]);
    return `- ${question.prompt}: ${selected ? selected.title : "Not answered"}`;
  });

  const recommendationLines = plan.recommendations.map((item) => {
    const sourceLabels = item.citations
      .map((citation) => sources[citation.sourceId].label)
      .join(", ");

    return [`### ${item.title}`, "", item.body, "", `Sources: ${sourceLabels}`].join("\n");
  });

  const tradeoffLines = plan.tradeoffs.length
    ? plan.tradeoffs.map((item) => [`### ${item.title}`, "", item.body].join("\n"))
    : ["- No explicit tradeoffs captured for this answer set."];

  return [
    "# Safe OpenClaw Setup Plan",
    "",
    `Risk posture: ${plan.riskLevel}`,
    "",
    plan.title,
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
    ...tradeoffLines,
    "",
    "## Note",
    "This app provides pre-install guidance only. It does not validate a live OpenClaw configuration.",
    "",
  ].join("\n");
}

export function downloadMarkdownPlan(
  plan: SetupPlan,
  answers: UserAnswers,
  questions: DecisionQuestion[],
) {
  const markdown = buildMarkdownPlan(plan, answers, questions);
  const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = PLAN_EXPORT_FILENAME;
  link.click();
  URL.revokeObjectURL(url);
}
