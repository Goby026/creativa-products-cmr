import { useProduct } from "@/context/product-context";

export function DeliveryStrip() {
  const { data } = useProduct();

  if (data.benefits.length === 0) return null;

  return (
    <div className="reveal flex flex-wrap items-center justify-center gap-5 bg-primary px-6 py-7 md:gap-10">
      {data.benefits.map((item) => (
        <div
          key={item.id}
          className="flex items-center gap-2.5 text-sm font-medium text-primary-foreground"
        >
          <span className="text-xl">{item.icon}</span>
          <span>{item.text}</span>
        </div>
      ))}
    </div>
  );
}
