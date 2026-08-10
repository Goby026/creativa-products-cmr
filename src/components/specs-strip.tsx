const SPECS = [
  { value: "5", label: "Niveles" },
  { value: "1.75m", label: "Altura total" },
  { value: "30 kg", label: "Por bandeja" },
  { value: "15mm", label: "Tablero melamina" },
  { value: "6/sem", label: "Unidades disponibles" },
];

export function SpecsStrip() {
  return (
    <div className="grid grid-cols-2 bg-foreground px-5 py-8 sm:grid-cols-3 md:grid-cols-5">
      {SPECS.map((spec) => (
        <div
          key={spec.label}
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
