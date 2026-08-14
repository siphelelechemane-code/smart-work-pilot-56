import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, GraduationCap, ListChecks, Sparkles } from "lucide-react";

import heroVideo from "@/assets/site-hero.mp4.asset.json";
import { AppShell } from "@/components/app/AppShell";
import { PageHeader } from "@/components/app/PageHeader";
import { navItems } from "@/components/app/nav-items";
import { priorityStyles } from "@/components/app/priority";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { topicKey, totalTopics } from "@/lib/n6-modules";
import { useWorkspace } from "@/lib/workspace-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CiviWork AI — N6 Civil Engineering Productivity Assistant" },
      {
        name: "description",
        content:
          "One dashboard for an N6 Civil Engineering trainee: AI site emails, meeting summaries, task planning, research, study hub and past-paper help.",
      },
      { property: "og:title", content: "CiviWork AI — N6 Civil Engineering Assistant" },
      {
        property: "og:description",
        content:
          "Site work and N6 study in one AI workspace: emails, meetings, planning, research, study hub and past papers.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const workplaceTools = navItems.filter((item) => item.group === "Workplace");
const studyTools = navItems.filter((item) => item.group === "Study");
const aiTools = navItems.filter((item) => item.to === "/chat");

function greeting(hour: number) {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function Index() {
  const { tasks, activity, studied, ready } = useWorkspace();
  const open = tasks.filter((t) => !t.completed);
  const done = tasks.length - open.length;
  const urgent = open.filter((t) => t.priority === "Urgent" || t.priority === "High").length;
  const studyPct = ready ? Math.round((studied.length / totalTopics) * 100) : 0;

  return (
    <AppShell>
      <section className="relative overflow-hidden rounded-2xl bg-navy-deep shadow-soft">
        <video
          className="h-48 w-full object-cover opacity-45 sm:h-64"
          src={heroVideo.url}
          autoPlay
          muted
          loop
          playsInline
          aria-label="Civil engineering construction site footage"
        />
        <div className="absolute inset-0 flex flex-col justify-end gap-1 bg-gradient-to-t from-navy-deep/95 via-navy-deep/50 to-transparent p-5 sm:p-7">
          <p className="font-display text-xl text-cream sm:text-2xl">
            {greeting(new Date().getHours())} 👷
          </p>
          <p className="max-w-2xl text-sm text-cream/85">
            You have {ready ? open.length : 0} open task{open.length === 1 ? "" : "s"} ({urgent}{" "}
            urgent or high), {ready ? studied.length : 0} of {totalTopics} N6 topics marked studied
            and {ready ? activity.length : 0} recent AI activit
            {activity.length === 1 ? "y" : "ies"}.
          </p>
        </div>
      </section>

      <PageHeader
        title="Your site and study day at a glance"
        description="CiviWork AI connects your workplace tools and your N6 studies. Every output is editable, labelled and needs your verification."
        action={
          <Button asChild>
            <Link to="/planner">
              <Sparkles className="size-4" />
              Plan my day
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Open tasks" value={ready ? open.length : 0} icon={ListChecks} />
        <StatCard label="Completed" value={ready ? done : 0} icon={CheckCircle2} />
        <StatCard label="Topics studied" value={ready ? studied.length : 0} icon={GraduationCap} />
        <StatCard label="AI runs logged" value={ready ? activity.length : 0} icon={Sparkles} />
      </div>

      <ToolSection title="Workplace tools" tools={workplaceTools} />
      <ToolSection title="N6 study tools" tools={studyTools} />
      <ToolSection title="Ask CiviBot" tools={aiTools} />

      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>N6 study progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Progress value={studyPct} />
          <p className="text-sm text-muted-foreground">
            {studyPct}% of the tracked N6 topics marked studied. Open the Study Hub to learn a topic
            and tick it off.
          </p>
          <Button asChild variant="outline" size="sm">
            <Link to="/study">
              Go to Study Hub
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>

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
            <CardTitle>Recent AI activity</CardTitle>
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

function ToolSection({
  title,
  tools,
}: {
  title: string;
  tools: readonly (typeof navItems)[number][];
}) {
  return (
    <section className="space-y-4">
      <h2 className="font-display text-xl">{title}</h2>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {tools.map((tool) => (
          <Card key={tool.to} className="group shadow-soft transition-shadow hover:shadow-lift">
            <CardHeader>
              <div className="flex size-10 items-center justify-center rounded-lg bg-navy text-cream">
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
        <div className="flex size-11 items-center justify-center rounded-lg bg-navy text-cream">
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
