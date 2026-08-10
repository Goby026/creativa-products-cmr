import { supabase } from "./supabase";
import { IMAGE_BUCKET } from "./api";
import type {
  Product,
  ProductImage,
  Spec,
  Dimension,
  Feature,
  Use,
  Benefit,
  Color,
  Json,
} from "./types";

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

type ChildInsert =
  | Omit<ProductImage, "id">
  | Omit<Spec, "id">
  | Omit<Dimension, "id">
  | Omit<Feature, "id">
  | Omit<Use, "id">
  | Omit<Benefit, "id">
  | Omit<Color, "id">;

export function newRowId(): string {
  return `new-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export async function updateProduct(
  id: string,
  patch: Partial<Omit<Product, "id" | "created_at" | "updated_at">>,
) {
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
  const { error: delError } = await supabase
    .from(table)
    .delete()
    .eq("product_id", productId);
  if (delError) throw new Error(delError.message);

  if (rows.length === 0) return;

  const payload = rows.map(({ id: _id, ...rest }) => ({
    ...rest,
    product_id: productId,
  }));
  const { error } = await supabase
    .from(table)
    .insert(payload as unknown as ChildInsert[]);
  if (error) throw new Error(error.message);
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
