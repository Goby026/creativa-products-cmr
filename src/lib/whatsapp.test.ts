import { describe, expect, it } from "vitest";
import { buildWhatsAppMessage } from "./whatsapp";

describe("buildWhatsAppMessage", () => {
  const base = {
    number: "51948349852",
    name: "Estante Vertical 5 Niveles",
    currency: "S/",
    price: 120,
    color: "Blanco",
  };

  it("incluye nombre, precio y color", () => {
    const msg = buildWhatsAppMessage(base);
    expect(msg).toContain("Estante Vertical 5 Niveles");
    expect(msg).toContain("S/ 120");
    expect(msg).toContain("Blanco");
  });

  it("indica coordinar color cuando el color es A pedido", () => {
    const msg = buildWhatsAppMessage({ ...base, color: "A pedido" });
    expect(msg).toContain("coordinar color");
  });
});
