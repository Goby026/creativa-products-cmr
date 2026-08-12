import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { useProduct } from "@/context/product-context";

export function Uses() {
  const { data } = useProduct();

  if (data.uses.length === 0) return null;

  return (
    <section className="section container-page">
      <p className="eyebrow">Usos recomendados</p>
      <h2 className="heading-lg mb-12 text-balance">
        Un estante, infinitas posibilidades
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {data.uses.map((u) => (
          <Card
            key={u.id}
            className="card-lift reveal rounded-2xl p-6 text-center shadow-soft"
          >
            <CardContent className="p-0">
              <span className="mb-3 block text-3xl" aria-hidden="true">
                {u.emoji}
              </span>
              <CardTitle className="mb-1.5 font-heading text-base font-semibold">
                {u.title}
              </CardTitle>
              <CardDescription className="text-xs leading-relaxed">
                {u.text}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
