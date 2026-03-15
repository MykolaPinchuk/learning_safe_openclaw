import { describe, expect, it } from "vitest";
import { buildSetupPlan } from "./buildSetupPlan";

describe("buildSetupPlan", () => {
  it("returns low risk for the cautious path", () => {
    const plan = buildSetupPlan({
      host: "dedicated-vm",
      browser: "none",
      skills: "none",
      channels: "none",
      agency: "guarded",
    });

    expect(plan.riskLevel).toBe("low");
  });

  it("returns high risk for the convenience-first path", () => {
    const plan = buildSetupPlan({
      host: "main-pc",
      browser: "full-browser",
      skills: "marketplace",
      channels: "broad",
      agency: "aggressive",
    });

    expect(plan.riskLevel).toBe("high");
    expect(plan.recommendations.some((item) => item.id === "host-main-pc")).toBe(true);
  });
});
