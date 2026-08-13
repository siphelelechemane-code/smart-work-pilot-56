# WorkMate AI

Log inSign up for free

You said:

Minimum Project Requirements
Your application must include at least three (3) of the following AI-powered features:
1.	Smart Email Generator 
o	Generate professional emails.
o	Support multiple tones (Formal, Friendly, Persuasive).
2.	Meeting Notes Summarizer 
o	Summarize lengthy meeting notes.
o	Extract action items, decisions, and deadlines.
3.	AI Task Planner / Scheduler 
o	Generate daily or weekly schedules.
o	Prioritise tasks effectively.
4.	AI Research Assistant 
o	Summarise topics or articles.
o	Provide insights and recommendations.
5.	AI Chatbot Interface 
o	Interactive AI workplace assistant.
o	Respond to user prompts.
 
Expected Project Structure
Your application should include:
•	Dashboard layout
•	Responsive design (Desktop and Mobile)
•	Input and output sections
•	AI-generated responses
•	Responsible AI disclaimer
 
Assessment Criteria
Your project will be evaluated based on:
•	Relevance of the problem being solved.
•	Quality of prompt engineering.
•	Functionality of the application.
•	Innovation and creativity.
•	Responsible AI practices.
•	Overall presentation and user experience.
 
Lovable AI Starter Prompt
Use the prompt below as a starting point when building your application with Lovable AI:
Build a modern, responsive web application called AI Workplace Productivity Assistant that helps professionals automate workplace tasks using AI.
The application should include:
•	Smart Email Generator
•	Meeting Notes Summarizer
•	AI Task Planner
•	AI Research Assistant
•	AI Chatbot Interface
Requirements:
•	Modern dashboard UI
•	Sidebar navigation
•	Responsive design
•	Structured AI prompts
•	Editable AI outputs
•	Responsible AI disclaimer

ChatGPT said:

This is a solid project brief. The easiest way to score well is to build all five features, rather than only the required three, while keeping them under one coherent workplace-assistant experience.

Recommended app structure

App name: AI Workplace Productivity Assistant

Dashboard

Overview of today’s tasks

Quick actions for each AI feature

Recent AI activity

Upcoming deadlines

Productivity summary

Sidebar navigation

Dashboard

Smart Email Generator

Meeting Notes Summarizer

AI Task Planner

AI Research Assistant

AI Chatbot

Settings

Feature specifications

1. Smart Email Generator

Input: recipient/context, purpose, key points

Tone selector: Formal / Friendly / Persuasive

Length selector: Short / Medium / Detailed

Generate button

Editable output

Copy/regenerate controls

2. Meeting Notes Summarizer

Large text input for meeting notes

Generate:

Summary

Key decisions

Action items

Deadlines

Assigned people

Allow the generated results to be edited.

3. AI Task Planner

User enters tasks and optional deadlines

AI determines priority

Generates a daily or weekly schedule

Categories such as Urgent, High, Medium, Low

Include estimated duration and suggested time slots

Allow tasks to be manually reordered.

4. AI Research Assistant

Topic/question input

Optional article/text input

Generate:

Executive summary

Key insights

Important findings

Recommendations

Follow-up questions

Clearly distinguish AI-generated information from verified sources.

5. AI Chatbot

Conversational workplace assistant

Can help with emails, meetings, tasks and research

Suggested prompts such as:

“Help me prioritise my tasks”

“Rewrite this email professionally”

“Summarise these meeting notes”

“Create a plan for my workday”

Prompt engineering

Don't simply send the user's text directly to an AI model. Give each feature a structured system prompt.

For example, the email generator should conceptually use:

You are a professional workplace communication assistant. Generate a clear, concise email based on the user's context and requested purpose. Follow the selected tone exactly. Do not invent facts, names, dates, commitments, or information that the user did not provide. Return only the email content.

For the meeting summarizer:

You are a workplace meeting-analysis assistant. Analyse the provided notes and return four clearly separated sections: Summary, Decisions, Action Items, and Deadlines. Only extract information supported by the notes. If information is missing, explicitly state that it was not provided. Do not invent owners or deadlines.

That last point is particularly useful for the Responsible AI assessment criterion.

Responsible AI

Put a visible disclaimer throughout the application, for example:

AI-generated content may contain errors. Review and verify important information before relying on it or sending it externally. Do not enter confidential, sensitive, or personal information unless your organisation's policies allow it.

Also include:

“Regenerate” functionality

Editable AI output

Clear indication that content was AI-generated

No fabricated facts

Source attribution for research where applicable

Confirmation before potentially consequential actions

UI direction

Use a polished SaaS dashboard rather than making each feature look like a separate application.

Desktop:
Sidebar → Main workspace → Optional right-side activity/context panel

Mobile:
Top navigation → Feature selector → Full-width input/output cards

Use a consistent visual language:

White/dark-neutral background

Blue or purple accent

Rounded cards

Clear hierarchy

Status badges

Loading/skeleton states

Empty states

Success/error notifications

Stronger Lovable prompt

You can use this as your actual starting prompt:

Build a modern, responsive SaaS-style web application called
"AI Workplace Productivity Assistant".

The application is designed for professionals who want to automate
common workplace tasks using AI.

CORE REQUIREMENTS

Create a polished dashboard application with:
- Responsive desktop and mobile layouts
- Persistent sidebar navigation on desktop
- Mobile-friendly navigation
- Modern cards, buttons, forms, tabs and status indicators
- Consistent professional visual design
- Clear loading, error, empty and success states
- Editable AI-generated outputs
- Copy and regenerate actions
- AI-generated content labels
- Responsible AI disclaimer

FEATURES

1. SMART EMAIL GENERATOR

Create an email-generation workspace.

Inputs:
- Email purpose
- Recipient/context
- Key points
- Tone: Formal, Friendly, Persuasive
- Length: Short, Medium, Detailed

Output:
- AI-generated professional email
- Editable text area
- Copy button
- Regenerate button

Prompt requirements:
- Follow the selected tone
- Do not invent facts, names, dates or commitments
- Produce professional, clear and concise communication
- Preserve all important user-provided information

2. MEETING NOTES SUMMARIZER

Create a meeting-analysis workspace.

Input:
- Large text area for meeting notes

Generate:
- Executive summary
- Key decisions
- Action items
- Responsible people
- Deadlines
- Open questions

Prompt requirements:
- Only extract information supported by the notes
- Never invent missing information
- Clearly indicate when an owner or deadline was not specified

Display the results in separate editable cards.

3. AI TASK PLANNER

Create a task-planning workspace.

Inputs:
- List of tasks
- Optional deadlines
- Available working hours
- Planning mode: Daily or Weekly

Generate:
- Prioritized task list
- Priority level
- Estimated duration
- Recommended schedule
- Reason for prioritization

Use priority levels:
- Urgent
- High
- Medium
- Low

Allow users to edit, reorder and mark tasks as completed.

4. AI RESEARCH ASSISTANT

Create a research workspace.

Inputs:
- Research topic/question
- Optional article or source text

Generate:
- Executive summary
- Key findings
- Key insights
- Recommendations
- Follow-up questions

The interface must clearly distinguish AI-generated analysis
from user-provided source material.

Do not present unsupported AI claims as verified facts.

5. AI CHATBOT

Create a conversational workplace assistant.

The chatbot should help users with:
- Email writing
- Meeting summaries
- Task planning
- Research
- General workplace productivity

Include suggested prompt buttons such as:
"Help me prioritise my tasks"
"Rewrite this email professionally"
"Summarise these meeting notes"
"Create a workday plan"

DASHBOARD

Create a dashboard homepage containing:
- Welcome section
- Today's priorities
- Upcoming deadlines
- Recent AI activity
- Quick-action buttons for all five AI features
- Productivity statistics

NAVIGATION

Sidebar items:
- Dashboard
- Email Generator
- Meeting Summarizer
- Task Planner
- Research Assistant
- AI Chatbot
- Settings

RESPONSIBLE AI

Display this disclaimer prominently:

"AI-generated content may contain errors. Review and verify important
information before relying on it or sending it externally. Do not enter
confidential, sensitive, or personal information unless permitted by
your organisation's policies."

Add AI-generated labels to generated content.

The AI must:
- Avoid fabricating information
- State when information is missing
- Avoid pretending uncertain information is factual
- Encourage human review for important decisions

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://smart-work-pilot-56.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/96422fb6-c9d0-4e27-b457-7bd3ca0a7216).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
