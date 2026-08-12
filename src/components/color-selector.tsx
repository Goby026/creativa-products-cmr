import { Check } from "lucide-react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { Color } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ColorSelector({
  colors,
  value,
  onChange,
}: {
  colors: Color[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="mb-6">
      <Label
        htmlFor="color-selector"
        className="mb-2.5 block text-xs font-semibold uppercase tracking-widest text-muted-foreground"
      >
        Color del acabado
      </Label>
      <RadioGroup
        value={value}
        onValueChange={onChange}
        className="flex flex-wrap gap-2"
        aria-label="Color del acabado"
      >
        {colors.map((c) => (
          <div key={c.id}>
            <RadioGroupItem
              value={c.value}
              id={`color-${c.value}`}
              className="peer sr-only"
            />
            <Label
              htmlFor={`color-${c.value}`}
              className={cn(
                "flex cursor-pointer items-center gap-2 rounded-xl border bg-card px-3.5 py-2 text-sm font-medium shadow-soft transition-all peer-data-checked:border-primary peer-data-checked:ring-2 peer-data-checked:ring-primary/30",
              )}
            >
              <span
                className="size-4 rounded-full border border-black/15"
                style={{ background: c.swatch }}
                aria-hidden="true"
              />
              {c.value}
              <Check className="hidden size-3.5 text-primary peer-data-checked:block" />
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
