import { Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { settingObject, settingString } from "@/lib/api";
import { useProduct } from "@/context/product-context";

type Company = {
  legal_name?: string;
  ruc?: string;
  type?: string;
  activity?: string;
  phone?: string;
  email?: string;
  city?: string;
  status?: string;
};

export function Footer() {
  const { data } = useProduct();
  const brand = settingString(data.settings, "brand.footer", "Creativa Melatech");
  const c = settingObject<Company>(data.settings, "company") ?? {};

  const legal = c.legal_name ?? "CREATIVA MELATECH S.A.C.";
  const ruc = c.ruc ?? "20615245322";
  const type = c.type ?? "Sociedad Anónima Cerrada";
  const activity =
    c.activity ??
    "Venta al por menor y mayor de computadoras, periféricos y programas de informática";
  const phone = c.phone ?? "948 349 852";
  const email = c.email ?? "george.rendich@gmail.com";
  const city = c.city ?? "Huancayo, Junín — Perú";
  const status = c.status ?? "Activo · Habido";

  return (
    <footer className="border-t bg-muted/40">
      <div className="container-page grid gap-10 py-12 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            <img
              src="/logo-cm.png"
              alt={legal}
              className="size-12 rounded-xl bg-white object-contain ring-1 ring-border"
            />
            <div>
              <p className="font-heading text-base font-bold text-foreground">
                {brand}
              </p>
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                {type}
              </p>
            </div>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            {activity}
          </p>
          <p className="mt-3 inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1 text-[11px] font-semibold text-muted-foreground">
            <ShieldCheck className="size-3.5 text-primary" />
            RUC {ruc} · {status}
          </p>
        </div>

        <div>
          <p className="mb-3 font-heading text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Datos de la empresa
          </p>
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between gap-4 text-xs">
              <span className="text-muted-foreground">Razón social</span>
              <span className="text-right font-medium text-foreground">{legal}</span>
            </li>
            <li className="flex justify-between gap-4 text-xs">
              <span className="text-muted-foreground">RUC</span>
              <span className="font-medium text-foreground">{ruc}</span>
            </li>
            <li className="flex justify-between gap-4 text-xs">
              <span className="text-muted-foreground">Tipo</span>
              <span className="text-right font-medium text-foreground">{type}</span>
            </li>
            <li className="flex justify-between gap-4 text-xs">
              <span className="text-muted-foreground">Estado</span>
              <span className="font-medium text-foreground">{status}</span>
            </li>
          </ul>
        </div>

        <div>
          <p className="mb-3 font-heading text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Contacto
          </p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2 text-xs text-foreground">
              <MapPin className="size-3.5 shrink-0 text-primary" />
              {city}
            </li>
            <li className="flex items-center gap-2 text-xs text-foreground">
              <Phone className="size-3.5 shrink-0 text-primary" />
              {phone}
            </li>
            <li className="flex items-center gap-2 text-xs text-foreground">
              <Mail className="size-3.5 shrink-0 text-primary" />
              {email}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t">
        <div className="container-page flex flex-wrap items-center justify-between gap-3 py-5 text-[11px] text-muted-foreground">
          <span>
            © {new Date().getFullYear()} {legal} · RUC {ruc}
          </span>
          <span className="flex items-center gap-4">
            <span>Precios en soles (S/) · Incluye IGV</span>
            <a
              href="/admin/login"
              className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-primary"
              aria-label="Acceso administradores"
            >
              🔐 Administrar
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
