import { useEffect, useState } from "react";
import { OrientationScreen } from "./features/orientation/OrientationScreen";
import { QuestionFlow } from "./features/questions/QuestionFlow";
import { PlanScreen } from "./features/plan/PlanScreen";
import { SummaryPanel } from "./components/SummaryPanel";
import { questions } from "./content/questions";
import { knowledgeCheck } from "./content/knowledge-checks";
import { buildSetupPlan } from "./lib/recommendation-engine/buildSetupPlan";
import {
  createInitialSessionState,
  loadSessionState,
  saveSessionState,
  type SessionState,
} from "./lib/storage/sessionStorage";

export default function App() {
  const [session, setSession] = useState<SessionState>(() => loadSessionState());

  useEffect(() => {
    saveSessionState(session);
  }, [session]);

  const plan = buildSetupPlan(session.answers);

  function updateSession(next: SessionState) {
    setSession(next);
  }

  function startFlow() {
    updateSession({ ...session, stage: "questions" });
  }

  function jumpToPlan() {
    updateSession({ ...session, stage: "plan" });
  }

  function updateKnowledgeAnswer(answerIndex: number) {
    updateSession({
      ...session,
      knowledgeCheck: {
        ...session.knowledgeCheck,
        selectedAnswerIndex: answerIndex,
        submitted: false,
      },
    });
  }

  function submitKnowledgeCheck() {
    updateSession({
      ...session,
      knowledgeCheck: {
        ...session.knowledgeCheck,
        submitted: true,
      },
    });
  }

  function selectAnswer(questionId: keyof SessionState["answers"], optionId: string) {
    updateSession({
      ...session,
      answers: {
        ...session.answers,
        [questionId]: optionId,
      },
    });
  }

  function goBack() {
    updateSession({
      ...session,
      currentQuestionIndex: Math.max(0, session.currentQuestionIndex - 1),
    });
  }

  function goForward() {
    if (session.currentQuestionIndex >= questions.length - 1) {
      updateSession({ ...session, stage: "plan" });
      return;
    }

    updateSession({
      ...session,
      currentQuestionIndex: session.currentQuestionIndex + 1,
    });
  }

  function editAnswers() {
    updateSession({
      ...session,
      stage: "questions",
      currentQuestionIndex: 0,
    });
  }

  function resetSession() {
    setSession(createInitialSessionState());
  }

  return (
    <div className="app-shell">
      <header className="hero">
        <p className="eyebrow">Pre-Install Safety Training</p>
        <h1>Set up OpenClaw like compromise is possible.</h1>
        <p className="lede">
          Learn the hard boundaries first, then decide whether your intended deployment
          is acceptable before you install anything.
        </p>
      </header>

      <main className="app-layout">
        <section className="panel panel-main">
          {session.stage === "intro" ? (
            <OrientationScreen
              knowledgeCheck={knowledgeCheck}
              knowledgeState={session.knowledgeCheck}
              onAnswerSelect={updateKnowledgeAnswer}
              onSubmit={submitKnowledgeCheck}
              onStartFlow={startFlow}
              onJumpToPlan={jumpToPlan}
            />
          ) : null}

          {session.stage === "questions" ? (
            <QuestionFlow
              question={questions[session.currentQuestionIndex]}
              questionIndex={session.currentQuestionIndex}
              totalQuestions={questions.length}
              selectedAnswer={session.answers[questions[session.currentQuestionIndex].id]}
              onAnswerSelect={selectAnswer}
              onBack={goBack}
              onNext={goForward}
            />
          ) : null}

          {session.stage === "plan" ? (
            <PlanScreen
              plan={plan}
              answers={session.answers}
              questions={questions}
              onEditAnswers={editAnswers}
              onReset={resetSession}
            />
          ) : null}
        </section>

        <aside className="panel panel-side">
          <SummaryPanel
            session={session}
            plan={plan}
            questions={questions}
            requiresTestingFeedback={session.stage !== "plan"}
          />
        </aside>
      </main>
    </div>
  );
}
