import { SourceCard } from "../../components/SourceCard";
import { RiskBadge } from "../../components/RiskBadge";
import { downloadMarkdownPlan } from "../../lib/export/markdown";
import type { DecisionQuestion, SetupPlan, UserAnswers } from "../../lib/types/content";

interface PlanScreenProps {
  plan: SetupPlan;
  answers: UserAnswers;
  questions: DecisionQuestion[];
  onEditAnswers: () => void;
  onReset: () => void;
}

export function PlanScreen({
  plan,
  answers,
  questions,
  onEditAnswers,
  onReset,
}: PlanScreenProps) {
  return (
    <div className="screen-stack">
      <p className="section-label">Recommendation</p>
      <h2 className="screen-title">{plan.title}</h2>
      <p className="body-copy">{plan.summary}</p>
      <RiskBadge riskLevel={plan.riskLevel} />

      <section className="section-stack">
        <h3>Recommended posture</h3>
        <div className="card-stack">
          {plan.recommendations.map((item) => (
            <article className="plan-card" key={item.id}>
              <strong>{item.title}</strong>
              <p>{item.body}</p>
              <div className="source-grid">
                {item.citations.map((citation) => (
                  <SourceCard citation={citation} key={`${item.id}-${citation.sourceId}`} />
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section-stack">
        <h3>Accepted tradeoffs</h3>
        <div className="card-stack">
          {plan.tradeoffs.length ? (
            plan.tradeoffs.map((item) => (
              <article className="plan-card" key={item.id}>
                <strong>{item.title}</strong>
                <p>{item.body}</p>
              </article>
            ))
          ) : (
            <article className="plan-card">
              <strong>No explicit tradeoffs captured</strong>
              <p>Your current answer set stays close to the conservative baseline.</p>
            </article>
          )}
        </div>
      </section>

      <section className="section-stack">
        <h3>Before you install anything</h3>
        <article className="plan-card">
          <strong>Use this result to decide whether the setup is acceptable at all</strong>
          <p>
            If your plan still depends on a main personal machine, broad skills, real personal
            accounts, or aggressive autonomy, the next step is usually to redesign the setup
            rather than proceed with installation.
          </p>
        </article>
      </section>

      <div className="button-row">
        <button
          className="button-primary"
          onClick={() => downloadMarkdownPlan(plan, answers, questions)}
          type="button"
        >
          Export Markdown plan
        </button>
        <button className="button-secondary" onClick={onEditAnswers} type="button">
          Edit answers
        </button>
        <button className="button-secondary" onClick={onReset} type="button">
          Reset session
        </button>
      </div>
    </div>
  );
}
