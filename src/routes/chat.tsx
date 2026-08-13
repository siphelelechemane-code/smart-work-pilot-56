import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { createFileRoute } from "@tanstack/react-router";
import { Bot, Loader2, Send, Trash2, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { AiBadge } from "@/components/app/AiBadge";
import { AppShell } from "@/components/app/AppShell";
import { DisclaimerBanner } from "@/components/app/DisclaimerBanner";
import { PageHeader } from "@/components/app/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Chatbot | AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Chat with a workplace productivity assistant for drafting, planning and prioritisation help, with streamed replies.",
      },
      { property: "og:title", content: "AI Workplace Chatbot" },
      {
        property: "og:description",
        content: "Ask work questions and get streamed, reviewable answers.",
      },
    ],
  }),
  component: ChatPage,
});

const SUGGESTIONS = [
  "Help me say no to a meeting politely",
  "How do I structure a weekly status update?",
  "Give me an agenda for a 30-minute project kickoff",
  "How should I prioritise five competing deadlines?",
];

function ChatPage() {
  const { messages, sendMessage, status, error, setMessages } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const busy = status === "submitted" || status === "streaming";

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  function submit(text: string) {
    const value = text.trim();
    if (!value || busy) return;
    void sendMessage({ text: value });
    setInput("");
  }

  return (
    <AppShell>
      <PageHeader
        title="AI Chatbot"
        description="A conversational assistant for workplace questions. Replies stream in and should always be reviewed before acting on them."
        action={
          messages.length > 0 ? (
            <Button variant="outline" size="sm" onClick={() => setMessages([])}>
              <Trash2 className="size-4" />
              Clear chat
            </Button>
          ) : null
        }
      />

      <Card className="flex min-h-[60vh] flex-col shadow-soft">
        <CardContent className="flex-1 space-y-4 overflow-y-auto py-6">
          {messages.length === 0 && (
            <div className="space-y-4 text-center">
              <Bot className="mx-auto size-10 text-primary" aria-hidden="true" />
              <p className="text-sm text-muted-foreground">
                Ask about drafting, planning, prioritising or communicating at work.
              </p>
              <div className="mx-auto flex max-w-xl flex-wrap justify-center gap-2">
                {SUGGESTIONS.map((s) => (
                  <Button key={s} variant="outline" size="sm" onClick={() => submit(s)}>
                    {s}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message) => {
            const isUser = message.role === "user";
            const text = message.parts
              .map((part) => (part.type === "text" ? part.text : ""))
              .join("");
            return (
              <div
                key={message.id}
                className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
              >
                <div
                  className={`flex size-8 shrink-0 items-center justify-center rounded-full ${
                    isUser ? "bg-secondary text-secondary-foreground" : "bg-primary text-primary-foreground"
                  }`}
                  aria-hidden="true"
                >
                  {isUser ? <User className="size-4" /> : <Bot className="size-4" />}
                </div>
                <div className="max-w-[80%] space-y-1">
                  {!isUser && <AiBadge />}
                  <div
                    className={`whitespace-pre-wrap rounded-xl px-4 py-3 text-sm ${
                      isUser
                        ? "bg-secondary text-secondary-foreground"
                        : "border border-border bg-card text-card-foreground"
                    }`}
                  >
                    {text || (busy ? "…" : "")}
                  </div>
                </div>
              </div>
            );
          })}

          {busy && (
            <p className="flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="size-3 animate-spin" />
              Assistant is thinking…
            </p>
          )}
          {error && <p className="text-sm text-destructive">{error.message}</p>}
          <div ref={endRef} />
        </CardContent>

        <div className="border-t border-border p-4">
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              submit(input);
            }}
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask the assistant…"
              aria-label="Message"
            />
            <Button type="submit" disabled={busy || !input.trim()}>
              <Send className="size-4" />
              <span className="sr-only sm:not-sr-only">Send</span>
            </Button>
          </form>
          <div className="mt-3">
            <DisclaimerBanner compact />
          </div>
        </div>
      </Card>
    </AppShell>
  );
}