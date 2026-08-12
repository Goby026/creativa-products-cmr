import { Card, CardContent } from "@/components/ui/card";
import { imageUrl } from "@/lib/api";
import { useProduct } from "@/context/product-context";

export function Dimensions() {
  const { data } = useProduct();
  const dimsImage = data.images[0];

  if (data.dimensions.length === 0) return null;

  return (
    <section className="section bg-muted/60">
      <div className="container-page grid items-center gap-10 md:grid-cols-2 md:gap-16">
        <Card className="reveal rounded-3xl p-8 shadow-soft">
          <CardContent className="p-0">
            {dimsImage && (
              <img
                src={imageUrl(dimsImage.url)}
                alt="Dimensiones del estante Creativa Melatech"
                loading="lazy"
                className="mx-auto w-[220px] rounded-2xl object-contain drop-shadow-[0_16px_32px_rgba(0,0,0,0.18)]"
              />
            )}
          </CardContent>
        </Card>

        <div className="reveal">
          <p className="eyebrow">Especificaciones técnicas</p>
          <h2 className="heading-lg mb-7 text-balance">
            Medidas exactas para planificar tu espacio
          </h2>
          <Card className="rounded-2xl shadow-soft">
            <CardContent className="p-0">
              <ul className="divider-list">
                {data.dimensions.map((d) => (
                  <li
                    key={d.id}
                    className="flex items-center justify-between px-5 py-3.5 text-sm"
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
                <li className="flex items-center justify-between px-5 py-3.5 text-sm">
                  <span className="text-muted-foreground">Material</span>
                  <span className="font-sans text-sm font-semibold">
                    Melamina 15 mm
                  </span>
                </li>
                <li className="flex items-center justify-between px-5 py-3.5 text-sm">
                  <span className="text-muted-foreground">Acabado lateral</span>
                  <span className="font-sans text-sm font-semibold">
                    Abierto (sin respaldo)
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
