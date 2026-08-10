import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/toast";

export function Spinner({ label = "Cargando…" }: { label?: string }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 text-sm text-muted-foreground">
      <span className="h-6 w-6 animate-spin rounded-full border-2 border-muted border-t-primary" />
      {label}
    </div>
  );
}

export function useSave() {
  const showToast = useToast();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function run(fn: () => Promise<void>) {
    setSaving(true);
    setSaved(false);
    try {
      await fn();
      setSaved(true);
      showToast("✓ Guardado");
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  }

  return { saving, saved, run };
}

export function AdminSection({
  title,
  description,
  children,
  onSave,
  saving,
  saved,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  onSave?: () => void;
  saving?: boolean;
  saved?: boolean;
}) {
  return (
    <section className="rounded-2xl border bg-card p-5 md:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-heading text-lg font-bold">{title}</h2>
          {description && (
            <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {onSave && (
          <div className="flex items-center gap-2">
            {saved && (
              <span className="text-xs font-medium text-emerald-600">
                ✓ Guardado
              </span>
            )}
            <Button onClick={onSave} disabled={saving}>
              {saving ? "Guardando…" : "Guardar"}
            </Button>
          </div>
        )}
      </div>
      {children}
    </section>
  );
}
