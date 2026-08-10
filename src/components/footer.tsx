export function Footer() {
  return (
    <footer className="flex flex-wrap items-center justify-between gap-3 bg-foreground px-6 py-7 md:px-10">
      <span className="font-heading text-base font-bold">
        <span className="text-primary-foreground">Creativa</span>{" "}
        <span className="text-white/70">Melatech</span>
      </span>
      <p className="text-xs text-white/35">
        © {new Date().getFullYear()} · Muebles en melamina · Huancayo, Perú
      </p>
      <p className="text-xs text-white/35">Precios en soles (S/) · Incluye IGV</p>
    </footer>
  );
}
