import { supabase, isSupabaseConfigured } from "./supabase";

type GtagFn = (...args: unknown[]) => void;

let GA_ID = "";
let visitLogged = false;

function gtag(): GtagFn {
  const w = window as unknown as { gtag?: GtagFn; dataLayer?: unknown[] };
  w.dataLayer = w.dataLayer || [];
  if (!w.gtag) {
    w.gtag = function (...args: unknown[]) {
      w.dataLayer!.push(args);
    };
  }
  return w.gtag;
}

function inject() {
  if (!GA_ID || document.querySelector('script[data-ga4]')) return;
  const s = document.createElement("script");
  s.dataset.ga4 = "true";
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);
  gtag()("js", new Date());
  gtag()("config", GA_ID);
}

export function initAnalytics() {
  inject();
}

export function setMeasurementId(id: string) {
  GA_ID = id || "";
  if (GA_ID) inject();
}

export function trackEvent(
  name: string,
  product?: { slug?: string | null; name?: string | null },
) {
  if (!GA_ID) return;
  gtag()("event", name, {
    product: product?.slug ?? undefined,
    product_name: product?.name ?? undefined,
  });
}

async function logEvent(event: string) {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase.rpc("increment_event", { p_event: event });
  if (error) {
    console.warn("increment_event:", error.message);
  }
}

/** Registra una visita: una por carga de página. */
export function trackVisit() {
  if (visitLogged) return;
  visitLogged = true;
  void logEvent("visit");
}

/** Registra un click en el botón de WhatsApp. */
export function trackWhatsAppClick() {
  void logEvent("whatsapp_click");
}
