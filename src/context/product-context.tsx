import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { fetchProductBundle, type ProductBundle } from "@/lib/api";
import { SEED_BUNDLE } from "@/lib/seed";
import { isSupabaseConfigured } from "@/lib/supabase";
import { setMeasurementId } from "@/lib/analytics";
import { settingObject } from "@/lib/api";

type ProductContextValue = {
  data: ProductBundle;
  loading: boolean;
  error: string | null;
  configured: boolean;
  reload: () => Promise<void>;
};

const ProductContext = createContext<ProductContextValue | null>(null);

export function ProductProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<ProductBundle>(SEED_BUNDLE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      setData(SEED_BUNDLE);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const bundle = await fetchProductBundle();
      setData(bundle);
      const ga = settingObject<{ measurement_id?: string }>(
        bundle.settings,
        "ga4",
      );
      setMeasurementId(ga?.measurement_id ?? "");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error de conexión");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <ProductContext.Provider
      value={{ data, loading, error, configured: isSupabaseConfigured, reload: load }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProduct(): ProductContextValue {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error("useProduct debe usarse dentro de <ProductProvider>");
  return ctx;
}
