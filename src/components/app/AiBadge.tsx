import { Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";

export function AiBadge({ label = "AI-generated" }: { label?: string }) {
  return (
    <Badge variant="secondary" className="gap-1 border border-border/60">
      <Sparkles className="size-3" aria-hidden="true" />
      {label}
    </Badge>
  );
}