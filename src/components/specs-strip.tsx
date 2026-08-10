import { useProduct } from "@/context/product-context";

export function SpecsStrip() {
  const { data } = useProduct();

  if (data.specs.length === 0) return null;

  return (
    <div className="grid grid-cols-2 bg-foreground px-5 py-8 sm:grid-cols-3 md:grid-cols-5">
      {data.specs.map((spec) => (
        <div
          key={spec.id}
          className="px-5 py-3 text-center md:border-r md:border-white/10 md:last:border-none"
        >
          <span className="block font-heading text-[26px] font-bold text-primary-foreground">
            {spec.value}
          </span>
          <span className="mt-1 block text-[10px] font-medium uppercase tracking-widest text-white/45">
            {spec.label}
          </span>
        </div>
      ))}
    </div>
  );
}
