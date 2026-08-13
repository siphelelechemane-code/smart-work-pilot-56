import type { Priority } from "@/lib/workspace-store";

export const priorityStyles: Record<Priority, string> = {
  Urgent: "bg-destructive text-destructive-foreground",
  High: "bg-accent text-accent-foreground",
  Medium: "bg-secondary text-secondary-foreground",
  Low: "bg-muted text-muted-foreground",
};