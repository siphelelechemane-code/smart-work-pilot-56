import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { FileText, Loader2, RefreshCw, Sparkles } from "lucide-react";
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
import type { ResearchOutput } from "@/lib/ai-schemas";
import { researchTopic } from "@/lib/ai.functions";
import { useWorkspace } from "@/lib/workspace-store";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant | AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Summarise a topic or pasted article into findings, insights, recommendations and follow-up questions.",
      },
      { property: "og:title", content: "AI Research Assistant" },
      {
        property: "og:description",
        content: "Summaries, insights and recommendations with clear confidence notes.",
      },
    ],
  }),
  component: ResearchPage,
});

function ResearchPage() {
  const run = useServerFn(researchTopic);
  const { logActivity } = useWorkspace();

  const [topic, setTopic] = useState("");
  const [sourceText, setSourceText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ResearchOutput | null>(null);

  async function handleResearch() {
    if (!topic.trim()) {
      toast.error("Enter a topic or question");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const output = await run({ data: { topic, sourceText } });
      setResult(output);
      logActivity("Research Assistant", topic.slice(0, 60));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell>
      <PageHeader
        title="AI Research Assistant"
        description="Analyse a topic on its own or against source material you paste in. AI analysis is always visually separated from your source."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Research brief</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="topic">Topic or question</Label>
              <Input
                id="topic"
                placeholder="How should we approach hybrid-work policy for a 40-person team?"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="source" className="flex items-center gap-2">
                <FileText className="size-4" aria-hidden="true" />
                Optional source text (article, report, policy)
              </Label>
              <Textarea
                id="source"
                rows={10}
                placeholder="Paste the article or document you want analysed…"
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Your pasted material is treated as the source of truth. Without it, the assistant
                gives general background you must verify.
              </p>
            </div>
            <Button onClick={handleResearch} disabled={loading} className="w-full">
              {loading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Sparkles className="size-4" />
              )}
              {loading ? "Researching…" : "Run research"}
            </Button>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </CardContent>
        </Card>

        <div className="space-y-4">
          {!result && !loading && (
            <Card className="shadow-soft">
              <CardContent className="py-10 text-center text-sm text-muted-foreground">
                Your AI analysis will appear here.
              </CardContent>
            </Card>
          )}

          {loading &&
            !result &&
            [0, 1].map((i) => <div key={i} className="h-40 animate-pulse rounded-xl bg-muted" />)}

          {result && (
            <>
              <div className="flex flex-wrap items-center gap-2">
                <AiBadge label="AI analysis — unverified" />
                <CopyButton
                  value={[
                    result.executiveSummary,
                    `Key findings:\n${result.keyFindings.map((f) => `- ${f}`).join("\n")}`,
                    `Insights:\n${result.insights.map((f) => `- ${f}`).join("\n")}`,
                    `Recommendations:\n${result.recommendations.map((f) => `- ${f}`).join("\n")}`,
                  ].join("\n\n")}
                  label="Copy analysis"
                />
              </div>

              <Card className="border-l-4 border-l-accent shadow-soft">
                <CardHeader>
                  <CardTitle>Executive summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    rows={5}
                    value={result.executiveSummary}
                    onChange={(e) => setResult({ ...result, executiveSummary: e.target.value })}
                  />
                </CardContent>
              </Card>

              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle>Key findings</CardTitle>
                </CardHeader>
                <CardContent>
                  <EditableList
                    items={result.keyFindings}
                    onChange={(keyFindings) => setResult({ ...result, keyFindings })}
                    emptyLabel="No findings returned."
                    addLabel="Add finding"
                  />
                </CardContent>
              </Card>

              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle>Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <EditableList
                    items={result.insights}
                    onChange={(insights) => setResult({ ...result, insights })}
                    emptyLabel="No insights returned."
                    addLabel="Add insight"
                  />
                </CardContent>
              </Card>

              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle>Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <EditableList
                    items={result.recommendations}
                    onChange={(recommendations) => setResult({ ...result, recommendations })}
                    emptyLabel="No recommendations returned."
                    addLabel="Add recommendation"
                  />
                </CardContent>
              </Card>

              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle>Follow-up questions & confidence</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                    {result.followUpQuestions.map((q) => (
                      <li key={q}>{q}</li>
                    ))}
                  </ul>
                  <p className="rounded-lg border border-border bg-secondary/60 p-3 text-sm">
                    {result.confidenceNote}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" onClick={handleResearch} disabled={loading}>
                      <RefreshCw className="size-4" />
                      Regenerate
                    </Button>
                  </div>
                  <DisclaimerBanner compact />
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </AppShell>
  );
}