import { Button } from "@/components/ui/button";
import { WhatsappIcon } from "@/components/whatsapp-icon";
import { PRICE } from "@/lib/constants";
import { openWhatsApp } from "@/lib/whatsapp";
import { trackEvent } from "@/lib/analytics";

const PHONE = "948 349 852";

export function BottomCta({ color }: { color: string }) {
  const handleWhatsApp = () => {
    trackEvent("whatsapp_click");
    openWhatsApp(color);
  };

  return (
    <section className="bg-foreground px-6 py-20 text-center md:px-10">
      <h2 className="font-heading text-[38px] font-bold text-white">
        ¿Listo para organizar
        <br />
        <em className="italic text-primary-foreground">tu espacio?</em>
      </h2>
      <p className="mb-8 mt-2.5 text-[15px] text-white/50">
        Fabricado en Huancayo · Precios finales · Sin letra pequeña
      </p>
      <span className="mb-7 block font-heading text-[60px] font-bold text-primary-foreground">
        <small className="font-sans text-[22px] font-normal">
          {PRICE.currency}{" "}
        </small>
        {PRICE.current}
        <small className="ml-3 text-base text-white/35 line-through">
          {PRICE.old}
        </small>
      </span>
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
          📞 {PHONE}
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
