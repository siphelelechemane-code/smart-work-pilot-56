import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, BadgeCheck, HardHat, ShieldCheck } from "lucide-react";

import { AppShell } from "@/components/app/AppShell";
import { PageHeader } from "@/components/app/PageHeader";
import { DISCLAIMER, STUDY_DISCLAIMER } from "@/components/app/nav-items";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/responsible-ai")({
  head: () => ({
    meta: [
      { title: "Responsible AI Centre | CiviWork AI" },
      {
        name: "description",
        content:
          "How CiviWork AI handles engineering and study information: disclaimers, verification indicators, limitations and safety boundaries.",
      },
      { property: "og:title", content: "Responsible AI Centre — CiviWork AI" },
      {
        property: "og:description",
        content:
          "Disclaimers, verification guidance and limitations for AI use in civil engineering study and site work.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ResponsibleAiPage,
});

const PRINCIPLES = [
  {
    title: "Human engineering judgement stays with you",
    body: "CiviWork AI produces drafts and study explanations. It never approves work, signs off a design, authorises a site instruction or makes a safety decision.",
  },
  {
    title: "No invented standards or specifications",
    body: "The assistant is instructed never to quote a code clause, specification value, drawing number or test result it cannot support. Where a value is required it tells you to confirm it with the drawings, standard, lecturer or supervisor.",
  },
  {
    title: "Verification recommended on technical output",
    body: "Any output containing calculations, formulae, material properties or exam answers is labelled for verification. Check it against your textbook, official memorandum, the applicable standard and your lecturer or supervisor.",
  },
  {
    title: "Study integrity",
    body: "Past-paper help is a learning aid: the assistant explains the method and the reasoning so you can reproduce the answer yourself. Submitting AI output as your own unchecked work is your risk and may breach your institution's rules.",
  },
  {
    title: "Limitations",
    body: "No live internet access, no access to project drawings, registers, calendars or inboxes, and no knowledge of your employer's procedures. Durations, quantities and time slots are estimates.",
  },
  {
    title: "Your data",
    body: "Tasks, study progress and activity history stay in your own browser (local storage). Text you submit is sent to the AI provider only to produce a response. Do not paste confidential, personal or contractually restricted project information.",
  },
];

function Callout({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof AlertTriangle;
  title: string;
  children: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-secondary/60 p-4">
      <p className="flex items-center gap-2 font-medium">
        <Icon className="size-4 text-accent" aria-hidden="true" />
        {title}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{children}</p>
    </div>
  );
}

function ResponsibleAiPage() {
  return (
    <AppShell>
      <PageHeader
        title="Responsible AI Centre"
        description="CiviWork AI is a drafting and study assistant for an N6 Civil Engineering trainee. It is not an engineer, a lecturer or a safety officer."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Callout icon={AlertTriangle} title="AI disclaimer">
          {DISCLAIMER}
        </Callout>
        <Callout icon={ShieldCheck} title="AI study assistance disclaimer">
          {STUDY_DISCLAIMER}
        </Callout>
      </div>

      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BadgeCheck className="size-5 text-accent" aria-hidden="true" />
            Verification indicators used in this app
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p>
            <span className="font-medium">AI-generated</span> — the text was written by the model
            from what you supplied. Read it before you send or submit it.
          </p>
          <p>
            <span className="font-medium">Verification recommended</span> — the output contains
            technical content (formulae, calculations, material behaviour, exam answers). Confirm it
            against an authoritative source before acting on it.
          </p>
          <p>
            <span className="font-medium">Not specified</span> — the assistant found no owner,
            deadline or value in your input and refused to guess one.
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardHat className="size-5 text-accent" aria-hidden="true" />
            Our responsible AI principles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-5 md:grid-cols-2">
            {PRINCIPLES.map((item) => (
              <div key={item.title} className="space-y-1">
                <dt className="font-medium">{item.title}</dt>
                <dd className="text-sm leading-relaxed text-muted-foreground">{item.body}</dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>
    </AppShell>
  );
}