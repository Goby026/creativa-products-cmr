import { ShieldCheck, Sparkles, Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ColorSelector } from "@/components/color-selector";
import { Countdown } from "@/components/countdown";
import { Gallery } from "@/components/gallery";
import { PriceBlock } from "@/components/price-block";
import { WhatsappIcon } from "@/components/whatsapp-icon";
import { useToast } from "@/components/toast";
import { openWhatsApp } from "@/lib/whatsapp";
import { trackEvent, trackWhatsAppClick } from "@/lib/analytics";
import { settingArray, settingObject } from "@/lib/api";
import { useProduct } from "@/context/product-context";

const TRUST_ICONS: Record<number, typeof Truck> = {
  0: Truck,
  1: ShieldCheck,
  2: Sparkles,
};

export function Hero({
  color,
  onColorChange,
}: {
  color: string;
  onColorChange: (value: string) => void;
}) {
  const showToast = useToast();
  const { data } = useProduct();
  const { product, colors, settings } = data;

  const payments = settingArray(settings, "payments");
  const trust = settingArray(settings, "trust");
  const heroCfg = settingObject<{ eyebrow?: string }>(settings, "hero");
  const wa = settingObject<{ number: string }>(settings, "whatsapp");

  const handleWhatsApp = () => {
    trackEvent("whatsapp_click", product ? { slug: product.slug, name: product.name } : undefined);
    trackWhatsAppClick();
    if (product && wa?.number) {
      openWhatsApp({
        number: wa.number,
        name: product.name,
        currency: product.currency,
        price: product.price,
        color,
      });
    }
  };

  return (
    <section id="comprar" className="hero-glow pt-20 md:pt-24">
      <div className="container-page grid grid-cols-1 items-center gap-10 py-10 md:grid-cols-2 md:gap-14 md:py-16">
        <div className="order-2 md:order-1">
          <Gallery />
        </div>

        <div className="order-1 md:order-2">
          <Badge className="mb-4 border-primary/30 bg-primary/10 px-3 py-1 text-primary">
            ✦ Melamina 15 mm
          </Badge>

          <p className="eyebrow">{heroCfg?.eyebrow ?? "Creativa Melatech · Huancayo"}</p>

          <h1 className="heading-xl mb-5 text-balance">
            {product?.headline ?? "Estante Vertical"}
            <br />
            <em className="italic text-primary">{product?.headline_em ?? "5 Niveles"}</em>
          </h1>

          <p className="mb-7 max-w-[440px] text-[15px] leading-relaxed text-muted-foreground">
            {product?.description ??
              "Diseño esquinero en melamina de 15 mm, abierto por ambos lados para una vista limpia desde cualquier ángulo."}
          </p>

          <ColorSelector
            colors={colors}
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
            {payments.map((m) => (
              <span key={m} className="chip">
                {m}
              </span>
            ))}
          </div>

          <Countdown />

          <div className="flex flex-col gap-3">
            <Button
              variant="whatsapp"
              className="h-14 w-full rounded-2xl px-8 text-base"
              onClick={handleWhatsApp}
              aria-label="Pedir por WhatsApp"
            >
              <WhatsappIcon className="size-5" />
              Pedir por WhatsApp
            </Button>
            <Button
              variant="default"
              className="h-14 w-full rounded-2xl px-8 text-base"
              onClick={() =>
                showToast(
                  "✅ ¡Perfecto! Escríbenos al WhatsApp para coordinar tu pedido.",
                )
              }
            >
              <Sparkles className="size-5" />
              Reservar ahora
            </Button>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-4">
            {trust.map((t, i) => {
              const Icon = TRUST_ICONS[i] ?? Truck;
              return (
                <span
                  key={t}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground"
                >
                  <Icon className="size-4 text-primary" />
                  {t}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
