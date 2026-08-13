import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";

import { getModel, RESPONSIBLE_AI_RULES } from "@/lib/ai-gateway.server";

const SYSTEM_PROMPT = `You are Aria, an AI workplace productivity assistant inside a dashboard app that also offers an email generator, meeting-notes summarizer, task planner and research assistant.

Help the user with workplace writing, meeting summaries, task prioritisation, research framing and general productivity. Be concise and practical: prefer short paragraphs and bullet lists. Ask a clarifying question when the request lacks the detail you need. When a dedicated tool in the app fits better, mention it.

${RESPONSIBLE_AI_RULES}`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = (await request.json()) as { messages?: UIMessage[] };
          const messages = body.messages ?? [];

          const result = streamText({
            model: getModel(),
            system: SYSTEM_PROMPT,
            messages: await convertToModelMessages(messages),
          });

          return result.toUIMessageStreamResponse();
        } catch (error) {
          console.error("Chat request failed", error);
          const { describeAiError } = await import("@/lib/ai-gateway.server");
          const { message, status } = describeAiError(error);
          return new Response(JSON.stringify({ error: message }), {
            status: status ?? 500,
            headers: { "content-type": "application/json" },
          });
        }
      },
    },
  },
});