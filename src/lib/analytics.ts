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

export function trackEvent(name: string) {
  if (!GA_ID) return;
  gtag()("event", name, { product: "estante-5-niveles" });
}

async function logEvent(event: string) {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase.from("analytics_events").insert({ event });
  if (error) {
    console.warn("analytics_events:", error.message);
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
