import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, RefreshCw, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AiBadge } from "@/components/app/AiBadge";
import { AppShell } from "@/components/app/AppShell";
import { CopyButton } from "@/components/app/CopyButton";
import { DisclaimerBanner } from "@/components/app/DisclaimerBanner";
import { PageHeader } from "@/components/app/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import type { EmailOutput } from "@/lib/ai-schemas";
import { generateEmail } from "@/lib/ai.functions";
import { useWorkspace } from "@/lib/workspace-store";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator | AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Generate professional workplace emails in formal, friendly or persuasive tones, then edit and copy the draft.",
      },
      { property: "og:title", content: "Smart Email Generator" },
      {
        property: "og:description",
        content: "Draft professional emails with selectable tone and length, ready to edit.",
      },
    ],
  }),
  component: EmailPage,
});

type Tone = "Formal" | "Friendly" | "Persuasive" | "Professional" | "Urgent";
type Length = "Short" | "Medium" | "Detailed";

const TEMPLATES = [
  "Requesting drawings",
  "Requesting technical clarification",
  "Reporting a site issue",
  "Asking for material information",
  "Submitting a progress update",
  "Requesting leave",
  "Reporting a delay",
  "Communicating with a supervisor",
  "Following up on outstanding work",
];

function EmailPage() {
  const run = useServerFn(generateEmail);
  const { logActivity } = useWorkspace();

  const [purpose, setPurpose] = useState("");
  const [recipient, setRecipient] = useState("");
  const [keyPoints, setKeyPoints] = useState("");
  const [tone, setTone] = useState<Tone>("Formal");
  const [length, setLength] = useState<Length>("Medium");
  const [template, setTemplate] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<EmailOutput | null>(null);

  async function handleGenerate() {
    if (!purpose.trim()) {
      toast.error("Describe the purpose of the email first");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const output = await run({
        data: { purpose, recipient, keyPoints, tone, length, template },
      });
      setResult(output);
      logActivity("Email Generator", `${tone} email: ${output.subject}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell>
      <PageHeader
        title="AI Email Generator"
        description="Site and office emails for an engineering environment. Nothing is invented — missing drawing numbers, dates and specifications are flagged for you."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Email details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Civil engineering template</Label>
              <div className="flex flex-wrap gap-2">
                {TEMPLATES.map((item) => (
                  <Button
                    key={item}
                    type="button"
                    size="sm"
                    variant={template === item ? "default" : "outline"}
                    onClick={() => {
                      const next = template === item ? "" : item;
                      setTemplate(next);
                      if (next && !purpose.trim()) setPurpose(next);
                    }}
                  >
                    {item}
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="purpose">Purpose</Label>
              <Input
                id="purpose"
                placeholder="Ask my site supervisor to clarify the reinforcement spec for tomorrow's pour"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient / context</Label>
              <Input
                id="recipient"
                placeholder="Site supervisor, Bridge B2 deck, works starting 07:00 tomorrow"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="points">Key points</Label>
              <Textarea
                id="points"
                rows={6}
                placeholder={"- Drawing S-104 rev B shows Y12 bars, the bar schedule shows Y16\n- Pour is planned for 07:00 tomorrow\n- Need written confirmation before steel is fixed"}
                value={keyPoints}
                onChange={(e) => setKeyPoints(e.target.value)}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Tone</Label>
                <Select value={tone} onValueChange={(v) => setTone(v as Tone)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Formal">Formal</SelectItem>
                    <SelectItem value="Friendly">Friendly</SelectItem>
                    <SelectItem value="Persuasive">Persuasive</SelectItem>
                    <SelectItem value="Professional">Professional</SelectItem>
                    <SelectItem value="Urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Length</Label>
                <Select value={length} onValueChange={(v) => setLength(v as Length)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Short">Short</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Detailed">Detailed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={handleGenerate} disabled={loading} className="w-full">
              {loading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Sparkles className="size-4" />
              )}
              {loading ? "Drafting…" : "Generate email"}
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="flex-row items-center justify-between gap-2 space-y-0">
            <CardTitle>Draft</CardTitle>
            {result && <AiBadge />}
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <p className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </p>
            )}

            {!result && !loading && !error && (
              <p className="text-sm text-muted-foreground">
                Your editable draft will appear here once generated.
              </p>
            )}

            {loading && !result && (
              <div className="space-y-2">
                <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
                <div className="h-32 animate-pulse rounded bg-muted" />
              </div>
            )}

            {result && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={result.subject}
                    onChange={(e) => setResult({ ...result, subject: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="body">Body (editable)</Label>
                  <Textarea
                    id="body"
                    rows={14}
                    value={result.body}
                    onChange={(e) => setResult({ ...result, body: e.target.value })}
                  />
                </div>
                {result.missingInformation.length > 0 && (
                  <div className="rounded-lg border border-border bg-secondary/60 p-3 text-sm">
                    <p className="font-medium">You still need to confirm:</p>
                    <ul className="mt-1 list-disc space-y-1 pl-5 text-muted-foreground">
                      {result.missingInformation.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="flex flex-wrap gap-2">
                  <CopyButton value={`Subject: ${result.subject}\n\n${result.body}`} />
                  <Button variant="outline" size="sm" onClick={handleGenerate} disabled={loading}>
                    <RefreshCw className="size-4" />
                    Regenerate
                  </Button>
                </div>
                <DisclaimerBanner compact />
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}