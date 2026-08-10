import { Card, CardContent } from "@/components/ui/card";

const FEATURES = [
  {
    icon: "🪟",
    title: "Abierto por ambos lados",
    text: "Sin respaldo ni laterales cerrados. La vista es limpia desde cualquier ángulo, ideal para dividir ambientes o lucir tus objetos favoritos.",
  },
  {
    icon: "💪",
    title: "30 kg por bandeja",
    text: "Cada nivel soporta hasta 30 kilogramos. Puedes poner libros pesados, macetas grandes o equipos sin preocuparte por el hundimiento.",
  },
  {
    icon: "🪵",
    title: "Melamina 15 mm premium",
    text: "Superficie resistente a la humedad, al rayado y fácil de limpiar. El grosor de 15 mm garantiza rigidez sin peso innecesario.",
  },
  {
    icon: "📐",
    title: "Perfil esquinero compacto",
    text: "Solo 30 × 30 cm de huella. Aprovecha los rincones que normalmente quedan vacíos, sin bloquear el paso ni la luz.",
  },
  {
    icon: "🎨",
    title: "Blanco, negro o a tu gusto",
    text: "Los colores estándar son blanco y negro, pero fabricamos en el tono que necesites. Solo coordina el color al hacer tu pedido.",
  },
  {
    icon: "⚡",
    title: "Producción local Huancayo",
    text: "Fabricado en Huancayo por Creativa Melatech. Producimos hasta 6 unidades por semana con control de calidad en cada pieza.",
  },
];

export function Features() {
  return (
    <section className="mx-auto max-w-[1100px] px-6 py-20 md:px-10">
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
        Por qué elegirlo
      </p>
      <h2 className="mb-12 max-w-[480px] font-heading text-[34px] font-bold leading-tight">
        Construido para durar, diseñado para organizar
      </h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f) => (
          <Card
            key={f.title}
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
