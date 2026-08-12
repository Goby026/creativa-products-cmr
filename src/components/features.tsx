import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { useProduct } from "@/context/product-context";

export function Features() {
  const { data } = useProduct();

  if (data.features.length === 0) return null;

  return (
    <section className="section container-page">
      <p className="eyebrow">Por qué elegirlo</p>
      <h2 className="heading-lg mb-12 max-w-[520px] text-balance">
        Construido para durar, diseñado para organizar
      </h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data.features.map((f) => (
          <Card
            key={f.id}
            className="card-lift reveal rounded-2xl p-6 shadow-soft"
          >
            <CardContent className="p-0">
              <span className="tile-icon mb-4">{f.icon}</span>
              <CardTitle className="mb-2 font-heading text-lg font-semibold">
                {f.title}
              </CardTitle>
              <CardDescription className="text-[13px] leading-relaxed">
                {f.text}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
