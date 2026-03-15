import type { KnowledgeCheck } from "../../lib/types/content";

interface OrientationScreenProps {
  knowledgeCheck: KnowledgeCheck;
  knowledgeState: {
    selectedAnswerIndex: number | null;
    submitted: boolean;
  };
  onAnswerSelect: (answerIndex: number) => void;
  onSubmit: () => void;
  onStartFlow: () => void;
  onJumpToPlan: () => void;
}

export function OrientationScreen({
  knowledgeCheck,
  knowledgeState,
  onAnswerSelect,
  onSubmit,
  onStartFlow,
  onJumpToPlan,
}: OrientationScreenProps) {
  const isCorrect = knowledgeState.selectedAnswerIndex === knowledgeCheck.answerIndex;

  return (
    <div className="screen-stack">
      <p className="section-label">Orientation</p>
      <h2 className="screen-title">Start by assuming convenience is not the goal.</h2>
      <p className="body-copy">
        OpenClaw behaves more like a high-privilege automation runtime than a normal chatbot.
        The reports consistently show that deployment choices drive most of the risk.
      </p>

      <div className="callout">
        <strong>Default assumption</strong>
        <p>
          If OpenClaw touches your personal machine, browser sessions, or everyday accounts, a
          mistake stops being academic very quickly.
        </p>
      </div>

      <div className="info-card">
        <strong>Evidence base</strong>
        <span>
          This app’s guidance is derived from the local reports in <code>input_reports/</code>.
          It is meant to shape setup judgment before installation.
        </span>
      </div>

      <section className="quiz-card">
        <h3>Quick check</h3>
        <p className="body-copy">{knowledgeCheck.prompt}</p>
        <div className="choice-grid">
          {knowledgeCheck.options.map((option, index) => (
            <button
              className={`choice-card ${
                knowledgeState.selectedAnswerIndex === index ? "selected" : ""
              }`}
              key={option}
              onClick={() => onAnswerSelect(index)}
              type="button"
            >
              <strong>{option}</strong>
            </button>
          ))}
        </div>
        <div className="button-row">
          <button className="button-secondary" onClick={onSubmit} type="button">
            Check answer
          </button>
        </div>
        <div className={`feedback ${knowledgeState.submitted ? (isCorrect ? "safe" : "warn") : ""}`}>
          {knowledgeState.submitted
            ? `${isCorrect ? "Correct." : "Not quite."} ${knowledgeCheck.explanation}`
            : ""}
        </div>
      </section>

      <div className="button-row">
        <button className="button-primary" onClick={onStartFlow} type="button">
          Start guided setup flow
        </button>
        <button className="button-secondary" onClick={onJumpToPlan} type="button">
          Skip to current recommendation
        </button>
      </div>
    </div>
  );
}
