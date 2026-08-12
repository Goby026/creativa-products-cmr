import { useEffect, useState } from "react";
import { Timer } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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
      <p className="mb-2.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        <Timer className="size-4 text-primary" />
        Oferta termina en
      </p>
      <div
        className="flex gap-2.5"
        role="timer"
        aria-label="Tiempo restante de la oferta"
      >
        {units.map((unit) => (
          <Card key={unit.label} className="rounded-xl shadow-soft">
            <CardContent className="flex min-w-16 flex-col items-center gap-0.5 p-3 text-center">
              <span className="font-heading text-2xl font-bold leading-none text-foreground">
                {format(unit.value)}
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                {unit.label}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
