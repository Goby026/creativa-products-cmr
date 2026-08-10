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

const transformsEnabled = import.meta.env.VITE_IMG_TRANSFORM !== "0";

export function imageUrl(
  path: string,
  opts: { w?: number; q?: number } = {},
): string {
  if (!isSupabaseConfigured) return path;
  if (/^https?:\/\//.test(path)) return path;
  const clean = path.replace(/^\//, "");
  const transform =
    transformsEnabled && (opts.w || opts.q)
      ? { transform: { width: opts.w, quality: opts.q } }
      : undefined;
  const { data } = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(clean, transform);
  return data.publicUrl;
}

type BundleRow = {
  product_images?: ProductImage[] | null;
  specs?: Spec[] | null;
  dimensions?: Dimension[] | null;
  features?: Feature[] | null;
  uses?: Use[] | null;
  benefits?: Benefit[] | null;
  colors?: Color[] | null;
};

const byOrder = <T extends { sort_order: number }>(items: T[]): T[] =>
  [...items].sort((a, b) => a.sort_order - b.sort_order);

export async function fetchProductBundle(productId?: string): Promise<ProductBundle> {
  let query = supabase
    .from("products")
    .select(
      "*, product_images(*), specs(*), dimensions(*), features(*), uses(*), benefits(*), colors(*)",
    );
  if (productId) {
    query = query.eq("id", productId);
  } else {
    query = query
      .eq("active", true)
      .order("sort_order", { ascending: true })
      .limit(1);
  }
  const { data: row, error } = await query.maybeSingle();

  if (error) throw error;

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

  if (!row) return empty;

  const { data: settings, error: settingsError } = await supabase
    .from("site_settings")
    .select("key,value");

  return {
    product: row,
    images: byOrder((row as BundleRow).product_images ?? []),
    specs: byOrder((row as BundleRow).specs ?? []),
    dimensions: byOrder((row as BundleRow).dimensions ?? []),
    features: byOrder((row as BundleRow).features ?? []),
    uses: byOrder((row as BundleRow).uses ?? []),
    benefits: byOrder((row as BundleRow).benefits ?? []),
    colors: byOrder((row as BundleRow).colors ?? []),
    settings: (settingsError ? [] : settings ?? []).reduce<SiteSettings>(
      (acc, s) => {
        acc[s.key] = s.value;
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
