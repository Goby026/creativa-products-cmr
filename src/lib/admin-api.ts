import { supabase } from "./supabase";
import { IMAGE_BUCKET } from "./api";
import type { Product, Json } from "./types";

export type ChildTable =
  | "specs"
  | "dimensions"
  | "features"
  | "uses"
  | "benefits"
  | "colors"
  | "product_images";

export type Row = {
  id: string;
  sort_order: number;
  [key: string]: unknown;
};

export type ProductSummary = Pick<
  Product,
  | "id"
  | "slug"
  | "name"
  | "headline"
  | "price"
  | "old_price"
  | "currency"
  | "active"
  | "sort_order"
  | "updated_at"
>;

export type ProductPatch = Partial<
  Omit<Product, "id" | "created_at" | "updated_at">
>;

export type ProductInsert = Omit<
  Product,
  "id" | "created_at" | "updated_at"
>;

export function newRowId(): string {
  return `new-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export type AnalyticsCounters = { visits: number; whatsapp: number };

export async function getAnalyticsCounters(): Promise<AnalyticsCounters> {
  const { data, error } = await supabase
    .from("analytics_counters")
    .select("event,count");
  if (error) throw new Error(error.message);
  const byEvent = new Map((data ?? []).map((r) => [r.event, r.count]));
  return {
    visits: byEvent.get("visit") ?? 0,
    whatsapp: byEvent.get("whatsapp_click") ?? 0,
  };
}

export async function listProducts(): Promise<ProductSummary[]> {
  const { data, error } = await supabase
    .from("products")
    .select(
      "id,slug,name,headline,price,old_price,currency,active,sort_order,updated_at",
    )
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function createProduct(patch: ProductInsert): Promise<string> {
  const { data, error } = await supabase
    .from("products")
    .insert(patch)
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  return data.id;
}

export async function deleteProduct(id: string) {
  const { data: images, error: imgError } = await supabase
    .from("product_images")
    .select("url")
    .eq("product_id", id);
  if (imgError) throw new Error(imgError.message);

  const paths = (images ?? [])
    .map((i) => i.url)
    .filter((u) => !/^https?:\/\//.test(u));
  if (paths.length > 0) {
    await supabase.storage.from(IMAGE_BUCKET).remove(paths);
  }

  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function updateProduct(id: string, patch: ProductPatch) {
  const { error } = await supabase
    .from("products")
    .update(patch)
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function replaceList(
  table: ChildTable,
  productId: string,
  rows: Row[],
) {
  const payload = rows.map(({ id: _id, ...rest }) => ({
    ...rest,
    product_id: productId,
  }));
  const { error } = await supabase.rpc("replace_product_rows", {
    p_table: table,
    p_product_id: productId,
    p_rows: payload as unknown as Json,
  });
  if (error) throw new Error(error.message);
}

/** Activa/desactiva un producto garantizando un único activo en la DB. */
export async function setActiveProduct(id: string, active: boolean) {
  if (active) {
    const { data: others, error: listErr } = await supabase
      .from("products")
      .select("id")
      .eq("active", true)
      .neq("id", id);
    if (listErr) throw new Error(listErr.message);
    for (const other of others ?? []) {
      const { error } = await supabase
        .from("products")
        .update({ active: false })
        .eq("id", other.id);
      if (error) throw new Error(error.message);
    }
  }
  await updateProduct(id, { active });
}

/** Verifica si un slug ya está en uso por otro producto. */
export async function slugExists(
  slug: string,
  exceptId?: string,
): Promise<boolean> {
  let query = supabase.from("products").select("id").eq("slug", slug);
  if (exceptId) query = query.neq("id", exceptId);
  const { data, error } = await query.maybeSingle();
  if (error) throw new Error(error.message);
  return data != null;
}

export async function upsertSetting(key: string, value: Json) {
  const { error } = await supabase
    .from("site_settings")
    .upsert({ key, value }, { onConflict: "key" });
  if (error) throw new Error(error.message);
}

export async function uploadImage(file: File): Promise<string> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage
    .from(IMAGE_BUCKET)
    .upload(path, file, { cacheControl: "3600", upsert: false });
  if (error) throw new Error(error.message);
  return path;
}

export async function deleteStorageFile(path: string) {
  if (!path || /^https?:\/\//.test(path)) return;
  const { error } = await supabase.storage
    .from(IMAGE_BUCKET)
    .remove([path]);
  if (error) throw new Error(error.message);
}
