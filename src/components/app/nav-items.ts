import {
  Bot,
  CalendarClock,
  FileQuestion,
  GraduationCap,
  LayoutDashboard,
  Mail,
  NotebookPen,
  Search,
  Settings,
  ShieldCheck,
} from "lucide-react";

export const navItems = [
  {
    to: "/",
    label: "Dashboard",
    icon: LayoutDashboard,
    blurb: "Your day at a glance",
    group: "Overview",
  },
  {
    to: "/email",
    label: "AI Email Generator",
    icon: Mail,
    blurb: "Site and supervisor emails",
    group: "Workplace",
  },
  {
    to: "/meetings",
    label: "Meeting Summarizer",
    icon: NotebookPen,
    blurb: "Site meetings to action items",
    group: "Workplace",
  },
  {
    to: "/planner",
    label: "AI Task Planner",
    icon: CalendarClock,
    blurb: "Balance site work and study",
    group: "Workplace",
  },
  {
    to: "/research",
    label: "Research Assistant",
    icon: Search,
    blurb: "Explain it at N6 level",
    group: "Study",
  },
  {
    to: "/study",
    label: "N6 Study Hub",
    icon: GraduationCap,
    blurb: "Modules, topics, flashcards",
    group: "Study",
  },
  {
    to: "/past-papers",
    label: "Past Paper Assistant",
    icon: FileQuestion,
    blurb: "Step-by-step worked answers",
    group: "Study",
  },
  { to: "/chat", label: "CiviBot", icon: Bot, blurb: "Ask anything, work or study", group: "AI" },
  {
    to: "/responsible-ai",
    label: "Responsible AI",
    icon: ShieldCheck,
    blurb: "Limits, verification, safety",
    group: "AI",
  },
  {
    to: "/settings",
    label: "Settings",
    icon: Settings,
    blurb: "Preferences and local data",
    group: "AI",
  },
] as const;

export const DISCLAIMER =
  "AI-generated information may contain errors or omissions. Verify important information against official course material, workplace procedures, engineering standards, your lecturer or your supervisor. AI must never replace professional engineering judgement or site safety procedures.";

export const STUDY_DISCLAIMER =
  "AI study assistance: AI-generated answers must be checked against your official textbook, lecturer guidance, course material and the applicable standards. Do not rely on AI alone for safety-critical engineering decisions.";