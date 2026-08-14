import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, RefreshCw, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AiBadge } from "@/components/app/AiBadge";
import { AppShell } from "@/components/app/AppShell";
import { CopyButton } from "@/components/app/CopyButton";
import { PageHeader } from "@/components/app/PageHeader";
import { STUDY_DISCLAIMER } from "@/components/app/nav-items";
import { VerifyBadge } from "@/components/app/VerifyBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { PastPaperOutput } from "@/lib/ai-schemas";
import { solvePastPaper } from "@/lib/ai.functions";
import { n6Modules } from "@/lib/n6-modules";
import { useWorkspace } from "@/lib/workspace-store";

export const Route = createFileRoute("/past-papers")({
  head: () => ({
    meta: [
      { title: "Past Paper Assistant | CiviWork AI" },
      {
        name: "description",
        content:
          "Paste an N6 Civil Engineering exam question and get a breakdown, required knowledge, step-by-step method, answer, reasoning and a similar practice question.",
      },
      { property: "og:title", content: "Past Paper Assistant — CiviWork AI" },
      {
        property: "og:description",
        content: "Learn the method behind N6 exam questions, not just the answer.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PastPapersPage,
});

function PastPapersPage() {
  const run = useServerFn(solvePastPaper);
  const { logActivity } = useWorkspace();

  const [question, setQuestion] = useState("");
  const [moduleName, setModuleName] = useState("Not specified");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PastPaperOutput | null>(null);

  async function handleSolve() {
    if (question.trim().length < 15) {
      toast.error("Paste the full exam question first");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const output = await run({
        data: { question, module: moduleName === "Not specified" ? "" : moduleName },
      });
      setResult(output);
      logActivity("Past Paper Assistant", question.slice(0, 60));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell>
      <PageHeader
        title="Past Paper Assistant"
        description="Paste a past-paper question. You get the method and the reasoning so you can reproduce the answer yourself in the exam."
      />

      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Exam question</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
            <div className="space-y-2">
              <Label>Module (optional)</Label>
              <Select value={moduleName} onValueChange={setModuleName}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Not specified">Not specified</SelectItem>
                  {n6Modules.map((m) => (
                    <SelectItem key={m.name} value={m.name}>
                      {m.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Textarea
            rows={8}
            placeholder="e.g. A simply supported beam spans 6 m and carries a uniformly distributed load of 20 kN/m. Calculate the maximum bending moment and the required section modulus. (10)"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleSolve} disabled={loading}>
              {loading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Sparkles className="size-4" />
              )}
              {loading ? "Working through it…" : "Break down this question"}
            </Button>
            {result && (
              <Button variant="outline" onClick={handleSolve} disabled={loading}>
                <RefreshCw className="size-4" />
                Regenerate
              </Button>
            )}
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <p className="rounded-lg border border-border bg-secondary/60 p-3 text-xs leading-relaxed">
            {STUDY_DISCLAIMER}
          </p>
        </CardContent>
      </Card>

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
            <VerifyBadge label="Check against the official memorandum" />
            <CopyButton
              value={[
                `Question breakdown\n${result.breakdown}`,
                `Required knowledge\n${result.requiredKnowledge.map((k) => `- ${k}`).join("\n")}`,
                `Method\n${result.steps.map((s, i) => `${i + 1}. ${s}`).join("\n")}`,
                `Final answer\n${result.finalAnswer}`,
                `Why this works\n${result.whyItWorks}`,
                `Practice question\n${result.similarQuestion}`,
              ].join("\n\n")}
              label="Copy solution"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-l-4 border-l-accent shadow-soft">
              <CardHeader>
                <CardTitle>Question breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{result.breakdown}</p>
              </CardContent>
            </Card>

            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Required knowledge</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc space-y-1 pl-5 text-sm">
                  {result.requiredKnowledge.map((k) => (
                    <li key={k}>{k}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="shadow-soft md:col-span-2">
              <CardHeader>
                <CardTitle>Step-by-step method</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="list-decimal space-y-2 pl-5 text-sm">
                  {result.steps.map((s) => (
                    <li key={s} className="whitespace-pre-wrap">
                      {s}
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>

            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Final answer</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap rounded-lg bg-secondary/60 p-3 font-mono text-sm">
                  {result.finalAnswer}
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Why this answer works</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{result.whyItWorks}</p>
              </CardContent>
            </Card>

            <Card className="shadow-soft md:col-span-2">
              <CardHeader>
                <CardTitle>Now try this one</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="whitespace-pre-wrap text-sm leading-relaxed">
                  {result.similarQuestion}
                </p>
                {result.assumptions.length > 0 && (
                  <div className="text-sm">
                    <p className="font-medium">Assumptions made</p>
                    <ul className="mt-1 list-disc space-y-1 pl-5 text-muted-foreground">
                      {result.assumptions.map((a) => (
                        <li key={a}>{a}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <p className="rounded-lg border border-border bg-secondary/60 p-3 text-sm">
                  {result.verificationNote}
                </p>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </AppShell>
  );
}