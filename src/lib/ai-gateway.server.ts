import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

export const AI_MODEL = "google/gemini-3.6-flash";

export function getGateway() {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new Error("Missing LOVABLE_API_KEY");

  return createOpenAICompatible({
    name: "lovable",
    baseURL: "https://ai.gateway.lovable.dev/v1",
    supportsStructuredOutputs: true,
    headers: {
      "Lovable-API-Key": apiKey,
      "X-Lovable-AIG-SDK": "vercel-ai-sdk",
    },
  });
}

export function getModel() {
  return getGateway()(AI_MODEL);
}

export const RESPONSIBLE_AI_RULES = `
Responsible AI rules you must always follow:
- Never invent facts, names, dates, numbers, owners or commitments that the user did not provide.
- When required information is missing, say so explicitly instead of guessing.
- Clearly separate what the source material states from your own inference.
- Never present uncertain information as verified fact.
- Encourage human review for anything consequential.
`.trim();

export function describeAiError(error: unknown): { message: string; status?: number | undefined } {
  const anyErr = error as { statusCode?: number; status?: number; message?: string } | undefined;
  const status = anyErr?.statusCode ?? anyErr?.status;
  if (status === 429) {
    return { message: "AI rate limit reached. Please wait a moment and try again.", status };
  }
  if (status === 402) {
    return { message: "AI credits exhausted. Add credits to continue using AI features.", status };
  }
  return { message: anyErr?.message || "The AI request failed. Please try again.", status };
}