import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { AdminSection, useSave } from "@/components/admin/admin-ui";
import { RowEditor, type FieldDef } from "@/components/admin/row-editor";
import { useProduct } from "@/context/product-context";
import { imageUrl } from "@/lib/api";
import {
  deleteStorageFile,
  newRowId,
  replaceList,
  updateProduct,
  uploadImage,
  type Row,
} from "@/lib/admin-api";
import type { Product } from "@/lib/types";

type Editable<T> = T & { id: string };

function asRows<T>(items: Editable<T>[]): Row[] {
  return items.map((i) => ({ ...(i as unknown as Record<string, unknown>) }) as Row);
}

const SPEC_FIELDS: FieldDef[] = [
  { key: "value", label: "Valor", placeholder: "30 kg" },
  { key: "label", label: "Etiqueta", placeholder: "Por bandeja" },
];

const DIM_FIELDS: FieldDef[] = [
  { key: "name", label: "Nombre", placeholder: "Alto total" },
  { key: "value", label: "Valor", placeholder: "1750" },
  { key: "unit", label: "Unidad", placeholder: "mm" },
];

const FEATURE_FIELDS: FieldDef[] = [
  { key: "icon", label: "Ícono", placeholder: "🪟" },
  { key: "title", label: "Título", placeholder: "Abierto por ambos lados" },
  {
    key: "text",
    label: "Descripción",
    type: "textarea",
    className: "sm:col-span-2",
  },
];

const USE_FIELDS: FieldDef[] = [
  { key: "emoji", label: "Emoji", placeholder: "📚" },
  { key: "title", label: "Título", placeholder: "Librería" },
  {
    key: "text",
    label: "Descripción",
    type: "textarea",
    className: "sm:col-span-2",
  },
];

const BENEFIT_FIELDS: FieldDef[] = [
  { key: "icon", label: "Ícono", placeholder: "🚚" },
  { key: "text", label: "Texto", placeholder: "Envío en Huancayo…" },
];

const COLOR_FIELDS: FieldDef[] = [
  { key: "value", label: "Nombre", placeholder: "Blanco" },
  {
    key: "swatch",
    label: "Color (CSS)",
    placeholder: "#f5f5f0 o linear-gradient(…)",
  },
];

function GalleryEditor({
  rows,
  onChange,
}: {
  rows: Row[];
  onChange: (rows: Row[]) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const update = (id: string, key: string, value: string) =>
    onChange(rows.map((r) => (r.id === id ? { ...r, [key]: value } : r)));

  const remove = (id: string) => {
    const row = rows.find((r) => r.id === id);
    if (row && !/^https?:\/\//.test(String(row.url))) {
      void deleteStorageFile(String(row.url)).catch(() => undefined);
    }
    onChange(rows.filter((r) => r.id !== id));
  };

  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= rows.length) return;
    const next = [...rows];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next.map((r, i) => ({ ...r, sort_order: i })));
  };

  async function handleFiles(files: FileList | null) {
    if (!files) return;
    setUploading(true);
    try {
      const created: Row[] = [];
      for (const file of Array.from(files)) {
        const url = await uploadImage(file);
        created.push({
          id: newRowId(),
          url,
          alt: "",
          sort_order: rows.length + created.length,
        });
      }
      onChange([...rows, ...created]);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Error al subir imagen");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div className="space-y-4">
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => void handleFiles(e.target.files)}
      />
      <Button
        type="button"
        variant="outline"
        disabled={uploading}
        onClick={() => fileRef.current?.click()}
      >
        {uploading ? "Subiendo…" : "📷 Subir foto(s)"}
      </Button>

      {rows.length === 0 && (
        <p className="rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground">
          Sin fotos todavía
        </p>
      )}

      {rows.map((row, i) => (
        <div key={row.id} className="flex items-start gap-3 rounded-xl border p-3">
          <img
            src={imageUrl(String(row.url))}
            alt={String(row.alt ?? "")}
            className="h-16 w-16 shrink-0 rounded-lg border object-cover"
          />
          <div className="grid flex-1 gap-2 sm:grid-cols-2">
            <div>
              <Label className="mb-1 block text-xs text-muted-foreground">
                Ruta o URL
              </Label>
              <Input
                value={String(row.url ?? "")}
                onChange={(e) => update(row.id, "url", e.target.value)}
              />
            </div>
            <div>
              <Label className="mb-1 block text-xs text-muted-foreground">
                Texto alternativo
              </Label>
              <Input
                value={String(row.alt ?? "")}
                onChange={(e) => update(row.id, "alt", e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-1">
            <Button
              type="button"
              size="sm"
              variant="ghost"
              disabled={i === 0}
              onClick={() => move(i, -1)}
            >
              ↑
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              disabled={i === rows.length - 1}
              onClick={() => move(i, 1)}
            >
              ↓
            </Button>
            <Button
              type="button"
              size="sm"
              variant="destructive"
              onClick={() => remove(row.id)}
            >
              ✕
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

const EMPTY_PRODUCT: Product = {
  id: "",
  slug: "",
  name: "",
  headline: "",
  headline_em: "",
  description: "",
  price: 0,
  old_price: null,
  currency: "S/",
  active: true,
  sort_order: 0,
  created_at: "",
  updated_at: "",
};

export function AdminProductEditor() {
  const { data, reload } = useProduct();
  const product = data.product ?? EMPTY_PRODUCT;

  const [form, setForm] = useState<Product>(product);
  const [images, setImages] = useState<Row[]>([]);
  const [specs, setSpecs] = useState<Row[]>([]);
  const [dimensions, setDimensions] = useState<Row[]>([]);
  const [features, setFeatures] = useState<Row[]>([]);
  const [uses, setUses] = useState<Row[]>([]);
  const [benefits, setBenefits] = useState<Row[]>([]);
  const [colors, setColors] = useState<Row[]>([]);

  useEffect(() => {
    if (data.product) setForm(data.product);
    setImages(asRows(data.images));
    setSpecs(asRows(data.specs));
    setDimensions(asRows(data.dimensions));
    setFeatures(asRows(data.features));
    setUses(asRows(data.uses));
    setBenefits(asRows(data.benefits));
    setColors(asRows(data.colors));
  }, [data]);

  const productSave = useSave();
  const imgSave = useSave();
  const specSave = useSave();
  const dimSave = useSave();
  const featSave = useSave();
  const useSave_ = useSave();
  const benSave = useSave();
  const colSave = useSave();

  const patch = (key: keyof Product, value: Product[keyof Product]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const saveProduct = () =>
    productSave.run(async () => {
      await updateProduct(product.id, {
        name: form.name,
        slug: form.slug,
        headline: form.headline,
        headline_em: form.headline_em,
        description: form.description,
        price: Number(form.price) || 0,
        old_price:
          form.old_price == null || form.old_price === 0
            ? null
            : Number(form.old_price),
        currency: form.currency,
        active: form.active,
        sort_order: Number(form.sort_order) || 0,
      });
      await reload();
    });

  const saveImages = () =>
    imgSave.run(async () => {
      await replaceList("product_images", product.id, images);
      await reload();
    });

  const saveSpecs = () =>
    specSave.run(async () => {
      await replaceList("specs", product.id, specs);
      await reload();
    });

  const saveDimensions = () =>
    dimSave.run(async () => {
      await replaceList("dimensions", product.id, dimensions);
      await reload();
    });

  const saveFeatures = () =>
    featSave.run(async () => {
      await replaceList("features", product.id, features);
      await reload();
    });

  const saveUses = () =>
    useSave_.run(async () => {
      await replaceList("uses", product.id, uses);
      await reload();
    });

  const saveBenefits = () =>
    benSave.run(async () => {
      await replaceList("benefits", product.id, benefits);
      await reload();
    });

  const saveColors = () =>
    colSave.run(async () => {
      await replaceList("colors", product.id, colors);
      await reload();
    });

  if (!data.product) {
    return (
      <div className="rounded-2xl border border-dashed bg-card p-6 text-sm text-muted-foreground">
        No hay un producto activo en la base de datos.
      </div>
    );
  }

  return (
    <>
      <div>
        <h1 className="font-heading text-2xl font-bold">Editor de producto</h1>
        <p className="text-sm text-muted-foreground">
          Los cambios se guardan directamente en la base de datos.
        </p>
      </div>

      <AdminSection
        title="Datos del producto"
        onSave={saveProduct}
        saving={productSave.saving}
        saved={productSave.saved}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Nombre</Label>
            <Input
              value={form.name}
              onChange={(e) => patch("name", e.target.value)}
            />
          </div>
          <div>
            <Label>Slug (URL)</Label>
            <Input
              value={form.slug}
              onChange={(e) => patch("slug", e.target.value)}
            />
          </div>
          <div>
            <Label>Encabezado (h1)</Label>
            <Input
              value={form.headline ?? ""}
              onChange={(e) => patch("headline", e.target.value)}
            />
          </div>
          <div>
            <Label>Encabezado en itálica</Label>
            <Input
              value={form.headline_em ?? ""}
              onChange={(e) => patch("headline_em", e.target.value)}
            />
          </div>
          <div className="sm:col-span-2">
            <Label>Descripción</Label>
            <Textarea
              rows={4}
              value={form.description ?? ""}
              onChange={(e) => patch("description", e.target.value)}
            />
          </div>
          <div>
            <Label>Moneda</Label>
            <Input
              value={form.currency}
              onChange={(e) => patch("currency", e.target.value)}
            />
          </div>
          <div>
            <Label>Precio (actual)</Label>
            <Input
              type="number"
              value={form.price}
              onChange={(e) => patch("price", Number(e.target.value))}
            />
          </div>
          <div>
            <Label>Precio anterior (0 = sin oferta)</Label>
            <Input
              type="number"
              value={form.old_price ?? 0}
              onChange={(e) =>
                patch("old_price", e.target.value === "" ? null : Number(e.target.value))
              }
            />
          </div>
          <div>
            <Label>Orden</Label>
            <Input
              type="number"
              value={form.sort_order}
              onChange={(e) => patch("sort_order", Number(e.target.value))}
            />
          </div>
          <label className="flex items-center gap-2 pt-5 text-sm font-medium">
            <Switch
              checked={form.active}
              onCheckedChange={(c) => patch("active", c)}
            />
            Producto activo (visible en el sitio)
          </label>
        </div>
      </AdminSection>

      <AdminSection
        title="Galería de fotos"
        description="Sube imágenes desde tu equipo. Las fotos iniciales (esquinero1–4) se subirán en la configuración inicial."
        onSave={saveImages}
        saving={imgSave.saving}
        saved={imgSave.saved}
      >
        <GalleryEditor rows={images} onChange={setImages} />
      </AdminSection>

      <AdminSection
        title="Colores del acabado"
        description="swatch acepta un color hex (#fff) o un gradiente CSS."
        onSave={saveColors}
        saving={colSave.saving}
        saved={colSave.saved}
      >
        <RowEditor rows={colors} fields={COLOR_FIELDS} onChange={setColors} />
      </AdminSection>

      <AdminSection
        title="Cifras destacadas (specs)"
        onSave={saveSpecs}
        saving={specSave.saving}
        saved={specSave.saved}
      >
        <RowEditor rows={specs} fields={SPEC_FIELDS} onChange={setSpecs} />
      </AdminSection>

      <AdminSection
        title="Dimensiones"
        onSave={saveDimensions}
        saving={dimSave.saving}
        saved={dimSave.saved}
      >
        <RowEditor rows={dimensions} fields={DIM_FIELDS} onChange={setDimensions} />
      </AdminSection>

      <AdminSection
        title="Características"
        onSave={saveFeatures}
        saving={featSave.saving}
        saved={featSave.saved}
      >
        <RowEditor rows={features} fields={FEATURE_FIELDS} onChange={setFeatures} />
      </AdminSection>

      <AdminSection
        title="Usos recomendados"
        onSave={saveUses}
        saving={useSave_.saving}
        saved={useSave_.saved}
      >
        <RowEditor rows={uses} fields={USE_FIELDS} onChange={setUses} />
      </AdminSection>

      <AdminSection
        title="Beneficios (franja inferior)"
        onSave={saveBenefits}
        saving={benSave.saving}
        saved={benSave.saved}
      >
        <RowEditor rows={benefits} fields={BENEFIT_FIELDS} onChange={setBenefits} />
      </AdminSection>
    </>
  );
}
