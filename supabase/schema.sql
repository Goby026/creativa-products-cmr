-- ═══════════════════════════════════════════════════════════════
-- ESQUINERO · Migración inicial (Supabase / PostgreSQL)
-- Ejecuta TODO este script en: Supabase Dashboard → SQL Editor → Run
-- ═══════════════════════════════════════════════════════════════

drop table if exists public.product_images cascade;
drop table if exists public.specs cascade;
drop table if exists public.dimensions cascade;
drop table if exists public.features cascade;
drop table if exists public.uses cascade;
drop table if exists public.benefits cascade;
drop table if exists public.colors cascade;
drop table if exists public.site_settings cascade;
drop table if exists public.admin_users cascade;
drop table if exists public.products cascade;

-- ── Trigger para updated_at ──────────────────────────────────
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ── Tabla: productos ─────────────────────────────────────────
create table public.products (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  name          text not null,
  headline      text,          -- título corto (h1)
  headline_em   text,          -- parte en itálica del título
  description   text,
  price         integer not null default 0,
  old_price     integer,
  currency      text not null default 'S/',
  active        boolean not null default true,
  sort_order    integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create trigger trg_products_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- ── Tablas hijas ─────────────────────────────────────────────
create table public.product_images (
  id           uuid primary key default gen_random_uuid(),
  product_id   uuid not null references public.products(id) on delete cascade,
  url          text not null,  -- ruta dentro del bucket "product-images"
  alt          text,
  sort_order   integer not null default 0
);

create table public.specs (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid not null references public.products(id) on delete cascade,
  value       text not null,
  label       text not null,
  sort_order  integer not null default 0
);

create table public.dimensions (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid not null references public.products(id) on delete cascade,
  name        text not null,
  value       text not null,
  unit        text,
  sort_order  integer not null default 0
);

create table public.features (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid not null references public.products(id) on delete cascade,
  icon        text not null,
  title       text not null,
  text        text not null,
  sort_order  integer not null default 0
);

create table public.uses (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid not null references public.products(id) on delete cascade,
  emoji       text not null,
  title       text not null,
  text        text not null,
  sort_order  integer not null default 0
);

create table public.benefits (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid not null references public.products(id) on delete cascade,
  icon        text not null,
  text        text not null,
  sort_order  integer not null default 0
);

create table public.colors (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid not null references public.products(id) on delete cascade,
  value       text not null,
  swatch      text not null,   -- clases tailwind o hex del color
  sort_order  integer not null default 0
);

-- ── Ajustes del sitio (key → valor jsonb) ────────────────────
create table public.site_settings (
  key         text primary key,
  value       jsonb not null
);

-- ── Usuarios administradores ─────────────────────────────────
create table public.admin_users (
  user_id     uuid primary key references auth.users(id) on delete cascade,
  created_at  timestamptz not null default now()
);

-- ── RLS: lectura pública ─────────────────────────────────────
alter table public.products        enable row level security;
alter table public.product_images  enable row level security;
alter table public.specs           enable row level security;
alter table public.dimensions      enable row level security;
alter table public.features        enable row level security;
alter table public.uses            enable row level security;
alter table public.benefits        enable row level security;
alter table public.colors          enable row level security;
alter table public.site_settings   enable row level security;
alter table public.admin_users     enable row level security;

do $$
declare t text;
begin
  foreach t in array array[
    'products','product_images','specs','dimensions',
    'features','uses','benefits','colors','site_settings'
  ]
  loop
    execute format(
      'create policy "public read %1$s" on public.%1$s for select using (true)', t);
  end loop;
end $$;

-- ── RLS: escritura solo admin ────────────────────────────────
create policy "admin write products"       on public.products      for all
  using (exists (select 1 from public.admin_users a where a.user_id = auth.uid()))
  with check (exists (select 1 from public.admin_users a where a.user_id = auth.uid()));

create policy "admin write product_images" on public.product_images for all
  using (exists (select 1 from public.admin_users a where a.user_id = auth.uid()))
  with check (exists (select 1 from public.admin_users a where a.user_id = auth.uid()));

create policy "admin write specs"          on public.specs          for all
  using (exists (select 1 from public.admin_users a where a.user_id = auth.uid()))
  with check (exists (select 1 from public.admin_users a where a.user_id = auth.uid()));

create policy "admin write dimensions"     on public.dimensions     for all
  using (exists (select 1 from public.admin_users a where a.user_id = auth.uid()))
  with check (exists (select 1 from public.admin_users a where a.user_id = auth.uid()));

create policy "admin write features"       on public.features       for all
  using (exists (select 1 from public.admin_users a where a.user_id = auth.uid()))
  with check (exists (select 1 from public.admin_users a where a.user_id = auth.uid()));

create policy "admin write uses"           on public.uses           for all
  using (exists (select 1 from public.admin_users a where a.user_id = auth.uid()))
  with check (exists (select 1 from public.admin_users a where a.user_id = auth.uid()));

create policy "admin write benefits"       on public.benefits       for all
  using (exists (select 1 from public.admin_users a where a.user_id = auth.uid()))
  with check (exists (select 1 from public.admin_users a where a.user_id = auth.uid()));

create policy "admin write colors"         on public.colors         for all
  using (exists (select 1 from public.admin_users a where a.user_id = auth.uid()))
  with check (exists (select 1 from public.admin_users a where a.user_id = auth.uid()));

create policy "admin write site_settings"  on public.site_settings  for all
  using (exists (select 1 from public.admin_users a where a.user_id = auth.uid()))
  with check (exists (select 1 from public.admin_users a where a.user_id = auth.uid()));

-- admin_users: lectura para usuarios autenticados
create policy "authenticated read admin_users" on public.admin_users
  for select using (auth.role() = 'authenticated');

-- ═══════════════════════════════════════════════════════════════
-- SEED · contenido actual del sitio
-- ═══════════════════════════════════════════════════════════════

insert into public.products
  (id, slug, name, headline, headline_em, description, price, old_price, currency)
values (
  '00000000-0000-0000-0000-000000000001',
  'esquinero-5-niveles',
  'Estante Vertical 5 Niveles',
  'Estante Vertical',
  '5 Niveles',
  'Diseño esquinero en melamina de 15 mm, abierto por ambos lados para una vista limpia desde cualquier ángulo. Cinco bandejas que soportan hasta 30 kg cada una — ideal para libros, plantas, electrónicos o lo que imagines.',
  120, 145, 'S/'
);

insert into public.product_images (product_id, url, alt, sort_order) values
  ('00000000-0000-0000-0000-000000000001', 'esquinero1.jpg', 'Estante Vertical 5 Niveles Creativa Melatech — Foto 1', 0),
  ('00000000-0000-0000-0000-000000000001', 'esquinero2.jpeg', 'Estante Vertical 5 Niveles Creativa Melatech — Foto 2', 1),
  ('00000000-0000-0000-0000-000000000001', 'esquinero3.jpeg', 'Estante Vertical 5 Niveles Creativa Melatech — Foto 3', 2),
  ('00000000-0000-0000-0000-000000000001', 'esquinero4.jpeg', 'Estante Vertical 5 Niveles Creativa Melatech — Foto 4', 3);

insert into public.specs (product_id, value, label, sort_order) values
  ('00000000-0000-0000-0000-000000000001', '5',       'Niveles',               0),
  ('00000000-0000-0000-0000-000000000001', '1.75m',   'Altura total',          1),
  ('00000000-0000-0000-0000-000000000001', '30 kg',   'Por bandeja',           2),
  ('00000000-0000-0000-0000-000000000001', '15mm',    'Tablero melamina',      3),
  ('00000000-0000-0000-0000-000000000001', '6/sem',   'Unidades disponibles',  4);

insert into public.dimensions (product_id, name, value, unit, sort_order) values
  ('00000000-0000-0000-0000-000000000001', 'Alto total',               '1750', 'mm',       0),
  ('00000000-0000-0000-0000-000000000001', 'Ancho',                    '300',  'mm',       1),
  ('00000000-0000-0000-0000-000000000001', 'Profundidad',              '300',  'mm',       2),
  ('00000000-0000-0000-0000-000000000001', 'Separación entre niveles', '313',  'mm',       3),
  ('00000000-0000-0000-0000-000000000001', 'Número de niveles',        '5',    'bandejas', 4),
  ('00000000-0000-0000-0000-000000000001', 'Carga por bandeja',        '~30',  'kg',       5);

insert into public.features (product_id, icon, title, text, sort_order) values
  ('00000000-0000-0000-0000-000000000001', '🪟', 'Abierto por ambos lados',
   'Sin respaldo ni laterales cerrados. La vista es limpia desde cualquier ángulo, ideal para dividir ambientes o lucir tus objetos favoritos.', 0),
  ('00000000-0000-0000-0000-000000000001', '💪', '30 kg por bandeja',
   'Cada nivel soporta hasta 30 kilogramos. Puedes poner libros pesados, macetas grandes o equipos sin preocuparte por el hundimiento.', 1),
  ('00000000-0000-0000-0000-000000000001', '🪵', 'Melamina 15 mm premium',
   'Superficie resistente a la humedad, al rayado y fácil de limpiar. El grosor de 15 mm garantiza rigidez sin peso innecesario.', 2),
  ('00000000-0000-0000-0000-000000000001', '📐', 'Perfil esquinero compacto',
   'Solo 30 × 30 cm de huella. Aprovecha los rincones que normalmente quedan vacíos, sin bloquear el paso ni la luz.', 3),
  ('00000000-0000-0000-0000-000000000001', '🎨', 'Blanco, negro o a tu gusto',
   'Los colores estándar son blanco y negro, pero fabricamos en el tono que necesites. Solo coordina el color al hacer tu pedido.', 4),
  ('00000000-0000-0000-0000-000000000001', '⚡', 'Producción local Huancayo',
   'Fabricado en Huancayo por Creativa Melatech. Producimos hasta 6 unidades por semana con control de calidad en cada pieza.', 5);

insert into public.uses (product_id, emoji, title, text, sort_order) values
  ('00000000-0000-0000-0000-000000000001', '📚', 'Librería',
   'Organiza tus libros favoritos con estilo y acceso fácil en cualquier habitación', 0),
  ('00000000-0000-0000-0000-000000000001', '🌿', 'Plantas & Deco',
   'Crea un jardín vertical en tu sala, comedor o dormitorio', 1),
  ('00000000-0000-0000-0000-000000000001', '🎮', 'Gaming & Tech',
   'Consolas, mandos y accesorios perfectamente ordenados y a la vista', 2),
  ('00000000-0000-0000-0000-000000000001', '🏪', 'Local comercial',
   'Exhibe productos en tiendas, bodegas o negocios con estilo profesional', 3);

insert into public.benefits (product_id, icon, text, sort_order) values
  ('00000000-0000-0000-0000-000000000001', '🚚', 'Envío en Huancayo según tarifa del transportista', 0),
  ('00000000-0000-0000-0000-000000000001', '📅', 'Fabricación semanal · Entrega coordinada',            1),
  ('00000000-0000-0000-0000-000000000001', '🤝', 'Acepta contra entrega',                              2),
  ('00000000-0000-0000-0000-000000000001', '💛', 'Yape · Plin · Efectivo',                             3);

-- swatch guarda un valor CSS (hex o gradiente) aplicable con style=""
insert into public.colors (product_id, value, swatch, sort_order) values
  ('00000000-0000-0000-0000-000000000001', 'Blanco',
   '#f5f5f0', 0),
  ('00000000-0000-0000-0000-000000000001', 'Negro',
   '#1a1a1a', 1),
  ('00000000-0000-0000-0000-000000000001', 'A pedido',
   'linear-gradient(135deg, #d4d4d8 0%, #71717a 50%, #18181b 100%)', 2);

insert into public.site_settings (key, value) values
  ('whatsapp',  '{"number": "51948349852", "display": "948 349 852"}'),
  ('payments',  '["💛 Yape", "💜 Plin", "💵 Efectivo", "🤝 Contra entrega"]'),
  ('trust',     '["🚚 Envío en Huancayo", "🛡️ Garantía de calidad", "📐 Melamina 15 mm"]'),
  ('brand',     '{"nav": "Creativa Melatech", "footer": "Creativa Melatech"}'),
  ('ga4',       '{"measurement_id": ""}'),
  ('hero',      '{"eyebrow": "Creativa Melatech · Huancayo"}'),
  ('bottom_cta','{"title": "¿Listo para organizar", "title_em": "tu espacio?", "subtitle": "Fabricado en Huancayo · Precios finales · Sin letra pequeña"}'),
  ('seo',       '{"title": "Estante Vertical 5 Niveles | Creativa Melatech Huancayo", "description": "Estante esquinero vertical de 5 niveles en melamina 15 mm. Fabricado en Huancayo, envío a toda la ciudad, contra entrega. S/ 120.00.", "og_image": "/esquinero1.jpg"}');

-- ═══════════════════════════════════════════════════════════════
-- STORAGE · políticas del bucket "product-images"
-- ═══════════════════════════════════════════════════════════════
-- Requiere crear el bucket antes (o con `npm run upload:images`).

create policy "public read product-images" on storage.objects
  for select to public
  using (bucket_id = 'product-images');

create policy "admin upload product-images" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'product-images'
    and exists (select 1 from public.admin_users a where a.user_id = auth.uid())
  );

create policy "admin update product-images" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'product-images'
    and exists (select 1 from public.admin_users a where a.user_id = auth.uid())
  )
  with check (
    bucket_id = 'product-images'
    and exists (select 1 from public.admin_users a where a.user_id = auth.uid())
  );

create policy "admin delete product-images" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'product-images'
    and exists (select 1 from public.admin_users a where a.user_id = auth.uid())
  );

-- ═══════════════════════════════════════════════════════════════
-- ADMIN · crear tu primer usuario administrador
--  1) En Authentication → Users → Add user (email + password)
--  2) Reemplaza <TU_USER_ID> por el UUID de ese usuario y ejecuta:
-- ═══════════════════════════════════════════════════════════════
-- insert into public.admin_users (user_id) values ('<TU_USER_ID>');
