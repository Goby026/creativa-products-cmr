import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { BadgeCheck } from "lucide-react";
import { useProduct } from "@/context/product-context";

export function PriceBlock() {
  const { data } = useProduct();
  const product = data.product;

  if (!product) return null;

  const discount = product.old_price
    ? Math.round(((product.old_price - product.price) / product.old_price) * 100)
    : 0;
  const savings = product.old_price ? product.old_price - product.price : null;

  return (
    <Card className="mb-6 rounded-2xl shadow-soft">
      <CardContent className="p-5">
        {product.old_price != null && (
          <p className="text-sm text-muted-foreground line-through">
            Antes: {product.currency} {product.old_price.toFixed(2)}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-semibold text-foreground">
              {product.currency}
            </span>
            <span className="font-heading text-5xl font-bold leading-none text-foreground">
              {product.price}
            </span>
          </div>
          {discount > 0 && (
            <Badge className="bg-destructive/10 text-destructive">
              -{discount}% Oferta
            </Badge>
          )}
        </div>
        <p className="mt-1.5 text-xs text-muted-foreground">
          Precio final · Incluye IGV · Melamina de calidad
        </p>
        {savings != null && (
          <p className="mt-2.5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
            <BadgeCheck className="size-4" />
            Ahorras {product.currency} {savings}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
