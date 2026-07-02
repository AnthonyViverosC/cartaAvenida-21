-- =====================================================================
--  Storage · Bucket de imágenes (productos, logo, portada, promociones)
--  Ejecutar en: Supabase → SQL Editor → New query.
-- =====================================================================

-- Crea el bucket público "imagenes" (lectura pública, escritura autenticada).
insert into storage.buckets (id, name, public)
values ('imagenes', 'imagenes', true)
on conflict (id) do nothing;

-- Políticas de acceso al bucket
-- Lectura pública (para mostrar las imágenes en la web).
drop policy if exists "imagenes_lectura_publica" on storage.objects;
create policy "imagenes_lectura_publica"
  on storage.objects for select
  using (bucket_id = 'imagenes');

-- Subir: solo usuarios autenticados (Admin/Empleado).
drop policy if exists "imagenes_subir_autenticado" on storage.objects;
create policy "imagenes_subir_autenticado"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'imagenes');

-- Reemplazar/actualizar: solo autenticados.
drop policy if exists "imagenes_actualizar_autenticado" on storage.objects;
create policy "imagenes_actualizar_autenticado"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'imagenes');

-- Eliminar: solo autenticados.
drop policy if exists "imagenes_eliminar_autenticado" on storage.objects;
create policy "imagenes_eliminar_autenticado"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'imagenes');
