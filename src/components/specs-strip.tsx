import { useProduct } from "@/context/product-context";

export function SpecsStrip() {
  const { data } = useProduct();

  if (data.specs.length === 0) return null;

  return (
    <section className="container-page pb-4">
      <div className="stat-band">
        {data.specs.map((spec) => (
          <div key={spec.id} className="stat-cell">
            <span className="font-heading text-[26px] font-bold text-primary">
              {spec.value}
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              {spec.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
