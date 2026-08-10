-- ═══════════════════════════════════════════════════════════════
-- 0003 · Fix recursión infinita en RLS de admin_users
-- ═══════════════════════════════════════════════════════════════
-- La política "admin read admin_users" de la 0002 consultaba la propia
-- tabla admin_users para autorizarse, y como las políticas de products y
-- tablas hijas también consultan admin_users, se producía recursión
-- infinita en cada lectura (error 42P17) y el sitio dejó de cargar.
--
-- La app solo lee la fila propia (admin-layout.tsx). Se elimina la
-- política "ver todas" y se conserva solo la lectura de la fila propia.

drop policy if exists "admin read admin_users" on public.admin_users;

-- idempotente: garantiza que exista la lectura de la fila propia
create policy "own admin read admin_users" on public.admin_users
  for select using (auth.uid() = user_id);
