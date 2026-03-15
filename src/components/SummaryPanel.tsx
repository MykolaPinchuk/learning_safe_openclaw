import type { DecisionQuestion, SetupPlan } from "../lib/types/content";
import type { SessionState } from "../lib/storage/sessionStorage";
import { RiskBadge } from "./RiskBadge";

interface SummaryPanelProps {
  session: SessionState;
  plan: SetupPlan;
  questions: DecisionQuestion[];
  requiresTestingFeedback: boolean;
}

const feedbackChecklist = [
  "Did the question order match how you naturally think about deployment risk?",
  "Were the tradeoffs concrete enough to change your judgment?",
  "Would you keep the final plan for a real setup later?",
];

export function SummaryPanel({
  session,
  plan,
  questions,
  requiresTestingFeedback,
}: SummaryPanelProps) {
  return (
    <div>
      <p className="section-label">Live Snapshot</p>
      <h2 className="side-title">Current posture</h2>
      <p className="side-copy">{plan.summary}</p>
      <RiskBadge riskLevel={plan.riskLevel} />

      <div className="card-stack">
        {requiresTestingFeedback ? (
          <article className="info-card">
            <strong>What to evaluate as you go</strong>
            <ul className="simple-list">
              {feedbackChecklist.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ) : null}

        {questions.map((question) => {
          const selected = question.options.find(
            (option) => option.id === session.answers[question.id],
          );

          return (
            <article className="info-card" key={question.id}>
              <strong>{question.prompt}</strong>
              <span>{selected ? selected.title : "Not answered yet"}</span>
            </article>
          );
        })}
      </div>
    </div>
  );
}
