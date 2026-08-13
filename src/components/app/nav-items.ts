import {
  Bot,
  CalendarClock,
  LayoutDashboard,
  Mail,
  NotebookPen,
  Search,
  Settings,
} from "lucide-react";

export const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, blurb: "Your day at a glance" },
  { to: "/email", label: "Email Generator", icon: Mail, blurb: "Draft professional emails" },
  {
    to: "/meetings",
    label: "Meeting Summarizer",
    icon: NotebookPen,
    blurb: "Decisions and action items",
  },
  { to: "/planner", label: "Task Planner", icon: CalendarClock, blurb: "Prioritise and schedule" },
  { to: "/research", label: "Research Assistant", icon: Search, blurb: "Summaries and insights" },
  { to: "/chat", label: "AI Chatbot", icon: Bot, blurb: "Ask anything work-related" },
  { to: "/settings", label: "Settings", icon: Settings, blurb: "Preferences and AI policy" },
] as const;

export const DISCLAIMER =
  "AI-generated content may contain errors. Review and verify important information before relying on it or sending it externally. Do not enter confidential, sensitive, or personal information unless permitted by your organisation's policies.";