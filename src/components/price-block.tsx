import { useProduct } from "@/context/product-context";

export function PriceBlock() {
  const { data } = useProduct();
  const product = data.product;

  if (!product) return null;

  const discount = product.old_price
    ? Math.round(((product.old_price - product.price) / product.old_price) * 100)
    : 0;
  const savings = product.old_price
    ? product.old_price - product.price
    : null;

  return (
    <div className="relative mb-6 overflow-hidden rounded-2xl border bg-card p-5">
      {discount > 0 && (
        <span className="absolute right-4 top-3.5 rounded bg-destructive/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-destructive">
          Oferta
        </span>
      )}
      {product.old_price != null && (
        <p className="text-sm text-muted-foreground line-through">
          Antes: {product.currency} {product.old_price.toFixed(2)}
        </p>
      )}
      <div className="flex items-baseline gap-1.5">
        <span className="text-xl font-semibold text-foreground">
          {product.currency}
        </span>
        <span className="font-heading text-5xl font-bold leading-none text-foreground">
          {product.price}
        </span>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        Precio final · Incluye IGV · Melamina de calidad
      </p>
      {savings != null && (
        <span className="mt-2.5 inline-flex items-center gap-1 rounded-md bg-secondary px-2.5 py-1 text-xs font-semibold text-secondary-foreground">
          ✓ Ahorras {product.currency} {savings} — {discount}% de descuento
        </span>
      )}
    </div>
  );
}
