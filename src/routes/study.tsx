import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
  BookOpen,
  CheckCircle2,
  Circle,
  ExternalLink,
  Loader2,
  Sparkles,
  Youtube,
} from "lucide-react";
import { useState } from "react";

import { AiBadge } from "@/components/app/AiBadge";
import { AppShell } from "@/components/app/AppShell";
import { CopyButton } from "@/components/app/CopyButton";
import { DisclaimerBanner } from "@/components/app/DisclaimerBanner";
import { PageHeader } from "@/components/app/PageHeader";
import { STUDY_DISCLAIMER } from "@/components/app/nav-items";
import { VerifyBadge } from "@/components/app/VerifyBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { StudyOutput } from "@/lib/ai-schemas";
import { explainTopic } from "@/lib/ai.functions";
import {
  n6Modules,
  resourceCategories,
  topicKey,
  totalTopics,
  youtubeSearchUrl,
} from "@/lib/n6-modules";
import { useWorkspace } from "@/lib/workspace-store";

export const Route = createFileRoute("/study")({
  head: () => ({
    meta: [
      { title: "N6 Study Hub | CiviWork AI" },
      {
        name: "description",
        content:
          "Learn any N6 Civil Engineering topic: AI explanations at three depths, terminology, formulae, worked examples, flashcards and practice questions.",
      },
      { property: "og:title", content: "N6 Study Hub — CiviWork AI" },
      {
        property: "og:description",
        content:
          "Module to topic to learn, practise and review — with progress tracking and verification prompts.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: StudyPage,
});

type Depth = "Quick" | "N6" | "Detailed";

function StudyPage() {
  const run = useServerFn(explainTopic);
  const { logActivity, studied, toggleStudied, ready } = useWorkspace();

  const [moduleName, setModuleName] = useState<string>(n6Modules[0].name);
  const [topic, setTopic] = useState<string>(n6Modules[0].topics[0]);
  const [depth, setDepth] = useState<Depth>("N6");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<StudyOutput | null>(null);
  const [flipped, setFlipped] = useState<number | null>(null);

  const activeModule = n6Modules.find((m) => m.name === moduleName) ?? n6Modules[0];
  const doneCount = ready ? studied.length : 0;
  const modDone = activeModule.topics.filter((t) =>
    studied.includes(topicKey(activeModule.name, t)),
  ).length;

  async function handleExplain(nextTopic = topic) {
    setLoading(true);
    setError(null);
    setFlipped(null);
    try {
      const output = await run({ data: { module: moduleName, topic: nextTopic, depth } });
      setResult(output);
      logActivity("N6 Study Hub", `${nextTopic} (${depth})`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell>
      <PageHeader
        title="N6 Study Hub"
        description="Module → Topic → Learn → Practise → Test → Review. Pick a topic and choose how deep you want the explanation."
        action={
          <Button onClick={() => void handleExplain()} disabled={loading}>
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
            {loading ? "Teaching…" : "Teach me this topic"}
          </Button>
        }
      />

      <Card className="shadow-soft">
        <CardContent className="grid gap-4 py-6 md:grid-cols-3">
          <div className="space-y-2">
            <Label>Module</Label>
            <Select
              value={moduleName}
              onValueChange={(v) => {
                setModuleName(v);
                const mod = n6Modules.find((m) => m.name === v);
                if (mod) setTopic(mod.topics[0]);
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {n6Modules.map((m) => (
                  <SelectItem key={m.name} value={m.name}>
                    {m.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Topic</Label>
            <Select value={topic} onValueChange={setTopic}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {activeModule.topics.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Explanation depth</Label>
            <Select value={depth} onValueChange={(v) => setDepth(v as Depth)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Quick">Quick explanation</SelectItem>
                <SelectItem value="N6">N6 level</SelectItem>
                <SelectItem value="Detailed">Detailed with derivations</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="shadow-soft lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="size-5 text-accent" aria-hidden="true" />
              Progress tracker
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>All modules</span>
                <span>
                  {doneCount}/{totalTopics}
                </span>
              </div>
              <Progress value={(doneCount / totalTopics) * 100} />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{activeModule.name}</span>
                <span>
                  {modDone}/{activeModule.topics.length}
                </span>
              </div>
              <Progress value={(modDone / activeModule.topics.length) * 100} />
            </div>
            <ul className="space-y-1">
              {activeModule.topics.map((t) => {
                const key = topicKey(activeModule.name, t);
                const done = studied.includes(key);
                return (
                  <li key={t}>
                    <button
                      type="button"
                      onClick={() => toggleStudied(key)}
                      className="flex w-full items-start gap-2 rounded-lg px-2 py-1.5 text-left text-sm hover:bg-secondary"
                    >
                      {done ? (
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-accent" />
                      ) : (
                        <Circle className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                      )}
                      <span className={done ? "text-muted-foreground line-through" : ""}>{t}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>

        <div className="space-y-4 lg:col-span-2">
          {error && (
            <p className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </p>
          )}

          {loading && !result && (
            <div className="space-y-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-32 animate-pulse rounded-xl bg-muted" />
              ))}
            </div>
          )}

          {!result && !loading && !error && (
            <Card className="shadow-soft">
              <CardContent className="py-10 text-center text-sm text-muted-foreground">
                Choose a module and topic, then press “Teach me this topic”.
              </CardContent>
            </Card>
          )}

          {result && (
            <>
              <div className="flex flex-wrap items-center gap-2">
                <AiBadge />
                <VerifyBadge />
                <CopyButton value={result.explanation} label="Copy explanation" />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleStudied(topicKey(moduleName, topic))}
                >
                  <CheckCircle2 className="size-4" />
                  {studied.includes(topicKey(moduleName, topic))
                    ? "Mark as not studied"
                    : "Mark topic studied"}
                </Button>
              </div>

              <Card className="border-l-4 border-l-accent shadow-soft">
                <CardHeader>
                  <CardTitle>
                    {topic} — {depth === "N6" ? "N6 level" : depth.toLowerCase()}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">
                    {result.explanation}
                  </p>
                </CardContent>
              </Card>

              <div className="grid gap-4 md:grid-cols-2">
                <Card className="shadow-soft">
                  <CardHeader>
                    <CardTitle>Key concepts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc space-y-1 pl-5 text-sm">
                      {result.keyConcepts.map((c) => (
                        <li key={c}>{c}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="shadow-soft">
                  <CardHeader>
                    <CardTitle>Terminology</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-2 text-sm">
                      {result.terminology.map((t) => (
                        <div key={t.term}>
                          <dt className="font-medium">{t.term}</dt>
                          <dd className="text-muted-foreground">{t.meaning}</dd>
                        </div>
                      ))}
                    </dl>
                  </CardContent>
                </Card>

                <Card className="shadow-soft">
                  <CardHeader>
                    <CardTitle>Formulae</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {result.formulae.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        No standard formulae apply to this topic.
                      </p>
                    ) : (
                      <ul className="space-y-2 text-sm">
                        {result.formulae.map((f) => (
                          <li key={f} className="rounded-lg bg-secondary/60 p-2 font-mono text-xs">
                            {f}
                          </li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                </Card>

                <Card className="shadow-soft">
                  <CardHeader>
                    <CardTitle>Common mistakes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc space-y-1 pl-5 text-sm">
                      {result.commonMistakes.map((m) => (
                        <li key={m}>{m}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle>Worked example</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">
                    {result.workedExample}
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle>Flashcards</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-3 sm:grid-cols-2">
                  {result.flashcards.map((card, i) => (
                    <button
                      key={card.front}
                      type="button"
                      onClick={() => setFlipped(flipped === i ? null : i)}
                      className="min-h-24 rounded-xl border border-border bg-secondary/50 p-3 text-left text-sm transition-colors hover:bg-secondary"
                    >
                      <span className="block text-xs uppercase tracking-wide text-muted-foreground">
                        {flipped === i ? "Answer" : "Tap to reveal"}
                      </span>
                      <span className="mt-1 block">{flipped === i ? card.back : card.front}</span>
                    </button>
                  ))}
                </CardContent>
              </Card>

              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle>Practice questions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ol className="list-decimal space-y-2 pl-5 text-sm">
                    {result.practiceQuestions.map((q) => (
                      <li key={q}>{q}</li>
                    ))}
                  </ol>
                  <p className="rounded-lg border border-border bg-secondary/60 p-3 text-sm">
                    {result.verificationNote}
                  </p>
                  <p className="text-xs text-muted-foreground">{STUDY_DISCLAIMER}</p>
                </CardContent>
              </Card>
            </>
          )}

          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Youtube className="size-5 text-accent" aria-hidden="true" />
                Recommended learning searches
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                These open a YouTube search for “{topic}”. They are search links, not videos the
                assistant has watched or verified — judge each video yourself.
              </p>
              <div className="flex flex-wrap gap-2">
                {resourceCategories.map((cat) => (
                  <Button key={cat.label} asChild variant="outline" size="sm">
                    <a
                      href={youtubeSearchUrl(`${topic} ${moduleName} ${cat.suffix}`)}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      {cat.label}
                      <ExternalLink className="size-3.5" />
                    </a>
                  </Button>
                ))}
              </div>
              <DisclaimerBanner compact />
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}