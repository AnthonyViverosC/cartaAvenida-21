// Trae los eventos ACTIVOS y próximos (fecha de hoy en adelante, o sin fecha)
// para mostrarlos en la página pública.
import { useEffect, useState } from 'react';
import { supabase, supabaseConfigurado } from '../lib/supabase.js';

export function useEventos() {
  const [eventos, setEventos] = useState([]);

  useEffect(() => {
    if (!supabaseConfigurado) return;
    let activo = true;

    (async () => {
      const hoy = new Date().toISOString().slice(0, 10);
      const { data, error } = await supabase
        .from('eventos')
        .select('id, titulo, descripcion, fecha, hora, lugar, imagen_url, video_url, destacado')
        .eq('activo', true)
        .order('fecha', { ascending: true, nullsFirst: true });
      if (error) {
        console.error('[useEventos]', error.message);
        return;
      }
      // Oculta los eventos ya pasados (los que sí tienen fecha).
      const vigentes = (data || []).filter((e) => !e.fecha || e.fecha >= hoy);
      if (activo) setEventos(vigentes);
    })();

    return () => {
      activo = false;
    };
  }, []);

  return eventos;
}
