import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/toast";
import {
  createProduct,
  deleteProduct,
  listProducts,
  setActiveProduct,
  type ProductSummary,
} from "@/lib/admin-api";

export function AdminProducts() {
  const navigate = useNavigate();
  const showToast = useToast();
  const [products, setProducts] = useState<ProductSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = async () => {
    setError(null);
    try {
      setProducts(await listProducts());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar productos");
    }
  };

  useEffect(() => {
    void load();
  }, []);

  async function handleCreate() {
    setBusyId("new");
    try {
      const id = await createProduct({
        name: "Nuevo producto",
        slug: `producto-${Date.now()}`,
        headline: "",
        headline_em: "",
        description: "",
        price: 0,
        old_price: null,
        currency: "S/",
        active: false,
        sort_order: (products?.length ?? 0) + 1,
      });
      navigate(`/admin/producto/${id}`);
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Error al crear producto");
    } finally {
      setBusyId(null);
    }
  }

  async function handleToggleActive(p: ProductSummary) {
    setBusyId(p.id);
    try {
      await setActiveProduct(p.id, !p.active);
      await load();
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Error al actualizar");
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(p: ProductSummary) {
    if (
      !window.confirm(
        `¿Eliminar "${p.name}"?\nSe borrarán sus fotos, specs, dimensiones y demás.`,
      )
    ) {
      return;
    }
    setBusyId(p.id);
    try {
      await deleteProduct(p.id);
      await load();
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Error al eliminar");
    } finally {
      setBusyId(null);
    }
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-dashed bg-card p-6 text-sm text-muted-foreground">
        {error}
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold">Productos</h1>
          <p className="text-sm text-muted-foreground">
            Gestiona el catálogo. Solo el producto activo se muestra en el sitio.
          </p>
        </div>
        <Button onClick={() => void handleCreate()} disabled={busyId === "new"}>
          {busyId === "new" ? "Creando…" : "+ Nuevo producto"}
        </Button>
      </div>

      {!products ? (
        <p className="text-sm text-muted-foreground">Cargando…</p>
      ) : products.length === 0 ? (
        <div className="rounded-2xl border border-dashed bg-card p-10 text-center text-sm text-muted-foreground">
          Aún no hay productos. Crea el primero con "+ Nuevo producto".
        </div>
      ) : (
        <div className="space-y-3">
          {products.map((p) => (
            <div
              key={p.id}
              className="flex flex-wrap items-center gap-4 rounded-2xl border bg-card p-4"
            >
              <div className="min-w-[220px] flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-heading font-bold">{p.name}</span>
                  <span
                    className={
                      p.active
                        ? "rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-medium text-emerald-700"
                        : "rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
                    }
                  >
                    {p.active ? "En el sitio" : "Oculto"}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  /{p.slug} · {p.currency} {p.price}
                  {p.old_price != null && (
                    <span className="ml-1.5 line-through">{p.old_price}</span>
                  )}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  size="sm"
                  variant={p.active ? "outline" : "default"}
                  disabled={busyId === p.id}
                  onClick={() => void handleToggleActive(p)}
                >
                  {p.active ? "Ocultar" : "Mostrar en sitio"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate(`/admin/producto/${p.id}`)}
                >
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  disabled={busyId === p.id}
                  onClick={() => void handleDelete(p)}
                >
                  Eliminar
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
