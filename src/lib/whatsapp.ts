import { WA_NUMBER, PRODUCT_NAME, PRICE } from "./constants";

export function buildWhatsAppMessage(color: string): string {
  const colorMsg = color === "A pedido" ? "a pedido (coordinar color)" : color;
  return (
    "Hola Creativa Melatech 👋\n\nEstoy interesado/a en el *" +
    PRODUCT_NAME +
    "* a " +
    PRICE.currency +
    " " +
    PRICE.current +
    ".\n" +
    "📌 Color: " +
    colorMsg +
    "\n\n¿Tienen disponibilidad? ¿Cómo coordino el pedido?"
  );
}

export function openWhatsApp(color: string): void {
  const url =
    "https://wa.me/" +
    WA_NUMBER +
    "?text=" +
    encodeURIComponent(buildWhatsAppMessage(color));
  window.open(url, "_blank", "noopener");
}
