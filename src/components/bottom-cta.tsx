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
    trackEvent("whatsapp_click");
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
    <section className="bg-foreground px-6 py-20 text-center md:px-10">
      <h2 className="font-heading text-[38px] font-bold text-white">
        {cfg?.title ?? "¿Listo para organizar"}
        <br />
        <em className="italic text-primary-foreground">
          {cfg?.title_em ?? "tu espacio?"}
        </em>
      </h2>
      <p className="mb-8 mt-2.5 text-[15px] text-white/50">
        {cfg?.subtitle ?? "Fabricado en Huancayo · Precios finales · Sin letra pequeña"}
      </p>
      {product && (
        <span className="mb-7 block font-heading text-[60px] font-bold text-primary-foreground">
          <small className="font-sans text-[22px] font-normal">
            {product.currency}{" "}
          </small>
          {product.price}
          {product.old_price != null && (
            <small className="ml-3 text-base text-white/35 line-through">
              {product.old_price}
            </small>
          )}
        </span>
      )}
      <br />
      <Button
        variant="whatsapp"
        className="h-[60px] px-12 text-[17px]"
        onClick={handleWhatsApp}
        aria-label="Escribir al WhatsApp"
      >
        <WhatsappIcon className="size-5" />
        Escribir al WhatsApp
      </Button>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
        <span className="flex items-center gap-1.5 text-xs text-white/40">
          📞 {wa?.display ?? ""}
        </span>
        <span className="flex items-center gap-1.5 text-xs text-white/40">
          📍 Huancayo, Junín
        </span>
        <span className="flex items-center gap-1.5 text-xs text-white/40">
          🏭 Creativa Melatech
        </span>
      </div>
    </section>
  );
}
