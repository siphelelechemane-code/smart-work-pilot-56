import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function EditableList({
  items,
  onChange,
  emptyLabel,
  addLabel = "Add item",
}: {
  items: string[];
  onChange: (items: string[]) => void;
  emptyLabel: string;
  addLabel?: string;
}) {
  return (
    <div className="space-y-2">
      {items.length === 0 && <p className="text-sm text-muted-foreground">{emptyLabel}</p>}
      {items.map((item, index) => (
        <div key={index} className="flex items-start gap-2">
          <Textarea
            value={item}
            rows={2}
            onChange={(event) => {
              const next = [...items];
              next[index] = event.target.value;
              onChange(next);
            }}
            className="min-h-0 resize-y"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Remove item"
            onClick={() => onChange(items.filter((_, i) => i !== index))}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      ))}
      <Button type="button" variant="ghost" size="sm" onClick={() => onChange([...items, ""])}>
        <Plus className="size-4" />
        {addLabel}
      </Button>
    </div>
  );
}