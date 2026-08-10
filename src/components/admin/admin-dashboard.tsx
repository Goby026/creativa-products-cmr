import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useProduct } from "@/context/product-context";

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border bg-card p-4 text-center">
      <p className="font-heading text-3xl font-bold">{value}</p>
      <p className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
    </div>
  );
}

export function AdminDashboard() {
  const { data, reload } = useProduct();
  const p = data.product;

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">Resumen</h1>
          <p className="text-sm text-muted-foreground">
            Estado actual del sitio y atajos de edición.
          </p>
        </div>
        <Button variant="outline" onClick={() => void reload()}>
          ↻ Recargar datos
        </Button>
      </div>

      {p ? (
        <div className="rounded-2xl border bg-card p-5 md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-heading text-xl font-bold">{p.name}</h2>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {p.currency} {p.price}
                {p.old_price != null && (
                  <span className="ml-2 line-through">{p.old_price}</span>
                )}
                {" · "}
                {p.active ? (
                  <span className="font-medium text-emerald-600">Activo</span>
                ) : (
                  <span className="font-medium text-destructive">Inactivo</span>
                )}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Link to={`/admin/producto/${p.id}`}>
                <Button>Editar producto</Button>
              </Link>
              <Link to="/admin/productos">
                <Button variant="outline">Ver todos</Button>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed bg-card p-6 text-sm text-muted-foreground">
          No hay un producto activo mostrado en el sitio.{" "}
          <Link to="/admin/productos" className="font-medium text-primary underline">
            Gestionar productos
          </Link>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat label="Fotos" value={data.images.length} />
        <Stat label="Specs" value={data.specs.length} />
        <Stat label="Dimensiones" value={data.dimensions.length} />
        <Stat label="Beneficios" value={data.benefits.length} />
        <Stat label="Features" value={data.features.length} />
        <Stat label="Usos" value={data.uses.length} />
        <Stat label="Colores" value={data.colors.length} />
        <Stat label="Ajustes" value={Object.keys(data.settings).length} />
      </div>
    </>
  );
}
