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
    <footer className="bg-foreground px-6 py-12 text-white md:px-10">
      <div className="grid gap-10 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            <img
              src="/logo-cm.png"
              alt={legal}
              className="h-12 w-12 rounded-xl bg-white object-contain"
            />
            <div>
              <p className="font-heading text-base font-bold text-primary-foreground">
                {brand}
              </p>
              <p className="text-[11px] uppercase tracking-wide text-white/40">
                {type}
              </p>
            </div>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-white/50">
            {activity}
          </p>
          <span className="mt-3 inline-block rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-white/70">
            RUC {ruc} · {status}
          </span>
        </div>

        <div>
          <p className="mb-3 font-heading text-xs font-bold uppercase tracking-wider text-white/40">
            Datos de la empresa
          </p>
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between gap-4 text-xs">
              <span className="text-white/40">Razón social</span>
              <span className="text-right text-white/80">{legal}</span>
            </li>
            <li className="flex justify-between gap-4 text-xs">
              <span className="text-white/40">RUC</span>
              <span className="text-white/80">{ruc}</span>
            </li>
            <li className="flex justify-between gap-4 text-xs">
              <span className="text-white/40">Tipo</span>
              <span className="text-right text-white/80">{type}</span>
            </li>
            <li className="flex justify-between gap-4 text-xs">
              <span className="text-white/40">Estado</span>
              <span className="text-white/80">{status}</span>
            </li>
          </ul>
        </div>

        <div>
          <p className="mb-3 font-heading text-xs font-bold uppercase tracking-wider text-white/40">
            Contacto
          </p>
          <ul className="space-y-2 text-sm">
            <li className="text-xs text-white/80">📍 {city}</li>
            <li className="text-xs text-white/80">📞 {phone}</li>
            <li className="text-xs text-white/80">✉️ {email}</li>
          </ul>
        </div>
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5 text-[11px] text-white/35">
        <span>
          © {new Date().getFullYear()} {legal} · RUC {ruc}
        </span>
        <span className="flex items-center gap-4">
          <span>Precios en soles (S/) · Incluye IGV</span>
          <a
            href="/admin/login"
            className="inline-flex items-center gap-1.5 text-white/35 transition-colors hover:text-white/70"
            aria-label="Acceso administradores"
          >
            🔐 Administrar
          </a>
        </span>
      </div>
    </footer>
  );
}
