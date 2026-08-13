import { ShieldAlert } from "lucide-react";

import { DISCLAIMER } from "./nav-items";

export function DisclaimerBanner({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-start gap-2 rounded-lg border border-border bg-secondary/60 px-3 py-2 text-xs leading-relaxed text-muted-foreground">
      <ShieldAlert className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
      <p>{compact ? DISCLAIMER.split(".")[0] + ". Always review AI output." : DISCLAIMER}</p>
    </div>
  );
}