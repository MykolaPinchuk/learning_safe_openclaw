import { describe, expect, it } from "vitest";
import {
  SESSION_STORAGE_KEY,
  createInitialSessionState,
  loadSessionState,
  saveSessionState,
} from "./sessionStorage";

describe("sessionStorage", () => {
  it("falls back to a fresh session on malformed data", () => {
    window.localStorage.setItem(SESSION_STORAGE_KEY, "{broken");

    expect(loadSessionState()).toEqual(createInitialSessionState());
  });

  it("saves and loads valid state", () => {
    const session = {
      stage: "questions" as const,
      currentQuestionIndex: 2,
      answers: { host: "cloud-box" },
      knowledgeCheck: {
        selectedAnswerIndex: 1,
        submitted: true,
      },
    };

    saveSessionState(session);

    expect(loadSessionState()).toEqual(session);
  });
});
