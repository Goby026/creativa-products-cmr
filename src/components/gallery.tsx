import { useState } from "react";
import { ArrowUpDown, MoveHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { imageUrl } from "@/lib/api";
import { useProduct } from "@/context/product-context";
import { cn } from "@/lib/utils";

export function Gallery() {
  const { data } = useProduct();
  const images = data.images;
  const [active, setActive] = useState(0);

  if (images.length === 0) return null;

  const index = Math.min(active, images.length - 1);
  const src = imageUrl(images[index].url, { w: 1200, q: 80 });

  const alto = data.dimensions.find((d) => d.name.includes("Alto"));
  const ancho = data.dimensions.find((d) => d.name.includes("Ancho"));

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full max-w-[520px]">
        <div className="gallery-main overflow-hidden rounded-3xl bg-card ring-1 ring-border shadow-glow">
          <img
            src={src}
            alt={images[index].alt ?? "Estante Vertical 5 Niveles Creativa Melatech"}
            className="aspect-[4/5] w-full object-cover"
          />
        </div>

        {alto && (
          <Badge
            variant="secondary"
            className="absolute right-3 top-3 gap-1 px-2.5 py-1 shadow-soft"
          >
            <ArrowUpDown className="size-3.5" />
            {alto.value} {alto.unit}
          </Badge>
        )}
        {ancho && (
          <Badge
            variant="secondary"
            className="absolute bottom-3 left-3 gap-1 px-2.5 py-1 shadow-soft"
          >
            <MoveHorizontal className="size-3.5" />
            {ancho.value} {ancho.unit}
          </Badge>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-4 flex flex-wrap justify-center gap-2.5">
          {images.map((item, i) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Ver foto ${i + 1} del estante`}
              aria-pressed={i === index}
              className={cn(
                "overflow-hidden rounded-xl bg-card p-1 ring-2 transition-all hover:-translate-y-0.5",
                i === index
                  ? "ring-primary"
                  : "ring-border opacity-75 hover:opacity-100",
              )}
            >
              <img
                src={imageUrl(item.url, { w: 96, q: 60 })}
                alt={`Miniatura foto ${i + 1}`}
                loading="lazy"
                className="size-14 rounded-lg object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
