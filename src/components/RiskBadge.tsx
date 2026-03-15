interface RiskBadgeProps {
  riskLevel: "low" | "medium" | "high";
}

export function RiskBadge({ riskLevel }: RiskBadgeProps) {
  const label = `${riskLevel} exposure`;

  return <div className={`risk-badge risk-${riskLevel}`}>{label}</div>;
}
