type GtagFn = (...args: unknown[]) => void;

let GA_ID = "";

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
