-- ═══════════════════════════════════════════════════════════════
-- ESQUINERO · Políticas de Storage para el bucket "product-images"
-- Ejecuta en: Supabase Dashboard → SQL Editor → Run
-- (idempotente: puede correrse varias veces sin error)
-- ═══════════════════════════════════════════════════════════════

-- Lectura pública de las fotos (galería del sitio)
drop policy if exists "public read product-images" on storage.objects;
create policy "public read product-images" on storage.objects
  for select to public
  using (bucket_id = 'product-images');

-- Subida/borrado/actualización solo para administradores
drop policy if exists "admin upload product-images" on storage.objects;
create policy "admin upload product-images" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'product-images'
    and exists (select 1 from public.admin_users a where a.user_id = auth.uid())
  );

drop policy if exists "admin update product-images" on storage.objects;
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

drop policy if exists "admin delete product-images" on storage.objects;
create policy "admin delete product-images" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'product-images'
    and exists (select 1 from public.admin_users a where a.user_id = auth.uid())
  );
