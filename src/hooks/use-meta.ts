import { useEffect } from "react";
import { settingObject } from "@/lib/api";
import type { SiteSettings } from "@/lib/types";

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

export function useMeta(settings: SiteSettings) {
  const seo = settingObject<Seo>(settings, "seo");
  const title = seo?.title ?? "Estante Vertical 5 Niveles | Creativa Melatech";

  useEffect(() => {
    document.title = title;
    setMeta("name", "description", seo?.description ?? null);
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", seo?.description ?? null);
    setMeta("property", "og:image", seo?.og_image ?? null);
  }, [title, seo?.description, seo?.og_image]);
}
