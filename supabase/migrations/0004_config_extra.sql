-- =====================================================================
--  Configuración · Campos adicionales del negocio
--  Ejecutar en: Supabase → SQL Editor → New query.
-- =====================================================================
alter table configuracion add column if not exists eslogan text;
alter table configuracion add column if not exists barrio text;
alter table configuracion add column if not exists maps_url text;

-- Valores iniciales (los actuales de la web) si están vacíos.
update configuracion set
  nombre_negocio = coalesce(nullif(nombre_negocio, ''), 'Avenida 21'),
  eslogan   = coalesce(eslogan, 'Dónde la magia empieza'),
  logo_url  = coalesce(logo_url, '/logo/logo2.jpeg'),
  portada_url = coalesce(portada_url, '/cocteles/Polvo de media noche.jpeg'),
  direccion = coalesce(direccion, 'Cra. 32A #19-47'),
  barrio    = coalesce(barrio, 'B/ Palermo Subterráneo'),
  telefonos = coalesce(telefonos, '313 787 7263'),
  whatsapp  = coalesce(whatsapp, '573137877263'),
  info_contacto = coalesce(info_contacto,
    'La diversión responsable es la mejor diversión. Prohibido el expendio de bebidas embriagantes a menores de edad.'),
  redes = case when redes = '{}'::jsonb
            then '{"instagram":"https://www.instagram.com/avenidaa_21/"}'::jsonb
            else redes end,
  colores = case when colores = '{}'::jsonb
            then '{"primario":"#e6b656","secundario":"#b8854a"}'::jsonb
            else colores end
where id = 1;
