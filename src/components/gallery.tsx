import { useState } from "react";
import { GALLERY } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Gallery() {
  const [active, setActive] = useState(0);
  const src = GALLERY[active];

  return (
    <div className="relative z-10 flex flex-col items-center">
      <div className="relative transition-transform duration-500 hover:[transform:perspective(800px)_rotateY(-4deg)_rotateX(2deg)_scale(1.02)]">
        <img
          src={src}
          alt={`Estante Vertical 5 Niveles Creativa Melatech — Foto ${active + 1}`}
          className="max-h-[65vh] w-auto max-w-full rounded-sm drop-shadow-[0_30px_60px_rgba(0,0,0,0.25)]"
        />
        <span className="absolute right-[-20px] top-[12%] rounded-lg border bg-card px-3 py-1.5 text-[11px] font-semibold shadow-md">
          ↕ 1750 mm
        </span>
        <span className="absolute bottom-[22%] left-[-24px] rounded-lg border bg-card px-3 py-1.5 text-[11px] font-semibold shadow-md">
          ← 300 mm
        </span>
        <span className="absolute bottom-[10%] right-[-20px] rounded-lg border bg-card px-3 py-1.5 text-[11px] font-semibold shadow-md">
          ↕ 300 mm
        </span>
      </div>

      {GALLERY.length > 1 && (
        <div className="mt-5 flex flex-wrap justify-center gap-2.5">
          {GALLERY.map((item, i) => (
            <button
              key={item}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Ver foto ${i + 1} del estante`}
              aria-pressed={i === active}
              className={cn(
                "rounded-[10px] border-2 bg-card p-[3px] transition-all hover:-translate-y-0.5",
                i === active
                  ? "border-primary opacity-100"
                  : "border-border opacity-70",
              )}
            >
              <img
                src={item}
                alt={`Miniatura foto ${i + 1}`}
                loading="lazy"
                className="h-14 w-14 rounded-lg object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
