import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const FILES = [
  "esquinero1.jpg",
  "esquinero2.jpeg",
  "esquinero3.jpeg",
  "esquinero4.jpeg",
];
const BUCKET = "product-images";

function loadEnv() {
  const envPath = path.join(ROOT, ".env");
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^\s*([\w.]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) {
      process.env[m[1]] = m[2].trim();
    }
  }
}

const extToType = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

async function main() {
  loadEnv();

  const url =
    process.env.SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL ||
    process.env.SUPABASE_SERVICE_ROLE_URL;
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ADMIN_KEY ||
    process.env.SUPABASE_SECRET_KEY;

  if (!url || !serviceKey) {
    console.error(
      "Faltan variables de entorno. Agrega SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY a tu .env\n",
      "(o reutiliza VITE_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY).",
    );
    process.exit(1);
  }

  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false },
  });

  const { error: bucketError } = await supabase.storage.createBucket(BUCKET, {
    public: true,
  });
  if (bucketError && !/already exists/i.test(bucketError.message)) {
    console.error("Error creando el bucket:", bucketError.message);
    process.exit(1);
  }
  console.log(`✔ Bucket "${BUCKET}" listo`);

  for (const name of FILES) {
    const candidates = [path.join(ROOT, "public", name), path.join(ROOT, name)];
    const filePath = candidates.find(existsSync);
    if (!filePath) {
      console.warn(`⚠ No existe ${name} (ni en public/ ni en la raíz), se omite`);
      continue;
    }
    const body = readFileSync(filePath);
    const contentType =
      extToType[path.extname(name).slice(1).toLowerCase()] ?? "application/octet-stream";

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(name, body, { contentType, cacheControl: "3600", upsert: true });
    if (error) {
      console.error(`✖ Error subiendo ${name}:`, error.message);
      process.exit(1);
    }
    console.log(`✔ Subida: ${name}`);
  }

  const { data: urls } = supabase.storage.from(BUCKET).list();
  if (urls) {
    console.log("\nArchivos en el bucket:");
    for (const f of urls) {
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(f.name);
      console.log(`  ${f.name} → ${data.publicUrl}`);
    }
  }
  console.log("\nListo. Las fotos del seed ya deberían mostrarse en el sitio.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
