# Esquinero — Creativa Melatech

Landing page de producto para el **estante vertical esquinero de 5 niveles**, fabricado en melamina por **CREATIVA MELATECH S.A.C.** (Huancayo, Junín, Perú). Incluye panel de administración para gestionar productos, fotos y ajustes del sitio.

- 🌐 Producción: https://esquinero.vercel.app
- 🔐 Área admin: https://esquinero.vercel.app/admin/login (acceso discreto en el pie de página)

## Stack

| Capa | Tecnología |
| --- | --- |
| Frontend | React 19 + Vite 8 + TypeScript |
| Estilos | Tailwind CSS 4 (`@tailwindcss/vite`) + shadcn/ui sobre Base UI |
| Routing | react-router-dom 7 |
| Backend | Supabase (PostgreSQL, Auth, Storage) |
| Deploy | Vercel (integración con GitHub, auto-deploy en `main`) |

## Requisitos

- Node.js 20+ (probado con Node 24)
- npm
- Proyecto en [Supabase](https://supabase.com)
- Cuenta en [Vercel](https://vercel.com)

## Configuración inicial

### 1. Instalar dependencias

```bash
npm install
```

### 2. Variables de entorno

Copia `.env.example` a `.env` y completa las claves:

```bash
VITE_SUPABASE_URL=<URL del proyecto Supabase>
VITE_SUPABASE_ANON_KEY=<anon/public key — segura para el front>
SUPABASE_SERVICE_ROLE_KEY=<service_role key — solo scripts, nunca al front>
```

> ⚠️ `.env` está en `.gitignore`. **Nunca** subas claves al repositorio (es público). `.env.example` solo contiene plantillas.

### 3. Configurar Supabase

Las migraciones se ejecutan a mano en **Supabase Dashboard → SQL Editor**:

1. **Esquema + seed**: abre `supabase/schema.sql` y pulsa *Run*. Crea las 10 tablas, políticas RLS y el contenido inicial (producto, fotos, especificaciones y ajustes).
2. **Políticas de Storage** (si no las incluyó el paso 1): abre `supabase/storage-policies.sql` y pulsa *Run*. Permite que el admin suba/borre fotos del bucket.
3. **Bucket + imágenes**: crea el bucket público `product-images` y sube las fotos seed:

```bash
npm run upload:images
```

> Crea el bucket automáticamente si no existe y sube las 4 fotos con `upsert`.

4. **Usuario administrador**:
   - En **Authentication → Users → Add user** crea el usuario con email y contraseña.
   - Copia su UUID y ejecuta en el SQL Editor: `insert into public.admin_users (user_id) values ('<TU_USER_ID>');`

### 4. Verificar la instalación

```bash
node scripts/verify-supabase.mjs
```

Comprueba conexión, tablas, seed, ajustes, storage y usuarios admin.

### 5. Ejecutar en desarrollo

```bash
npm run dev
```

## Comandos

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Servidor de desarrollo (Vite) |
| `npm run build` | Typecheck (`tsc -b`) + build de producción |
| `npm run preview` | Sirve el build de producción localmente |
| `npm run upload:images` | Sube las fotos seed al bucket `product-images` |
| `node scripts/verify-supabase.mjs` | Diagnóstico completo de Supabase |

## Panel de administración

Se accede desde **`/admin/login`** (o el enlace "🔐 Administrar" del pie de página).

- **Dashboard** — resumen del producto activo y accesos rápidos.
- **Productos** (`/admin/productos`) — listar, crear, mostrar/ocultar, eliminar productos. Al crear uno nuevo te lleva a su editor.
- **Editor de producto** (`/admin/producto/:id`) — nombre, precios, galería (subir/borrar fotos), especificaciones, dimensiones, características, usos, beneficios y colores.
- **Ajustes** (`/admin/ajustes`) — WhatsApp, sección principal, CTA final, listas de pagos/confianza, marca, datos de la empresa (RUC) y SEO.

El sitio público muestra siempre el **producto activo**.

## Estructura del proyecto

```
src/
├── components/          # Secciones de la landing (hero, footer, gallery, …)
│   ├── admin/           # Panel admin (dashboard, productos, editor, ajustes)
│   └── ui/              # Primitivas shadcn/ui (button, input, card, …)
├── context/             # ProductContext: bundle de datos + reload
├── hooks/               # use-meta (SEO) y use-reveal (animaciones)
├── lib/
│   ├── api.ts           # Lectura pública (fetchProductBundle, helpers setting*)
│   ├── admin-api.ts     # Escritura admin (productos, imágenes, ajustes)
│   ├── supabase.ts      # Cliente Supabase (guard `isSupabaseConfigured`)
│   ├── types.ts         # Tipos de la base de datos (Database)
│   ├── seed.ts          # Datos de respaldo si Supabase no está configurado
│   └── whatsapp.ts      # Construcción de enlaces wa.me
supabase/
├── schema.sql           # Migración completa (tablas, RLS, seed, storage)
└── storage-policies.sql # Políticas RLS del bucket (idempotente)
scripts/
├── upload-images.mjs    # Bucket + fotos seed
└── verify-supabase.mjs  # Diagnóstico
```

## Despliegue

1. Crea el proyecto en Vercel e importa el repositorio GitHub (`Goby026/creativa-products-cmr`).
2. Añade las variables `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` en *Project → Settings → Environment Variables* (Production y Development).
3. La rama `main` se despliega automáticamente en cada push. `vercel.json` ya configura el framework, el build y el rewrite SPA.

## Licencia y datos de la empresa

**CREATIVA MELATECH S.A.C.** · RUC 20615245322 · Sociedad Anónima Cerrada · Activo · Habido
Tel. 948 349 852 · Huancayo, Junín — Perú

Los datos de contacto y formalización son editables desde el admin (Ajustes → Datos de la empresa).
