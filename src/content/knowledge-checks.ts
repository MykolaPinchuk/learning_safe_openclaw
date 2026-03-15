import type { KnowledgeCheck } from "../lib/types/content";

export const knowledgeCheck: KnowledgeCheck = {
  id: "isolation-boundary",
  prompt: "Which choice most reduces the blast radius before any other hardening step?",
  options: [
    "Using a frontier model instead of a smaller model",
    "Running on a dedicated VM or spare machine",
    "Installing only highly rated marketplace skills",
  ],
  answerIndex: 1,
  explanation:
    "Isolation changes the consequence of failure. Model choice and skill quality matter, but separating the runtime from your main machine is the bigger boundary.",
};
