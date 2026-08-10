import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { newRowId, type Row } from "@/lib/admin-api";

export type FieldDef = {
  key: string;
  label: string;
  placeholder?: string;
  type?: "text" | "textarea";
  className?: string;
};

export function emptyRow(fields: FieldDef[]): Row {
  const row: Row = { id: newRowId(), sort_order: 0 };
  for (const f of fields) row[f.key] = "";
  return row;
}

function reindex(rows: Row[]): Row[] {
  return rows.map((r, i) => ({ ...r, sort_order: i }));
}

export function RowEditor({
  rows,
  fields,
  onChange,
}: {
  rows: Row[];
  fields: FieldDef[];
  onChange: (rows: Row[]) => void;
}) {
  const update = (id: string, key: string, value: string) => {
    onChange(rows.map((r) => (r.id === id ? { ...r, [key]: value } : r)));
  };

  const remove = (id: string) => {
    onChange(reindex(rows.filter((r) => r.id !== id)));
  };

  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= rows.length) return;
    const next = [...rows];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(reindex(next));
  };

  const add = () => onChange(reindex([...rows, emptyRow(fields)]));

  return (
    <div className="space-y-3">
      {rows.length === 0 && (
        <p className="rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground">
          Sin elementos todavía
        </p>
      )}

      {rows.map((row, i) => (
        <div key={row.id} className="flex items-start gap-2">
          <div
            className={cn(
              "grid flex-1 gap-2 sm:grid-cols-2",
              fields.length >= 3 && "lg:grid-cols-3",
            )}
          >
            {fields.map((f) => (
              <div key={f.key} className={f.className}>
                <Label className="mb-1 block text-xs text-muted-foreground">
                  {f.label}
                </Label>
                {f.type === "textarea" ? (
                  <Textarea
                    rows={2}
                    value={String(row[f.key] ?? "")}
                    placeholder={f.placeholder}
                    onChange={(e) => update(row.id, f.key, e.target.value)}
                  />
                ) : (
                  <Input
                    value={String(row[f.key] ?? "")}
                    placeholder={f.placeholder}
                    onChange={(e) => update(row.id, f.key, e.target.value)}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex gap-1 pt-5">
            <Button
              type="button"
              size="sm"
              variant="ghost"
              aria-label="Subir"
              disabled={i === 0}
              onClick={() => move(i, -1)}
            >
              ↑
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              aria-label="Bajar"
              disabled={i === rows.length - 1}
              onClick={() => move(i, 1)}
            >
              ↓
            </Button>
            <Button
              type="button"
              size="sm"
              variant="destructive"
              aria-label="Eliminar"
              onClick={() => remove(row.id)}
            >
              ✕
            </Button>
          </div>
        </div>
      ))}

      <Button type="button" variant="outline" onClick={add}>
        + Agregar
      </Button>
    </div>
  );
}
