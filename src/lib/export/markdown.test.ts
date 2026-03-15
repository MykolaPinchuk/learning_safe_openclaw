import { describe, expect, it } from "vitest";
import { questions } from "../../content/questions";
import { buildSetupPlan } from "../recommendation-engine/buildSetupPlan";
import { buildMarkdownPlan } from "./markdown";

describe("buildMarkdownPlan", () => {
  it("includes answers, risk posture, and source labels", () => {
    const answers = {
      host: "main-pc",
      browser: "full-browser",
      skills: "marketplace",
      channels: "broad",
      agency: "aggressive",
    } as const;

    const markdown = buildMarkdownPlan(buildSetupPlan(answers), answers, questions);

    expect(markdown).toContain("Risk posture: high");
    expect(markdown).toContain("Where are you thinking of running OpenClaw?");
    expect(markdown).toContain("Anthropic report 1");
  });
});
