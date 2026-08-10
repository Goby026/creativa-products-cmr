import { PRICE } from "@/lib/constants";

export function PriceBlock() {
  const discount = Math.round(
    ((PRICE.old - PRICE.current) / PRICE.old) * 100,
  );
  const savings = PRICE.old - PRICE.current;

  return (
    <div className="relative mb-6 overflow-hidden rounded-2xl border bg-card p-5">
      <span className="absolute right-4 top-3.5 rounded bg-destructive/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-destructive">
        Oferta
      </span>
      <p className="text-sm text-muted-foreground line-through">
        Antes: {PRICE.currency} {PRICE.old.toFixed(2)}
      </p>
      <div className="flex items-baseline gap-1.5">
        <span className="text-xl font-semibold text-foreground">
          {PRICE.currency}
        </span>
        <span className="font-heading text-5xl font-bold leading-none text-foreground">
          {PRICE.current}
        </span>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        Precio final · Incluye IGV · Melamina de calidad
      </p>
      <span className="mt-2.5 inline-flex items-center gap-1 rounded-md bg-secondary px-2.5 py-1 text-xs font-semibold text-secondary-foreground">
        ✓ Ahorras {PRICE.currency} {savings} — {discount}% de descuento
      </span>
    </div>
  );
}
