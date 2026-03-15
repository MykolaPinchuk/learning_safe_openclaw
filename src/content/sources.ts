import type { SourceDoc } from "../lib/types/content";

export const sources: Record<string, SourceDoc> = {
  "anthropic-1": {
    id: "anthropic-1",
    label: "Anthropic report 1",
    path: "input_reports/anthropic_report1.md",
    note: "Treats isolation, skill distrust, and credential hygiene as the starting controls.",
  },
  "anthropic-2": {
    id: "anthropic-2",
    label: "Anthropic report 2",
    path: "input_reports/anthropic_report2.md",
    note: "Frames the core problem as a security-versus-capability tradeoff rather than a simple checklist.",
  },
  "openai-1": {
    id: "openai-1",
    label: "OpenAI report 1",
    path: "input_reports/openai_report1.pdf",
    note: "Highlights browser-to-agent attacks, loopback trust problems, and the need to treat the gateway as a privileged control plane.",
  },
  "openai-2": {
    id: "openai-2",
    label: "OpenAI report 2",
    path: "input_reports/openai_report2.pdf",
    note: "Emphasizes safe usage patterns, channel controls, and conservative deployment posture before installation.",
  },
  gemini: {
    id: "gemini",
    label: "Gemini report",
    path: "input_reports/gemini_openclaw_report.md",
    note: "Covers architecture, deployment risks, and the dangers around skills, channels, memory, and elevated access.",
  },
};
