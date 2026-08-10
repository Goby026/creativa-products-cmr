import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";

const env = {};
for (const line of readFileSync(".env", "utf8").split("\n")) {
  const m = line.match(/^\s*([\w.]+)\s*=\s*(.*)\s*$/);
  if (m) env[m[1]] = m[2].trim();
}

const url = env.VITE_SUPABASE_URL;
const anon = env.VITE_SUPABASE_ANON_KEY;
const service = env.SUPABASE_SERVICE_ROLE_KEY;

const anonC = createClient(url, anon, { auth: { persistSession: false } });
const svcC = createClient(url, service, { auth: { persistSession: false } });

const ok = (label, detail = "") =>
  console.log(`  ✅ ${label}${detail ? " — " + detail : ""}`);
const bad = (label, detail = "") =>
  console.log(`  ❌ ${label}${detail ? " — " + detail : ""}`);

console.log("1) Conexión y tablas");
for (const t of [
  "products", "product_images", "specs", "dimensions", "features",
  "uses", "benefits", "colors", "site_settings", "admin_users",
]) {
  try {
    const { error } = await anonC.from(t).select("*").limit(1);
    if (error) bad(t, error.message);
    else ok(t);
  } catch (e) {
    bad(t, e.message);
  }
}

console.log("\n1b) Contadores (RPC público, lectura solo admin)");
{
  const { error: rpcErr } = await anonC.rpc("increment_event", { p_event: "verify_test" });
  if (rpcErr) bad("increment_event (anónimo)", rpcErr.message);
  else ok("increment_event (anónimo puede registrar)");

  const { data: counters, error: cErr } = await svcC
    .from("analytics_counters").select("event,count");
  if (cErr) bad("analytics_counters", cErr.message);
  else {
    const row = (counters ?? []).find((c) => c.event === "verify_test");
    if (!row) bad("analytics_counters", "no registró el contador verify_test");
    else ok("analytics_counters", `${row.event} = ${row.count}`);
  }

  const { data: sel, error: selErr } = await anonC
    .from("analytics_counters").select("event").limit(1);
  if (!selErr && (sel ?? []).length === 0)
    ok("select anónimo counters", "0 filas (solo admin lee)");
  else if (!selErr)
    bad("select anónimo counters", `devuelve ${(sel ?? []).length} filas`);
  else bad("select anónimo counters", selErr.message);

  const { error: rpcAdminErr } = await anonC.rpc("replace_product_rows", {
    p_table: "specs",
    p_product_id: "00000000-0000-0000-0000-000000000001",
    p_rows: [],
  });
  if (rpcAdminErr) ok("replace_product_rows (anónimo)", "denegado como debe ser");
  else bad("replace_product_rows (anónimo)", "no debería estar permitido para cualquiera");

  await svcC.from("analytics_counters").delete().eq("event", "verify_test");
}

console.log("\n2) Seed");
const { data: prods, error: pErr } = await anonC
  .from("products").select("id,slug,name,price,active,old_price");
if (pErr) bad("products", pErr.message);
else if (prods.length === 0) bad("Seed de producto", "no hay productos");
else {
  ok("productos", `${prods.length} · ${prods.map((p) => p.slug).join(", ")}`);
  for (const p of prods) {
    const pid = p.id;
    const checks = await Promise.all(
      ["product_images", "specs", "dimensions", "features", "uses", "benefits", "colors"]
        .map(async (t) => {
          const { count } = await anonC
            .from(t).select("id", { count: "exact", head: true }).eq("product_id", pid);
          return { t, count: count ?? 0 };
        }),
    );
    const parts = checks.map((c) => `${c.t}:${c.count}`).join(" ");
    ok(`hijos de ${p.slug}`, parts);
  }
}

console.log("\n3) Ajustes del sitio");
const { data: sets, error: sErr } = await anonC
  .from("site_settings").select("key");
if (sErr) bad("site_settings", sErr.message);
else ok("keys", (sets ?? []).map((s) => s.key).join(", ") || "(vacío)");

console.log("\n4) Storage");
const { data: buckets, error: bErr } = await anonC.storage.listBuckets();
if (bErr) bad("listBuckets", bErr.message);
else {
  ok("buckets", (buckets ?? []).map((b) => b.name).join(", "));
  const { data: files, error: fErr } = await anonC.storage
    .from("product-images").list();
  if (fErr) bad("product-images", fErr.message);
  else ok("archivos", (files ?? []).map((f) => f.name).join(", ") || "(vacío)");
}

console.log("\n5) Admin (service role)");
const { data: admins, error: aErr } = await svcC.from("admin_users").select("*");
if (aErr) bad("admin_users", aErr.message);
else if ((admins ?? []).length === 0) bad("admin_users", "no hay administradores registrados");
else ok("admin_users", (admins ?? []).map((a) => a.user_id).join(", "));

const { data: users, error: uErr } = await svcC.auth.admin.listUsers({ perPage: 50 });
if (uErr) bad("auth users", uErr.message);
else {
  ok("auth.users", `${users.users.length} usuarios`);
  for (const u of users.users) {
    console.log(`     · ${u.email ?? u.phone ?? u.id} [${u.id}]`);
  }
}
