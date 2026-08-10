import { GA_MEASUREMENT_ID } from "./constants";

type GtagFn = (...args: unknown[]) => void;

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

export function initAnalytics() {
  if (!GA_MEASUREMENT_ID) return;
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(s);
  gtag()("js", new Date());
  gtag()("config", GA_MEASUREMENT_ID);
}

export function trackEvent(name: string) {
  gtag()("event", name, { product: "estante-5-niveles" });
}
