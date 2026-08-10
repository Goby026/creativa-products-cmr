import { supabase, isSupabaseConfigured } from "./supabase";
import type {
  Product,
  ProductImage,
  Spec,
  Dimension,
  Feature,
  Use,
  Benefit,
  Color,
  SiteSettings,
  Json,
} from "./types";

export type ProductBundle = {
  product: Product | null;
  images: ProductImage[];
  specs: Spec[];
  dimensions: Dimension[];
  features: Feature[];
  uses: Use[];
  benefits: Benefit[];
  colors: Color[];
  settings: SiteSettings;
};

export const IMAGE_BUCKET = "product-images";

export function imageUrl(path: string): string {
  if (!isSupabaseConfigured) return path;
  if (/^https?:\/\//.test(path)) return path;
  const { data } = supabase.storage
    .from(IMAGE_BUCKET)
    .getPublicUrl(path.replace(/^\//, ""));
  return data.publicUrl;
}

export async function fetchProductBundle(): Promise<ProductBundle> {
  const { data: product, error: productError } = await supabase
    .from("products")
    .select("*")
    .eq("active", true)
    .order("sort_order", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (productError) throw productError;

  const empty: ProductBundle = {
    product: null,
    images: [],
    specs: [],
    dimensions: [],
    features: [],
    uses: [],
    benefits: [],
    colors: [],
    settings: {},
  };

  if (!product) return empty;

  const [images, specs, dimensions, features, uses, benefits, colors, settings] =
    await Promise.all([
      supabase
        .from("product_images")
        .select("*")
        .eq("product_id", product.id)
        .order("sort_order", { ascending: true }),
      supabase
        .from("specs")
        .select("*")
        .eq("product_id", product.id)
        .order("sort_order", { ascending: true }),
      supabase
        .from("dimensions")
        .select("*")
        .eq("product_id", product.id)
        .order("sort_order", { ascending: true }),
      supabase
        .from("features")
        .select("*")
        .eq("product_id", product.id)
        .order("sort_order", { ascending: true }),
      supabase
        .from("uses")
        .select("*")
        .eq("product_id", product.id)
        .order("sort_order", { ascending: true }),
      supabase
        .from("benefits")
        .select("*")
        .eq("product_id", product.id)
        .order("sort_order", { ascending: true }),
      supabase
        .from("colors")
        .select("*")
        .eq("product_id", product.id)
        .order("sort_order", { ascending: true }),
      supabase.from("site_settings").select("key,value"),
    ]);

  const rows = (r: { data: unknown; error: unknown }): unknown[] =>
    r.error ? [] : (r.data as unknown[]);

  return {
    product,
    images: rows(images) as ProductImage[],
    specs: rows(specs) as Spec[],
    dimensions: rows(dimensions) as Dimension[],
    features: rows(features) as Feature[],
    uses: rows(uses) as Use[],
    benefits: rows(benefits) as Benefit[],
    colors: rows(colors) as Color[],
    settings: (settings.data ?? []).reduce<SiteSettings>(
      (acc, row) => {
        acc[row.key] = row.value;
        return acc;
      },
      {},
    ),
  };
}

export function setting<T>(settings: SiteSettings, key: string): T | undefined {
  return settings[key] as T | undefined;
}

export function settingString(
  settings: SiteSettings,
  key: string,
  fallback = "",
): string {
  const v = settings[key];
  return typeof v === "string" ? v : fallback;
}

export function settingArray<T = string>(
  settings: SiteSettings,
  key: string,
  fallback: T[] = [],
): T[] {
  const v = settings[key];
  return Array.isArray(v) ? (v as T[]) : fallback;
}

export function settingObject<T extends Json>(
  settings: SiteSettings,
  key: string,
): T | undefined {
  const v = settings[key];
  return v !== null && typeof v === "object" && !Array.isArray(v)
    ? (v as T)
    : undefined;
}
