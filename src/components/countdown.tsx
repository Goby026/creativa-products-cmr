import { useEffect, useState } from "react";

const OFFER_HOURS_MS = 24 * 60 * 60 * 1000;

function getOfferEnd(): number {
  const stored = parseInt(localStorage.getItem("offerEnd") ?? "", 10);
  if (!stored || Date.now() > stored) {
    const next = Date.now() + OFFER_HOURS_MS;
    localStorage.setItem("offerEnd", String(next));
    return next;
  }
  return stored;
}

function format(n: number): string {
  return String(n).padStart(2, "0");
}

export function Countdown() {
  const [remaining, setRemaining] = useState(() =>
    Math.max(0, getOfferEnd() - Date.now()),
  );

  useEffect(() => {
    const id = window.setInterval(() => {
      setRemaining(Math.max(0, getOfferEnd() - Date.now()));
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  const units = [
    { label: "Horas", value: Math.floor(remaining / 3600000) },
    { label: "Min", value: Math.floor((remaining % 3600000) / 60000) },
    { label: "Seg", value: Math.floor((remaining % 60000) / 1000) },
  ];

  return (
    <div className="mb-6">
      <p className="mb-2.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        ⏱ Oferta termina en
      </p>
      <div
        className="flex gap-2.5"
        role="timer"
        aria-label="Tiempo restante de la oferta"
      >
        {units.map((unit) => (
          <div
            key={unit.label}
            className="min-w-14 rounded-[10px] bg-foreground px-3.5 py-2.5 text-center text-primary-foreground"
          >
            <span className="block font-heading text-[22px] font-bold leading-none">
              {format(unit.value)}
            </span>
            <span className="mt-1 block text-[9px] font-semibold uppercase tracking-widest text-white/50">
              {unit.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
