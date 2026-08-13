import { createServerFn } from "@tanstack/react-start";

import {
  emailInput,
  emailOutput,
  meetingInput,
  meetingOutput,
  plannerInput,
  plannerOutput,
  researchInput,
  researchOutput,
} from "./ai-schemas";

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => emailInput.parse(input))
  .handler(async ({ data }) => {
    const { runStructured } = await import("./ai-runner.server");
    return runStructured({
      schema: emailOutput,
      schemaName: "EmailDraft",
      system: `You are a professional workplace communication assistant. Write a clear, concise email using ONLY the information the user supplies. Match the requested tone exactly (Formal = respectful and businesslike; Friendly = warm and approachable; Persuasive = confident with a clear call to action). Respect the requested length (Short ~80 words, Medium ~150 words, Detailed ~280 words). Preserve every key point the user provided. Return the subject line and body separately, and list anything the user should fill in themselves in missingInformation (empty list if nothing is missing). Never use placeholder facts, invented dates or fabricated names.`,
      prompt: `Tone: ${data.tone}\nLength: ${data.length}\nRecipient / context: ${data.recipient || "not provided"}\nPurpose: ${data.purpose}\nKey points to include:\n${data.keyPoints || "not provided"}`,
    });
  });

export const summarizeMeeting = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => meetingInput.parse(input))
  .handler(async ({ data }) => {
    const { runStructured } = await import("./ai-runner.server");
    return runStructured({
      schema: meetingOutput,
      schemaName: "MeetingSummary",
      system: `You are a workplace meeting-analysis assistant. Analyse the supplied notes and extract only information the notes support. Produce an executive summary, key decisions, action items (task, owner, deadline) and open questions. When an owner or deadline is not stated in the notes, set that field to exactly "Not specified". List every important element the notes did not provide in notProvided. Never invent owners, deadlines, numbers or outcomes.`,
      prompt: `Meeting notes:\n${data.notes}`,
    });
  });

export const planTasks = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => plannerInput.parse(input))
  .handler(async ({ data }) => {
    const { runStructured } = await import("./ai-runner.server");
    return runStructured({
      schema: plannerOutput,
      schemaName: "TaskPlan",
      system: `You are a workplace planning assistant. Prioritise the user's tasks using Urgent, High, Medium and Low, based only on the deadlines and context provided. For each task give an estimated duration, a suggested time slot that fits the stated working hours and planning mode, and a short reason for its priority. Keep the schedule realistic and do not exceed the available hours. Record any assumption you had to make in assumptions. Never invent deadlines or tasks the user did not list.`,
      prompt: `Planning mode: ${data.mode}\nAvailable working hours: ${data.workingHours || "not provided"}\nTasks (one per line, deadlines where given):\n${data.tasks}`,
    });
  });

export const researchTopic = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => researchInput.parse(input))
  .handler(async ({ data }) => {
    const { runStructured } = await import("./ai-runner.server");
    return runStructured({
      schema: researchOutput,
      schemaName: "ResearchBrief",
      system: `You are a workplace research assistant. Produce an executive summary, key findings, insights, recommendations and follow-up questions. When source text is supplied, base findings on it and clearly mark anything that is your own inference rather than a statement from the source. When no source text is supplied, treat your answer as general background the user must verify. Use confidenceNote to state how reliable the analysis is and what should be verified. You have no web access, so never cite specific sources, statistics or studies you cannot support.`,
      prompt: `Research topic or question: ${data.topic}\n\nSource text provided by user:\n${data.sourceText || "none provided"}`,
    });
  });