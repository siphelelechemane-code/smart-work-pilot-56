import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, Trash2 } from "lucide-react";

import { AppShell } from "@/components/app/AppShell";
import { PageHeader } from "@/components/app/PageHeader";
import { DISCLAIMER } from "@/components/app/nav-items";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useWorkspace } from "@/lib/workspace-store";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings & Responsible AI Policy | AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Review the responsible AI policy, understand data handling, and clear locally stored tasks and activity history.",
      },
      { property: "og:title", content: "Settings & Responsible AI Policy" },
      {
        property: "og:description",
        content: "How this assistant handles your data and where AI output needs human review.",
      },
    ],
  }),
  component: SettingsPage,
});

const POLICY = [
  {
    title: "Human review is required",
    body: "Every draft, summary, plan and answer is a starting point. A person must read, verify and approve output before it is sent, published or acted on.",
  },
  {
    title: "No invented facts",
    body: "The assistant is instructed to work only from what you provide. When information is missing it flags it as 'not provided' instead of filling the gap with a guess.",
  },
  {
    title: "Limitations",
    body: "The assistant has no live internet access, no access to your calendar or inbox, and no knowledge of your internal systems. Timings and estimates are approximations.",
  },
  {
    title: "Your data",
    body: "Tasks and activity history are stored only in your own browser (local storage) and never leave your device. Text you submit is sent to the AI provider solely to produce a response and is not used to build a profile of you here.",
  },
  {
    title: "Sensitive information",
    body: "Do not paste confidential, personal or regulated data unless your organisation's policy explicitly allows it.",
  },
  {
    title: "Accountability",
    body: "AI output is not professional, legal, financial or medical advice. Responsibility for any decision or communication stays with the human who sends it.",
  },
];

function SettingsPage() {
  const { activity, tasks, clearActivity, setTasks } = useWorkspace();

  return (
    <AppShell>
      <PageHeader
        title="Settings & Responsible AI"
        description="How this assistant behaves, what it stores, and where your judgement is required."
      />

      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="size-5 text-primary" aria-hidden="true" />
            Responsible AI policy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="rounded-lg border border-border bg-secondary/60 p-4 text-sm">{DISCLAIMER}</p>
          <Separator />
          <dl className="grid gap-5 md:grid-cols-2">
            {POLICY.map((item) => (
              <div key={item.title} className="space-y-1">
                <dt className="font-medium">{item.title}</dt>
                <dd className="text-sm text-muted-foreground">{item.body}</dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>

      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Local data</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {tasks.length} saved task{tasks.length === 1 ? "" : "s"} and {activity.length} activity
            entr{activity.length === 1 ? "y" : "ies"} are stored in this browser.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => setTasks([])} disabled={tasks.length === 0}>
              <Trash2 className="size-4" />
              Clear saved tasks
            </Button>
            <Button variant="outline" onClick={clearActivity} disabled={activity.length === 0}>
              <Trash2 className="size-4" />
              Clear activity history
            </Button>
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}