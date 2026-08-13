import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, ListChecks, Sparkles } from "lucide-react";

import { AppShell } from "@/components/app/AppShell";
import { PageHeader } from "@/components/app/PageHeader";
import { navItems } from "@/components/app/nav-items";
import { priorityStyles } from "@/components/app/priority";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWorkspace } from "@/lib/workspace-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI Workplace Productivity Assistant Dashboard" },
      {
        name: "description",
        content:
          "One dashboard for AI-assisted email drafting, meeting summaries, task planning, research and chat — with human review built in.",
      },
      { property: "og:title", content: "AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content:
          "Draft emails, summarise meetings, plan tasks, research topics and chat — all in one assistant.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const tools = navItems.filter((item) => item.to !== "/" && item.to !== "/settings");

function Index() {
  const { tasks, activity, ready } = useWorkspace();
  const open = tasks.filter((t) => !t.completed);
  const done = tasks.length - open.length;

  return (
    <AppShell>
      <PageHeader
        title="Your workspace at a glance"
        description="Five AI assistants for the busywork of a working day. You stay in control — every output is editable and needs your review."
        action={
          <Button asChild>
            <Link to="/planner">
              <Sparkles className="size-4" />
              Plan my day
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Open tasks" value={ready ? open.length : 0} icon={ListChecks} />
        <StatCard label="Completed" value={ready ? done : 0} icon={CheckCircle2} />
        <StatCard label="AI runs logged" value={ready ? activity.length : 0} icon={Sparkles} />
      </div>

      <section className="space-y-4">
        <h2 className="font-display text-xl">AI tools</h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {tools.map((tool) => (
            <Card key={tool.to} className="group shadow-soft transition-shadow hover:shadow-lift">
              <CardHeader>
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <tool.icon className="size-5" aria-hidden="true" />
                </div>
                <CardTitle className="pt-2">{tool.label}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{tool.blurb}</p>
                <Button asChild variant="ghost" className="px-0">
                  <Link to={tool.to}>
                    Open
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Today&apos;s priorities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {open.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No open tasks. Build a plan in the Task Planner to see priorities here.
              </p>
            ) : (
              open.slice(0, 5).map((task) => (
                <div
                  key={task.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border p-3"
                >
                  <span className="text-sm">{task.title}</span>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge className={priorityStyles[task.priority]}>{task.priority}</Badge>
                    <span>{task.suggestedSlot}</span>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {activity.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nothing yet. Your AI runs will be listed here.
              </p>
            ) : (
              activity.slice(0, 6).map((item) => (
                <div key={item.id} className="border-b border-border pb-2 last:border-0 last:pb-0">
                  <p className="text-sm font-medium">{item.tool}</p>
                  <p className="text-xs text-muted-foreground">{item.detail}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(item.at).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: typeof ListChecks;
}) {
  return (
    <Card className="shadow-soft">
      <CardContent className="flex items-center gap-4 py-6">
        <div className="flex size-11 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
          <Icon className="size-5" aria-hidden="true" />
        </div>
        <div>
          <p className="font-display text-2xl">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}
