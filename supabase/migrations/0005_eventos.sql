-- =====================================================================
--  Eventos · Agenda del bar (música en vivo, shows, fechas especiales)
--  Ejecutar en: Supabase → SQL Editor → New query.
-- =====================================================================
create table if not exists eventos (
  id          uuid primary key default gen_random_uuid(),
  titulo      text not null,
  descripcion text,
  fecha       date,                 -- día del evento
  hora        text,                 -- ej: "9:00 PM" (texto libre)
  lugar       text,                 -- ej: "Terraza principal"
  imagen_url  text,
  activo      boolean not null default true,   -- mostrar/ocultar
  destacado   boolean not null default false,  -- resaltar en la web
  orden       int not null default 0,
  creado_en   timestamptz not null default now()
);

create index if not exists idx_eventos_fecha on eventos(fecha);

-- Seguridad (RLS): lectura pública de los activos; escritura autenticada.
alter table eventos enable row level security;

drop policy if exists eventos_lectura_publica on eventos;
create policy eventos_lectura_publica on eventos
  for select using (activo = true or auth.role() = 'authenticated');

drop policy if exists eventos_escritura on eventos;
create policy eventos_escritura on eventos
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
