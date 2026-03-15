import type { DecisionQuestion } from "../../lib/types/content";

interface QuestionFlowProps {
  question: DecisionQuestion;
  questionIndex: number;
  totalQuestions: number;
  selectedAnswer?: string;
  onAnswerSelect: (questionId: DecisionQuestion["id"], optionId: string) => void;
  onBack: () => void;
  onNext: () => void;
}

export function QuestionFlow({
  question,
  questionIndex,
  totalQuestions,
  selectedAnswer,
  onAnswerSelect,
  onBack,
  onNext,
}: QuestionFlowProps) {
  const progress = ((questionIndex + 1) / totalQuestions) * 100;

  return (
    <div className="screen-stack">
      <div className="question-meta">
        <span>
          Decision {questionIndex + 1} of {totalQuestions}
        </span>
        <span>{question.hint}</span>
      </div>
      <div aria-hidden="true" className="progress-track">
        <span className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
      <p className="section-label">Guided Decision</p>
      <h2 className="screen-title">{question.prompt}</h2>

      <div className="choice-grid">
        {question.options.map((option) => (
          <button
            className={`choice-card ${selectedAnswer === option.id ? "selected" : ""}`}
            key={option.id}
            onClick={() => onAnswerSelect(question.id, option.id)}
            type="button"
          >
            <strong>{option.title}</strong>
            <span>{option.description}</span>
          </button>
        ))}
      </div>

      <div className="button-row">
        <button
          className="button-secondary"
          disabled={questionIndex === 0}
          onClick={onBack}
          type="button"
        >
          Back
        </button>
        <button
          className="button-primary"
          disabled={!selectedAnswer}
          onClick={onNext}
          type="button"
        >
          {questionIndex === totalQuestions - 1 ? "Build recommendation" : "Continue"}
        </button>
      </div>
    </div>
  );
}
