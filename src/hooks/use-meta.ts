import { useEffect } from "react";
import { settingObject } from "@/lib/api";
import type { Product, SiteSettings } from "@/lib/types";

type Seo = {
  title?: string;
  description?: string;
  og_image?: string;
};

function setMeta(attr: string, name: string, content: string | null) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
  if (!content) {
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.content = content;
}

function setJsonLd(product: Product | null, seo: Seo | undefined) {
  const existing = document.getElementById("product-jsonld");
  existing?.remove();
  if (!seo) return;

  const offers = product
    ? {
        "@type": "Offer",
        url: "https://creativamelatech.com/esquinero-5-niveles",
        priceCurrency: product.currency === "$" ? "USD" : "PEN",
        price: String(product.price),
        availability: "https://schema.org/InStock",
        itemCondition: "https://schema.org/NewCondition",
      }
    : null;

  const el = document.createElement("script");
  el.type = "application/ld+json";
  el.id = "product-jsonld";
  el.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Product",
    name: seo.title ?? product?.name ?? "Estante Vertical 5 Niveles",
    image: seo.og_image ? [seo.og_image] : undefined,
    description: seo.description ?? undefined,
    brand: { "@type": "Brand", name: "Creativa Melatech" },
    sku: "CM-EV-5N",
    ...(offers ? { offers } : {}),
  });
  document.head.appendChild(el);
}

export function useMeta(settings: SiteSettings, product: Product | null) {
  const seo = settingObject<Seo>(settings, "seo");
  const title = seo?.title ?? product?.name ?? "Estante Vertical 5 Niveles | Creativa Melatech";

  useEffect(() => {
    document.title = title;
    setMeta("name", "description", seo?.description ?? null);
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", seo?.description ?? null);
    setMeta("property", "og:image", seo?.og_image ?? null);
    setJsonLd(product, seo);
  }, [title, seo?.description, seo?.og_image, product]);
}
