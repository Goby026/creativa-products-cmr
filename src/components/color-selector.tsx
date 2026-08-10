import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

const COLORS = [
  { value: "Blanco", swatch: "bg-[#f5f5f0]" },
  { value: "Negro", swatch: "bg-[#1a1a1a]" },
  {
    value: "A pedido",
    swatch: "bg-gradient-to-br from-[#d4d4d8] via-[#71717a] to-[#18181b]",
  },
];

export function ColorSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="mb-6">
      <span className="mb-2.5 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        Color del acabado
      </span>
      <RadioGroup
        value={value}
        onValueChange={onChange}
        className="flex flex-wrap gap-2"
      >
        {COLORS.map((c) => (
          <div key={c.value}>
            <RadioGroupItem
              value={c.value}
              id={`color-${c.value}`}
              className="peer sr-only"
            />
            <label
              htmlFor={`color-${c.value}`}
              className="flex cursor-pointer items-center gap-2 rounded-[10px] border-[1.5px] bg-card px-3.5 py-2 text-sm font-medium transition-colors peer-data-checked:border-primary peer-data-checked:shadow-[0_0_0_2px_rgba(0,0,0,0.15)]"
            >
              <span
                className={cn(
                  "h-4 w-4 rounded-full border-[1.5px] border-black/15",
                  c.swatch,
                )}
              />
              {c.value}
            </label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
