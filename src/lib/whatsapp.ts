type Order = {
  number: string;
  name: string;
  currency: string;
  price: number;
  color: string;
};

export function buildWhatsAppMessage({ name, currency, price, color }: Order): string {
  const colorMsg = color === "A pedido" ? "a pedido (coordinar color)" : color;
  return (
    "Hola Creativa Melatech 👋\n\nEstoy interesado/a en el *" +
    name +
    "* a " +
    currency +
    " " +
    price +
    ".\n" +
    "📌 Color: " +
    colorMsg +
    "\n\n¿Tienen disponibilidad? ¿Cómo coordino el pedido?"
  );
}

export function openWhatsApp(order: Order): void {
  const url =
    "https://wa.me/" +
    order.number +
    "?text=" +
    encodeURIComponent(buildWhatsAppMessage(order));
  window.open(url, "_blank", "noopener");
}
