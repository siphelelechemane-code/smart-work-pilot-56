import { BadgeCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";

export function VerifyBadge({ label = "Verification recommended" }: { label?: string }) {
  return (
    <Badge className="gap-1 bg-navy text-cream">
      <BadgeCheck className="size-3" aria-hidden="true" />
      {label}
    </Badge>
  );
}