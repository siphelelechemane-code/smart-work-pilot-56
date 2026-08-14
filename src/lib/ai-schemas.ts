import { z } from "zod";

export const emailInput = z.object({
  purpose: z.string().min(1),
  recipient: z.string(),
  keyPoints: z.string(),
  template: z.string(),
  tone: z.enum(["Formal", "Friendly", "Persuasive", "Professional", "Urgent"]),
  length: z.enum(["Short", "Medium", "Detailed"]),
});
export type EmailInput = z.infer<typeof emailInput>;

export const emailOutput = z.object({
  subject: z.string(),
  body: z.string(),
  missingInformation: z.array(z.string()),
});
export type EmailOutput = z.infer<typeof emailOutput>;

export const meetingInput = z.object({ notes: z.string().min(1) });

export const meetingOutput = z.object({
  summary: z.string(),
  decisions: z.array(z.string()),
  actionItems: z.array(
    z.object({
      task: z.string(),
      owner: z.string(),
      deadline: z.string(),
    }),
  ),
  openQuestions: z.array(z.string()),
  notProvided: z.array(z.string()),
});
export type MeetingOutput = z.infer<typeof meetingOutput>;

export const plannerInput = z.object({
  tasks: z.string().min(1),
  workingHours: z.string(),
  mode: z.enum(["Daily", "Weekly"]),
});

export const plannerOutput = z.object({
  plannedTasks: z.array(
    z.object({
      title: z.string(),
      priority: z.enum(["Urgent", "High", "Medium", "Low"]),
      estimatedDuration: z.string(),
      suggestedSlot: z.string(),
      reason: z.string(),
    }),
  ),
  scheduleNotes: z.string(),
  assumptions: z.array(z.string()),
});
export type PlannerOutput = z.infer<typeof plannerOutput>;

export const researchInput = z.object({
  topic: z.string().min(1),
  sourceText: z.string(),
  mode: z.enum(["General", "N6"]),
});

export const researchOutput = z.object({
  executiveSummary: z.string(),
  keyFindings: z.array(z.string()),
  insights: z.array(z.string()),
  recommendations: z.array(z.string()),
  followUpQuestions: z.array(z.string()),
  confidenceNote: z.string(),
});
export type ResearchOutput = z.infer<typeof researchOutput>;

export const studyInput = z.object({
  module: z.string().min(1),
  topic: z.string().min(1),
  depth: z.enum(["Quick", "N6", "Detailed"]),
});

export const studyOutput = z.object({
  explanation: z.string(),
  keyConcepts: z.array(z.string()),
  terminology: z.array(z.object({ term: z.string(), meaning: z.string() })),
  formulae: z.array(z.string()),
  workedExample: z.string(),
  commonMistakes: z.array(z.string()),
  practiceQuestions: z.array(z.string()),
  flashcards: z.array(z.object({ front: z.string(), back: z.string() })),
  verificationNote: z.string(),
});
export type StudyOutput = z.infer<typeof studyOutput>;

export const pastPaperInput = z.object({
  question: z.string().min(1),
  module: z.string(),
});

export const pastPaperOutput = z.object({
  breakdown: z.string(),
  requiredKnowledge: z.array(z.string()),
  steps: z.array(z.string()),
  finalAnswer: z.string(),
  whyItWorks: z.string(),
  similarQuestion: z.string(),
  assumptions: z.array(z.string()),
  verificationNote: z.string(),
});
export type PastPaperOutput = z.infer<typeof pastPaperOutput>;