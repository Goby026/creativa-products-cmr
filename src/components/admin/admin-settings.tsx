import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AdminSection, useSave } from "@/components/admin/admin-ui";
import { useProduct } from "@/context/product-context";
import { settingObject, settingArray } from "@/lib/api";
import { upsertSetting } from "@/lib/admin-api";

type Wa = { number?: string; display?: string };
type Brand = { nav?: string; footer?: string };
type Hero = { eyebrow?: string };
type Cta = { title?: string; title_em?: string; subtitle?: string };
type Seo = { title?: string; description?: string; og_image?: string };

function splitLines(v: string): string[] {
  return v
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

export function AdminSettings() {
  const { data, reload } = useProduct();
  const s = data.settings;

  const [wa, setWa] = useState<Wa>({});
  const [ga, setGa] = useState("");
  const [brand, setBrand] = useState<Brand>({});
  const [hero, setHero] = useState<Hero>({});
  const [cta, setCta] = useState<Cta>({});
  const [payments, setPayments] = useState("");
  const [trust, setTrust] = useState("");
  const [seo, setSeo] = useState<Seo>({});

  useEffect(() => {
    setWa(settingObject<Wa>(s, "whatsapp") ?? {});
    setGa(settingObject<{ measurement_id?: string }>(s, "ga4")?.measurement_id ?? "");
    setBrand(settingObject<Brand>(s, "brand") ?? {});
    setHero(settingObject<Hero>(s, "hero") ?? {});
    setCta(settingObject<Cta>(s, "bottom_cta") ?? {});
    setPayments(settingArray(s, "payments").join("\n"));
    setTrust(settingArray(s, "trust").join("\n"));
    setSeo(settingObject<Seo>(s, "seo") ?? {});
  }, [s]);

  const save = useSave();

  const doSave = () =>
    save.run(async () => {
      await Promise.all([
        upsertSetting("whatsapp", { number: wa.number, display: wa.display }),
        upsertSetting("ga4", { measurement_id: ga }),
        upsertSetting("brand", { nav: brand.nav, footer: brand.footer }),
        upsertSetting("hero", { eyebrow: hero.eyebrow }),
        upsertSetting("bottom_cta", {
          title: cta.title,
          title_em: cta.title_em,
          subtitle: cta.subtitle,
        }),
        upsertSetting("payments", splitLines(payments)),
        upsertSetting("trust", splitLines(trust)),
        upsertSetting("seo", {
          title: seo.title,
          description: seo.description,
          og_image: seo.og_image,
        }),
      ]);
      await reload();
    });

  return (
    <>
      <div>
        <h1 className="font-heading text-2xl font-bold">Ajustes del sitio</h1>
        <p className="text-sm text-muted-foreground">
          WhatsApp, pagos, textos y SEO. Se aplican al guardar.
        </p>
      </div>

      <AdminSection
        title="WhatsApp"
        onSave={doSave}
        saving={save.saving}
        saved={save.saved}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Número (código + número)</Label>
            <Input
              value={wa.number ?? ""}
              placeholder="51948349852"
              onChange={(e) => setWa((v) => ({ ...v, number: e.target.value }))}
            />
          </div>
          <div>
            <Label>Número para mostrar</Label>
            <Input
              value={wa.display ?? ""}
              placeholder="948 349 852"
              onChange={(e) => setWa((v) => ({ ...v, display: e.target.value }))}
            />
          </div>
        </div>
      </AdminSection>

      <AdminSection
        title="Sección principal (hero)"
        onSave={doSave}
        saving={save.saving}
        saved={save.saved}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Texto superior (eyebrow)</Label>
            <Input
              value={hero.eyebrow ?? ""}
              onChange={(e) =>
                setHero((v) => ({ ...v, eyebrow: e.target.value }))
              }
            />
          </div>
        </div>
      </AdminSection>

      <AdminSection
        title="Llamada final (bottom CTA)"
        onSave={doSave}
        saving={save.saving}
        saved={save.saved}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Título</Label>
            <Input
              value={cta.title ?? ""}
              onChange={(e) => setCta((v) => ({ ...v, title: e.target.value }))}
            />
          </div>
          <div>
            <Label>Título (itálica)</Label>
            <Input
              value={cta.title_em ?? ""}
              onChange={(e) =>
                setCta((v) => ({ ...v, title_em: e.target.value }))
              }
            />
          </div>
          <div className="sm:col-span-2">
            <Label>Subtítulo</Label>
            <Input
              value={cta.subtitle ?? ""}
              onChange={(e) =>
                setCta((v) => ({ ...v, subtitle: e.target.value }))
              }
            />
          </div>
        </div>
      </AdminSection>

      <AdminSection
        title="Listas (una por línea)"
        onSave={doSave}
        saving={save.saving}
        saved={save.saved}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Formas de pago</Label>
            <Textarea
              rows={5}
              value={payments}
              onChange={(e) => setPayments(e.target.value)}
              placeholder={"💛 Yape\n💜 Plin\n💵 Efectivo"}
            />
          </div>
          <div>
            <Label>Garantías / confianza</Label>
            <Textarea
              rows={5}
              value={trust}
              onChange={(e) => setTrust(e.target.value)}
              placeholder={"🚚 Envío en Huancayo\n🛡️ Garantía de calidad"}
            />
          </div>
        </div>
      </AdminSection>

      <AdminSection
        title="Marca y Analytics"
        onSave={doSave}
        saving={save.saving}
        saved={save.saved}
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <Label>Marca (nav)</Label>
            <Input
              value={brand.nav ?? ""}
              onChange={(e) =>
                setBrand((v) => ({ ...v, nav: e.target.value }))
              }
            />
          </div>
          <div>
            <Label>Marca (footer)</Label>
            <Input
              value={brand.footer ?? ""}
              onChange={(e) =>
                setBrand((v) => ({ ...v, footer: e.target.value }))
              }
            />
          </div>
          <div>
            <Label>Google Analytics ID (GA4)</Label>
            <Input
              value={ga}
              placeholder="G-XXXXXXXXXX"
              onChange={(e) => setGa(e.target.value)}
            />
          </div>
        </div>
      </AdminSection>

      <AdminSection
        title="SEO"
        onSave={doSave}
        saving={save.saving}
        saved={save.saved}
      >
        <div className="grid gap-4">
          <div>
            <Label>Título</Label>
            <Input
              value={seo.title ?? ""}
              onChange={(e) => setSeo((v) => ({ ...v, title: e.target.value }))}
            />
          </div>
          <div>
            <Label>Descripción</Label>
            <Textarea
              rows={3}
              value={seo.description ?? ""}
              onChange={(e) =>
                setSeo((v) => ({ ...v, description: e.target.value }))
              }
            />
          </div>
          <div>
            <Label>Imagen Open Graph</Label>
            <Input
              value={seo.og_image ?? ""}
              placeholder="/esquinero1.jpg o URL pública"
              onChange={(e) => setSeo((v) => ({ ...v, og_image: e.target.value }))}
            />
          </div>
        </div>
      </AdminSection>
    </>
  );
}
