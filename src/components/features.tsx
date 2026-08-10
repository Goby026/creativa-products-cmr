import { Card, CardContent } from "@/components/ui/card";
import { useProduct } from "@/context/product-context";

export function Features() {
  const { data } = useProduct();

  if (data.features.length === 0) return null;

  return (
    <section className="mx-auto max-w-[1100px] px-6 py-20 md:px-10">
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
        Por qué elegirlo
      </p>
      <h2 className="mb-12 max-w-[480px] font-heading text-[34px] font-bold leading-tight">
        Construido para durar, diseñado para organizar
      </h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data.features.map((f) => (
          <Card
            key={f.id}
            className="reveal p-7 transition-all duration-300 hover:-translate-y-[3px] hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] hover:ring-ring/60"
          >
            <CardContent className="px-0">
              <span className="mb-3.5 block text-[28px]">{f.icon}</span>
              <h3 className="font-heading text-[17px] font-semibold">
                {f.title}
              </h3>
              <p className="mt-2.5 text-[13px] leading-relaxed text-muted-foreground">
                {f.text}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
