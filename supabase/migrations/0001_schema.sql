-- =====================================================================
--  Avenida 21 · Esquema de base de datos (Supabase / PostgreSQL)
--  Base de datos normalizada para el sistema de menú administrable.
--  Ejecutar este archivo COMPLETO en: Supabase → SQL Editor → New query.
-- =====================================================================

-- Extensiones necesarias
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
--  ENUMS
-- ---------------------------------------------------------------------
do $$ begin
  create type rol_usuario as enum ('admin', 'empleado');
exception when duplicate_object then null; end $$;

do $$ begin
  create type tipo_promocion as enum ('descuento', 'combo', 'destacado');
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------
--  USUARIOS (perfiles)
--  La autenticación (email + contraseña ENCRIPTADA) la maneja Supabase
--  Auth en la tabla interna auth.users. Aquí guardamos el rol y datos
--  de perfil, enlazados 1:1 con auth.users.
-- ---------------------------------------------------------------------
create table if not exists perfiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  nombre      text not null default 'Usuario',
  rol         rol_usuario not null default 'empleado',
  creado_en   timestamptz not null default now()
);

-- Helper: ¿el usuario actual es admin? (evita recursión en las políticas)
create or replace function es_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from perfiles where id = auth.uid() and rol = 'admin'
  );
$$;

-- Al registrarse un usuario en Auth, crea su perfil automáticamente.
create or replace function crear_perfil_nuevo_usuario()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into perfiles (id, nombre, rol)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nombre', split_part(new.email, '@', 1)),
    -- El primer usuario del sistema será admin; el resto empleados.
    case when (select count(*) from perfiles) = 0 then 'admin'::rol_usuario
         else 'empleado'::rol_usuario end
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function crear_perfil_nuevo_usuario();

-- ---------------------------------------------------------------------
--  CATEGORIAS
-- ---------------------------------------------------------------------
create table if not exists categorias (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,          -- ej: 'whisky' (usado como ancla en la web)
  nombre      text not null,
  icono       text default '',
  orden       int  not null default 0,       -- para ordenar (drag & drop)
  visible     boolean not null default true, -- mostrar/ocultar en el menú público
  creado_en   timestamptz not null default now()
);

-- ---------------------------------------------------------------------
--  PRODUCTOS
-- ---------------------------------------------------------------------
create table if not exists productos (
  id           uuid primary key default gen_random_uuid(),
  categoria_id uuid not null references categorias(id) on delete cascade,
  nombre       text not null,
  descripcion  text,
  precio       numeric(12,2),                 -- en miles de COP (ej: 180 = $180.000)
  color        text,                          -- color del placeholder si no hay imagen
  imagen_url   text,
  disponible   boolean not null default true, -- Disponible / Agotado
  activo       boolean not null default true, -- desactivar sin borrar
  destacado    boolean not null default false,-- producto destacado
  orden        int not null default 0,        -- orden dentro de su categoría
  creado_en    timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);
create index if not exists idx_productos_categoria on productos(categoria_id);

-- Mantiene actualizado_en al modificar
create or replace function tocar_actualizado_en()
returns trigger language plpgsql as $$
begin new.actualizado_en = now(); return new; end; $$;

drop trigger if exists trg_productos_touch on productos;
create trigger trg_productos_touch before update on productos
  for each row execute function tocar_actualizado_en();

-- ---------------------------------------------------------------------
--  ETIQUETAS  ("Nuevo", "Más vendido", "Promoción")  + relación M:N
-- ---------------------------------------------------------------------
create table if not exists etiquetas (
  id      uuid primary key default gen_random_uuid(),
  nombre  text not null unique,
  color   text not null default '#e6b656'
);

create table if not exists producto_etiquetas (
  producto_id uuid references productos(id) on delete cascade,
  etiqueta_id uuid references etiquetas(id) on delete cascade,
  primary key (producto_id, etiqueta_id)
);

insert into etiquetas (nombre, color) values
  ('Nuevo', '#37e6ff'),
  ('Más vendido', '#e6b656'),
  ('Promoción', '#ff3ea5')
on conflict (nombre) do nothing;

-- ---------------------------------------------------------------------
--  PROMOCIONES
-- ---------------------------------------------------------------------
create table if not exists promociones (
  id           uuid primary key default gen_random_uuid(),
  titulo       text not null,
  descripcion  text,
  tipo         tipo_promocion not null default 'descuento',
  valor        numeric(12,2),                 -- % de descuento o precio del combo
  producto_id  uuid references productos(id) on delete set null,
  imagen_url   text,
  activa       boolean not null default true,
  fecha_inicio date,
  fecha_fin    date,
  creado_en    timestamptz not null default now()
);

-- ---------------------------------------------------------------------
--  IMAGENES  (registro de archivos subidos a Storage)
-- ---------------------------------------------------------------------
create table if not exists imagenes (
  id          uuid primary key default gen_random_uuid(),
  url         text not null,
  path        text not null,                  -- ruta dentro del bucket
  tipo        text default 'producto',        -- producto | logo | portada | promocion
  producto_id uuid references productos(id) on delete set null,
  creado_en   timestamptz not null default now()
);

-- ---------------------------------------------------------------------
--  CONFIGURACION  (fila única con los datos del negocio)
-- ---------------------------------------------------------------------
create table if not exists configuracion (
  id            int primary key default 1,
  nombre_negocio text not null default 'Avenida 21',
  logo_url      text,
  portada_url   text,
  colores       jsonb not null default '{}'::jsonb,  -- {primario, secundario, ...}
  horarios      text,
  direccion     text,
  telefonos     text,
  whatsapp      text,
  redes         jsonb not null default '{}'::jsonb,   -- {instagram, facebook, tiktok...}
  info_contacto text,
  actualizado_en timestamptz not null default now(),
  constraint fila_unica check (id = 1)
);

insert into configuracion (id) values (1) on conflict (id) do nothing;

-- =====================================================================
--  SEGURIDAD (Row Level Security)
--  - Lectura pública: solo lo visible/activo (para el menú de la web).
--  - Escritura: solo usuarios autenticados (Admin o Empleado).
--  - Gestión de usuarios y borrados sensibles: solo Admin.
-- =====================================================================
alter table perfiles          enable row level security;
alter table categorias        enable row level security;
alter table productos         enable row level security;
alter table etiquetas         enable row level security;
alter table producto_etiquetas enable row level security;
alter table promociones       enable row level security;
alter table imagenes          enable row level security;
alter table configuracion     enable row level security;

-- PERFILES: cada quien ve/edita el suyo; el admin gestiona todos.
create policy perfiles_select on perfiles for select using (auth.uid() = id or es_admin());
create policy perfiles_update_admin on perfiles for update using (es_admin());
create policy perfiles_self_update on perfiles for update using (auth.uid() = id);

-- CATEGORIAS
create policy categorias_lectura_publica on categorias for select using (visible = true or auth.role() = 'authenticated');
create policy categorias_escritura on categorias for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- PRODUCTOS
create policy productos_lectura_publica on productos for select using ((activo = true) or auth.role() = 'authenticated');
create policy productos_escritura on productos for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ETIQUETAS
create policy etiquetas_lectura on etiquetas for select using (true);
create policy etiquetas_escritura on etiquetas for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy prodetiq_lectura on producto_etiquetas for select using (true);
create policy prodetiq_escritura on producto_etiquetas for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- PROMOCIONES
create policy promociones_lectura_publica on promociones for select using (activa = true or auth.role() = 'authenticated');
create policy promociones_escritura on promociones for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- IMAGENES
create policy imagenes_lectura on imagenes for select using (true);
create policy imagenes_escritura on imagenes for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- CONFIGURACION
create policy config_lectura_publica on configuracion for select using (true);
create policy config_escritura on configuracion for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
