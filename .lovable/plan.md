# AI Workplace Productivity Assistant

A responsive SaaS-style dashboard app with all five AI features, real AI responses via Lovable AI, structured prompts, editable outputs, and Responsible AI safeguards.

## Layout & navigation

- Persistent sidebar on desktop (Dashboard, Email Generator, Meeting Summarizer, Task Planner, Research Assistant, AI Chatbot, Settings); collapsible sheet menu on mobile with a top bar.
- Shared workspace shell: page header, input panel, output panel, "AI-generated" badge, copy/regenerate actions, loading/empty/error states, toasts.
- Design direction: polished professional SaaS — deep indigo/slate palette with a single bright accent, rounded cards, clear type hierarchy, semantic tokens only (no hardcoded colors), full light/dark support.

## Pages

1. **Dashboard** — welcome section, today's priorities, upcoming deadlines, recent AI activity, quick-action tiles for all five tools, productivity stats.
2. **Smart Email Generator** — purpose, recipient/context, key points, tone (Formal / Friendly / Persuasive), length (Short / Medium / Detailed); editable output with copy + regenerate.
3. **Meeting Notes Summarizer** — large notes input; structured output cards for summary, decisions, action items (owner + deadline, flagged "not specified" when absent), and open questions; each card editable.
4. **AI Task Planner** — task list with optional deadlines, working hours, Daily/Weekly mode; returns prioritised tasks (Urgent/High/Medium/Low) with duration, suggested time slot and reasoning; drag-free reorder buttons, inline edit, complete toggle.
5. **AI Research Assistant** — topic/question plus optional source text; returns executive summary, key findings, insights, recommendations, follow-up questions; source material visually separated from AI analysis with an "unverified" note.
6. **AI Chatbot** — streaming conversational assistant with suggested prompt chips and message history for the session.
7. **Settings** — theme toggle, default tone/length preferences, and the full Responsible AI policy text.

## AI behaviour (prompt engineering)

Each feature gets its own server-side system prompt enforcing: follow selected tone/mode exactly, never fabricate names, dates, owners or commitments, explicitly state when information is missing, separate inference from fact, and encourage human review. Structured features return typed JSON so the UI can render editable cards.

## Responsible AI

- Persistent disclaimer banner in the app shell plus the full statement in Settings and under every generated output.
- "AI-generated" labels on all outputs, editable results, regenerate control, and a confirm step before destructive actions.

## Technical notes

- Enable Lovable Cloud so the app can call Lovable AI securely; all model calls run server-side (`google/gemini-3.6-flash`) with no keys in the browser.
- Chatbot uses a streaming server route; the other four tools use typed server functions with structured output and graceful handling of rate-limit / credit errors surfaced in the UI.
- Data (tasks, activity feed, saved outputs) is kept in client state for this build — no accounts or database needed unless you want persistence later.
- Route-level SEO metadata (unique title/description/OG per page).

## Not included

- User accounts/login, team sharing, real email sending, or live web search for the research tool (it analyses the topic and any text you paste).