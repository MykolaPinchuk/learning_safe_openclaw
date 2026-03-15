import { sources } from "../content/sources";
import type { CitationRef } from "../lib/types/content";

interface SourceCardProps {
  citation: CitationRef;
}

export function SourceCard({ citation }: SourceCardProps) {
  const source = sources[citation.sourceId];

  return (
    <article className="source-card">
      <strong>{source.label}</strong>
      <p>{source.note}</p>
      <span className="source-path">{source.path}</span>
    </article>
  );
}
