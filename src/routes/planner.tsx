import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ArrowDown, ArrowUp, Loader2, Sparkles, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AiBadge } from "@/components/app/AiBadge";
import { AppShell } from "@/components/app/AppShell";
import { DisclaimerBanner } from "@/components/app/DisclaimerBanner";
import { PageHeader } from "@/components/app/PageHeader";
import { priorityStyles } from "@/components/app/priority";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { planTasks } from "@/lib/ai.functions";
import { newId, useWorkspace } from "@/lib/workspace-store";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner | AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Turn a task list into a prioritised daily or weekly schedule with durations, time slots and reasoning.",
      },
      { property: "og:title", content: "AI Task Planner" },
      {
        property: "og:description",
        content: "Prioritise tasks and build a realistic daily or weekly plan.",
      },
    ],
  }),
  component: PlannerPage,
});

function PlannerPage() {
  const run = useServerFn(planTasks);
  const { tasks, setTasks, toggleTask, updateTask, moveTask, removeTask, logActivity } =
    useWorkspace();

  const [input, setInput] = useState("");
  const [workingHours, setWorkingHours] = useState("08:30 - 17:00, lunch 13:00");
  const [mode, setMode] = useState<"Daily" | "Weekly">("Daily");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [assumptions, setAssumptions] = useState<string[]>([]);

  async function handlePlan() {
    if (!input.trim()) {
      toast.error("List at least one task");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const output = await run({ data: { tasks: input, workingHours, mode } });
      setTasks(
        output.plannedTasks.map((t) => ({
          id: newId(),
          title: t.title,
          priority: t.priority,
          estimatedDuration: t.estimatedDuration,
          suggestedSlot: t.suggestedSlot,
          reason: t.reason,
          completed: false,
        })),
      );
      setNotes(output.scheduleNotes);
      setAssumptions(output.assumptions);
      logActivity("Task Planner", `${mode} plan with ${output.plannedTasks.length} tasks`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell>
      <PageHeader
        title="AI Task Planner"
        description="Drop in your tasks and the assistant prioritises them into a realistic plan. Everything stays editable and reorderable."
      />

      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Your tasks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tasks">One task per line (add deadlines if you have them)</Label>
              <Textarea
                id="tasks"
                rows={8}
                placeholder={"Finish Q3 audit pack — due tomorrow 12:00\nReview intern onboarding doc\nPrep client demo for Friday"}
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hours">Available working hours</Label>
              <Input
                id="hours"
                value={workingHours}
                onChange={(e) => setWorkingHours(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Planning mode</Label>
              <Select value={mode} onValueChange={(v) => setMode(v as "Daily" | "Weekly")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Daily">Daily</SelectItem>
                  <SelectItem value="Weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handlePlan} disabled={loading} className="w-full">
              {loading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Sparkles className="size-4" />
              )}
              {loading ? "Planning…" : `Build ${mode.toLowerCase()} plan`}
            </Button>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </CardContent>
        </Card>

        <div className="space-y-4">
          {tasks.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <AiBadge label="AI-prioritised" />
              <span className="text-xs text-muted-foreground">
                {tasks.filter((t) => t.completed).length} of {tasks.length} complete
              </span>
            </div>
          )}

          {tasks.length === 0 && !loading && (
            <Card className="shadow-soft">
              <CardContent className="py-10 text-center text-sm text-muted-foreground">
                No plan yet. Add your tasks and generate a schedule.
              </CardContent>
            </Card>
          )}

          {loading &&
            tasks.length === 0 &&
            [0, 1, 2].map((i) => <div key={i} className="h-24 animate-pulse rounded-xl bg-muted" />)}

          {tasks.map((task) => (
            <Card key={task.id} className="shadow-soft">
              <CardContent className="flex flex-col gap-3 py-4 sm:flex-row sm:items-start">
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => toggleTask(task.id)}
                  aria-label="Mark task complete"
                  className="mt-1"
                />
                <div className="min-w-0 flex-1 space-y-2">
                  <Input
                    value={task.title}
                    onChange={(e) => updateTask(task.id, { title: e.target.value })}
                    className={task.completed ? "line-through opacity-60" : ""}
                  />
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <Badge className={priorityStyles[task.priority]}>{task.priority}</Badge>
                    <span className="text-muted-foreground">{task.estimatedDuration}</span>
                    <span className="text-muted-foreground">· {task.suggestedSlot}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{task.reason}</p>
                </div>
                <div className="flex gap-1 sm:flex-col">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Move up"
                    onClick={() => moveTask(task.id, -1)}
                  >
                    <ArrowUp className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Move down"
                    onClick={() => moveTask(task.id, 1)}
                  >
                    <ArrowDown className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Remove task"
                    onClick={() => removeTask(task.id)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {(notes || assumptions.length > 0) && (
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Schedule notes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {notes && <p className="text-muted-foreground">{notes}</p>}
                {assumptions.length > 0 && (
                  <div>
                    <p className="font-medium">Assumptions the AI made:</p>
                    <ul className="mt-1 list-disc space-y-1 pl-5 text-muted-foreground">
                      {assumptions.map((a) => (
                        <li key={a}>{a}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <DisclaimerBanner compact />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AppShell>
  );
}