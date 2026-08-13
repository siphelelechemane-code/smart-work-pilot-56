import { z } from "zod";

export const emailInput = z.object({
  purpose: z.string().min(1),
  recipient: z.string(),
  keyPoints: z.string(),
  tone: z.enum(["Formal", "Friendly", "Persuasive"]),
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