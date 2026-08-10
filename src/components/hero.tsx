import { Button } from "@/components/ui/button";
import { ColorSelector } from "@/components/color-selector";
import { Countdown } from "@/components/countdown";
import { Gallery } from "@/components/gallery";
import { PriceBlock } from "@/components/price-block";
import { WhatsappIcon } from "@/components/whatsapp-icon";
import { useToast } from "@/components/toast";
import { openWhatsApp } from "@/lib/whatsapp";
import { trackEvent } from "@/lib/analytics";

const PAYMENTS = ["💛 Yape", "💜 Plin", "💵 Efectivo", "🤝 Contra entrega"];
const TRUST = ["🚚 Envío en Huancayo", "🛡️ Garantía de calidad", "📐 Melamina 15 mm"];

export function Hero({
  color,
  onColorChange,
}: {
  color: string;
  onColorChange: (value: string) => void;
}) {
  const showToast = useToast();

  const handleWhatsApp = () => {
    trackEvent("whatsapp_click");
    openWhatsApp(color);
  };

  return (
    <section className="grid min-h-screen grid-cols-1 pt-20 md:grid-cols-2">
      <div className="relative flex min-h-[420px] flex-col items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_30%_70%,rgba(0,0,0,0.04),transparent_60%)] p-6 md:min-h-[600px]">
        <span className="absolute left-5 top-5 rounded-full bg-primary px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-primary-foreground">
          ✦ Melamina 15 mm
        </span>
        <Gallery />
        <span className="absolute bottom-5 left-5 flex items-center rounded-full bg-foreground/80 px-3.5 py-2 text-[11px] font-semibold text-white backdrop-blur-sm">
          <span className="mr-1.5 inline-block h-[7px] w-[7px] animate-pulse rounded-full bg-[#7de08a]" />
          Disponible · Fabricación semanal
        </span>
      </div>

      <div className="flex flex-col justify-center px-6 py-10 md:px-12 md:py-0">
        <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
          Creativa Melatech · Huancayo
        </p>
        <h1 className="mb-5 font-heading text-4xl font-bold leading-[1.1] md:text-[48px]">
          Estante Vertical
          <br />
          <em className="italic text-primary">5 Niveles</em>
        </h1>
        <p className="mb-7 max-w-[420px] text-[15px] leading-relaxed text-muted-foreground">
          Diseño esquinero en melamina de 15 mm, abierto por ambos lados para
          una vista limpia desde cualquier ángulo. Cinco bandejas que soportan
          hasta 30 kg cada una — ideal para libros, plantas, electrónicos o lo
          que imagines.
        </p>

        <ColorSelector
          value={color}
          onChange={(v) => {
            onColorChange(v);
            if (v === "A pedido") {
              showToast(
                "📝 Perfecto, coordina el color al escribirnos por WhatsApp",
              );
            }
          }}
        />

        <PriceBlock />

        <div className="mb-6 flex flex-wrap gap-2">
          {PAYMENTS.map((m) => (
            <span
              key={m}
              className="rounded-lg border-[1.5px] bg-card px-3 py-1.5 text-xs font-medium"
            >
              {m}
            </span>
          ))}
        </div>

        <Countdown />

        <div className="flex flex-col gap-3">
          <Button
            variant="whatsapp"
            className="h-14 w-full px-8 text-base"
            onClick={handleWhatsApp}
            aria-label="Pedir por WhatsApp"
          >
            <WhatsappIcon className="size-5" />
            Pedir por WhatsApp
          </Button>
          <Button
            variant="default"
            className="h-14 w-full px-8 text-base"
            onClick={() =>
              showToast(
                "✅ ¡Perfecto! Escríbenos al WhatsApp para coordinar tu pedido.",
              )
            }
          >
            🛒 Reservar ahora
          </Button>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-4">
          {TRUST.map((t) => (
            <span
              key={t}
              className="flex items-center gap-1.5 text-xs text-muted-foreground"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
