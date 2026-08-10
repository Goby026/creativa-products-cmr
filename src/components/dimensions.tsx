import { Card } from "@/components/ui/card";
import { GALLERY } from "@/lib/constants";

const DIMS = [
  { name: "Alto total", value: "1750", unit: "mm" },
  { name: "Ancho", value: "300", unit: "mm" },
  { name: "Profundidad", value: "300", unit: "mm" },
  { name: "Separación entre niveles", value: "313", unit: "mm" },
  { name: "Número de niveles", value: "5", unit: "bandejas" },
  { name: "Carga por bandeja", value: "~30", unit: "kg" },
];

export function Dimensions() {
  const dimsImage = GALLERY[0];

  return (
    <section className="bg-muted px-6 py-20 md:px-10">
      <div className="mx-auto grid max-w-[1100px] items-center gap-10 md:grid-cols-2 md:gap-16">
        <Card className="reveal p-10 text-center shadow-[0_4px_40px_rgba(0,0,0,0.06)]">
          <img
            src={dimsImage}
            alt="Dimensiones del estante Creativa Melatech"
            loading="lazy"
            className="mx-auto w-[200px] rounded-sm drop-shadow-[0_10px_30px_rgba(0,0,0,0.15)]"
          />
        </Card>

        <div className="reveal">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
            Especificaciones técnicas
          </p>
          <h2 className="mb-7 font-heading text-[26px] font-bold leading-tight">
            Medidas exactas para planificar tu espacio
          </h2>
          <ul className="divide-y divide-border">
            {DIMS.map((d) => (
              <li
                key={d.name}
                className="flex items-center justify-between py-3.5 text-sm"
              >
                <span className="text-muted-foreground">{d.name}</span>
                <span className="font-heading text-xl font-semibold">
                  {d.value}{" "}
                  <small className="font-sans text-xs font-normal text-muted-foreground">
                    {d.unit}
                  </small>
                </span>
              </li>
            ))}
            <li className="flex items-center justify-between py-3.5 text-sm">
              <span className="text-muted-foreground">Material</span>
              <span className="font-sans text-sm font-semibold">
                Melamina 15 mm
              </span>
            </li>
            <li className="flex items-center justify-between py-3.5 text-sm">
              <span className="text-muted-foreground">Acabado lateral</span>
              <span className="font-sans text-sm font-semibold">
                Abierto (sin respaldo)
              </span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
