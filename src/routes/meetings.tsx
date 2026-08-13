import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, RefreshCw, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AiBadge } from "@/components/app/AiBadge";
import { AppShell } from "@/components/app/AppShell";
import { CopyButton } from "@/components/app/CopyButton";
import { DisclaimerBanner } from "@/components/app/DisclaimerBanner";
import { EditableList } from "@/components/app/EditableList";
import { PageHeader } from "@/components/app/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { MeetingOutput } from "@/lib/ai-schemas";
import { summarizeMeeting } from "@/lib/ai.functions";
import { useWorkspace } from "@/lib/workspace-store";

export const Route = createFileRoute("/meetings")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer | AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Turn long meeting notes into a summary, decisions, action items with owners and deadlines, and open questions.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer" },
      {
        property: "og:description",
        content: "Extract decisions, action items and deadlines from your meeting notes.",
      },
    ],
  }),
  component: MeetingsPage,
});

function MeetingsPage() {
  const run = useServerFn(summarizeMeeting);
  const { logActivity } = useWorkspace();

  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<MeetingOutput | null>(null);

  async function handleSummarize() {
    if (notes.trim().length < 20) {
      toast.error("Paste your meeting notes first");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const output = await run({ data: { notes } });
      setResult(output);
      logActivity("Meeting Summarizer", `${output.actionItems.length} action items extracted`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const plainText = result
    ? [
        `Summary\n${result.summary}`,
        `Decisions\n${result.decisions.map((d) => `- ${d}`).join("\n")}`,
        `Action items\n${result.actionItems
          .map((a) => `- ${a.task} (Owner: ${a.owner}; Deadline: ${a.deadline})`)
          .join("\n")}`,
        `Open questions\n${result.openQuestions.map((q) => `- ${q}`).join("\n")}`,
      ].join("\n\n")
    : "";

  return (
    <AppShell>
      <PageHeader
        title="Meeting Notes Summarizer"
        description="Paste raw notes and get a structured, editable breakdown. Missing owners and deadlines are labelled rather than guessed."
      />

      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Meeting notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            rows={10}
            placeholder="Paste the full meeting notes or transcript here…"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleSummarize} disabled={loading}>
              {loading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Sparkles className="size-4" />
              )}
              {loading ? "Analysing…" : "Summarise notes"}
            </Button>
            {result && (
              <Button variant="outline" onClick={handleSummarize} disabled={loading}>
                <RefreshCw className="size-4" />
                Regenerate
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {error && (
        <p className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </p>
      )}

      {loading && !result && (
        <div className="grid gap-4 md:grid-cols-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-40 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      )}

      {result && (
        <>
          <div className="flex flex-wrap items-center gap-2">
            <AiBadge />
            <CopyButton value={plainText} label="Copy all" />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Executive summary</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  rows={6}
                  value={result.summary}
                  onChange={(e) => setResult({ ...result, summary: e.target.value })}
                />
              </CardContent>
            </Card>

            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Key decisions</CardTitle>
              </CardHeader>
              <CardContent>
                <EditableList
                  items={result.decisions}
                  onChange={(decisions) => setResult({ ...result, decisions })}
                  emptyLabel="No decisions were recorded in these notes."
                  addLabel="Add decision"
                />
              </CardContent>
            </Card>

            <Card className="shadow-soft md:col-span-2">
              <CardHeader>
                <CardTitle>Action items</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {result.actionItems.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No action items were found in these notes.
                  </p>
                )}
                {result.actionItems.map((item, index) => (
                  <div
                    key={index}
                    className="grid gap-3 rounded-lg border border-border p-3 sm:grid-cols-[1fr_auto_auto]"
                  >
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Task</Label>
                      <Input
                        value={item.task}
                        onChange={(e) => {
                          const actionItems = [...result.actionItems];
                          actionItems[index] = { ...item, task: e.target.value };
                          setResult({ ...result, actionItems });
                        }}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Owner</Label>
                      <Input
                        value={item.owner}
                        onChange={(e) => {
                          const actionItems = [...result.actionItems];
                          actionItems[index] = { ...item, owner: e.target.value };
                          setResult({ ...result, actionItems });
                        }}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Deadline</Label>
                      <Input
                        value={item.deadline}
                        onChange={(e) => {
                          const actionItems = [...result.actionItems];
                          actionItems[index] = { ...item, deadline: e.target.value };
                          setResult({ ...result, actionItems });
                        }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Open questions</CardTitle>
              </CardHeader>
              <CardContent>
                <EditableList
                  items={result.openQuestions}
                  onChange={(openQuestions) => setResult({ ...result, openQuestions })}
                  emptyLabel="No open questions were raised."
                  addLabel="Add question"
                />
              </CardContent>
            </Card>

            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Not provided in the notes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {result.notProvided.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    The notes covered everything the assistant needed.
                  </p>
                ) : (
                  <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                    {result.notProvided.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
                <DisclaimerBanner compact />
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </AppShell>
  );
}