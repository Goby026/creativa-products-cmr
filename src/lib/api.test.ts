import { describe, expect, it } from "vitest";
import { imageUrl, settingArray, settingObject, settingString } from "./api";
import type { SiteSettings } from "./types";

describe("setting helpers", () => {
  const settings: SiteSettings = {
    whatsapp: { number: "51948349852" },
    payments: ["Yape", "Plin"],
    trust: [],
    brand: "texto-simple",
  };

  it("settingString devuelve el valor o el fallback", () => {
    expect(settingString(settings, "brand")).toBe("texto-simple");
    expect(settingString(settings, "no-existe", "fb")).toBe("fb");
    expect(settingString(settings, "whatsapp", "fb")).toBe("fb");
  });

  it("settingArray devuelve arrays o el fallback", () => {
    expect(settingArray(settings, "payments")).toEqual(["Yape", "Plin"]);
    expect(settingArray(settings, "trust")).toEqual([]);
    expect(settingArray(settings, "no-existe", ["x"])).toEqual(["x"]);
  });

  it("settingObject devuelve objetos o undefined", () => {
    expect(settingObject<{ number: string }>(settings, "whatsapp")).toEqual({
      number: "51948349852",
    });
    expect(settingObject(settings, "payments")).toBeUndefined();
    expect(settingObject(settings, "no-existe")).toBeUndefined();
  });
});

describe("imageUrl", () => {
  it("deja intactas las URLs absolutas", () => {
    expect(imageUrl("https://ejemplo.com/esquinero1.jpg")).toBe(
      "https://ejemplo.com/esquinero1.jpg",
    );
  });

  it("resuelve rutas de storage a una URL pública", () => {
    const url = imageUrl("esquinero1.jpg");
    expect(url).toContain("esquinero1.jpg");
    if (url.startsWith("http")) {
      expect(url).toContain("/storage/v1/object/public/product-images/");
    } else {
      expect(url).toBe("esquinero1.jpg");
    }
  });
});
