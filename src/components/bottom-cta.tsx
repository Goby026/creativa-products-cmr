import { MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhatsappIcon } from "@/components/whatsapp-icon";
import { openWhatsApp } from "@/lib/whatsapp";
import { trackEvent, trackWhatsAppClick } from "@/lib/analytics";
import { settingObject } from "@/lib/api";
import { useProduct } from "@/context/product-context";

type BottomCtaConfig = {
  title?: string;
  title_em?: string;
  subtitle?: string;
};

export function BottomCta({ color }: { color: string }) {
  const { data } = useProduct();
  const { product, settings } = data;

  const wa = settingObject<{ number: string; display: string }>(
    settings,
    "whatsapp",
  );
  const cfg = settingObject<BottomCtaConfig>(settings, "bottom_cta");

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
    <section className="section container-page">
      <div className="relative overflow-hidden rounded-3xl bg-foreground px-6 py-16 text-center shadow-lifted md:px-10 md:py-20">
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 10%, rgba(255,255,255,0.35), transparent 45%), radial-gradient(circle at 85% 90%, rgba(255,255,255,0.2), transparent 45%)",
          }}
          aria-hidden="true"
        />
        <div className="relative">
          <h2 className="heading-xl text-balance text-background">
            {cfg?.title ?? "¿Listo para organizar"}
            <br />
            <em className="italic text-primary-foreground">
              {cfg?.title_em ?? "tu espacio?"}
            </em>
          </h2>
          <p className="mx-auto mb-8 mt-2.5 max-w-md text-[15px] text-background/60">
            {cfg?.subtitle ?? "Fabricado en Huancayo · Precios finales · Sin letra pequeña"}
          </p>
          {product && (
            <p className="mb-7 font-heading text-[56px] font-bold leading-none text-primary-foreground">
              <small className="font-sans text-[22px] font-normal">
                {product.currency}{" "}
              </small>
              {product.price}
              {product.old_price != null && (
                <small className="ml-3 text-base text-background/40 line-through">
                  {product.old_price}
                </small>
              )}
            </p>
          )}
          <Button
            variant="whatsapp"
            className="h-[60px] rounded-2xl px-12 text-[17px]"
            onClick={handleWhatsApp}
            aria-label="Escribir al WhatsApp"
          >
            <WhatsappIcon className="size-5" />
            Escribir al WhatsApp
          </Button>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <span className="flex items-center gap-1.5 text-xs text-background/50">
              <Phone className="size-3.5" />
              {wa?.display ?? ""}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-background/50">
              <MapPin className="size-3.5" />
              Huancayo, Junín
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
