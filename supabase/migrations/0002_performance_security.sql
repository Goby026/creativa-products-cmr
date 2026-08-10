-- ═══════════════════════════════════════════════════════════════
-- ESQUINERO · Migración 0002 — Rendimiento y seguridad
-- Ejecuta TODO este script en: Supabase Dashboard → SQL Editor → Run
-- ═══════════════════════════════════════════════════════════════

-- ── 1) Contadores atómicos de actividad ────────────────────────
-- Reemplaza analytics_events (crecía sin límite y era insertable por
-- cualquiera) por un contador por tipo de evento. La tabla vieja se
-- conserva como histórico; se deja de escribir en ella.

create table if not exists public.analytics_counters (
  event  text primary key,
  count  bigint not null default 0
);

create or replace function public.increment_event(p_event text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_event is null or length(p_event) = 0 then
    raise exception 'evento requerido';
  end if;
  insert into public.analytics_counters (event, count)
  values (p_event, 1)
  on conflict (event) do update set count = public.analytics_counters.count + 1;
end;
$$;

revoke all on function public.increment_event(text) from public;
grant execute on function public.increment_event(text) to anon, authenticated;

alter table public.analytics_counters enable row level security;

create policy "admin read analytics_counters" on public.analytics_counters
  for select using (
    exists (select 1 from public.admin_users a where a.user_id = auth.uid())
  );

-- Migra los contadores históricos desde la tabla de eventos.
do $$
begin
  if exists (
    select 1 from information_schema.tables
    where table_schema = 'public' and table_name = 'analytics_events'
  ) then
    insert into public.analytics_counters (event, count)
    select event, count(*)::bigint
    from public.analytics_events
    group by event
    on conflict (event) do nothing;
  end if;
end $$;

-- Ya no se aceptan inserts públicos en la tabla de eventos.
drop policy if exists "public insert analytics_events" on public.analytics_events;

-- ── 2) Un solo producto activo ─────────────────────────────────
-- Antes de crear el índice, desactiva los activos sobrantes
-- (se conserva el de menor sort_order).
update public.products set active = false
where active = true
  and id <> (
    select id from public.products
    where active = true
    order by sort_order asc, created_at asc
    limit 1
  );

create unique index if not exists one_active_product_idx
  on public.products ((true))
  where active;

-- ── 3) Reemplazo atómico de tablas hijas (RPC) ─────────────────
-- delete + insert en una sola transacción. Solo admins autenticados.
-- p_rows llega sin la columna id; la asigna el default de la tabla.
create or replace function public.replace_product_rows(
  p_table      text,
  p_product_id uuid,
  p_rows       jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_allowed text[] := array['specs','dimensions','features','uses','benefits','colors','product_images'];
begin
  if not exists (select 1 from public.admin_users a where a.user_id = auth.uid()) then
    raise exception 'No autorizado';
  end if;
  if p_table is null or not (p_table = any(v_allowed)) then
    raise exception 'Tabla no permitida';
  end if;
  if p_product_id is null then
    raise exception 'product_id requerido';
  end if;

  execute format('delete from public.%I where product_id = $1', p_table)
    using p_product_id;

  if jsonb_array_length(coalesce(p_rows, '[]'::jsonb)) > 0 then
    execute format(
      'insert into public.%I select * from jsonb_populate_recordset(null::public.%I, $1)',
      p_table, p_table
    ) using p_rows;
  end if;
end;
$$;

revoke all on function public.replace_product_rows(text, uuid, jsonb) from public;
grant execute on function public.replace_product_rows(text, uuid, jsonb) to authenticated;

-- ── 4) admin_users: lecturas restringidas ──────────────────────
-- Un usuario autenticado ya no puede listar los UUIDs de todos los admins.
drop policy if exists "authenticated read admin_users" on public.admin_users;
drop policy if exists "own admin read admin_users" on public.admin_users;
drop policy if exists "admin read admin_users" on public.admin_users;

create policy "own admin read admin_users" on public.admin_users
  for select using (auth.uid() = user_id);

create policy "admin read admin_users" on public.admin_users
  for select using (
    exists (select 1 from public.admin_users a where a.user_id = auth.uid())
  );
