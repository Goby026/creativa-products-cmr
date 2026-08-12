import { Card, CardContent } from "@/components/ui/card";
import { useProduct } from "@/context/product-context";

export function DeliveryStrip() {
  const { data } = useProduct();

  if (data.benefits.length === 0) return null;

  return (
    <section className="section container-page pt-0">
      <div className="reveal grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {data.benefits.map((item) => (
          <Card
            key={item.id}
            className="rounded-2xl border-primary/15 bg-primary/5 shadow-soft"
          >
            <CardContent className="flex items-center gap-3 p-5">
              <span className="tile-icon shrink-0" aria-hidden="true">
                {item.icon}
              </span>
              <span className="text-sm font-medium leading-snug">
                {item.text}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
