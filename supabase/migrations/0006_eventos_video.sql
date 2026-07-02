-- =====================================================================
--  Eventos · Soporte de video
--  Ejecutar en: Supabase → SQL Editor → New query.
-- =====================================================================
alter table eventos add column if not exists video_url text;
