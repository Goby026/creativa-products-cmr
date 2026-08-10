# AGENTS.md

Guía para agentes de IA que trabajan en este repositorio.

## Comandos

```bash
npm run dev              # servidor de desarrollo (Vite)
npm run build            # verificación obligatoria: tsc -b && vite build
npm run preview          # sirve el build en local
npm run upload:images    # sube fotos seed al bucket product-images
node scripts/verify-supabase.mjs   # diagnóstico de Supabase
```

- **No hay scripts de lint ni de tests configurados.** La verificación de calidad es `npm run build` (typecheck + build). Siempre ejecútalo tras hacer cambios.
- `npm install` instala dependencias en `node_modules`; no instalar nada sin consultar antes.

## Arquitectura

- Aplicación **SPA** React 19 + Vite 8 + TypeScript + Tailwind 4. Deploy automático en Vercel desde `main` (repo GitHub público `Goby026/creativa-products-cmr`).
- **El contenido vive en Supabase** (PostgreSQL + Auth + Storage), no en el código:
  - `products` + tablas hijas (`product_images`, `specs`, `dimensions`, `features`, `uses`, `benefits`, `colors`).
  - `site_settings`: pares `key → value (jsonb)` para textos y configuración (whatsapp, brand, company, hero, bottom_cta, payments, trust, seo, ga4).
  - `src/lib/seed.ts` solo es contenido de respaldo cuando Supabase no está configurado. **No** es la fuente de verdad.
- El bundle se carga con `fetchProductBundle(productId?)` en `src/lib/api.ts` (sin id → producto activo; con id → producto específico).
- **RLS**: lectura pública, escritura solo para usuarios en `admin_users` (RLS de Storage idéntico: lectura pública, escritura admin).
- Panel admin bajo `/admin` con login en `/admin/login`. Rutas en `src/App.tsx`.

## Convenciones

- Alias de importación `@/` → `src/`. Ej.: `import { Button } from "@/components/ui/button"`.
- Componentes en **kebab-case**, una sección por archivo en `src/components/`; el panel admin en `src/components/admin/`; primitivas de UI en `src/components/ui/`.
- **Lectura de settings**: usar helpers `settingString`, `settingArray`, `settingObject` de `src/lib/api.ts` (devuelven fallback seguro). Nunca acceder a `settings[key]` a pelo.
- **Escritura**: todo pasa por `src/lib/admin-api.ts` (tipos `ProductPatch`, `ProductInsert`, `replaceList`, `upsertSetting`). El `supabase` del front usa la sesión del admin.
- Comentarios solo cuando aportan; seguir el estilo del código existente.

## Advertencias importantes

- ⚠️ **El repo es público. Nunca** commitear `.env` ni secretos (claves de Supabase). `.env.example` solo con placeholders; las claves reales viven solo en `.env` local y en las variables de Vercel.
- ⚠️ `info/` está en `.gitignore` (material de referencia del cliente: logo, banner, PDF SUNAT). Para usar esos assets, copiarlos a `public/` con nombre normalizado (`logo-cm.png`, etc.); **no** quitar la carpeta del gitignore.
- ⚠️ **El DDL no se puede ejecutar por API/CLI**: los cambios de SQL (tablas, políticas, seeds) los debe correr el usuario en Supabase Dashboard → SQL Editor. Mantener `supabase/schema.sql` como migración canónica e idempotente. Para updates puntuales de datos se puede usar un script throwaway con la `SUPABASE_SERVICE_ROLE_KEY` (borrarlo después; el rol service pasa por alto RLS).
- Si se cambia un setting en código, hay que **sincronizarlo en la DB** (o el sitio seguirá mostrando el valor viejo) y añadir el valor de respaldo en `src/lib/seed.ts`.
- El footer, nav y hero muestran el **producto activo**; el admin edita por id.
- `vercel.json` ya tiene el rewrite SPA: no crear rutas de servidor adicionales.
- Flujo de entrega habitual: cambios → `npm run build` → commit → push a `main` (auto-deploy a Vercel). No hacer push sin que el usuario lo pida explícitamente.

## Estructura relevante

```
src/lib/api.ts            # fetchProductBundle + helpers setting*
src/lib/admin-api.ts      # operaciones de escritura admin
src/lib/types.ts          # tipos de la DB (Database) y entidades
src/lib/seed.ts           # respaldo sin Supabase
src/lib/supabase.ts       # cliente y guard isSupabaseConfigured
src/App.tsx               # rutas públicas y /admin
src/components/admin/     # dashboard, productos, editor, ajustes
supabase/schema.sql       # migración canónica (tablas, RLS, seed, storage)
supabase/storage-policies.sql
scripts/verify-supabase.mjs
```
