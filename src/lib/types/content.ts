export type SourceId =
  | "anthropic-1"
  | "anthropic-2"
  | "openai-1"
  | "openai-2"
  | "gemini";

export interface SourceDoc {
  id: SourceId;
  label: string;
  path: string;
  note: string;
}

export interface CitationRef {
  sourceId: SourceId;
}

export interface DecisionOption {
  id: string;
  title: string;
  description: string;
}

export interface DecisionQuestion {
  id: "host" | "browser" | "skills" | "channels" | "agency";
  prompt: string;
  hint: string;
  options: DecisionOption[];
}

export interface KnowledgeCheck {
  id: string;
  prompt: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export interface RecommendationItem {
  id: string;
  title: string;
  body: string;
  citations: CitationRef[];
}

export interface TradeoffItem {
  id: string;
  title: string;
  body: string;
}

export interface UserAnswers {
  host?: string;
  browser?: string;
  skills?: string;
  channels?: string;
  agency?: string;
}

export interface SetupPlan {
  title: string;
  summary: string;
  riskLevel: "low" | "medium" | "high";
  recommendations: RecommendationItem[];
  tradeoffs: TradeoffItem[];
}
