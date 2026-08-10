import { useProduct } from "@/context/product-context";

export function Uses() {
  const { data } = useProduct();

  if (data.uses.length === 0) return null;

  return (
    <section className="mx-auto max-w-[1100px] px-6 py-20 md:px-10">
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
        Usos recomendados
      </p>
      <h2 className="mb-12 font-heading text-[34px] font-bold leading-tight">
        Un estante, infinitas posibilidades
      </h2>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {data.uses.map((u) => (
          <div
            key={u.id}
            className="reveal group rounded-2xl border bg-card p-6 text-center transition-all duration-300 hover:-translate-y-[3px] hover:bg-foreground"
          >
            <span className="mb-3 block text-[30px]">{u.emoji}</span>
            <h3 className="font-heading text-[15px] font-semibold transition-colors group-hover:text-white">
              {u.title}
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground transition-colors group-hover:text-white/60">
              {u.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
