import type { UserAnswers } from "../types/content";

export const SESSION_STORAGE_KEY = "safe-openclaw:v1:session";

export interface SessionState {
  stage: "intro" | "questions" | "plan";
  currentQuestionIndex: number;
  answers: UserAnswers;
  knowledgeCheck: {
    selectedAnswerIndex: number | null;
    submitted: boolean;
  };
}

export function createInitialSessionState(): SessionState {
  return {
    stage: "intro",
    currentQuestionIndex: 0,
    answers: {},
    knowledgeCheck: {
      selectedAnswerIndex: null,
      submitted: false,
    },
  };
}

function isValidStage(value: unknown): value is SessionState["stage"] {
  return value === "intro" || value === "questions" || value === "plan";
}

export function loadSessionState(): SessionState {
  if (typeof window === "undefined") {
    return createInitialSessionState();
  }

  try {
    const raw = window.localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) {
      return createInitialSessionState();
    }

    const parsed = JSON.parse(raw) as Partial<SessionState>;
    if (!isValidStage(parsed.stage)) {
      return createInitialSessionState();
    }

    return {
      stage: parsed.stage,
      currentQuestionIndex:
        typeof parsed.currentQuestionIndex === "number" && parsed.currentQuestionIndex >= 0
          ? parsed.currentQuestionIndex
          : 0,
      answers: typeof parsed.answers === "object" && parsed.answers ? parsed.answers : {},
      knowledgeCheck: {
        selectedAnswerIndex:
          typeof parsed.knowledgeCheck?.selectedAnswerIndex === "number"
            ? parsed.knowledgeCheck.selectedAnswerIndex
            : null,
        submitted: Boolean(parsed.knowledgeCheck?.submitted),
      },
    };
  } catch {
    return createInitialSessionState();
  }
}

export function saveSessionState(state: SessionState) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(state));
}
